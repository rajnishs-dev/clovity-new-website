import type { CaseStudyItem } from '@/types/content';
import { getCaseStudyItems } from './case-study';

/**
 * The AI Solutions page's data layer.
 *
 * One CMS read: the proof rail's case studies, through `getCaseStudyItems()`, which reads
 * Strapi's `jsm-resource` collection and falls back to the bundled set. Filtering happens here
 * rather than in the section, so the section only ever receives what it renders.
 */

/** How many proof cards the section's three-up grid holds. */
const PROOF_COUNT = 3;

/**
 * Terms that mark a case study as AI or automation work.
 *
 * ── WHY A TEXT MATCH AND NOT `category` ──
 * Same constraint as `data/workforce.ts`, `data/managed-services.ts` and `data/itsm.ts`:
 * `CaseStudyItem.category` only ever has a value on the BUNDLED rows, because the live
 * `jsm-resource` collection has no category, client, industry or tag columns (see
 * `toCaseStudyItem` in `api/cms.mappers.ts`). A filter on `category` alone therefore matches
 * nothing the moment the CMS is reachable, and the section silently degrades to "the three
 * newest case studies".
 *
 * ── "AI" ALONE IS NOT IN THIS LIST, ON PURPOSE ──
 * A bare `'ai'` substring matches inside ordinary words - "available", "detail", "email",
 * "maintain", "certain" - so it would flag essentially every row while looking like a
 * deliberate filter. The two-character form is only safe with word boundaries, which
 * `String.includes` does not give, so the list uses phrases instead. `isAiWork` handles the
 * bare acronym separately with a real regex.
 */
const AI_TERMS = [
  'artificial intelligence',
  'machine learning',
  'automation',
  'automated',
  'pulse ai',
  'gen ai',
  'generative',
  'copilot',
  'rovo',
  'chatbot',
  'predictive',
  'anomaly',
  'llm',
] as const;

/** Matches "AI" as a standalone token, so "email" and "available" do not qualify. */
const AI_ACRONYM = /\bai\b/i;

/** Title, excerpt and body text of one case study, lowercased, as one string. */
function searchableText(item: CaseStudyItem): string {
  const blocks = (item.content ?? []).map((block) => {
    if (block.type === 'list') return block.items.join(' ');
    if (block.type === 'image') return block.alt;
    return block.text;
  });

  return [item.title, item.excerpt, ...blocks].join(' ').toLowerCase();
}

function isAiWork(item: CaseStudyItem): boolean {
  if (
    (item.tags ?? []).some((tag) => {
      const value = tag.toLowerCase();
      return value === 'ai' || value === 'automation';
    })
  ) {
    return true;
  }

  const text = searchableText(item);
  return AI_TERMS.some((term) => text.includes(term)) || AI_ACRONYM.test(text);
}

/**
 * AI and automation case studies, newest first.
 *
 * TOPS UP from the remaining case studies when fewer than three match, for the same reason
 * every other expertise rail does: without it, a CMS outage returning a partial list - or an
 * editor publishing a batch that misses every term above - leaves a heading over a single
 * card, which reads worse than showing adjacent work.
 */
export async function getAiCaseStudies(): Promise<CaseStudyItem[]> {
  const all = await getCaseStudyItems();

  const matching = all.filter(isAiWork);
  if (matching.length >= PROOF_COUNT) return matching.slice(0, PROOF_COUNT);

  const rest = all.filter((item) => !isAiWork(item));
  return [...matching, ...rest].slice(0, PROOF_COUNT);
}

/** Everything the AI Solutions page needs. */
export async function getAiPageData() {
  const caseStudies = await getAiCaseStudies();
  return { caseStudies };
}
