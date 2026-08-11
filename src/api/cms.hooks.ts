'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  BadgeGroup,
  ContactFormConfig,
  CultureHighlight,
  JobOpening,
  JobTrackFilter,
} from '@/types/content';
import {
  getAwards,
  getInTouch,
  getJobs,
  getLifeAtClovity,
  isCmsConfigured,
} from './cms';
import { toJobTrackFilters } from './cms.mappers';

/**
 * Client-side CMS hooks — the browser fetches its own data, the way `website-t`
 * does.
 *
 * ── WHY THERE IS STILL AN `initial` ARGUMENT ──
 * Every hook starts from data the page already has (fetched during static
 * generation) and then re-fetches in the browser, replacing it when the response
 * lands. Each half does something the other cannot:
 *
 *   • the initial data is IN THE HTML, so the content is there for crawlers, for
 *     anyone with JS blocked, and on first paint — no spinner, no layout jump;
 *   • the client fetch means an editor's publish shows up on the next page load
 *     rather than after the cache window.
 *
 * A pure client fetch would have given the second and lost the first: 173 job
 * listings would vanish from the crawlable HTML.
 *
 * ── FAILURE IS SILENT ON PURPOSE ──
 * If the request fails the hook keeps whatever it already had, so a visitor sees the
 * build-time content instead of an error. That is also why `status` is exposed
 * separately rather than the data ever being cleared.
 *
 * ── ABORT ON UNMOUNT ──
 * Each effect owns an `AbortController` and a `cancelled` flag. The controller stops
 * the request; the flag stops a response already in flight from calling `setState` on
 * an unmounted component.
 */

export type CmsFetchStatus = 'idle' | 'loading' | 'error';

/** What every hook returns. `data` is never empty — it falls back to `initial`. */
export interface CmsResource<TData> {
  data: TData;
  status: CmsFetchStatus;
}

/**
 * Shared effect body.
 *
 * `setStatus('loading')` runs inside the async function rather than in the effect
 * body, because a synchronous `setState` in an effect triggers a cascading render
 * (and `react-hooks/set-state-in-effect` rejects it).
 */
function useCmsResource<TData>(
  load: (signal: AbortSignal) => Promise<TData>,
  initial: TData,
  /** Re-run key. Primitive, so the effect does not fire on every render. */
  key: string,
): CmsResource<TData> {
  const [data, setData] = useState<TData>(initial);
  const [status, setStatus] = useState<CmsFetchStatus>('idle');

  useEffect(() => {
    if (!isCmsConfigured()) return;

    const controller = new AbortController();
    let cancelled = false;

    void (async () => {
      setStatus('loading');
      try {
        const next = await load(controller.signal);
        if (cancelled) return;
        setData(next);
        setStatus('idle');
      } catch {
        if (cancelled || controller.signal.aborted) return;
        // Keep the data already on screen — see the note above.
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
    // `load` is redefined every render by design; `key` is what decides a refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, status };
}

/** About — the Strapi-backed badge row. */
export function useAwards(
  initial: BadgeGroup['badges'],
): CmsResource<BadgeGroup['badges']> {
  return useCmsResource((signal) => getAwards(signal), initial, 'awards');
}

export interface JobsResource extends CmsResource<JobOpening[]> {
  filters: JobTrackFilter[];
}

/** Careers — open positions, with the filter tabs derived from them. */
export function useJobs(initial: JobOpening[]): JobsResource {
  const { data, status } = useCmsResource(
    (signal) => getJobs(signal),
    initial,
    'jobs',
  );

  // Derived from whatever is on screen right now, so a tab can never point at a
  // track with no visible openings.
  const filters = useMemo(() => toJobTrackFilters(data), [data]);

  return { data, status, filters };
}

/** Careers — the culture block's photograph. */
export function useLifeAtClovity(
  initial: CultureHighlight,
): CmsResource<CultureHighlight> {
  return useCmsResource(
    async (signal) => {
      const rows = await getLifeAtClovity(signal);
      // The lead row of the first gallery, matching the server loader.
      return rows[0] ?? initial;
    },
    initial,
    'life-at-clovity',
  );
}

/** Contact — which form fields show, and which are required. */
export function useInTouch(
  websiteSlug: string,
  initial: ContactFormConfig,
): CmsResource<ContactFormConfig> {
  return useCmsResource(
    async (signal) => (await getInTouch(websiteSlug, signal)) ?? initial,
    initial,
    `get-in-touch:${websiteSlug}`,
  );
}
