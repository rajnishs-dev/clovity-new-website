import type { CaseStudyItem } from '@/types/content';
import { getMatchingCaseStudies } from './case-study-match';

/**
 * The DevSecOps page's data layer - one CMS read, the proof rail's case studies.
 *
 * ── IT USED TO FETCH A BLOG POST TOO ──
 * This file previously exported `getDevSecOpsPlaybook`, which looked up one featured
 * long-form post ("DevSecOps with Atlassian: Building Secure Software Delivery at Scale")
 * by slug for the "Our Own Thinking, Written Down" band. That band was removed on request,
 * so the lookup went with it rather than being left exported and unused.
 *
 * Worth knowing if it ever comes back: that post is still bundled in `data/blog.ts` with a
 * full body, and `constants/devsecops.ts` draws its delivery and toolchain framing from
 * that body - so the page's copy is still downstream of the article even though the article
 * is no longer linked from here.
 */

/**
 * Terms that mark a case study as secure-delivery work.
 *
 * Narrow on purpose - see the note in `case-study-match.ts`. "security" alone is the
 * broadest term here and is still safe, because it does not appear in every case study the
 * way "jira" or "atlassian" would.
 *
 * `bitbucket` and `pipeline` are the strongest signals available: this practice is about
 * the delivery toolchain, and a case study that mentions either is almost certainly about
 * it. `devsecops` and `ci/cd` are included for the day a row names them directly.
 */
const DEVSECOPS_TERMS = [
  'devsecops',
  'devops',
  'ci/cd',
  'cicd',
  'pipeline',
  'bitbucket',
  'security',
  'compliance',
  'vulnerabilit',
  'audit',
  'release management',
  'code review',
] as const;

export async function getDevSecOpsCaseStudies(): Promise<CaseStudyItem[]> {
  return getMatchingCaseStudies({
    terms: DEVSECOPS_TERMS,
    tags: ['devsecops', 'devops', 'security'],
  });
}

/** Everything the DevSecOps page needs. */
export async function getDevSecOpsPageData() {
  const caseStudies = await getDevSecOpsCaseStudies();
  return { caseStudies };
}
