/**
 * Transport-level contracts for the future Node.js + Express + PostgreSQL admin
 * API. Every service function returns one of these envelopes, so components
 * never touch an Axios response object directly and the UI keeps working when
 * the backend swaps shape.
 */

/** Successful single-resource envelope. */
export interface ApiSuccess<TData> {
  success: true;
  data: TData;
  message?: string;
  meta?: Record<string, unknown>;
}

/** Failure envelope. `code` is a stable machine-readable string. */
export interface ApiFailure {
  success: false;
  data: null;
  message: string;
  code: ApiErrorCode;
  status: number;
  /** Field-level validation errors keyed by form field name. */
  fieldErrors?: Record<string, string[]>;
}

export type ApiResult<TData> = ApiSuccess<TData> | ApiFailure;

export const API_ERROR_CODES = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
  ABORTED: 'ABORTED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR',
  NOT_CONFIGURED: 'API_NOT_CONFIGURED',
} as const;

export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];

/** Cursor/offset pagination metadata returned by list endpoints. */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedData<TItem> {
  items: TItem[];
  pagination: Pagination;
}

export type PaginatedResult<TItem> = ApiResult<PaginatedData<TItem>>;

/** Query parameters accepted by every list endpoint. */
export interface ListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  /** Arbitrary `field=value` filters, serialised as query params. */
  filters?: Record<string, string | number | boolean | undefined>;
}

/** Options threaded through to the underlying HTTP client per request. */
export interface RequestOptions {
  signal?: AbortSignal;
  /** Next.js fetch/ISR revalidation window, in seconds. */
  revalidate?: number | false;
  /** Cache tags for on-demand revalidation from the CMS webhook. */
  tags?: string[];
  headers?: Record<string, string>;
}
