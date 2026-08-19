import type { CaseStudyItem } from '@/types/content';
import { getCaseStudyItems } from './case-study';

/**
 * The Workforce Solutions page's data layer.
 *
 * One CMS read: the proof rail's case studies, through `getCaseStudyItems()`, which reads
 * Strapi's `jsm-resource` collection and falls back to the bundled set. Filtering happens
 * here rather than in the section, so the section only ever receives what it renders.
 *
 * No client-logo marquee and no CMS-driven job list here. The open-roles list belongs to
 * `/careers` and is about people joining Clovity; this page is about Clovity's people
 * joining a client's team, and putting our own vacancies on it would answer the opposite
 * question to the one the reader arrived with.
 */

/** How many proof cards the section's three-up grid holds. */
const PROOF_COUNT = 3;

/**
 * Terms that mark a case study as staffing, embedded-team or enablement work.
 *
 * ── WHY A TEXT MATCH AND NOT `category` ──
 * Same constraint as `data/managed-services.ts` and `data/itsm.ts`:
 * `CaseStudyItem.category` only ever has a value on the BUNDLED rows, because the live
 * `jsm-resource` collection has no category, client, industry or tag columns (see
 * `toCaseStudyItem` in `api/cms.mappers.ts`). A filter on `category` alone therefore
 * matches nothing the moment the CMS is reachable, and the section silently degrades to
 * "the three newest case studies".
 *
 * So the sweep runs over the text the CMS does supply. Deliberately narrow: broad terms
 * like "jira" or "team" match nearly every row, which would put this back to showing
 * whatever is newest. "team" in particular is excluded for that reason - it appears in
 * almost every case study ever written.
 */
const WORKFORCE_TERMS = [
  'staff augmentation',
  'augmentation',
  'staffing',
  'embedded',
  'forward-deployed',
  'training',
  'enablement',
  'coaching',
  'adoption',
  'upskill',
  'certified experts',
  'resource',
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

function isWorkforceWork(item: CaseStudyItem): boolean {
  if (
    (item.tags ?? []).some((tag) => {
      const value = tag.toLowerCase();
      return value === 'workforce' || value === 'staff augmentation';
    })
  ) {
    return true;
  }

  const text = searchableText(item);
  return WORKFORCE_TERMS.some((term) => text.includes(term));
}

/**
 * Staffing and enablement case studies, newest first.
 *
 * TOPS UP from the remaining case studies when fewer than three match, for the same
 * reason the Managed Services and ITSM rails do: without it, a CMS outage returning a
 * partial list - or an editor publishing a batch that misses every term above - leaves a
 * heading over a single card, which reads worse than showing adjacent work.
 */
export async function getWorkforceCaseStudies(): Promise<CaseStudyItem[]> {
  const all = await getCaseStudyItems();

  const matching = all.filter(isWorkforceWork);
  if (matching.length >= PROOF_COUNT) return matching.slice(0, PROOF_COUNT);

  const rest = all.filter((item) => !isWorkforceWork(item));
  return [...matching, ...rest].slice(0, PROOF_COUNT);
}

/** Everything the Workforce Solutions page needs. */
export async function getWorkforcePageData() {
  const caseStudies = await getWorkforceCaseStudies();
  return { caseStudies };
}
