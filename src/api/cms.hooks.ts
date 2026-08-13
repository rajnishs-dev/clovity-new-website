'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  BadgeGroup,
  BlogPost,
  CaseStudyItem,
  ContactFormConfig,
  ContentCollection,
  ContentItem,
  ContentKind,
  CultureHighlight,
  EventItem,
  JobOpening,
  JobTrackFilter,
  NewsItem,
  WebinarItem,
} from '@/types/content';
import { FIELD_NOTES_PER_TAB } from '@/constants/content';
import { buildWhatsNewCards } from '@/constants/navigation';
import type { NavFeatureCard } from '@/types/navigation';
import {
  getAwards,
  getBlogBySlug,
  getBlogs,
  getCaseStudies,
  getCaseStudyBySlug,
  getEventBySlug,
  getEvents,
  getInTouch,
  getJobs,
  getLifeAtClovity,
  getNews,
  getNewsBySlug,
  getWebinarBySlug,
  getWebinars,
  isCmsConfigured,
} from './cms';
import { toJobTrackFilters } from './cms.mappers';

/**
 * Client-side CMS hooks - the browser fetches its own data, the way `website-t`
 * does.
 *
 * ── WHY THERE IS STILL AN `initial` ARGUMENT ──
 * Every hook starts from data the page already has (fetched during static
 * generation) and then re-fetches in the browser, replacing it when the response
 * lands. Each half does something the other cannot:
 *
 *   • the initial data is IN THE HTML, so the content is there for crawlers, for
 *     anyone with JS blocked, and on first paint - no spinner, no layout jump;
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

/** What every hook returns. `data` is never empty - it falls back to `initial`. */
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
        // Keep the data already on screen - see the note above.
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

/** About - the Strapi-backed badge row. */
export function useAwards(
  initial: BadgeGroup['badges'],
): CmsResource<BadgeGroup['badges']> {
  return useCmsResource((signal) => getAwards(signal), initial, 'awards');
}

export interface JobsResource extends CmsResource<JobOpening[]> {
  filters: JobTrackFilter[];
}

/** Careers - open positions, with the filter tabs derived from them. */
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

/** Careers - the culture block's photograph. */
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

/** Contact - which form fields show, and which are required. */
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

/**
 * Header - the Resources mega panel's "What's New" rail.
 *
 * `initial` is the pair built at import time from the bundled fallback data
 * (see `buildWhatsNewCards` / `WHATS_NEW_CARDS` in `constants/navigation.ts`),
 * so the panel never has nothing to show. Once the browser's own request for
 * the live `event` and `blog` collections lands, the rail swaps to whichever
 * event and post are actually newest in the CMS.
 */
export function useWhatsNewCards(
  initial: NavFeatureCard[],
): CmsResource<NavFeatureCard[]> {
  return useCmsResource(
    async (signal) => {
      const [events, blogs] = await Promise.all([
        getEvents(signal),
        getBlogs(signal),
      ]);
      const cards = buildWhatsNewCards(events[0], blogs[0]);
      return cards.length > 0 ? cards : initial;
    },
    initial,
    'whats-new',
  );
}

/* ── The resource collections ───────────────────────────────────────────────
 *
 * These are what make the CMS reads visible in a browser's Network tab: every list
 * and every article body is fetched from `cms.clovity.com` by the browser, the way
 * `website-t` does it.
 *
 * The `initial` argument is the bundled fallback, so the first paint is content rather
 * than a spinner and a CMS outage still shows something. `status` is exposed for callers
 * that want to say "loading" over the top of it.
 */

export function useBlogPosts(initial: BlogPost[]): CmsResource<BlogPost[]> {
  return useCmsResource((signal) => getBlogs(signal), initial, 'blogs');
}

export function useNewsItems(initial: NewsItem[]): CmsResource<NewsItem[]> {
  return useCmsResource((signal) => getNews(signal), initial, 'news');
}

export function useEventItems(initial: EventItem[]): CmsResource<EventItem[]> {
  return useCmsResource((signal) => getEvents(signal), initial, 'events');
}

