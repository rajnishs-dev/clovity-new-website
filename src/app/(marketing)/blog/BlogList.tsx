'use client';

import { useState } from 'react';
import {
  FeaturedResourceCard,
  LoadMoreGrid,
  ResourceCard,
  ResourceSidebar,
} from '@/components/common/Resources';
import type { BlogPost } from '@/types/content';
import { useBlogPosts } from '@/api/cms.hooks';
import { formatContentDate } from '@/lib/format';
import { matchesQuery } from '@/lib/search';

/**
 * Fetched twice on purpose: server-side into `initialPosts` (so crawlers/no-JS see full
 * content, no spinner) and again client-side via `useBlogPosts` (so the CMS request shows
 * in the Network tab and new posts appear without waiting for revalidate). If the client
 * fetch fails, `initialPosts` stays on screen.
 */
export function BlogList({ initialPosts }: { initialPosts: BlogPost[] }) {
  const { data: posts } = useBlogPosts(initialPosts);
  const [query, setQuery] = useState('');

  const filtered = posts.filter((post) => matchesQuery(query, post.title));
  const [featured, ...rest] = filtered;
  // Same UNFILTERED list as the sidebar always shows, so a search that matches
  // nothing in the grid doesn't also empty out "Top Blogs".
  const topPosts = posts.slice(0, 4);

  return (
    <div className="mx-auto grid max-w-shell grid-cols-1 gap-10 px-6 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        {filtered.length > 0 ? (
          <LoadMoreGrid
            // Remounts on search change, so a new query always starts back at
            // the first page instead of carrying over a "load more" count from
            // a different, larger result set.
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
              ...rest.map((post) => (
                <ResourceCard
                  key={post.id}
                  href={post.href}
                  external={post.external}
                  image={post.image}
                  title={post.title}
                  excerpt={post.excerpt}
                  publishedAt={post.publishedAt}
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
            No articles match “{query}”.
          </p>
        )}
      </div>

      <ResourceSidebar
        searchPlaceholder="Search articles…"
        topLabel="Top Blogs"
        items={topPosts}
        searchItems={posts}
        onSearch={setQuery}
        className="lg:sticky lg:top-[110px]"
      />
    </div>
  );
}
