'use client';

import { useMemo, useState } from 'react';
import type { EventCategory, EventItem } from '@/types/content';
import { Icon } from '@/components/ui/Icon';
import {
  CategoryPill,
  FeaturedResourceCard,
  LoadMoreGrid,
  MetaItem,
  ResourceCard,
} from '@/components/common/Resources';
import { buttonClass } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';
import { Select, type SelectOption } from '@/components/ui/Select';
import { useEventItems } from '@/api/cms.hooks';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { formatContentDate } from '@/lib/format';
import { matchesQuery } from '@/lib/search';
import { ROUTES } from '@/constants/routes';

/**
 * The filter toolbar + featured card + grid for `/events` - the legacy
 * `.evt-toolbar` + `.evt-featured` + `.evt-grid`, ported from a hand-rolled
 * DOM-attribute filter script into React state.
 *
 * A client component because the category/status/search filtering has to run
 * without a page reload, exactly as it did on the legacy site.
 */
type StatusFilter = 'all' | 'upcoming' | 'past';
type CategoryFilter = 'all' | EventCategory;

const CATEGORY_META: Record<
  EventCategory,
  { label: string; tone: 'blue' | 'pink' | 'cyan'; icon: 'landmark' | 'people-group' | 'handshake' }
> = {
  government: { label: 'Government Tour', tone: 'blue', icon: 'landmark' },
  conference: { label: 'Conference', tone: 'pink', icon: 'people-group' },
  industry: { label: 'Industry Event', tone: 'cyan', icon: 'handshake' },
};

const CATEGORY_OPTIONS: SelectOption<CategoryFilter>[] = [
  { value: 'all', label: 'All Categories', dotColor: '#94a3b8' },
  { value: 'government', label: 'Government Tours', dotColor: '#1d4ed8' },
  { value: 'conference', label: 'Conferences', dotColor: '#db2777' },
  { value: 'industry', label: 'Industry & Procurement', dotColor: '#0e7490' },
];

