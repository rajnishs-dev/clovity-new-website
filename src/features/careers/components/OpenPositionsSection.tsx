'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { JobOpening } from '@/types/content';
import { useJobs } from '@/api/cms.hooks';
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
 * "Current Openings Across Our Delivery Teams" — the Strapi-backed roles list.
 *
 * A CLIENT COMPONENT because the team tabs filter in place. The legacy page did this
 * by writing `style.display` on every card from a click handler; here the filter is
 * state and the list is derived, so a card that is filtered out is not in the DOM
 * rather than hidden — same visual result, and no chance of a hidden card staying
 * focusable.
 *
 * TABS ARE DERIVED FROM THE DATA, not hard-coded. A fixed tab list breaks in both
 * directions: a tab for a track with no openings filters to an empty list, and a track
 * an editor adds in `clovity-admin` gets no tab at all. When Strapi is unreachable the
 * bundled roles carry the published page's own team names, so the offline state shows
 * exactly the tabs the design does.
 *
 * Each card owns its own expand/menu state — see `JobCard` for why that matters at
 * 173 of them.
 */

export interface OpenPositionsSectionProps {
  /** Build-time snapshot. Refreshed in the browser — see `api/cms.hooks.ts`. */
  initialJobs: JobOpening[];
}

export function OpenPositionsSection({
  initialJobs,
}: OpenPositionsSectionProps) {
  const { data: jobs, filters } = useJobs(initialJobs);
  const [activeFilter, setActiveFilter] = useState('all');

  /**
   * Fall back to "All Roles" if the refreshed list no longer has the selected
   * track — otherwise closing the last opening in a team leaves the visitor on a
   * tab that has quietly disappeared, staring at an empty list.
   */
  const selected = filters.some((filter) => filter.id === activeFilter)
    ? activeFilter
    : 'all';

  const visible = useMemo(
    () =>
      selected === 'all'
        ? jobs
        : jobs.filter((job) => job.track === selected),
    [jobs, selected],
  );

  return (
    <Section
      id="open-roles"
      padding="tight"
      className="border-y border-line-faint bg-[#eaf8ff]"
    >
      <SectionHeader
        label={CAREERS_ROLES_CONTENT.label}
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

      <div
        className={cn('flex flex-col gap-4', revealAligned('left'))}
        {...revealAttrs()}
      >
        {visible.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {visible.length === 0 ? (
        <p
          role="status"
          className="px-5 py-10 text-center text-[14.5px] text-[#64748b]"
        >
          {CAREERS_ROLES_CONTENT.emptyMessage}
        </p>
      ) : null}

      <div
        className={cn(
          'mt-7 flex flex-wrap items-center justify-between gap-6 rounded-[18px] border border-brand-100 bg-[linear-gradient(160deg,#eff6ff_0%,#fef1e8_100%)] px-[30px] py-7',
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
          className="to-900:w-full to-900:justify-center"
          trailingIcon={<Icon name="send" className="text-xs" />}
        >
          {CAREERS_ROLES_CONTENT.generalCtaLabel}
        </ButtonLink>
      </div>
    </Section>
  );
}
