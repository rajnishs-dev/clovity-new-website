import axios, { type AxiosInstance } from 'axios';
import { env } from '@/config/env';
import type {
  BadgeGroup,
  BlogPost,
  CaseStudyItem,
  ContactFormConfig,
  CultureHighlight,
  EventItem,
  JobOpening,
  NewsItem,
  WebinarItem,
} from '@/types/content';
import {
  composeEnquiryGoal,
  toAwardBadges,
  toBlogPost,
  toCaseStudyItem,
  toContactFormConfig,
  toCultureHighlight,
  toEventItem,
  toJobOpening,
  toNewsItem,
  toWebinarItem,
  type EnquiryInput,
} from './cms.mappers';
import type {
  StrapiAward,
  StrapiBlog,
  StrapiContactUsInput,
  StrapiEvent,
  StrapiGetInTouch,
  StrapiGetInTouchLeadInput,
  StrapiJob,
  StrapiJsmResource,
  StrapiLifeAtClovity,
  StrapiListResponse,
  StrapiNews,
  StrapiWebinar,
} from './cms.types';

/**
 * The Strapi CMS (`clovity-admin`) — one axios instance and one flat list of calls,
 * the same shape as `website-t/src/api/cms.ts`.
 *
 * EVERY CMS ROUTE THIS SITE TALKS TO IS IN `CMS_ENDPOINTS` BELOW, and every request
 * goes through the one instance in this file. No component, page or feature builds a
 * URL — that is what keeps a collection rename a one-line change here.
 *
 * Five files, and each earns its place:
 *   cms.ts           this file — client, endpoints, queries, calls
 *   cms.types.ts     Strapi's wire shapes
 *   cms.mappers.ts   Strapi shapes → the app's own content types
 *   cms.richtext.ts  Strapi richtext (HTML, in practice) → `ContentBlock[]`
 *   cms.hooks.ts     the browser-side hooks
 *
 * This is the site's ONLY HTTP layer. The `src/services/api` scaffolding that targeted
 * a never-built Express backend was removed - form submissions go through Server
 * Actions, and everything else reads Strapi from here.
 */

/* ── Endpoints ──────────────────────────────────────────────────────────── */

/**
 * Strapi's plural route names are not guessable from the singular content type —
 * `life-at-clovity` becomes `life-at-clovities`, `contact-us` becomes
 * `contact-uses` — so they are written down once here rather than at each call.
 */
export const CMS_ENDPOINTS = {
  awards: '/api/awards',
  jobs: '/api/jobs',
  lifeAtClovity: '/api/life-at-clovities',
  getInTouch: '/api/get-in-touches',
  contactUs: '/api/contact-uses',
  getInTouchLeads: '/api/get-in-touch-leads',
  subscribes: '/api/subscribes',

  // The five resource collections. Two of these are guesses waiting to happen:
  //   • `news` pluralises to `newses`;
  //   • the case studies the site renders live in `jsm-resources`, NOT in the
  //     `case-study` collection. That one exists too, with 25 older rows no page
  //     shows — `website-t` reads `jsm-resources` for `/case-study`, and its three
  //     rows are the three case studies this design was built around.
  blogs: '/api/blogs',
  news: '/api/newses',
  events: '/api/events',
  webinars: '/api/webinars',
  caseStudies: '/api/jsm-resources',
} as const;

/**
 * Strapi caps `pagination[pageSize]` at 100 whatever is asked for — requesting 250
 * against the live instance returns `{ pageSize: 100 }` and a hundred rows. Any
 * collection that can exceed it must be paged; see `getJobs`.
 */
const MAX_PAGE_SIZE = 100;

/* ── Client ─────────────────────────────────────────────────────────────── */

