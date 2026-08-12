'use client';

import {
  FeaturedResourceCard,
  LoadMoreGrid,
  ResourceCard,
  ResourceSidebar,
} from '@/components/common/Resources';
import type { BlogPost } from '@/types/content';
import { useBlogPosts } from '@/api/cms.hooks';
import { formatContentDate } from '@/lib/format';

/**
 * The `/blog` grid and sidebar. FETCHED TWICE, on purpose.
 *
 * 1. The page fetches on the SERVER and hands the result in as `initialPosts`, so all 100
 *    posts are in the HTML: crawlers, link previews and no-JS visitors see real content,
 *    and there is no spinner on first paint.
 * 2. `useBlogPosts` then refetches IN THE BROWSER, which is what puts
 *    `GET https://cms.clovity.com/api/blogs` in a visitor's Network tab and picks up an
 *    editor's publish without waiting out the revalidate window.
 *
 * Neither half is redundant. Dropping the server half is what emptied the HTML down to
 * the 8 bundled posts when this was briefly client-only; dropping the client half is what
 * made the request invisible in DevTools. The fetch failing leaves `initialPosts` on
 * screen, so the worst case is content that is up to an hour old.
 */
export function BlogList({ initialPosts }: { initialPosts: BlogPost[] }) {
  const { data: posts } = useBlogPosts(initialPosts);

  const [featured, ...rest] = posts;
  // Same list as the grid, so the sidebar can never advertise a post the page does not
  // have.
  const topPosts = posts.slice(0, 4);

  return (
    <div className="mx-auto grid max-w-shell grid-cols-1 gap-10 px-6 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0">
        <LoadMoreGrid
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
          initialCount={5}
          step={4}
          gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2"
          loadMoreLabel="Load More Articles"
        />
      </div>

      <ResourceSidebar
        searchPlaceholder="Search articles…"
        topLabel="Top Blogs"
        items={topPosts}
        className="lg:sticky lg:top-[110px]"
      />
    </div>
  );
}
