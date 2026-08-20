'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { JobOpening } from '@/types/content';
import { useJobs } from '@/api/cms.hooks';
import { LoadMoreGrid } from '@/components/common/Resources';
import {
  ButtonLink,
  GradientText,
  Icon,
  Section,
  SectionHeader,
} from '@/components/ui';
import {
  CAREERS_GENERAL_APPLICATION_HREF,
  CAREERS_ROLES_CONTENT,
} from '@/constants/careers';
import { JobCard } from './JobCard';

/**
 * "Current Openings Across Our Delivery Teams" - the Strapi-backed roles list.
 *
 * A client component because the team tabs filter in place: the list is derived from
 * filter state, so a filtered-out card is removed from the DOM rather than hidden, and
 * can't stay focusable.
 *
 * Tabs are derived from the data, not hard-coded, so a track with no openings doesn't
 * get an empty tab and a track added in `clovity-admin` isn't missing one; the offline
 * fallback roles carry the published page's own team names.
 *
 * Each card owns its own expand/menu state - see `JobCard`.
 */

export interface OpenPositionsSectionProps {
  /** Build-time snapshot. Refreshed in the browser - see `api/cms.hooks.ts`. */
  initialJobs: JobOpening[];
}

export function OpenPositionsSection({
  initialJobs,
}: OpenPositionsSectionProps) {
  const { data: jobs, filters } = useJobs(initialJobs);
  const [activeFilter, setActiveFilter] = useState('all');
  const [positionQuery, setPositionQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  /**
   * Fall back to "All Roles" if the refreshed list no longer has the selected
   * track - otherwise closing the last opening in a team leaves the visitor on a
   * tab that has quietly disappeared, staring at an empty list.
   */
  const selected = filters.some((filter) => filter.id === activeFilter)
    ? activeFilter
    : 'all';

  const searching = positionQuery.trim() !== '' || locationQuery.trim() !== '';

  const visible = useMemo(() => {
    const trackFiltered =
      selected === 'all' ? jobs : jobs.filter((job) => job.track === selected);

    const posQuery = positionQuery.trim().toLowerCase();
    const locQuery = locationQuery.trim().toLowerCase();
    if (!posQuery && !locQuery) return trackFiltered;

    return trackFiltered.filter((job) => {
      const matchesPosition =
        !posQuery || job.title.toLowerCase().includes(posQuery);
      const matchesLocation =
        !locQuery || (job.location ?? '').toLowerCase().includes(locQuery);
      return matchesPosition && matchesLocation;
    });
  }, [jobs, selected, positionQuery, locationQuery]);

  return (
    <Section
      id="open-roles"
      padding="tight"
      className="border-y border-line-faint bg-[#eaf8ff]"
    >
      <SectionHeader
        labelClassName="mb-4"
        heading={
          <>
            {CAREERS_ROLES_CONTENT.headingLead}
            <GradientText>
              {CAREERS_ROLES_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        subheading={CAREERS_ROLES_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[680px] md:text-center"
      />

      <div
        className={cn(
          'mb-9 flex flex-wrap justify-center gap-3.5',
          revealAligned('center'),
        )}
        {...revealAttrs()}
      >
        <div className="relative min-w-[220px] max-w-[320px] flex-1">
          <input
            type="text"
            value={positionQuery}
            onChange={(event) => setPositionQuery(event.target.value)}
            placeholder="Search by position…"
            aria-label="Search by position"
            className="w-full rounded-xl bg-white py-3 pl-4 pr-11 text-[14px] text-title shadow-[0_0_0_1px_rgba(15,23,42,.08)] outline-none transition-shadow placeholder:text-[#94a3b8] focus:shadow-[0_0_0_1.5px_#2563eb]"
          />
          <Icon
            name="search"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#94a3b8]"
          />
        </div>

        <div className="relative min-w-[220px] max-w-[320px] flex-1">
          <input
            type="text"
            value={locationQuery}
            onChange={(event) => setLocationQuery(event.target.value)}
            placeholder="Search by location…"
            aria-label="Search by location"
            className="w-full rounded-xl bg-white py-3 pl-4 pr-11 text-[14px] text-title shadow-[0_0_0_1px_rgba(15,23,42,.08)] outline-none transition-shadow placeholder:text-[#94a3b8] focus:shadow-[0_0_0_1.5px_#2563eb]"
          />
          <Icon
            name="map-pin"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[14px] text-[#94a3b8]"
          />
        </div>
      </div>

      {/* Only render the tab row when there is something to filter. */}
      {filters.length > 1 ? (
        <div
          role="tablist"
          aria-label="Filter openings by team"
          className={cn(
            'mb-9 flex flex-wrap justify-center gap-2.5',
            revealAligned('center'),
          )}
          {...revealAttrs()}
        >
          {filters.map((filter) => {
            const active = filter.id === selected;
            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  'cursor-pointer rounded-pill border px-5 py-[9px] text-[13.5px] font-700 transition-all duration-200',
                  active
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-line bg-white text-[#475569] hover:border-brand-200 hover:text-brand-700',
                )}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className={cn(revealAligned('left'))} {...revealAttrs()}>
        <LoadMoreGrid
          // Remounts on tab or search change, so switching teams or typing a new
          // query always starts back at the first page instead of carrying over a
          // "load more" count from a different, larger result set.
          key={`${selected}-${positionQuery}-${locationQuery}`}
          items={visible.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          initialCount={10}
          step={10}
          gridClassName="flex flex-col gap-4"
          loadMoreLabel="Load More Positions"
        />
      </div>

      {visible.length === 0 ? (
        <p
          role="status"
          className="px-5 py-10 text-center text-[14.5px] text-[#64748b]"
        >
          {searching
            ? 'No positions match your search - try a different title or location.'
            : CAREERS_ROLES_CONTENT.emptyMessage}
        </p>
      ) : null}

      <div
        className={cn(
          'mt-7 flex flex-wrap items-center justify-between gap-6 rounded-[10px] border border-brand-100 bg-white px-[30px] py-7',
          'to-900:justify-start',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        <div>
          <b className="mb-[5px] block text-[16.5px] font-500 text-ink">
            {CAREERS_ROLES_CONTENT.generalTitle}
          </b>
          <p className="m-0 max-w-[480px] text-[14px] text-body">
            {CAREERS_ROLES_CONTENT.generalDescription}
          </p>
        </div>
        <ButtonLink
          href={CAREERS_GENERAL_APPLICATION_HREF}
          className="to-900:justify-center"
          trailingIcon={<Icon name="send" className="text-xs" />}
        >
          {CAREERS_ROLES_CONTENT.generalCtaLabel}
        </ButtonLink>
      </div>
    </Section>
  );
}
