'use client';

import { useState } from 'react';
import type { NewsItem } from '@/types/content';
import {
  FeaturedResourceCard,
  LoadMoreGrid,
  ResourceCard,
  ResourceSidebar,
} from '@/components/common/Resources';
import { useNewsItems } from '@/api/cms.hooks';
import { formatContentDate } from '@/lib/format';
import { matchesQuery } from '@/lib/search';

/**
 * The `/news` grid and sidebar. FETCHED TWICE, on purpose - see the note in `BlogList`:
 * `initialItems` is the page's server-side fetch, so the releases are in the HTML for
 * crawlers, and `useNewsItems` refetches in the browser, which is what puts
 * `GET https://cms.clovity.com/api/newses` in a visitor's Network tab.
 */
export function NewsList({ initialItems }: { initialItems: NewsItem[] }) {
  const { data: items } = useNewsItems(initialItems);
  const [query, setQuery] = useState('');

  const filtered = items.filter((item) => matchesQuery(query, item.title));
  const [featured, ...rest] = filtered;
  // Same UNFILTERED list as the sidebar always shows, so a search that matches
  // nothing in the grid doesn't also empty out "Top News".
  const topNews = items.slice(0, 4);

  return (
    <div className="mx-auto grid max-w-shell grid-cols-1 gap-10 px-6 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        {filtered.length > 0 ? (
          <LoadMoreGrid
            key={query}
            items={[
              featured ? (
                <FeaturedResourceCard
                  key={featured.id}
                  href={featured.href}
                  external={featured.external}
                  image={featured.image}
                  title={featured.title}
                  excerpt={featured.excerpt}
                  ctaLabel="Read Full Article"
                  meta={
                    <time
                      dateTime={featured.publishedAt}
                      className="mb-3 block text-[12.5px] font-700 text-black"
                    >
                      {formatContentDate(featured.publishedAt)}
                    </time>
                  }
                  className="lg:col-span-2"
                />
              ) : null,
              ...rest.map((item) => (
                <ResourceCard
                  key={item.id}
                  href={item.href}
                  external={item.external}
                  image={item.image}
                  title={item.title}
                  excerpt={item.excerpt}
                  publishedAt={item.publishedAt}
                />
              )),
            ].filter(Boolean)}
            initialCount={10}
            step={10}
            gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2"
            loadMoreLabel="Load More Articles"
          />
        ) : (
          <p className="rounded-[10px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-6 py-14 text-center text-[14.5px] text-body">
            No news match “{query}”.
          </p>
        )}
      </div>

      <ResourceSidebar
        searchPlaceholder="Search news…"
        topLabel="Top News"
        items={topNews}
        searchItems={items}
        onSearch={setQuery}
        className="lg:sticky lg:top-[110px]"
      />
    </div>
  );
}
