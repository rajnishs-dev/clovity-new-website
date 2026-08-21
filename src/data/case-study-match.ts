import type { CaseStudyItem } from '@/types/content';
import { getCaseStudyItems } from './case-study';

/**
 * Shared case-study matching for the expertise pages' proof rails.
 *
 * ── WHY THIS FILE EXISTS ──
 * `data/itsm.ts`, `data/managed-services.ts`, `data/workforce.ts` and `data/ai.ts` each
 * carry their own copy of the same forty lines: flatten a case study to searchable text,
 * keyword-match it, take the first three, top up from the rest when fewer than three
 * match. Four copies was already too many; the Atlassian, Cloud Migration and Marketplace
 * Apps rails would have made seven. Those four are left alone deliberately - they work,
 * and rewriting them is a separate change - but nothing new should copy them again.
 *
 * ── WHY A TEXT MATCH AND NOT `category` ──
 * `CaseStudyItem.category`, `client`, `industry` and `tags` only ever have values on the
 * BUNDLED rows. The live `jsm-resource` collection has no columns for them - see
 * `toCaseStudyItem` in `api/cms.mappers.ts` - so a filter on `category` alone matches
 * nothing the moment the CMS is reachable, and a rail silently degrades to "the three
 * newest case studies". Tags are still checked first, because they are the precise signal
 * and start working the day that column exists; the keyword sweep is the fallback.
 *
 * Keep per-page term lists NARROW. Broad words like "jira" or "atlassian" match nearly
 * every row, which puts the rail straight back to showing whatever is newest.
 */

/** How many cards the three-up proof grids hold. */
export const PROOF_COUNT = 3;

/** Title, excerpt and body text of one case study, lowercased, as one string. */
export function searchableText(item: CaseStudyItem): string {
  const blocks = (item.content ?? []).map((block) => {
    if (block.type === 'list') return block.items.join(' ');
    if (block.type === 'image') return block.alt;
    return block.text;
  });

  return [item.title, item.excerpt, ...blocks].join(' ').toLowerCase();
}

export interface CaseStudyMatch {
  /** Lowercase substrings to look for in the searchable text. */
  terms: readonly string[];
  /** Exact `tags` values that qualify a row outright, lowercased. */
  tags?: readonly string[];
  /**
   * Extra predicate over the searchable text, for signals a substring cannot express
   * safely - e.g. the AI rail needs `\bai\b`, because a bare "ai" substring also matches
   * "available", "detail", "email" and "maintain".
   */
  matches?: (text: string) => boolean;
  /** Defaults to `PROOF_COUNT`. */
  count?: number;
}

function qualifies(item: CaseStudyItem, spec: CaseStudyMatch): boolean {
  const wanted = spec.tags ?? [];
  if (
    wanted.length > 0 &&
    (item.tags ?? []).some((tag) => wanted.includes(tag.toLowerCase()))
  ) {
    return true;
  }

  const text = searchableText(item);
  if (spec.terms.some((term) => text.includes(term))) return true;
  return spec.matches ? spec.matches(text) : false;
}

/**
 * Case studies matching `spec`, newest first, topped up to `count`.
 *
 * TOPS UP from the non-matching rows on purpose: without it a CMS outage returning a
 * partial list - or an editor publishing a batch that misses every term - leaves a heading
 * over one card, which reads worse than showing adjacent work.
 */
export async function getMatchingCaseStudies(
  spec: CaseStudyMatch,
): Promise<CaseStudyItem[]> {
  const count = spec.count ?? PROOF_COUNT;
  const all = await getCaseStudyItems();

  const matching = all.filter((item) => qualifies(item, spec));
  if (matching.length >= count) return matching.slice(0, count);

  const rest = all.filter((item) => !qualifies(item, spec));
  return [...matching, ...rest].slice(0, count);
}
