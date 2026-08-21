import type { CaseStudyItem } from '@/types/content';
import { getMatchingCaseStudies } from './case-study-match';

/**
 * The Atlassian Solutions page's data layer - one CMS read, the proof rail's case studies.
 *
 * ── THE TERMS ARE THE HARD PART ON THIS PAGE ──
 * This is the broadest expertise page on the site, so the usual trick of matching its own
 * subject does not work: "jira", "confluence" and "atlassian" appear in nearly every case
 * study Clovity publishes, and matching on them returns whatever is newest while looking
 * like a deliberate filter. See the note in `case-study-match.ts`.
 *
 * So the sweep targets PLATFORM-OWNERSHIP work specifically - administration, workflow and
 * permission design, governance, licensing, upgrades - which is what this page sells, rather
 * than the product names it happens to mention.
 */
const ATLASSIAN_TERMS = [
  'administration',
  'workflow',
  'permission',
  'governance',
  'licens', // licence / license / licensing
  'upgrade',
  'consolidat',
  'instance',
  'implementation',
  'rollout',
  'optimization',
  'optimisation',
] as const;

export async function getAtlassianCaseStudies(): Promise<CaseStudyItem[]> {
  return getMatchingCaseStudies({
    terms: ATLASSIAN_TERMS,
    tags: ['atlassian', 'atlassian solutions'],
  });
}

/** Everything the Atlassian Solutions page needs. */
export async function getAtlassianPageData() {
  const caseStudies = await getAtlassianCaseStudies();
  return { caseStudies };
}
