import { cn } from '@/lib/cn';
import type { Pagination as PaginationMeta } from '@/types/api';
import { Icon } from '../Icon';
import { SmartLink } from '../Link';

/**
 * Pagination for the blog / news / events / case-study indexes.
 *
 * Renders real links (`?page=2`) rather than buttons, so pages are crawlable,
 * shareable and work with the browser's back button — which matters for SEO on
 * an index that the CMS will keep growing.
 *
 * Wrapped in `<nav aria-label>`, with `aria-current="page"` on the active number
 * and an ellipsis marked `aria-hidden` so it is not read as content.
 */
export interface PaginationProps {
  meta: PaginationMeta;
  /** Base path; the component appends `?page=N`. */
  basePath: string;
  /** Extra query params to preserve across pages (filters, search). */
  searchParams?: Record<string, string>;
  className?: string;
  /** Page numbers to show either side of the current page. */
  siblings?: number;
}

function buildHref(
  basePath: string,
  page: number,
  searchParams: Record<string, string>,
): string {
  const params = new URLSearchParams(searchParams);
  if (page > 1) params.set('page', String(page));
  else params.delete('page');
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

/** Page numbers plus `'gap'` markers, e.g. `[1,'gap',4,5,6,'gap',12]`. */
function buildRange(
  current: number,
  total: number,
  siblings: number,
): Array<number | 'gap'> {
  const first = 1;
  const last = total;
  const start = Math.max(first, current - siblings);
  const end = Math.min(last, current + siblings);

  const pages: Array<number | 'gap'> = [];
  if (start > first) {
    pages.push(first);
    if (start > first + 1) pages.push('gap');
  }
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < last) {
    if (end < last - 1) pages.push('gap');
    pages.push(last);
  }
  return pages;
}

const ITEM_CLASS =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-full border border-[#e2e8f0] bg-white px-3 text-[14px] font-600 text-[#334155] transition-colors hover:border-brand-600 hover:bg-brand-600 hover:text-white';

export function Pagination({
  meta,
  basePath,
  searchParams = {},
  className,
  siblings = 1,
}: PaginationProps) {
  if (meta.totalPages <= 1) return null;

  const pages = buildRange(meta.page, meta.totalPages, siblings);

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-2', className)}
    >
      {meta.hasPrev ? (
        <SmartLink
          href={buildHref(basePath, meta.page - 1, searchParams)}
          className={ITEM_CLASS}
          aria-label="Go to previous page"
          rel="prev"
        >
          <Icon name="chevron-left" className="text-[11px]" />
        </SmartLink>
      ) : (
        <span
          className={cn(ITEM_CLASS, 'pointer-events-none opacity-35')}
          aria-hidden
        >
          <Icon name="chevron-left" className="text-[11px]" />
        </span>
      )}

      {pages.map((page, index) =>
        page === 'gap' ? (
          <span
            key={`gap-${index}`}
            aria-hidden
            className="px-1 text-[14px] text-[#94a3b8]"
          >
            &hellip;
          </span>
        ) : page === meta.page ? (
          <span
            key={page}
            aria-current="page"
            className={cn(
              ITEM_CLASS,
              'border-brand-600 bg-brand-600 text-white hover:bg-brand-700',
            )}
          >
            {page}
          </span>
        ) : (
          <SmartLink
            key={page}
            href={buildHref(basePath, page, searchParams)}
            className={ITEM_CLASS}
            aria-label={`Go to page ${page}`}
          >
            {page}
          </SmartLink>
        ),
      )}

      {meta.hasNext ? (
        <SmartLink
          href={buildHref(basePath, meta.page + 1, searchParams)}
          className={ITEM_CLASS}
          aria-label="Go to next page"
          rel="next"
        >
          <Icon name="chevron-right" className="text-[11px]" />
        </SmartLink>
      ) : (
        <span
          className={cn(ITEM_CLASS, 'pointer-events-none opacity-35')}
          aria-hidden
        >
          <Icon name="chevron-right" className="text-[11px]" />
        </span>
      )}
    </nav>
  );
}