const STATUS_OPTIONS: SelectOption<StatusFilter>[] = [
  { value: 'all', label: 'All Events' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
];

function eventStatus(item: EventItem): 'upcoming' | 'past' {
  const date = item.startsAt ?? item.publishedAt;
  return new Date(date).getTime() >= Date.now() ? 'upcoming' : 'past';
}

export function EventsExplorer({ items: initialItems }: { items: EventItem[] }) {
  /**
   * FETCHED TWICE, on purpose. `initialItems` comes from the page's server-side fetch, so
   * the events are in the HTML for crawlers; this refetches in the browser, which puts
   * `GET https://cms.clovity.com/api/events` in the Network tab and picks up a publish
   * without waiting out the revalidate window. A failed refetch keeps what is on screen.
   */
  const { data: items } = useEventItems(initialItems);

  const [category, setCategory] = useState<CategoryFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [query, setQuery] = useState('');
  // The input stays responsive on every keystroke; only the (expensive-ish,
  // 60+ item) filtering below waits for a pause - see `useDebouncedValue`.
  const debouncedQuery = useDebouncedValue(query, 300);

  /**
   * The category filter only exists when the events have categories: the Strapi `event`
   * type has no category column, so a "Government Tours" option filtering 64 events to
   * zero would read as broken rather than empty. Derived from the data, same as careers'
   * track tabs. The bundled fallback events do set a category, so the filter shows there.
   */
  const hasCategories = useMemo(
    () => items.some((item) => item.category),
    [items],
  );

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = category === 'all' || item.category === category;
      const matchesStatus = status === 'all' || eventStatus(item) === status;
      return matchesCategory && matchesStatus && matchesQuery(debouncedQuery, item.title);
    });
  }, [items, category, status, debouncedQuery]);

  const [featured, ...rest] = filtered;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-3.5">
        {hasCategories ? (
          <Select
            value={category}
            onChange={setCategory}
            options={CATEGORY_OPTIONS}
            ariaLabel="Filter by category"
            className="min-w-[170px]"
          />
        ) : null}

        <Select
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
          ariaLabel="Filter by status"
          className="min-w-[140px]"
        />

        <div className="relative min-w-[240px] max-w-[350px] flex-1">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name…"
            aria-label="Search events"
            className="w-full rounded-xl bg-white py-3 pl-4 pr-11 text-[14px] text-title shadow-[0_0_0_1px_rgba(15,23,42,.08)] outline-none transition-shadow placeholder:text-[#94a3b8] focus:shadow-[0_0_0_1.5px_#2563eb]"
          />
          <Icon
            name="search"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#94a3b8]"
          />
        </div>

        <span className="whitespace-nowrap pl-2 text-[12.5px] font-700 text-body">
          {filtered.length} {filtered.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      {filtered.length > 0 ? (
        <LoadMoreGrid
          // Remounts on filter change, so switching category/status/search always
          // starts back at the first page instead of carrying over a "load more"
          // count from a different, larger filtered list.
          key={`${category}-${status}-${debouncedQuery}`}
          items={[
            featured ? (
              <FeaturedResourceCard
                key={featured.id}
                href={featured.href}
                external={featured.external}
                image={featured.image}
                ribbon="Most Recent"
                title={featured.title}
                excerpt={featured.excerpt}
                ctaLabel="View Event Recap"
                className="lg:col-span-3 lg:grid-cols-[0.55fr_1fr]"
                meta={
                  <>
                    {/* No pill rather than a wrong one: an uncategorised CMS event used to
                        fall through to the "Government Tour" label, which mislabels an
                        industry conference on the page's most prominent card. */}
                    {featured.category ? (
                      <CategoryPill
                        label={CATEGORY_META[featured.category].label}
                        icon={CATEGORY_META[featured.category].icon}
                        tone={CATEGORY_META[featured.category].tone}
                      />
                    ) : null}
                    <div className="mb-2 flex flex-wrap gap-4">
                      <MetaItem icon="calendar-days">
                        {/* `formatContentDate`, not a local `toLocaleDateString`: this
                            card sits beside the grid cards, which use it, and the two
                            must not disagree about which day an event is on. */}
                        {formatContentDate(featured.startsAt ?? featured.publishedAt)}
                      </MetaItem>
                      {featured.location ? (
                        <MetaItem icon="map-pin">{featured.location}</MetaItem>
                      ) : null}
                    </div>
                  </>
                }
              />
            ) : null,
            ...rest.map((event) => (
              <ResourceCard
                key={event.id}
                href={event.href}
                external={event.external}
                image={event.image}
                title={event.title}
                excerpt={event.excerpt}
                publishedAt={event.startsAt ?? event.publishedAt}
                ctaLabel="View Recap"
                meta={
                  event.location ? (
                    <MetaItem icon="map-pin">{event.location}</MetaItem>
                  ) : undefined
                }
              />
            )),
          ].filter(Boolean)}
          initialCount={10}
          step={10}
          gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          loadMoreLabel="Load More Events"
        />
      ) : null}

      {filtered.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-[#dbe4f0] bg-[#f8fafc] px-6 py-14 text-center">
          <Icon name="alert-circle" className="mb-4 text-[32px] text-[#bfdbfe]" />
          <h4 className="mb-2 text-[18px] font-500 text-title">
            No events match your filters
          </h4>
          <p className="mx-auto mb-5 max-w-[420px] text-[13.5px] leading-[1.65] text-body">
            {status === 'upcoming'
              ? "We're always planning our next stop. Subscribe below and we'll let you know as soon as new dates are confirmed."
              : "Try a different category or clear your search to see everything we've been part of."}
          </p>
          <SmartLink href={`${ROUTES.discover.contact}`} className={buttonClass('secondary')}>
            Subscribe for Updates
          </SmartLink>
        </div>
      ) : null}
    </>
  );
}
