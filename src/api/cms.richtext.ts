import type { ContentBlock } from '@/types/content';

/**
 * Strapi `richtext` → the site's `ContentBlock[]`.
 *
 * WHY THIS FILE EXISTS - `types/content.ts` deliberately models an article body as a
 * closed union of blocks rather than a blob of HTML, so a detail page renders with the
 * site's own typography components (`ArticleBody`) and never with
 * `dangerouslySetInnerHTML`. The CMS does not send that shape. Something has to
 * translate, and that translation is pure text work with no knowledge of Strapi field
 * names, which is why it sits here and not in `cms.mappers.ts`.
 *
 * WHAT THE LIVE DATA ACTUALLY LOOKS LIKE - verified against cms.clovity.com, because
 * the `richtext` type implies markdown and almost none of it is:
 *
 *  • `blog.content` (504 rows) is HTML pasted from a WYSIWYG. Tag census over a
 *    25-row sample: `p` 963, `li` 890, `h3` 246, `ul` 211, `span` 131, `br` 60,
 *    `a` 50. No `h2` anywhere - `h3` IS the article's top heading level.
 *  • `news.content` (56 rows) is HTML too, but carries inline `style` attributes
 *    (`<p style="margin-bottom:15px;">`) and anchor markup from press releases.
 *  • `jsm-resource.content` (the case studies) is a MIX: bare text lines with no
 *    wrapper tags, section titles marked up as a stray `<strong>Introduction</strong>`,
 *    and one row that opens with markdown `**Challenges**` before switching to `<p>`.
 *  • `webinar.eventDescription` is NOT HTML at all - plain text with blank-line
 *    paragraph breaks and `**bold**` runs.
 *
 * So this parser has to survive all four. It handles block-level HTML, loose text
 * between tags, and markdown emphasis, and it drops anything it cannot place rather
 * than emitting an empty block that would render as a gap on the page.
 *
 * INLINE FORMATTING IS INTENTIONALLY LOST. `ContentBlock` has no marks - no bold, no
 * links - so `<a>` and `<strong>` inside a paragraph flatten to their text. That is a
 * real trade-off of the block model, not an oversight here: adding marks means
 * extending `ContentBlock` and `ArticleBody` together, at which point this file grows
 * a case for them.
 */

/* ── Entities ───────────────────────────────────────────────────────────────── */

/**
 * The named entities the live content actually uses, plus the five XML basics.
 *
 * A full HTML entity table is ~2000 names and none of the rest appear in this CMS;
 * an unknown name is left verbatim rather than mangled, so a miss shows up as
 * `&hellip;` on the page instead of silently deleting the character.
 */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  hellip: '…',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  bull: '•',
  middot: '·',
  deg: '°',
  trade: '™',
  reg: '®',
  copy: '©',
  times: '×',
};

/**
 * Numeric references first, then named.
 *
 * Order matters for double-encoded content (`&amp;#39;`): decoding `&amp;` first would
 * turn it into `&#39;` and leave a literal entity on the page. Numeric-first means the
 * inner reference resolves and the outer `&amp;` becomes a plain ampersand.
 */
function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (match, hex: string) => {
      const code = Number.parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    })
    .replace(/&#(\d+);/g, (match, dec: string) => {
      const code = Number(dec);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    })
    .replace(
      /&([a-z]+);/gi,
      (match, name: string) => NAMED_ENTITIES[name.toLowerCase()] ?? match,
    );
}

/* ── Inline text ────────────────────────────────────────────────────────────── */

/** Strip markdown emphasis markers, which the block model cannot represent. */
function stripEmphasis(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/(^|\s)\*([^*\n]+)\*(?=\s|[.,;:!?)]|$)/g, '$1$2');
}

/**
 * One block's inner HTML → its plain text.
 *
 * Tags become a SPACE, not nothing, because `<span>A</span><span>B</span>` with no
 * whitespace in the source is real WYSIWYG output and must not become "AB". The cost is
 * a space on the wrong side of punctuation — `<strong>Mahesh Shah</strong>,` flattens to
 * "Mahesh Shah ," — which is why `tidySpacing` runs after.
 */
function toText(html: string): string {
  return tidySpacing(
    stripEmphasis(decodeEntities(html.replace(/<[^>]*>/g, ' '))),
  );
}

