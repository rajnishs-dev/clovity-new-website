import axios, { type AxiosInstance } from 'axios';
import { env } from '@/config/env';
import type {
  BadgeGroup,
  ContactFormConfig,
  CultureHighlight,
  JobOpening,
} from '@/types/content';
import {
  composeEnquiryGoal,
  toAwardBadges,
  toContactFormConfig,
  toCultureHighlight,
  toJobOpening,
  type EnquiryInput,
} from './cms.mappers';
import type {
  StrapiAward,
  StrapiContactUsInput,
  StrapiGetInTouch,
  StrapiGetInTouchLeadInput,
  StrapiJob,
  StrapiLifeAtClovity,
  StrapiListResponse,
} from './cms.types';

/**
 * The Strapi CMS (`clovity-admin`) — one axios instance and one flat list of calls,
 * the same shape as `website-t/src/api/cms.ts`.
 *
 * Four files, and each earns its place:
 *   cms.ts          this file — client, endpoints, queries, calls
 *   cms.types.ts    Strapi's wire shapes
 *   cms.mappers.ts  Strapi shapes → the app's own content types
 *   cms.hooks.ts    the browser-side hooks
 *
 * NOT to be confused with `src/services/api`, which targets a completely different
 * backend (the future Express admin API, base URL `NEXT_PUBLIC_API_BASE_URL`).
 * Rule of thumb: `api/cms*` is Strapi, `services/api` is the other one.
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
