import { isAxiosError } from 'axios';
import {
  API_ERROR_CODES,
  type ApiErrorCode,
  type ApiFailure,
  type ApiResult,
  type ApiSuccess,
  type PaginatedData,
  type Pagination,
} from '@/types/api';

/**
 * Normalisation layer. Anything that can go wrong on the wire is folded into a
 * single `ApiFailure` shape here, so no component ever inspects an Axios error
 * or a raw HTTP status. Callers just check `result.success`.
 */

export function ok<TData>(data: TData, message?: string): ApiSuccess<TData> {
  return { success: true, data, ...(message ? { message } : {}) };
}

export function fail(
  message: string,
  code: ApiErrorCode,
  status = 0,
  fieldErrors?: Record<string, string[]>,
): ApiFailure {
  return {
    success: false,
    data: null,
    message,
    code,
    status,
    ...(fieldErrors ? { fieldErrors } : {}),
  };
}

/** Map an HTTP status onto a stable error code. */
function codeForStatus(status: number): ApiErrorCode {
  switch (status) {
    case 401:
      return API_ERROR_CODES.UNAUTHORIZED;
    case 403:
      return API_ERROR_CODES.FORBIDDEN;
    case 404:
      return API_ERROR_CODES.NOT_FOUND;
    case 422:
      return API_ERROR_CODES.VALIDATION;
    case 429:
      return API_ERROR_CODES.RATE_LIMITED;
    default:
      return status >= 500 ? API_ERROR_CODES.SERVER : API_ERROR_CODES.UNKNOWN;
  }
}

const FALLBACK_MESSAGES: Record<ApiErrorCode, string> = {
  [API_ERROR_CODES.NETWORK]:
    'We could not reach the server. Check your connection and try again.',
  [API_ERROR_CODES.TIMEOUT]: 'The request took too long. Please try again.',
  [API_ERROR_CODES.ABORTED]: 'The request was cancelled.',
  [API_ERROR_CODES.UNAUTHORIZED]: 'Please sign in and try again.',
  [API_ERROR_CODES.FORBIDDEN]: 'You do not have access to this resource.',
  [API_ERROR_CODES.NOT_FOUND]: 'We could not find what you were looking for.',
  [API_ERROR_CODES.VALIDATION]: 'Please correct the highlighted fields.',
  [API_ERROR_CODES.RATE_LIMITED]:
    'Too many requests. Please wait a moment and try again.',
  [API_ERROR_CODES.SERVER]:
    'Something went wrong on our side. Please try again shortly.',
  [API_ERROR_CODES.UNKNOWN]: 'Something went wrong. Please try again.',
  [API_ERROR_CODES.NOT_CONFIGURED]:
    'The content API is not configured for this environment.',
};

/** Pull a human message out of an unknown error body without using `any`. */
function extractMessage(body: unknown): string | undefined {
  if (typeof body === 'string' && body.trim()) return body;
  if (body && typeof body === 'object') {
    const record = body as Record<string, unknown>;
    for (const key of ['message', 'error', 'detail'] as const) {
      const value = record[key];
      if (typeof value === 'string' && value.trim()) return value;
    }
  }
  return undefined;
}

/** Pull `{ field: ["msg"] }` validation errors out of an unknown body. */
function extractFieldErrors(
  body: unknown,
): Record<string, string[]> | undefined {
  if (!body || typeof body !== 'object') return undefined;
  const record = body as Record<string, unknown>;
  const raw = record['errors'] ?? record['fieldErrors'];
  if (!raw || typeof raw !== 'object') return undefined;

  const result: Record<string, string[]> = {};
  for (const [field, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      result[field] = value.filter((v): v is string => typeof v === 'string');
    } else if (typeof value === 'string') {
      result[field] = [value];
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

/** Turn any thrown value into an `ApiFailure`. */
export function normalizeError(error: unknown): ApiFailure {
  if (isAxiosError(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return fail(
        FALLBACK_MESSAGES[API_ERROR_CODES.TIMEOUT],
        API_ERROR_CODES.TIMEOUT,
      );
    }
    if (error.code === 'ERR_CANCELED') {
      return fail(
        FALLBACK_MESSAGES[API_ERROR_CODES.ABORTED],
        API_ERROR_CODES.ABORTED,
      );
    }
    if (!error.response) {
      return fail(
        FALLBACK_MESSAGES[API_ERROR_CODES.NETWORK],
        API_ERROR_CODES.NETWORK,
      );
    }

    const status = error.response.status;
    const code = codeForStatus(status);
    const body: unknown = error.response.data;
    return fail(
      extractMessage(body) ?? FALLBACK_MESSAGES[code],
      code,
      status,
      extractFieldErrors(body),
    );
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return fail(
      FALLBACK_MESSAGES[API_ERROR_CODES.ABORTED],
      API_ERROR_CODES.ABORTED,
    );
  }

  if (error instanceof Error) {
    return fail(error.message, API_ERROR_CODES.UNKNOWN);
  }

  return fail(
    FALLBACK_MESSAGES[API_ERROR_CODES.UNKNOWN],
    API_ERROR_CODES.UNKNOWN,
  );
}

/**
 * Unwrap a payload that may or may not already be enveloped.
 * Accepts `{ success, data }`, `{ data }` or a bare value.
 */
export function unwrapData<TData>(payload: unknown): TData {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: TData }).data;
  }
  return payload as TData;
}

/** Build pagination metadata, tolerating a partial or absent server block. */
export function buildPagination(
  raw: unknown,
  itemCount: number,
  requested: { page?: number; pageSize?: number } = {},
): Pagination {
  const source = (raw && typeof raw === 'object' ? raw : {}) as Record<
    string,
    unknown
  >;
  const num = (key: string, fallback: number): number => {
    const value = source[key];
    return typeof value === 'number' && Number.isFinite(value)
      ? value
      : fallback;
  };

  const page = num('page', requested.page ?? 1);
  const pageSize = num('pageSize', requested.pageSize ?? itemCount ?? 10);
  const total = num('total', itemCount);
  const totalPages = Math.max(
    1,
    num('totalPages', pageSize > 0 ? Math.ceil(total / pageSize) : 1),
  );

  return {
    page,
    pageSize,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/** Wrap a list payload into the paginated envelope. */
export function toPaginated<TItem>(
  payload: unknown,
  requested: { page?: number; pageSize?: number } = {},
): ApiResult<PaginatedData<TItem>> {
  const container = (
    payload && typeof payload === 'object' ? payload : {}
  ) as Record<string, unknown>;

  const rawItems = Array.isArray(payload)
    ? payload
    : Array.isArray(container['items'])
      ? container['items']
      : Array.isArray(container['data'])
        ? container['data']
        : [];

  const items = rawItems as TItem[];
  return ok({
    items,
    pagination: buildPagination(
      container['pagination'] ?? container['meta'],
      items.length,
      requested,
    ),
  });
}
