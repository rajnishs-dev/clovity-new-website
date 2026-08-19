import type { CaseStudyItem } from '@/types/content';
import { getCaseStudyItems } from './case-study';

/**
 * The Managed Services page's data layer.
 *
 * One CMS read: the proof rail's case studies, through `getCaseStudyItems()`, which
 * reads Strapi's `jsm-resource` collection and falls back to the bundled set.
 * Filtering happens here rather than in the section so the section only ever receives
 * what it renders.
 *
 * No client-logo marquee here, unlike the ITSM page - this page already carries a
 * nine-product strip, and two logo rows on one page reads as filler.
 */

/** How many proof cards the section's three-up grid holds. */
const PROOF_COUNT = 3;

/**
 * Terms that mark a case study as ongoing-platform work.
 *
 * ── WHY A TEXT MATCH AND NOT `category` ──
 * Same constraint as `data/itsm.ts`: `CaseStudyItem.category` only ever has a value
 * on the BUNDLED rows, because the live `jsm-resource` collection has no category,
 * client, industry or tag columns (see `toCaseStudyItem` in `api/cms.mappers.ts`). A
 * filter on `category` alone therefore matches nothing the moment the CMS is
 * reachable, and the section silently degrades to "the three newest case studies".
 *
 * So the sweep runs over the text the CMS does supply. Deliberately narrow: broad
 * terms like "jira" or "atlassian" match nearly every row, which would put this back
 * to showing whatever is newest.
 */
const MANAGED_TERMS = [
  'managed service',
  'ongoing support',
  'administration',
  'optimization',
  'optimisation',
  'health check',
  'governance',
  'hosting',
  'upgrade',
  'maintenance',
  'support model',
] as const;

/** Title, excerpt and body text of one case study, lowercased, as one string. */
function searchableText(item: CaseStudyItem): string {
  const blocks = (item.content ?? []).map((block) => {
    if (block.type === 'list') return block.items.join(' ');
    if (block.type === 'image') return block.alt;
    return block.text;
  });

  return [item.title, item.excerpt, ...blocks].join(' ').toLowerCase();
}

function isManagedWork(item: CaseStudyItem): boolean {
  if (
    (item.tags ?? []).some((tag) => tag.toLowerCase() === 'managed services')
  ) {
    return true;
  }

  const text = searchableText(item);
  return MANAGED_TERMS.some((term) => text.includes(term));
}

/**
 * Ongoing-platform case studies, newest first.
 *
 * TOPS UP from the remaining case studies when fewer than three match, for the same
 * reason the ITSM rail does: without it, a CMS outage returning a partial list - or an
 * editor publishing a batch that misses every term above - leaves a heading over a
 * single card, which reads worse than showing adjacent work.
 */
export async function getManagedServicesCaseStudies(): Promise<
  CaseStudyItem[]
> {
  const all = await getCaseStudyItems();

  const matching = all.filter(isManagedWork);
  if (matching.length >= PROOF_COUNT) return matching.slice(0, PROOF_COUNT);

  const rest = all.filter((item) => !isManagedWork(item));
  return [...matching, ...rest].slice(0, PROOF_COUNT);
}

/** Everything the Managed Services page needs. */
export async function getManagedServicesPageData() {
  const caseStudies = await getManagedServicesCaseStudies();
  return { caseStudies };
}
