import type { CaseStudyItem } from '@/types/content';
import { getMatchingCaseStudies } from './case-study-match';

/**
 * The Marketplace Apps page's data layer - one CMS read, the proof rail's case studies.
 *
 * ── THIS RAIL WILL PROBABLY TOP UP, AND THAT IS EXPECTED ──
 * Clovity's published case studies are about delivery engagements, not about its own apps, so
 * there may be no row that genuinely matches "marketplace app" work. The terms below are the
 * honest signals if such a row is ever published (an app build, a Forge project, a dashboard
 * or reporting rollout); until then `getMatchingCaseStudies` tops the rail up from adjacent
 * work, which is the right outcome - three real engagements beat a heading over one card.
 *
 * If this rail should only ever show app-specific stories, it needs a `category` column in
 * Strapi rather than a longer keyword list. Adding broader terms here would just make the
 * top-up implicit instead of explicit.
 */
const APP_TERMS = [
  'marketplace',
  'forge',
  'plugin',
  'add-on',
  'addon',
  'app development',
  'dashboard',
  'reporting',
  'time tracking',
  'custom app',
] as const;

export async function getMarketplaceAppsCaseStudies(): Promise<
  CaseStudyItem[]
> {
  return getMatchingCaseStudies({
    terms: APP_TERMS,
    tags: ['marketplace apps', 'apps'],
  });
}

/** Everything the Marketplace Apps page needs. */
export async function getMarketplaceAppsPageData() {
  const caseStudies = await getMarketplaceAppsCaseStudies();
  return { caseStudies };
}
