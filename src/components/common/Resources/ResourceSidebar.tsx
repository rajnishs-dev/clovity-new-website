'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type * as React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';
import type { ContentItem } from '@/types/content';
import { formatContentDate, truncate } from '@/lib/format';
import { matchesQuery } from '@/lib/search';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { CoverImage } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';
import { Icon } from '@/components/ui/Icon';

/** How many matches the results panel under the search box shows at once. */
const MAX_RESULTS = 6;

/** Longest query the box accepts/echoes, so "Results for …" never overflows the 340px card. */
const MAX_QUERY_LENGTH = 40;

/**
 * The sticky sidebar shared by resource listing and detail pages.
 *
 * Two modes, exactly one expected: `searchItems` filters the full list
 * inline by title as the visitor types (debounced), swapping the "Top N"
 * panel for a "Results" panel; `onSearch` additionally lets a listing page
 * filter its own grid the same way. `searchHref` instead pushes `?q=` to
 * that page on submit, for pages with no full list to search client-side.
 *
 * `self-start` is load-bearing: the grid's default `stretch` would otherwise
 * size this to the main column's full height, leaving `position: sticky`
 * nowhere to stick.
 */
export type ResourceSidebarProps = {
  searchPlaceholder: string;
  topLabel: string;
  /** The "Top N" list shown while the search box is empty. */
  items: ContentItem[];
  className?: string;
} & (
  | {
      /** Everything the search box can match against - NOT just `items`. */
      searchItems: ContentItem[];
      /** Notified (debounced) as the visitor types - omit on a detail page, which has no grid of its own to filter. */
      onSearch?: (query: string) => void;
      searchHref?: undefined;
    }
  | { searchItems?: undefined; onSearch?: undefined; searchHref: string }
);

/** The thumbnail list shared by the "Top N" and "Results" panels. */
function ItemList({ items }: { items: ContentItem[] }) {
  return (
    <ul className="list-none p-0">
      {items.map((item, index) => (
        <li key={item.id}>
          <SmartLink
            href={item.href}
            forceExternal={item.external}
            className={`group flex items-center gap-3.5 py-3 text-inherit no-underline ${
              index === items.length - 1 ? '' : 'border-b border-[#f1f5f9]'
            } ${index === 0 ? 'pt-0' : ''}`}
          >
            <span className="relative h-[58px] w-[76px] shrink-0 overflow-hidden rounded-[10px] bg-slate-100">
              <CoverImage src={item.image.src} alt="" sizes="76px" />
            </span>
            <span className="min-w-0">
              <span className="mb-1 line-clamp-2 text-[16px] font-500 leading-[1.4] text-title transition-colors group-hover:text-brand-700">
                {item.title}
              </span>
              <time
                dateTime={item.publishedAt}
                className="block text-[11px] font-700 text-black"
              >
                {formatContentDate(item.publishedAt)}
              </time>
            </span>
          </SmartLink>
        </li>
      ))}
    </ul>
  );
}

/** The white card wrapping either panel - identical shell, different heading/body. */
function SidebarCard({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[10px] border border-line-soft bg-white p-4 shadow-xs">
      <h3 className="mb-2 break-words text-[19px] font-500 text-title">{label}</h3>
      {children}
    </div>
  );
}

export function ResourceSidebar({
  searchPlaceholder,
  topLabel,
  items,
  className,
  onSearch,
  searchItems,
  searchHref,
}: ResourceSidebarProps) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const debounced = useDebouncedValue(value, 300);
  const query = debounced.trim();
  const isSearching = searchItems !== undefined && query !== '';

  // `onSearch` is the parent's setter, which is a fresh closure most renders;
  // depending on the debounced value alone is what actually gates this to
  // "once per pause" instead of re-firing whenever the parent re-renders.
  useEffect(() => {
    onSearch?.(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const results = isSearching
    ? (searchItems ?? []).filter((item) => matchesQuery(query, item.title))
    : [];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchHref) return;
    const q = value.trim();
    router.push(q ? `${searchHref}?q=${encodeURIComponent(q)}` : searchHref);
  };

  return (
    <aside className={cn('self-start', className)}>
      <div className="mb-5 rounded-[10px] border border-line-soft bg-white p-4 shadow-xs">
        <h3 className="mb-2 text-[19px] font-500 text-title">Search</h3>
        <form role="search" aria-label={searchPlaceholder} onSubmit={handleSubmit}>
          <div className="relative flex items-center">
            <label htmlFor="resource-sidebar-search" className="sr-only">
              {searchPlaceholder}
            </label>
            <Icon
              name="search"
              className="pointer-events-none absolute left-4 text-[13px] text-[#94a3b8]"
            />
            <input
              id="resource-sidebar-search"
              type="search"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={searchPlaceholder}
              autoComplete="off"
              maxLength={MAX_QUERY_LENGTH}
              className="w-full rounded-full border border-[#e2e8f0] bg-white py-3 pl-11 pr-4 text-[14px] font-500 text-[#1e293b] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-brand-600"
            />
          </div>
        </form>
      </div>

      {isSearching ? (
        <SidebarCard label={`Results for "${truncate(query, MAX_QUERY_LENGTH)}"`}>
          {results.length > 0 ? (
            <ItemList items={results.slice(0, MAX_RESULTS)} />
          ) : (
            <p className="m-0 py-2 text-[13.5px] text-body break-words">
              Nothing matches “{truncate(query, MAX_QUERY_LENGTH)}”.
            </p>
          )}
        </SidebarCard>
      ) : items.length > 0 ? (
        <SidebarCard label={topLabel}>
          <ItemList items={items} />
        </SidebarCard>
      ) : null}
    </aside>
  );
}