/**
 * Collapse whitespace and undo the spacing that tag-stripping introduces.
 *
 * Both halves are needed on live content: the press releases in `news` wrap names and
 * dates in `<strong>`/`<a>` mid-sentence, which leaves a space before the following
 * comma, and they open quotes with `<span>` runs, which leaves one after the opening
 * quote mark.
 */
function tidySpacing(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?%)\]}»”’])/g, '$1')
    .replace(/([([{«“‘])\s+/g, '$1')
    .trim();
}

/* ── Block-level parsing ────────────────────────────────────────────────────── */

/**
 * Matches one block-level element and captures its inner HTML.
 *
 * Non-greedy, and back-referenced to the opening tag name so `<p>…</p><p>…</p>` is two
 * matches rather than one spanning both. Nested same-name tags (`<div><div>`) would
 * mis-pair, which is why `div` is last resort and why the loose-text path below exists
 * at all - anything this regex does not claim still becomes prose instead of vanishing.
 */
const BLOCK_RE = /<(p|h[1-6]|ul|ol|blockquote|div)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi;

const LIST_ITEM_RE = /<li\b[^>]*>([\s\S]*?)<\/li\s*>/gi;

/** A line that is nothing but bolded text reads as a section title, not a sentence. */
const BOLD_ONLY_RE = /^(?:<strong\b[^>]*>|<b\b[^>]*>|\*\*|__)([\s\S]+?)(?:<\/strong\s*>|<\/b\s*>|\*\*|__)$/i;

const BULLET_LINE_RE = /^\s*(?:[-*•·]|\d+[.)])\s+/;

/**
 * An ATX markdown heading, e.g. `## The Challenge`.
 *
 * The case-study bodies mix these into otherwise-HTML content — `##` for section titles
 * and `###` for the numbered sub-sections under them — and without this the marker
 * renders as literal `##` at the start of a paragraph.
 */
const ATX_HEADING_RE = /^(#{1,6})\s+(.*)$/;

/**
 * Heading level from the tag name.
 *
 * `h1`-`h3` all map to the larger of `ArticleBody`'s two sizes because the CMS's blog
 * HTML uses `h3` as its ONLY heading level - rendering an article's main section
 * headings at the subordinate size would be wrong. `h4`-`h6` take the smaller one,
 * which is where a genuinely nested heading lands.
 */
function headingLevel(tag: string): 2 | 3 {
  return /^h[123]$/i.test(tag) ? 2 : 3;
}

/* ── Inline images ──────────────────────────────────────────────────────────── */

const IMG_RE = /<img\b[^>]*>/gi;

/**
 * One attribute off a tag.
 *
 * The leading `(?:^|\s)` is load-bearing: without it `src` also matches `data-src` and
 * `width` matches nothing useful inside a `style="max-width:…"` value.
 */
function attr(tag: string, name: string): string | null {
  const match = new RegExp(
    `(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    'i',
  ).exec(tag);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

/**
 * An `<img>` tag → an image block, or `null` when it has no source.
 *
 * `width`/`height` are optional because 11 of the live tags omit them - the press-release
 * screenshots in `news` are sized with a `style` attribute instead.
 */
function imageBlock(tag: string): ContentBlock | null {
  const src = attr(tag, 'src')?.trim();
  if (!src) return null;

  const width = Number(attr(tag, 'width'));
  const height = Number(attr(tag, 'height'));

  return {
    type: 'image',
    src: decodeEntities(src),
    alt: decodeEntities(attr(tag, 'alt') ?? '').trim(),
    ...(Number.isFinite(width) && width > 0 ? { width } : {}),
    ...(Number.isFinite(height) && height > 0 ? { height } : {}),
  };
}

/**
 * Walk a fragment, emitting its images and its text IN SOURCE ORDER.
 *
 * An editor's image usually sits in its own `<p>`, but not always - `<p><img/>caption
 * text</p>` happens - so the fragment is split around each tag rather than the images
 * being hoisted to the front or the back.
 */
function splitOnImages(
  html: string,
  makeText: (text: string) => ContentBlock | null,
): ContentBlock[] {
  if (!/<img\b/i.test(html)) {
    const only = makeText(toText(html));
    return only ? [only] : [];
  }

  const blocks: ContentBlock[] = [];
  let cursor = 0;

  IMG_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = IMG_RE.exec(html)) !== null) {
    const before = makeText(toText(html.slice(cursor, match.index)));
    if (before) blocks.push(before);

    const image = imageBlock(match[0]);
    if (image) blocks.push(image);

    cursor = match.index + match[0].length;
  }

  const after = makeText(toText(html.slice(cursor)));
  if (after) blocks.push(after);

  return blocks;
}

const asParagraph = (text: string): ContentBlock | null =>
  text ? { type: 'paragraph', text } : null;

/**
 * Pull every image out of a fragment, returning the fragment without them.
 *
 * For containers where an image cannot be rendered IN PLACE - a heading, a list item -
 * the image is emitted after the block instead of being lost. This is not a hypothetical
 * tidiness: the live bodies contain `<h3><b><img …></b></h3>` and
 * `<li>Enhanced efficiency<img …></li>`, and thirteen images sat in exactly those two
 * positions.
 */
function extractImages(html: string): { html: string; images: ContentBlock[] } {
  const images: ContentBlock[] = [];
  const stripped = html.replace(IMG_RE, (tag) => {
    const block = imageBlock(tag);
    if (block) images.push(block);
    return ' ';
  });
  return { html: stripped, images };
}

function listBlock(innerHtml: string): ContentBlock | null {
  const items = [...innerHtml.matchAll(LIST_ITEM_RE)]
    .map((match) => toText(match[1] ?? ''))
    .filter((item) => item.length > 0);
  return items.length ? { type: 'list', items } : null;
}

/**
 * Text that sits outside any block tag.
 *
 * Split on EVERY newline, not just blank-line runs: loose text in this CMS is
 * line-structured (the case-study bodies are one logical line per line, unwrapped), so
 * joining single-newline lines produces run-on paragraphs that read as a mistake.
 */
function looseBlocks(text: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (bullets.length) {
      blocks.push({ type: 'list', items: bullets });
      bullets = [];
    }
  };

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      flushBullets();
      continue;
    }

    if (BULLET_LINE_RE.test(line)) {
      const item = toText(line.replace(BULLET_LINE_RE, ''));
      if (item) bullets.push(item);
      continue;
    }

    flushBullets();

    // An untagged image, usually on a line of its own. Checked before the heading and
    // paragraph cases because the tag flattens to empty text and would be dropped.
    if (/<img\b/i.test(line)) {
      blocks.push(...splitOnImages(line, asParagraph));
      continue;
    }

    const atx = ATX_HEADING_RE.exec(line);
    if (atx) {
      const heading = toText(atx[2] ?? '');
      // `#`-`###` are this content's section titles; deeper ones are sub-sections.
      if (heading) {
        blocks.push({
          type: 'heading',
          text: heading,
          level: (atx[1] ?? '').length <= 3 ? 2 : 3,
        });
      }
      continue;
    }

    const bold = BOLD_ONLY_RE.exec(line);
    if (bold) {
      const heading = toText(bold[1] ?? '');
      if (heading) blocks.push({ type: 'heading', text: heading, level: 2 });
      continue;
    }

    const paragraph = toText(line);
    if (paragraph) blocks.push({ type: 'paragraph', text: paragraph });
  }

  flushBullets();
  return blocks;
}

/**
 * Parse a Strapi richtext value into renderable blocks.
 *
 * Returns an empty array for empty input, so a caller can decide between "render
 * nothing" and "fall back" rather than getting a body with one blank paragraph in it.
 */
export function richTextToBlocks(value: string | null | undefined): ContentBlock[] {
  if (!value?.trim()) return [];

  const source = value
    .replace(/\r\n?/g, '\n')
    // A TAG THAT SPANS LINES IS FOLDED ONTO ONE LINE FIRST. `looseBlocks` splits on
    // newlines, so a multi-line tag would reach it as two fragments, neither of which
    // is a complete `<…>` for the stripper to remove — which is exactly how one blog
    // row leaked a literal `<img src ="…" />` into its prose. Folding first makes the
    // line-based split safe for any tag, not just the `img` that exposed it.
    .replace(/<[^>]*>/g, (tag) => tag.replace(/\s*\n\s*/g, ' '))
    // `<br>` becomes a real newline, so a `<br><br>` break in loose text splits
    // paragraphs, while a single `<br>` inside a `<p>` collapses to a space when that
    // paragraph's inner HTML is flattened.
    .replace(/<\s*br\s*\/?\s*>/gi, '\n');

  const blocks: ContentBlock[] = [];
  let cursor = 0;

  BLOCK_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = BLOCK_RE.exec(source)) !== null) {
    if (match.index > cursor) {
      blocks.push(...looseBlocks(source.slice(cursor, match.index)));
    }
    cursor = match.index + match[0].length;

    const tag = (match[1] ?? '').toLowerCase();
    const inner = match[2] ?? '';

    if (tag === 'ul' || tag === 'ol') {
      const { html: withoutImages, images } = extractImages(inner);
      const list = listBlock(withoutImages);
      if (list) blocks.push(list);
      blocks.push(...images);
      continue;
    }

    if (/^h[1-6]$/.test(tag)) {
      const { html: withoutImages, images } = extractImages(inner);
      const text = toText(withoutImages);
      if (text) blocks.push({ type: 'heading', text, level: headingLevel(tag) });
      blocks.push(...images);
      continue;
    }

    if (tag === 'blockquote') {
      const { html: withoutImages, images } = extractImages(inner);
      const text = toText(withoutImages);
      if (text) blocks.push({ type: 'quote', text });
      blocks.push(...images);
      continue;
    }

    // `p` / `div`. An editor who wrapped a list in a paragraph still gets a list -
    // flattening the `<li>`s into one sentence is the worse failure.
    if (/<li\b/i.test(inner)) {
      const list = listBlock(inner);
      if (list) blocks.push(list);
      continue;
    }

    // A `<p>` holding nothing but bold text is a section title in this content, the
    // same as the loose-text case.
    const trimmedInner = inner.trim();
    const bold = BOLD_ONLY_RE.exec(trimmedInner);
    if (bold) {
      const heading = toText(bold[1] ?? '');
      if (heading) blocks.push({ type: 'heading', text: heading, level: 2 });
      continue;
    }

    blocks.push(...splitOnImages(inner, asParagraph));
  }

  if (cursor < source.length) {
    blocks.push(...looseBlocks(source.slice(cursor)));
  }

  return blocks;
}

