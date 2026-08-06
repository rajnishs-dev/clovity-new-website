import type {
  ApiResult,
  ListQuery,
  PaginatedResult,
  RequestOptions,
} from '@/types/api';
import type {
  BlogPost,
  CaseStudyItem,
  ClientLogo,
  CredentialRow,
  CustomerStory,
  EventItem,
  MarketplaceApp,
  NewsItem,
  StatItem,
  WebinarItem,
} from '@/types/content';
import { ENDPOINTS } from './endpoints';
import { apiGet, apiPost } from './request';
import { toPaginated } from './response';

/**
 * The resource-oriented API surface components and Server Components call.
 *
 * Nothing below knows about Axios, status codes or envelopes — that all lives
 * in request.ts / response.ts. When the Express backend lands, only the
 * ENDPOINTS map and (if the JSON shape differs) the mappers change.
 */

/* ── Content collections ────────────────────────────────────────────────── */

export const contentApi = {
  async blogs(
    query?: ListQuery,
    options?: RequestOptions,
  ): Promise<PaginatedResult<BlogPost>> {
    const result = await apiGet<unknown>(
      ENDPOINTS.blogs.list(),
      query,
      options,
    );
    return result.success ? toPaginated<BlogPost>(result.data, query) : result;
  },

  blog(slug: string, options?: RequestOptions): Promise<ApiResult<BlogPost>> {
    return apiGet<BlogPost>(ENDPOINTS.blogs.detail(slug), undefined, options);
  },

  async caseStudies(
    query?: ListQuery,
    options?: RequestOptions,
  ): Promise<PaginatedResult<CaseStudyItem>> {
    const result = await apiGet<unknown>(
      ENDPOINTS.caseStudies.list(),
      query,
      options,
    );
    return result.success
      ? toPaginated<CaseStudyItem>(result.data, query)
      : result;
  },

  async events(
    query?: ListQuery,
    options?: RequestOptions,
  ): Promise<PaginatedResult<EventItem>> {
    const result = await apiGet<unknown>(
      ENDPOINTS.events.list(),
      query,
      options,
    );
    return result.success ? toPaginated<EventItem>(result.data, query) : result;
  },

  async webinars(
    query?: ListQuery,
    options?: RequestOptions,
  ): Promise<PaginatedResult<WebinarItem>> {
    const result = await apiGet<unknown>(
      ENDPOINTS.webinars.list(),
      query,
      options,
    );
    return result.success
      ? toPaginated<WebinarItem>(result.data, query)
      : result;
  },

  async news(
    query?: ListQuery,
    options?: RequestOptions,
  ): Promise<PaginatedResult<NewsItem>> {
    const result = await apiGet<unknown>(ENDPOINTS.news.list(), query, options);
    return result.success ? toPaginated<NewsItem>(result.data, query) : result;
  },
};

/* ── Marketing structure ────────────────────────────────────────────────── */

export const marketingApi = {
  marketplaceApps(
    options?: RequestOptions,
  ): Promise<ApiResult<MarketplaceApp[]>> {
    return apiGet<MarketplaceApp[]>(
      ENDPOINTS.marketplaceApps.list(),
      undefined,
      options,
    );
  },

  clientLogos(options?: RequestOptions): Promise<ApiResult<ClientLogo[]>> {
    return apiGet<ClientLogo[]>(ENDPOINTS.clients.logos(), undefined, options);
  },

  customerStories(
    options?: RequestOptions,
  ): Promise<ApiResult<CustomerStory[]>> {
    return apiGet<CustomerStory[]>(
      ENDPOINTS.clients.stories(),
      undefined,
      options,
    );
  },

  credentials(options?: RequestOptions): Promise<ApiResult<CredentialRow[]>> {
    return apiGet<CredentialRow[]>(
      ENDPOINTS.credentials.list(),
      undefined,
      options,
    );
  },

  statistics(options?: RequestOptions): Promise<ApiResult<StatItem[]>> {
    return apiGet<StatItem[]>(ENDPOINTS.statistics.list(), undefined, options);
  },
};

/* ── Forms ──────────────────────────────────────────────────────────────── */

export interface ContactSubmission {
  fullName: string;
  workEmail: string;
  company?: string;
  phone?: string;
  interest?: string;
  message: string;
  consent: boolean;
}

export interface NewsletterSubmission {
  email: string;
  source?: string;
}

export const formsApi = {
  submitContact(
    payload: ContactSubmission,
    options?: RequestOptions,
  ): Promise<ApiResult<{ id: string }>> {
    return apiPost<{ id: string }, ContactSubmission>(
      ENDPOINTS.contact.submit(),
      payload,
      options,
    );
  },

  subscribeNewsletter(
    payload: NewsletterSubmission,
    options?: RequestOptions,
  ): Promise<ApiResult<{ id: string }>> {
    return apiPost<{ id: string }, NewsletterSubmission>(
      ENDPOINTS.newsletter.subscribe(),
      payload,
      options,
    );
  },
};

/** Everything, for callers that prefer one import. */
export const api = {
  content: contentApi,
  marketing: marketingApi,
  forms: formsApi,
} as const;
