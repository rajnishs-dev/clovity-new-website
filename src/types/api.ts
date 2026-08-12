/**
 * Pagination metadata.
 *
 * All that survives of a transport-contract file written for a Node/Express admin
 * API that was never built. Every other type in it - `ApiResult`, `ApiFailure`,
 * `ListQuery`, the error-code table - described envelopes nothing sends. The Strapi
 * layer in `@/api/cms` speaks Strapi's own `{ data, meta }` shape and throws on
 * failure, so it never needed them.
 *
 * Kept because `components/ui/Pagination` renders from this shape.
 */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