/* ── Derived fields ─────────────────────────────────────────────────────────── */

/** Words per minute used for the "N min read" chip. Nielsen's midpoint for prose. */
const READING_WPM = 220;

const EXCERPT_MAX = 180;

/**
 * First paragraph of a body, clipped to card length.
 *
 * NONE of these collections has an excerpt column - `news.subtitle` is the only
 * editorial summary in the CMS - so the card teaser has to come from the body. Clipping
 * happens on a word boundary because the design's card shows two lines and a
 * mid-word cut is visible.
 */
export function excerptFromBlocks(
  blocks: ContentBlock[],
  maxLength = EXCERPT_MAX,
): string {
  const paragraphs = blocks.filter(
    (block): block is Extract<ContentBlock, { type: 'paragraph' }> =>
      block.type === 'paragraph' && block.text.length > 0,
  );

  // Prefer the first paragraph that is actually a sentence. Several case-study bodies
  // open with an untagged one-line section title ("The Need for a Smarter IT
  // Infrastructure"), which is a heading in everything but markup and makes a poor
  // teaser; the length test steps over it without needing to guess at intent.
  const first =
    paragraphs.find((block) => block.text.length >= 60) ?? paragraphs[0];
  if (!first) return '';

  const text = first.text;
  if (text.length <= maxLength) return text;

  const clipped = text.slice(0, maxLength);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${(lastSpace > maxLength * 0.6 ? clipped.slice(0, lastSpace) : clipped).replace(/[,;:.\s]+$/, '')}…`;
}

/**
 * Reading time, in whole minutes, never zero.
 *
 * Derived rather than authored: the CMS has no such column, and the detail page's meta
 * row shows the chip whenever the value is present. A one-line post should still read
 * "1 min read" rather than "0".
 */
export function readingMinutesFromBlocks(blocks: ContentBlock[]): number {
  const words = blocks.reduce((total, block) => {
    if (block.type === 'image') return total;
    const text = block.type === 'list' ? block.items.join(' ') : block.text;
    return total + text.split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.round(words / READING_WPM));
}
