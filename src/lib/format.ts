/**
 * Presentation-layer formatters. All pure, all locale-explicit - the same input
 * renders the same string on the server and in the browser, which is what keeps
 * React from throwing a hydration mismatch.
 */

const DEFAULT_LOCALE = 'en-US';

/**
 * The zone every CONTENT DATE is rendered in. Not the visitor's, and not UTC.
 *
 * WHY A FIXED ZONE AT ALL: rendering in the visitor's zone would make the same post
 * show two different days to two readers, and would differ between the server render
 * and the browser - a hydration mismatch.
 *
 * WHY THIS ZONE AND NOT UTC: Strapi stores these fields as instants, but editorially
 * they are DAYS someone picked in a date picker - and that picker runs in the editors'
 * browser, in Noida. Strapi converts the pick to UTC on the way in, so a date chosen as
 * "11 Feb" is stored as `2026-02-10T18:30:00Z`. Formatted in UTC that reads 10 Feb: one
 * day earlier than the editor chose, on every such row.
 *
 * It is not a marginal case. Measured against the live CMS: 179 of 504 blog rows (36%)
 * and 2 of 64 event rows land on a different calendar day in UTC than in IST, and the
 * fingerprints are unmistakable - two events at exactly `18:30:00Z` (midnight IST) and
 * blog clusters at `06:30Z` / `07:30Z` / `05:30Z` (12:00 / 13:00 / 11:00 IST).
 *
 * THE DURABLE FIX IS IN THE CMS, not here: a Strapi `date` field carries no time and no
 * zone, so it cannot drift. Until `blog_date` and `startDateTime` become date-only
 * columns, this constant is what reproduces the day the editor actually chose.
 */
const CONTENT_TIME_ZONE = 'Asia/Kolkata';

/**
 * `"2026-05-29"` → `"29 May 2026"` - the legacy card date format, exactly.
 *
 * Assembled from `formatToParts` rather than handed to `format()`: en-US would
 * emit "May 29, 2026" (month-first, with a comma), which is a different string
 * from what the original site rendered. Building it part-by-part pins the
 * day-month-year order regardless of the locale used for the month name.
 */
export function formatContentDate(
  iso: string,
  locale: string = DEFAULT_LOCALE,
): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const parts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: CONTENT_TIME_ZONE,
  }).formatToParts(date);

  const pick = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? '';

  return `${pick('day')} ${pick('month')} ${pick('year')}`;
}

/** `"2026-05-29"` → `"May 29, 2026"` for article bylines. */
export function formatLongDate(
  iso: string,
  locale: string = DEFAULT_LOCALE,
): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: CONTENT_TIME_ZONE,
  }).format(date);
}

/** Thousands separators for the animated counters: `1234` → `"1,234"`. */
export function formatNumber(
  value: number,
  locale: string = DEFAULT_LOCALE,
): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** Cut to `maxLength` on a word boundary and append an ellipsis. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const slice = text.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(' ');
  return `${(lastSpace > maxLength * 0.6 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`;
}

/** Initials for avatar fallbacks: `"Jane Doe"` → `"JD"`. */
export function initials(name: string, max = 2): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, max)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

/**
 * The named HTML entities that actually occur in this CMS's content.
 *
 * A lookup rather than a DOM-based decode, because this runs during static
 * generation on the server where there is no `document`, and pulling in a full
 * entity table for the handful of characters a job posting uses is not worth the
 * bytes. Numeric entities are handled separately below, which covers everything
 * else a WYSIWYG paste realistically produces.
 */
const HTML_ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&rdquo;': '”',
  '&ldquo;': '“',
  '&mdash;': '-',
  '&ndash;': '–',
  '&hellip;': '…',
  '&bull;': '•',
};

/**
 * Decode the HTML entities a CMS paste realistically contains.
 *
 * Exported because both consumers of `job_description` need it: the card teaser
 * (`richTextToPlainText`) and the expanded panel (`<RichText>`). Keeping one
 * implementation means the two can never disagree about what `&rsquo;` looks like.
 *
 * Unknown named entities collapse to a space rather than being left as `&frac12;`
 * literals - in a job posting that is the less wrong of the two.
 */
export function decodeHtmlEntities(source: string): string {
  return source
    .replace(
      /&[a-z]+;/gi,
      (entity) => HTML_ENTITIES[entity.toLowerCase()] ?? ' ',
    )
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(parseInt(code, 16)),
    );
}

/**
 * Strip every mark from a CMS rich-text field, leaving the words.
 *
 * FOR TEASERS - a role card shows a sentence or two where the source field holds a
 * whole job posting. The expanded panel uses `<RichText>` instead, which keeps the
 * structure.
 *
 * HANDLES BOTH HTML AND MARKDOWN. Strapi's `richtext` type is nominally markdown,
 * but every one of the 173 job postings in the live instance is HTML - pasted out
 * of a WYSIWYG - and 103 of them carry entities like `&nbsp;` and `&amp;`. A
 * markdown-only pass left visible tag soup in the teaser.
 *
 * ORDER IS LOAD-BEARING: tags come out here, and entities are decoded afterwards by
 * the caller, so an escaped `&lt;p&gt;` in someone's copy is not decoded into a tag
 * and then stripped as one.
 */
function stripRichTextMarkup(source: string): string {
  return (
    source
      // Elements whose CONTENT is not prose - drop them wholesale rather than
      // leaving CSS or JS in the excerpt.
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      // Markdown fenced code, then inline code.
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/`([^`]*)`/g, '$1')
      // Markdown images before links - an image is a link with a leading `!`.
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // Markdown headings, blockquotes and list markers at line starts.
      .replace(/^\s{0,3}#{1,6}\s+/gm, '')
      .replace(/^\s{0,3}>\s?/gm, '')
      .replace(/^\s{0,3}[-*+]\s+/gm, '')
      .replace(/^\s{0,3}\d+\.\s+/gm, '')
      .replace(/^\s{0,3}([-*_]\s?){3,}$/gm, ' ')
      // Markdown emphasis.
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/~~(.*?)~~/g, '$1')
      // HTML tags - replaced with a space so `</li><li>` does not fuse two words.
      .replace(/<[^>]+>/g, ' ')
  );
}

/** Flatten to one line, entities decoded. The teaser form. */
export function richTextToPlainText(source: string): string {
  return decodeHtmlEntities(stripRichTextMarkup(source))
    .replace(/\s+/g, ' ')
    .trim();
}

/** Rough reading time in whole minutes, floored at 1. */
export function readingMinutes(text: string, wordsPerMinute = 220): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
