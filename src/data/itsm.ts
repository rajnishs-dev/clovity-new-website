import type { CaseStudyItem, ClientLogo } from '@/types/content';
import { CLIENT_LOGOS } from '@/constants/clients';
import { ITSM_PROOF_CONTENT } from '@/constants/itsm';
import { getCaseStudyItems } from './case-study';

/**
 * The ITSM page's data layer.
 *
 * One CMS read and one bundled list, matching `data/about.ts`:
 *
 *  • CASE STUDIES come through `getCaseStudyItems()`, which reads Strapi's
 *    `jsm-resource` collection and falls back to the bundled set. Filtering happens
 *    here rather than in the section so the section only ever receives what it
 *    renders.
 *
 *  • CLIENT LOGOS are bundled - `clovity-admin` has no collection for them, and
 *    `constants/clients.ts` is the same source the home and About marquees use.
 */

/** How many proof cards the section's three-up grid holds. */
const PROOF_COUNT = 3;

/**
 * Terms that mark a case study as service-management work.
 *
 * ── WHY A TEXT MATCH AND NOT `category` ──
 * `CaseStudyItem.category` only ever has a value on the BUNDLED rows. The live
 * `jsm-resource` collection has no client, industry, category or outcome columns -
 * see the comment in `toCaseStudyItem` (`api/cms.mappers.ts`) - so a filter on
 * `category` or `tags` alone matches nothing as soon as the CMS is reachable, and
 * this section silently degrades to "the three newest case studies", which on the
 * live data means it leads with a cloud-migration story.
 *
 * So `category`/`tags` are still checked first (they are the precise signal, and
 * they start working the day that column exists in Strapi), with a keyword sweep
 * over the text the CMS does supply as the fallback. Deliberately narrow: broad
 * terms like "jira" or "atlassian" match nearly every row and would put us back
 * where we started.
 */
const SERVICE_MANAGEMENT_TERMS = [
  'service management',
  'service desk',
  'service solution',
  'jsm',
  'itsm',
  'itil',
  'help desk',
  'incident management',
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

function isServiceManagement(item: CaseStudyItem): boolean {
  if (item.category === ITSM_PROOF_CONTENT.category) return true;
  if ((item.tags ?? []).some((tag) => tag.toLowerCase() === 'itsm')) return true;

  const text = searchableText(item);
  return SERVICE_MANAGEMENT_TERMS.some((term) => text.includes(term));
}

/**
 * Service-management case studies, newest first.
 *
 * TOPS UP from the remaining case studies when fewer than three match. Without the
 * top-up, a CMS outage returning a partial list - or an editor publishing a batch
 * that happens to miss every term above - leaves this section as a heading over one
 * card, which reads worse than showing adjacent work.
 */
export async function getItsmCaseStudies(): Promise<CaseStudyItem[]> {
  const all = await getCaseStudyItems();

  const matching = all.filter(isServiceManagement);
  if (matching.length >= PROOF_COUNT) return matching.slice(0, PROOF_COUNT);

  const rest = all.filter((item) => !isServiceManagement(item));
  return [...matching, ...rest].slice(0, PROOF_COUNT);
}

/** The client-logo marquee. Same bundled source as the home and About pages. */
export async function getItsmClientLogos(): Promise<ClientLogo[]> {
  return CLIENT_LOGOS;
}

/** Everything the ITSM page needs, resolved in parallel. */
export async function getItsmPageData() {
  const [caseStudies, logos] = await Promise.all([
    getItsmCaseStudies(),
    getItsmClientLogos(),
  ]);

  return { caseStudies, logos };
}