export function useWebinarItems(
  initial: WebinarItem[],
): CmsResource<WebinarItem[]> {
  return useCmsResource((signal) => getWebinars(signal), initial, 'webinars');
}

export function useCaseStudies(
  initial: CaseStudyItem[],
): CmsResource<CaseStudyItem[]> {
  return useCmsResource(
    (signal) => getCaseStudies(signal),
    initial,
    'case-studies',
  );
}

/**
 * One article, fetched by slug.
 *
 * `initial` may be `undefined` - an article outside the bundled fallback has nothing to
 * show until the request lands, which is the trade-off of fetching in the browser. The
 * `key` includes the slug so navigating between two articles refetches.
 */
function useCmsBySlug<TItem>(
  load: (slug: string, signal: AbortSignal) => Promise<TItem | null>,
  slug: string,
  initial: TItem | undefined,
  scope: string,
): CmsResource<TItem | undefined> {
  return useCmsResource(
    async (signal) => (await load(slug, signal)) ?? initial,
    initial,
    `${scope}:${slug}`,
  );
}

export function useBlogPost(
  slug: string,
  initial: BlogPost | undefined,
): CmsResource<BlogPost | undefined> {
  return useCmsBySlug(getBlogBySlug, slug, initial, 'blog');
}

export function useNewsItem(
  slug: string,
  initial: NewsItem | undefined,
): CmsResource<NewsItem | undefined> {
  return useCmsBySlug(getNewsBySlug, slug, initial, 'news');
}

export function useEventItem(
  slug: string,
  initial: EventItem | undefined,
): CmsResource<EventItem | undefined> {
  return useCmsBySlug(getEventBySlug, slug, initial, 'event');
}

export function useWebinarItem(
  slug: string,
  initial: WebinarItem | undefined,
): CmsResource<WebinarItem | undefined> {
  return useCmsBySlug(getWebinarBySlug, slug, initial, 'webinar');
}

export function useCaseStudy(
  slug: string,
  initial: CaseStudyItem | undefined,
): CmsResource<CaseStudyItem | undefined> {
  return useCmsBySlug(getCaseStudyBySlug, slug, initial, 'case-study');
}

/**
 * The home page's five Field Notes tabs, refetched together.
 *
 * The tab chrome (label, icon, headings, "View More" href) comes from `initial` and is
 * never refetched - it is page furniture, not CMS content. Only the cards are replaced.
 *
 * The casts are contained here on purpose: `ContentCollection.items` is the wide
 * `ContentItem[]`, but the collection whose `kind` is `'blog'` holds `BlogPost`s and
 * nothing else, so each hook gets the right initial value without every caller repeating
 * the assertion.
 */
export function useContentCollections(
  initial: ContentCollection[],
): CmsResource<ContentCollection[]> {
  const itemsOf = (kind: ContentKind): ContentItem[] =>
    initial.find((collection) => collection.kind === kind)?.items ?? [];

  const blogs = useBlogPosts(itemsOf('blog') as BlogPost[]);
  const news = useNewsItems(itemsOf('news') as NewsItem[]);
  const events = useEventItems(itemsOf('events') as EventItem[]);
  const webinars = useWebinarItems(itemsOf('webinars') as WebinarItem[]);
  const studies = useCaseStudies(itemsOf('case-study') as CaseStudyItem[]);

  const byKind: Record<ContentKind, ContentItem[]> = {
    blog: blogs.data,
    news: news.data,
    events: events.data,
    webinars: webinars.data,
    'case-study': studies.data,
  };

  const data = useMemo(
    () =>
      initial.map((collection) => ({
        ...collection,
        items: byKind[collection.kind].slice(0, FIELD_NOTES_PER_TAB),
      })),
    // Depend on the fetched arrays, not on `byKind`, which is a new object each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initial, blogs.data, news.data, events.data, webinars.data, studies.data],
  );

  const statuses = [blogs, news, events, webinars, studies].map((r) => r.status);
  const status: CmsFetchStatus = statuses.includes('loading')
    ? 'loading'
    : statuses.includes('error')
      ? 'error'
      : 'idle';

  return { data, status };
}