/**
 * ONE instance, used from the server AND the browser — which is what keeps this
 * file as small as `website-t`'s. The only thing that differs between the two is
 * the token:
 *
 *   server   `CMS_API_TOKEN`             — write-capable, never leaves the server.
 *   browser  `NEXT_PUBLIC_CMS_API_TOKEN` — public by definition, should be READ-ONLY.
 *
 * The split is enforced by Next, not by discipline: it inlines `NEXT_PUBLIC_*` into
 * the client bundle and leaves every other `process.env` access as `undefined`
 * there. So the private token is simply not reachable from a browser build, and the
 * `typeof window` check below is what picks it up on the server.
 *
 * SET A SEPARATE READ-ONLY TOKEN for the public one — Strapi → Settings → API
 * Tokens → Create, type "Read-only". Sharing one write-capable token across both
 * lets anyone with dev tools create records.
 */
function authToken(): string {
  const serverToken =
    typeof window === 'undefined' ? process.env.CMS_API_TOKEN : undefined;
  return serverToken ?? process.env.NEXT_PUBLIC_CMS_API_TOKEN ?? '';
}

let instance: AxiosInstance | null = null;

/** Lazy, so importing this module without calling it costs nothing. */
function http(): AxiosInstance {
  if (instance) return instance;

  const client = axios.create({
    baseURL: env.strapi.url || undefined,
    timeout: env.apiTimeout,
    headers: { Accept: 'application/json' },
  });

  // Per request, not baked into `headers`, so a value injected after this module
  // was first evaluated (dev, `.env.local` edits) is still picked up.
  client.interceptors.request.use((config) => {
    const token = authToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance = client;
  return client;
}

/** True when a Strapi base URL is configured for this environment. */
export function isCmsConfigured(): boolean {
  return env.strapi.enabled;
}

/** Test/HMR hook — forces the next call to rebuild the instance. */
export function resetCmsClient(): void {
  instance = null;
}

/* ── Query helpers ──────────────────────────────────────────────────────── */

/**
 * Strapi's query language.
 *
 * Deliberately not a generic `{ page, pageSize, sort }` shape: Strapi ignores those
 * and wants `pagination[page]`, `pagination[pageSize]` and `sort[0]`. Getting it
 * wrong returns a cheerful 200 with unsorted, unpaginated, unfiltered data.
 */
export interface StrapiQuery {
  populate?: '*';
  /** Strapi syntax, e.g. `['order:asc', 'createdAt:desc']`. */
  sort?: string[];
  page?: number;
  pageSize?: number;
  /** Pre-built filter keys, e.g. `{ 'filters[track][$eq]': 'Engineering' }`. */
  filters?: Record<string, string>;
}

function toParams(query: StrapiQuery): Record<string, string> {
  const params: Record<string, string> = {};
  if (query.populate) params['populate'] = query.populate;
  query.sort?.forEach((key, i) => (params[`sort[${i}]`] = key));
  if (query.page !== undefined) params['pagination[page]'] = String(query.page);
  if (query.pageSize !== undefined) {
    params['pagination[pageSize]'] = String(query.pageSize);
  }
  Object.assign(params, query.filters ?? {});
  return params;
}

async function getList<TEntity>(
  path: string,
  query: StrapiQuery,
  signal?: AbortSignal,
): Promise<StrapiListResponse<TEntity>> {
  const { data } = await http().get<StrapiListResponse<TEntity>>(path, {
    params: toParams(query),
    ...(signal ? { signal } : {}),
  });
  return data;
}

/**
 * Walk every page of a collection.
 *
 * Needed because of the 100-row cap: the 173 published jobs arrive in two pages, and
 * a single request returns a valid 200 that is quietly missing 73 of them. `maxPages`
 * is a runaway guard, not a content limit.
 */
async function getAllPages<TEntity>(
  path: string,
  query: StrapiQuery,
  signal?: AbortSignal,
  maxPages = 20,
): Promise<TEntity[]> {
  const rows: TEntity[] = [];
  let page = 1;
  let pageCount = 1;

  do {
    const body = await getList<TEntity>(path, { ...query, page }, signal);
    rows.push(...(body.data ?? []));
    pageCount = body.meta?.pagination?.pageCount ?? 1;
    page += 1;
  } while (page <= pageCount && page <= maxPages);

  return rows;
}

/* ── Reads ──────────────────────────────────────────────────────────────── */

/**
 * Every read is sorted by the collection's own `order` column, because that column
 * exists so an editor controls sequence from the admin panel rather than a developer
 * controlling it in code.
 *
 * These THROW on failure. Callers wrap them in `withCmsFallback` (server) or the
 * hooks' try/catch (browser), so a CMS outage shows bundled content rather than an
 * error — see `withCmsFallback` below.
 */

/** Certification / recognition badges — the About page's second badge row. */
export async function getAwards(
  signal?: AbortSignal,
): Promise<BadgeGroup['badges']> {
  const body = await getList<StrapiAward>(
    CMS_ENDPOINTS.awards,
    { populate: '*', sort: ['order:asc'], pageSize: MAX_PAGE_SIZE },
    signal,
  );
  return toAwardBadges(body.data ?? []);
}

/**
 * Career openings.
 *
 * `title:asc` after `order:asc` is not decoration: `order` is nullable and not
 * unique in the live data, and Strapi sorts nulls last. Without the tie-break the
 * list reshuffles between renders, which on a statically regenerated page reads as
 * content moving for no reason.
 */
export async function getJobs(signal?: AbortSignal): Promise<JobOpening[]> {
  const rows = await getAllPages<StrapiJob>(
    CMS_ENDPOINTS.jobs,
    {
      populate: '*',
      sort: ['order:asc', 'title:asc'],
      pageSize: MAX_PAGE_SIZE,
    },
    signal,
  );
  return rows.map(toJobOpening);
}

/** Culture photos — the Careers page uses the first as its split-media image. */
export async function getLifeAtClovity(
  signal?: AbortSignal,
): Promise<CultureHighlight[]> {
  const body = await getList<StrapiLifeAtClovity>(
    CMS_ENDPOINTS.lifeAtClovity,
    {
      populate: '*',
      sort: ['sectionOrder:asc', 'order:asc'],
      pageSize: MAX_PAGE_SIZE,
    },
    signal,
  );
  return (body.data ?? []).map(toCultureHighlight);
}

/**
 * Contact form configuration for one page, by `website_slug`.
 *
 * Resolves to `null` — a success, not a failure — when no row exists for the slug.
 * That is the ordinary state before anyone creates one, and the form then falls back
 * to the field set the published design shows.
 */
export async function getInTouch(
  websiteSlug: string,
  signal?: AbortSignal,
): Promise<ContactFormConfig | null> {
  const body = await getList<StrapiGetInTouch>(
    CMS_ENDPOINTS.getInTouch,
    {
      populate: '*',
      pageSize: 1,
      filters: { 'filters[website_slug][$eq]': websiteSlug },
    },
    signal,
  );
  const row = body.data?.[0];
  return row ? toContactFormConfig(row) : null;
}

/* ── Reads: the resource collections ────────────────────────────────────── */

/**
 * How many rows a resource list page asks for.
 *
 * ONE request, not every page. `blog` has 504 published rows and the 100-row cap means
 * walking it costs six round trips at build time for every one of the five collections
 * — and the list pages reveal 5 cards with a "Load More" that steps 4 at a time, so
 * nothing past the first hundred is reachable by clicking anyway.
 *
 * Detail pages are unaffected: each fetches its own row by slug, so a post outside the
 * first hundred still renders in full. See `PRERENDERED_DETAIL_PAGES` in the detail
 * routes for how those slugs are chosen.
 */
const RESOURCE_PAGE_SIZE = MAX_PAGE_SIZE;

/**
 * Fetch one row by its `slug` column.
 *
 * Strapi 5 addresses single entries by `documentId`, not by slug, so a detail page has
 * to filter a list instead of hitting `/api/blogs/:slug` — the same thing `website-t`
 * does. `pageSize: 1` because `slug` is unique in every one of these schemas.
 */
async function getBySlug<TEntity>(
  path: string,
  slug: string,
  signal?: AbortSignal,
): Promise<TEntity | null> {
  const body = await getList<TEntity>(
    path,
    {
      populate: '*',
      pageSize: 1,
      filters: { 'filters[slug][$eq]': slug },
    },
    signal,
  );
  return body.data?.[0] ?? null;
}

/**
 * Map rows, dropping the ones that cannot render.
 *
 * Every resource mapper returns `null` for a row with no artwork, because these designs
 * are image-first: a card with an empty 255px frame is worse than one fewer card.
 */
function mapRows<TEntity, TItem>(
  rows: TEntity[] | undefined,
  map: (row: TEntity) => TItem | null,
): TItem[] {
  return (rows ?? [])
    .map(map)
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

/**
 * Blog posts, newest first.
 *
 * `blog_date` is the editorial date and what the published site sorts on; `createdAt`
 * breaks ties and covers any row whose `blog_date` an editor left empty, which would
 * otherwise sort last-and-randomly.
 */
export async function getBlogs(signal?: AbortSignal): Promise<BlogPost[]> {
  const body = await getList<StrapiBlog>(
    CMS_ENDPOINTS.blogs,
    {
      populate: '*',
      sort: ['blog_date:desc', 'createdAt:desc'],
      pageSize: RESOURCE_PAGE_SIZE,
    },
    signal,
  );
  return mapRows(body.data, toBlogPost);
}

export async function getBlogBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<BlogPost | null> {
  const row = await getBySlug<StrapiBlog>(CMS_ENDPOINTS.blogs, slug, signal);
  return row ? toBlogPost(row) : null;
}

/**
 * News, newest first.
 *
 * Sorted on `createdAt` alone: the collection has no date column, and `isFeatured` — the
 * obvious candidate for pinning a lead story — is set on three rows that are all
 * 2018-2019 press releases. Date order is what `website-t` uses and what puts the
 * current announcement in the page's featured slot.
 */
export async function getNews(signal?: AbortSignal): Promise<NewsItem[]> {
  const body = await getList<StrapiNews>(
    CMS_ENDPOINTS.news,
    { populate: '*', sort: ['createdAt:desc'], pageSize: RESOURCE_PAGE_SIZE },
    signal,
  );
  return mapRows(body.data, toNewsItem);
}

export async function getNewsBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<NewsItem | null> {
  const row = await getBySlug<StrapiNews>(CMS_ENDPOINTS.news, slug, signal);
  return row ? toNewsItem(row) : null;
}

/** Events, most recent first — the explorer splits upcoming from past itself. */
export async function getEvents(signal?: AbortSignal): Promise<EventItem[]> {
  const body = await getList<StrapiEvent>(
    CMS_ENDPOINTS.events,
    {
      populate: '*',
      sort: ['startDateTime:desc'],
      pageSize: RESOURCE_PAGE_SIZE,
    },
    signal,
  );
  return mapRows(body.data, toEventItem);
}

export async function getEventBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<EventItem | null> {
  const row = await getBySlug<StrapiEvent>(CMS_ENDPOINTS.events, slug, signal);
  return row ? toEventItem(row) : null;
}

/** Webinars — the active session first, then newest, matching the published site. */
export async function getWebinars(signal?: AbortSignal): Promise<WebinarItem[]> {
  const body = await getList<StrapiWebinar>(
    CMS_ENDPOINTS.webinars,
    {
      populate: '*',
      sort: ['isActive:desc', 'createdAt:desc'],
      pageSize: RESOURCE_PAGE_SIZE,
    },
    signal,
  );
  return mapRows(body.data, toWebinarItem);
}

export async function getWebinarBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<WebinarItem | null> {
  const row = await getBySlug<StrapiWebinar>(
    CMS_ENDPOINTS.webinars,
    slug,
    signal,
  );
  return row ? toWebinarItem(row) : null;
}

/** Case studies — the `jsm-resource` collection. See `CMS_ENDPOINTS` for why. */
export async function getCaseStudies(
  signal?: AbortSignal,
): Promise<CaseStudyItem[]> {
  const body = await getList<StrapiJsmResource>(
    CMS_ENDPOINTS.caseStudies,
    { populate: '*', sort: ['createdAt:desc'], pageSize: RESOURCE_PAGE_SIZE },
    signal,
  );
  return mapRows(body.data, toCaseStudyItem);
}

export async function getCaseStudyBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<CaseStudyItem | null> {
  const row = await getBySlug<StrapiJsmResource>(
    CMS_ENDPOINTS.caseStudies,
    slug,
    signal,
  );
  return row ? toCaseStudyItem(row) : null;
}

/* ── Writes ─────────────────────────────────────────────────────────────── */

/** Strapi wraps every write body in `{ data: … }`. Applied once, here. */
function post<TInput>(path: string, input: TInput) {
  return http().post(path, { data: input });
}

/**
 * Submit a contact enquiry.
 *
 * Writes TWO rows, because no single collection holds everything the form asks for:
 *   `contact-us`        email + the whole enquiry as text (`goal`)
 *   `get-in-touch-lead` the structured half (name, company, phone), tagged with the
 *                       page's `email_subject` so enquiries stay distinguishable
 *
 * The `contact-us` row is the one that must land, so it is awaited first and its
 * failure is the caller's failure. The lead row is best-effort: if it fails the
 * enquiry is still recorded in full, and telling the visitor their message did not
 * send would be false.
 */
export async function postEnquiry(
  payload: EnquiryInput & {
    email: string;
    emailSubject?: string;
    sourceId?: string;
  },
): Promise<void> {
  const contactUs: StrapiContactUsInput = {
    email: payload.email,
    goal: composeEnquiryGoal(payload),
  };
  await post(CMS_ENDPOINTS.contactUs, contactUs);

  const lead: StrapiGetInTouchLeadInput = {
    email: payload.email,
    ...(payload.fullName ? { name: payload.fullName } : {}),
    ...(payload.company ? { company_name: payload.company } : {}),
    ...(payload.phone ? { phone_number: payload.phone } : {}),
    ...(payload.sourceId ? { get_in_touch_id: payload.sourceId } : {}),
    ...(payload.emailSubject ? { email_subject: payload.emailSubject } : {}),
  };
  try {
    await post(CMS_ENDPOINTS.getInTouchLeads, lead);
  } catch {
    // Best-effort — see the note above.
  }
}

/** Newsletter signup. */
export async function postSubscribe(email: string): Promise<void> {
  await post(CMS_ENDPOINTS.subscribes, { email });
}

/* ── Fallback ───────────────────────────────────────────────────────────── */

/**
 * Run a CMS read, and use the bundled content if anything goes wrong.
 *
 * This is what keeps the design intact no matter what the CMS does: the section asks
 * for its data, gets live rows when Strapi is reachable, and gets the same-shaped
 * constants from `src/constants` when it is not. The rendered markup — and therefore
 * the layout — is identical either way.
 *
 * An empty list counts as "no data" and falls back too. A published site showing a
 * heading over an empty grid is worse than showing the seeded content, and an empty
 * array is far more often a misconfigured API token than a deliberate editorial
 * decision to have zero awards.
 */
export async function withCmsFallback<TData>(
  load: () => Promise<TData>,
  fallback: TData,
): Promise<TData> {
  if (!isCmsConfigured()) return fallback;
  try {
    const data = await load();
    if (Array.isArray(data) && data.length === 0) return fallback;
    return data ?? fallback;
  } catch {
    return fallback;
  }
}
