import type { AxiosRequestConfig } from 'axios';
import { API_ERROR_CODES, type ApiResult, type ListQuery } from '@/types/api';
import type { RequestOptions } from '@/types/api';
import { getApiClient, isApiConfigured } from './axios';
import { fail, normalizeError, ok, unwrapData } from './response';

/**
 * The only place in the app that performs an HTTP call.
 *
 * Two properties matter:
 *  1. It never throws. Every path returns `ApiResult`, so a failed fetch
 *     degrades a section to its fallback instead of blanking the page.
 *  2. It short-circuits when the API is not configured, which is what lets the
 *     site run today on bundled static content and switch to live data by
 *     flipping one env flag - with no component change.
 */

const NOT_CONFIGURED = () =>
  fail(
    'The content API is not configured for this environment.',
    API_ERROR_CODES.NOT_CONFIGURED,
  );

/** Flatten a `ListQuery` into Axios `params`, dropping empty values. */
export function toParams(query: ListQuery = {}): Record<string, string> {
  const params: Record<string, string> = {};

  if (query.page !== undefined) params['page'] = String(query.page);
  if (query.pageSize !== undefined) params['pageSize'] = String(query.pageSize);
  if (query.search) params['search'] = query.search;
  if (query.sort) params['sort'] = query.sort;
  if (query.order) params['order'] = query.order;

  for (const [key, value] of Object.entries(query.filters ?? {})) {
    if (value !== undefined && value !== '') params[key] = String(value);
  }
  return params;
}

function axiosConfig(
  options: RequestOptions = {},
  params?: Record<string, string>,
): AxiosRequestConfig {
  return {
    ...(params ? { params } : {}),
    ...(options.signal ? { signal: options.signal } : {}),
    ...(options.headers ? { headers: options.headers } : {}),
  };
}

export async function apiGet<TData>(
  path: string,
  query?: ListQuery,
  options?: RequestOptions,
): Promise<ApiResult<TData>> {
  if (!isApiConfigured()) return NOT_CONFIGURED();
  try {
    const response = await getApiClient().get<unknown>(
      path,
      axiosConfig(options, query ? toParams(query) : undefined),
    );
    return ok(unwrapData<TData>(response.data));
  } catch (error) {
    return normalizeError(error);
  }
}

export async function apiPost<TData, TBody = unknown>(
  path: string,
  body: TBody,
  options?: RequestOptions,
): Promise<ApiResult<TData>> {
  if (!isApiConfigured()) return NOT_CONFIGURED();
  try {
    const response = await getApiClient().post<unknown>(
      path,
      body,
      axiosConfig(options),
    );
    return ok(unwrapData<TData>(response.data));
  } catch (error) {
    return normalizeError(error);
  }
}

export async function apiPut<TData, TBody = unknown>(
  path: string,
  body: TBody,
  options?: RequestOptions,
): Promise<ApiResult<TData>> {
  if (!isApiConfigured()) return NOT_CONFIGURED();
  try {
    const response = await getApiClient().put<unknown>(
      path,
      body,
      axiosConfig(options),
    );
    return ok(unwrapData<TData>(response.data));
  } catch (error) {
    return normalizeError(error);
  }
}

export async function apiPatch<TData, TBody = unknown>(
  path: string,
  body: TBody,
  options?: RequestOptions,
): Promise<ApiResult<TData>> {
  if (!isApiConfigured()) return NOT_CONFIGURED();
  try {
    const response = await getApiClient().patch<unknown>(
      path,
      body,
      axiosConfig(options),
    );
    return ok(unwrapData<TData>(response.data));
  } catch (error) {
    return normalizeError(error);
  }
}

export async function apiDelete<TData = void>(
  path: string,
  options?: RequestOptions,
): Promise<ApiResult<TData>> {
  if (!isApiConfigured()) return NOT_CONFIGURED();
  try {
    const response = await getApiClient().delete<unknown>(
      path,
      axiosConfig(options),
    );
    return ok(unwrapData<TData>(response.data));
  } catch (error) {
    return normalizeError(error);
  }
}

/**
 * Fetch with a bundled static fallback.
 *
 * This is the seam that makes every section backend-ready today: a section asks
 * for its data, gets live CMS content when the API is on, and gets the exact
 * same shape from `src/constants` when it is off or unreachable. The rendered
 * UI is identical either way.
 */
export async function withFallback<TData>(
  loader: () => Promise<ApiResult<TData>>,
  fallback: TData,
): Promise<TData> {
  if (!isApiConfigured()) return fallback;
  const result = await loader();
  return result.success ? result.data : fallback;
}
