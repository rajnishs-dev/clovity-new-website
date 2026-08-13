'use client';

import { useState } from 'react';
import type { WebinarItem } from '@/types/content';
import { LoadMoreGrid, ResourceCard } from '@/components/common/Resources';
import { useWebinarItems } from '@/api/cms.hooks';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { matchesQuery } from '@/lib/search';
import { Icon } from '@/components/ui/Icon';

/**
 * The `/webinars` search box + card grid. FETCHED TWICE, on purpose - see the note in
 * `BlogList`: `initialWebinars` is the page's server-side fetch, so the sessions are in
 * the HTML for crawlers, and `useWebinarItems` refetches in the browser, which is what
 * puts `GET https://cms.clovity.com/api/webinars` in a visitor's Network tab.
 */
export function WebinarGrid({
  initialWebinars,
}: {
  initialWebinars: WebinarItem[];
}) {
  const { data: webinars } = useWebinarItems(initialWebinars);
  const [query, setQuery] = useState('');
  // The input stays responsive on every keystroke; only the filtering and the
  // grid it drives wait for a pause - see `useDebouncedValue`.
  const debouncedQuery = useDebouncedValue(query, 300);

  const filtered = webinars.filter((webinar) =>
    matchesQuery(debouncedQuery, webinar.title),
  );

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-3.5">
        <div className="relative min-w-[240px] max-w-[350px] flex-1">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search webinars…"
            aria-label="Search webinars"
            className="w-full rounded-xl bg-white py-3 pl-4 pr-11 text-[14px] text-title shadow-[0_0_0_1px_rgba(15,23,42,.08)] outline-none transition-shadow placeholder:text-[#94a3b8] focus:shadow-[0_0_0_1.5px_#2563eb]"
          />
          <Icon
            name="search"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#94a3b8]"
          />
        </div>

        <span className="whitespace-nowrap pl-2 text-[12.5px] font-700 text-body">
          {filtered.length} {filtered.length === 1 ? 'webinar' : 'webinars'}
        </span>
      </div>

      {filtered.length > 0 ? (
        <LoadMoreGrid
          // Remounts on search change, so a new query always starts back at
          // the first page instead of carrying over a "load more" count from
          // a different, larger result set.
          key={debouncedQuery}
          items={filtered.map((webinar) => (
            <ResourceCard
              key={webinar.id}
              href={webinar.href}
              external={webinar.external}
              image={webinar.image}
              title={webinar.title}
              excerpt={webinar.excerpt}
              publishedAt={webinar.publishedAt}
              ctaLabel="Get Recording"
            />
          ))}
          initialCount={10}
          step={10}
          gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          loadMoreLabel="Load More Webinars"
        />
      ) : (
        <p className="rounded-[10px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-6 py-14 text-center text-[14.5px] text-body">
          No webinars match “{debouncedQuery}”.
        </p>
      )}
    </>
  );
}
