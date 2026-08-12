'use client';

import type { WebinarItem } from '@/types/content';
import { LoadMoreGrid, ResourceCard } from '@/components/common/Resources';
import { useWebinarItems } from '@/api/cms.hooks';

/**
 * The `/webinars` card grid. FETCHED TWICE, on purpose - see the note in `BlogList`:
 * `initialWebinars` is the page's server-side fetch, so the sessions are in the HTML for
 * crawlers, and `useWebinarItems` refetches in the browser, which is what puts
 * `GET https://cms.clovity.com/api/webinars` in a visitor's Network tab.
 */
export function WebinarGrid({
  initialWebinars,
}: {
  initialWebinars: WebinarItem[];
}) {
  const { data: webinars } = useWebinarItems(initialWebinars);

  return (
    <LoadMoreGrid
      items={webinars.map((webinar) => (
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
  );
}
