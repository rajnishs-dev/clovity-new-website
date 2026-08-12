import { Fragment, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { decodeHtmlEntities } from '@/lib/format';

/**
 * Renders a CMS rich-text field as React elements.
 *
 * ── WHY NOT `dangerouslySetInnerHTML` ──
 * The source is Strapi's `job_description`, and in the live instance every one of
 * the 173 postings is HTML pasted out of a WYSIWYG. Injecting that string would put
 * markup written by whoever last edited a job ad straight into the page - one
 * `<img onerror=…>` in a paste from an external document is stored XSS, and it would
 * execute for every visitor. The legacy site does exactly that (its markdown
 * renderer passes HTML through untouched); this does not.
 *
 * ── WHY NOT A REGEX SANITISER ──
 * Allow-listing tags by rewriting the HTML string is the classic footgun:
 * `<scr<script>ipt>`, unbalanced quotes and malformed nesting all defeat it, and a
 * near-miss is indistinguishable from a hit until it is exploited. No sanitiser
 * library is installed, and adding one for a single field is a dependency decision
 * that is not mine to make.
 *
 * ── WHAT THIS DOES INSTEAD ──
 * Tag names are *read* and then discarded; nothing from the source is ever emitted
 * as markup. The output is always React elements whose children are strings, which
 * React escapes. So the worst a hostile paste can do is render as visible text.
 * Attributes - including `href`, `style` and every `on*` handler - are dropped
 * wholesale, because none of them can be trusted and none is needed to read a job
 * posting.
 *
 * Structure IS preserved, which is the point: headings, paragraphs and bullet lists
 * are what make a posting readable, and flattening one to a single paragraph (which
 * is all the card teaser needs) would make the expanded panel unusable.
 *
 * Handles markdown too - Strapi types the column as markdown even though the live
 * content is HTML, so both are covered rather than betting on one.
 */

/* ── Model ──────────────────────────────────────────────────────────────── */

interface Span {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

type Block =
  | { kind: 'heading'; spans: Span[] }
  | { kind: 'paragraph'; spans: Span[] }
  | { kind: 'list'; ordered: boolean; items: Span[][] };

/** Tags whose entire contents are dropped - never prose. */
const VOID_CONTENT = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;

const BOLD_TAGS = new Set(['strong', 'b']);
const ITALIC_TAGS = new Set(['em', 'i']);
const HEADING_TAG = /^h[1-6]$/;

/**
 * Tags that end whatever line was being built.
 *
 * `td`/`th` are NOT here: a table row reads better as one line than as one paragraph
 * per cell, so those only contribute a separating space.
 */
const BREAKS_BLOCK = new Set([
  'p',
  'div',
  'section',
  'article',
  'blockquote',
  'tr',
  'table',
  'tbody',
  'thead',
  'br',
  'hr',
]);

/**
 * Turn rich text into blocks with a single-pass tokeniser.
 *
 * ── WHY A TOKENISER AND NOT A REGEX PER BLOCK ──
 * The obvious approach - one regex matching `<(p|li|ul|h1)…>(.*?)</\1>` and walking
 * the matches - is wrong on nested markup, and wrong in a way that looks fine.
 * Scanning left to right, `<ul>` matches BEFORE the `<li>`s inside it, the scan
 * cursor jumps past `</ul>`, and every bullet in that list is skipped. Measured
 * against the live postings that silently dropped up to 98% of a job description:
 * these are mostly bullet lists, and the panel still rendered a plausible-looking
 * few paragraphs. A fidelity check comparing rendered words against source words is
 * the only reason it was caught, and it is worth keeping one around.
 *
 * So: tags are read one at a time and drive a small state machine. Nesting depth
 * does not matter, because nothing is "consumed" - text always lands in whichever
 * buffer is currently open.
 *
 * Markdown is normalised to the same tags first, so there is one code path.
 */
function toBlocks(source: string): Block[] {
  const normalised = source
    .replace(VOID_CONTENT, ' ')
    // Markdown headings and list markers → the tags the machine understands.
    .replace(/^\s{0,3}#{1,6}\s+(.*)$/gm, '<h4>$1</h4>')
    .replace(/^\s{0,3}[-*+]\s+(.*)$/gm, '<li>$1</li>')
    .replace(/^\s{0,3}\d+\.\s+(.*)$/gm, '<li data-ordered>$1</li>')
    // Markdown emphasis → tags, so the inline handling below styles it.
    .replace(/(\*\*|__)(.+?)\1/g, '<strong>$2</strong>')
    .replace(/(?<![*\w])\*(?!\s)([^*]+?)\*(?![*\w])/g, '<em>$1</em>')
    // A blank line is a paragraph break in markdown.
    .replace(/\n{2,}/g, '<br>');

  const blocks: Block[] = [];

  let buffer: Span[] = [];
  let bufferIsHeading = false;
  let itemBuffer: Span[] | null = null;
  let list: { ordered: boolean; items: Span[][] } | null = null;

  // Depth counters, not a stack: unbalanced `</strong>` is routine in pasted HTML,
  // and a counter recovers where a stack would stay desynced for the rest of the
  // document.
  let bold = 0;
  let italic = 0;

  const target = () => (itemBuffer !== null ? itemBuffer : buffer);

  const pushText = (raw: string) => {
    const text = decodeHtmlEntities(raw).replace(/\s+/g, ' ');
    if (!text.trim()) {
      // Preserve a single separating space between two styled runs.
      const into = target();
      const last = into[into.length - 1];
      if (last && !last.text.endsWith(' ')) last.text += ' ';
      return;
    }
    const into = target();
    const last = into[into.length - 1];
    if (
      last &&
      Boolean(last.bold) === bold > 0 &&
      Boolean(last.italic) === italic > 0
    ) {
      last.text += text;
      return;
    }
    into.push({
      text,
      ...(bold > 0 ? { bold: true } : {}),
      ...(italic > 0 ? { italic: true } : {}),
    });
  };

  const trim = (spans: Span[]): Span[] =>
    spans
      .map((span) => ({ ...span, text: span.text.replace(/\s+/g, ' ') }))
      .filter((span) => span.text.trim().length > 0);

  const flushList = () => {
    if (list && list.items.length > 0) {
      blocks.push({ kind: 'list', ordered: list.ordered, items: list.items });
    }
    list = null;
  };

  const flushBuffer = () => {
    const spans = trim(buffer);
    buffer = [];
    if (spans.length === 0) {
      bufferIsHeading = false;
      return;
    }
    // A paragraph interrupting a list ends it, so ordering is preserved.
    flushList();
    blocks.push({ kind: bufferIsHeading ? 'heading' : 'paragraph', spans });
    bufferIsHeading = false;
  };

  const closeItem = () => {
    if (itemBuffer === null) return;
    const spans = trim(itemBuffer);
    itemBuffer = null;
    if (spans.length === 0) return;
    if (!list) list = { ordered: false, items: [] };
    list.items.push(spans);
  };

  /** Tag, or a run of text. Anything else is not representable here. */
  const tokens = /<\/?([a-z][a-z0-9]*)\b([^>]*)>|([^<]+)/gi;
  let token: RegExpExecArray | null;

  while ((token = tokens.exec(normalised)) !== null) {
    const [raw, rawName, attrs, text] = token;

    if (text !== undefined) {
      pushText(text);
      continue;
    }

    const name = (rawName ?? '').toLowerCase();
    const closing = raw.startsWith('</');

    if (BOLD_TAGS.has(name)) {
      bold = closing ? Math.max(0, bold - 1) : bold + 1;
      continue;
    }
    if (ITALIC_TAGS.has(name)) {
      italic = closing ? Math.max(0, italic - 1) : italic + 1;
      continue;
    }

    if (name === 'li') {
      if (closing) {
        closeItem();
      } else {
        // An unclosed previous item still gets committed.
        closeItem();
        flushBuffer();
        if (!list) list = { ordered: /data-ordered/.test(attrs ?? ''), items: [] };
        itemBuffer = [];
      }
      continue;
    }

    if (name === 'ul' || name === 'ol') {
      closeItem();
      if (closing) {
        flushList();
      } else {
        flushBuffer();
        flushList();
        list = { ordered: name === 'ol', items: [] };
      }
      continue;
    }

    if (HEADING_TAG.test(name)) {
      closeItem();
      flushBuffer();
      // The flag is set on OPEN and consumed by the flush on close.
      if (!closing) bufferIsHeading = true;
      continue;
    }

    if (name === 'td' || name === 'th') {
      pushText(' ');
      continue;
    }

    if (BREAKS_BLOCK.has(name)) {
      // Inside a list item a `<p>` is a line break, not a new block - flushing the
      // buffer there would strand the item's text outside the bullet.
      if (itemBuffer !== null) pushText(' ');
      else flushBuffer();
      continue;
    }

    // Everything else (a, span, u, img, table cells' wrappers…) is ignored, and its
    // text still flows into the current buffer.
  }

  closeItem();
  flushBuffer();
  flushList();

  return blocks;
}

/* ── Rendering ──────────────────────────────────────────────────────────── */

function renderSpans(spans: Span[]): ReactNode {
  return spans.map((span, index) => {
    const key = `${index}-${span.text.slice(0, 12)}`;
    if (span.bold && span.italic) {
      return (
        <em key={key} className="font-700">
          {span.text}
        </em>
      );
    }
    if (span.bold) {
      return (
        <strong key={key} className="font-700 text-title">
          {span.text}
        </strong>
      );
    }
    if (span.italic) return <em key={key}>{span.text}</em>;
    return <Fragment key={key}>{span.text}</Fragment>;
  });
}

export interface RichTextProps {
  /** Raw CMS field - HTML, markdown, or a mix. */
  source: string;
  className?: string;
}

export function RichText({ source, className }: RichTextProps) {
  const blocks = toBlocks(source);
  if (blocks.length === 0) return null;

  return (
    <div className={cn('text-[15px] leading-[1.7] text-muted', className)}>
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;

        if (block.kind === 'heading') {
          return (
            <h4
              key={key}
              className="mb-2 mt-5 text-[16px] font-700 text-title first:mt-0"
            >
              {renderSpans(block.spans)}
            </h4>
          );
        }

        if (block.kind === 'list') {
          const ListTag = block.ordered ? 'ol' : 'ul';
          return (
            <ListTag
              key={key}
              className={cn(
                'mb-4 ml-5 flex list-outside flex-col gap-1.5',
                block.ordered ? 'list-decimal' : 'list-disc',
              )}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${itemIndex}-${item[0]?.text.slice(0, 12) ?? ''}`}>
                  {renderSpans(item)}
                </li>
              ))}
            </ListTag>
          );
        }

        return (
          <p key={key} className="mb-3 last:mb-0">
            {renderSpans(block.spans)}
          </p>
        );
      })}
    </div>
  );
}
