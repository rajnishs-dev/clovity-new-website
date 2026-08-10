/**
 * Presentation-layer formatters. All pure, all locale-explicit - the same input
 * renders the same string on the server and in the browser, which is what keeps
 * React from throwing a hydration mismatch.
 */

const DEFAULT_LOCALE = 'en-US';

/**
 * `"2026-05-29"` → `"29 May 2026"` - the legacy card date format, exactly.
 *
 * Assembled from `formatToParts` rather than handed to `format()`: en-US would
 * emit "May 29, 2026" (month-first, with a comma), which is a different string
 * from what the original site rendered. Building it part-by-part pins the
 * day-month-year order regardless of the locale used for the month name.
 *
 * UTC throughout, so a visitor's timezone can never shift the day.
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
    timeZone: 'UTC',
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
    timeZone: 'UTC',
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

/** URL-safe slug from arbitrary title text. */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

/** Rough reading time in whole minutes, floored at 1. */
export function readingMinutes(text: string, wordsPerMinute = 220): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}
