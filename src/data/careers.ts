import type { CultureHighlight, JobOpening, JobTrackFilter } from '@/types/content';
import { getJobs, getLifeAtClovity, withCmsFallback } from '@/api/cms';
import { toJobTrackFilters } from '@/api/cms.mappers';
import {
  CAREERS_CULTURE_FALLBACK,
  CAREERS_JOBS_FALLBACK,
} from '@/constants/careers';

/**
 * The Careers page's data layer.
 *
 * Both loaders read Strapi (`clovity-admin`) and both fall back to the bundled
 * content, so the page renders the published design whether or not the CMS is up.
 *
 * This is the page the legacy frontend already drove from Strapi — its `/talent`
 * route read `/api/jobs` with the same `order` sort and the same `track` filter — so
 * wiring it here is a port of existing behaviour into the new design, not a new
 * integration.
 */

/**
 * Open positions plus the filter tabs derived from them.
 *
 * The tabs come from the SAME array that renders the cards, which is what guarantees
 * every tab matches at least one opening and every opening is reachable from a tab.
 * Deriving them separately — from a fixed list, or a second request — is how a tab
 * that filters to nothing gets shipped.
 */
export async function getJobOpenings(): Promise<{
  jobs: JobOpening[];
  filters: JobTrackFilter[];
}> {
  const jobs = await withCmsFallback(
    () => getJobs(),
    CAREERS_JOBS_FALLBACK,
  );

  return { jobs, filters: toJobTrackFilters(jobs) };
}

/**
 * The photograph for the "Life at Clovity" culture block.
 *
 * `life-at-clovity` is a photo GALLERY — 12 rows in four themed sets of three, each
 * row an image plus a caption, which the legacy site rendered as cards on their own
 * page. This design has a single culture block with one photo, so the lead row of
 * the first gallery (`sectionOrder` then `order`) supplies it, and an editor picks
 * which through the ordering fields they already use.
 *
 * Only the image is consumed downstream — see the note in `CultureSection` for why
 * the row's `header_*` and `info` are not this section's headline and paragraph.
 */
export async function getCultureHighlight(): Promise<CultureHighlight> {
  const highlights = await withCmsFallback(
    () => getLifeAtClovity(),
    [CAREERS_CULTURE_FALLBACK],
  );

  return highlights[0] ?? CAREERS_CULTURE_FALLBACK;
}

/** Everything the Careers page needs, resolved in parallel. */
export async function getCareersPageData() {
  const [openings, culture] = await Promise.all([
    getJobOpenings(),
    getCultureHighlight(),
  ]);

  return { ...openings, culture };
}
