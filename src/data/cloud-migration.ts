import type { CaseStudyItem } from '@/types/content';
import { getMatchingCaseStudies } from './case-study-match';

/**
 * The Cloud Migration page's data layer - one CMS read, the proof rail's case studies.
 *
 * These terms are the most reliable of any expertise page: migration work names itself in a
 * case study's title far more often than administration or AI work does, and the live
 * `jsm-resource` collection genuinely contains migration stories (Forcepoint's Data Center to
 * Cloud move among them). This rail should rarely need to top up.
 *
 * `data center` is spelled only the American way here, matching how the published case
 * studies write it. Add `data centre` if a British-spelled row ever lands.
 */
const MIGRATION_TERMS = [
  'migration',
  'migrat', // migrate / migrated / migrating
  'data center',
  'server to cloud',
  'cloud transformation',
  'cutover',
  'gov cloud',
  'government cloud',
  'agc',
  'fedramp',
] as const;

export async function getCloudMigrationCaseStudies(): Promise<CaseStudyItem[]> {
  return getMatchingCaseStudies({
    terms: MIGRATION_TERMS,
    tags: ['cloud migration', 'migration'],
  });
}

/** Everything the Cloud Migration page needs. */
export async function getCloudMigrationPageData() {
  const caseStudies = await getCloudMigrationCaseStudies();
  return { caseStudies };
}
