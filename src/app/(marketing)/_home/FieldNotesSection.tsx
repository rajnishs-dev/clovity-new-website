'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import type { ContentCollection, ContentKind } from '@/types/content';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';
import { Tabs } from '@/components/ui/Tabs';
import { useContentCollections } from '@/api/cms.hooks';
import {
  GradientText,
  HEADING_CLASS,
  SUBHEADING_CLASS,
} from '@/components/ui/Typography';
import { HIGHLIGHTS_CONTENT } from '@/constants/home';
import { ContentCardRail } from './ContentCardRail';

/**
 * Picking a content type swaps the card rail, column heading, subheading and
 * "View More" destination.
 *
 * The dot-grid backdrop is a `before:` layer with a masked radial-gradient
 * pattern; `mask-image` has no Tailwind utility, so it's an arbitrary property.
 *
 * Remounting the rail on tab change (`key`) resets its scroll position and
 * re-measures the arrows.
 */
const TAB_ID_PREFIX = 'field-notes';

/** `.hi-tab` - a left-aligned pill that slides right on hover. */
const TAB_CLASS =
  'flex sm:flex-1 cursor-pointer items-center gap-3 rounded-xl border border-line bg-white px-4 py-3.5 text-left text-[14px] font-500 text-[#334155] shadow-[0_1px_2px_rgba(15,23,42,.04)] [transition:transform_.22s,box-shadow_.22s,border-color_.22s,background_.22s,color_.22s] hover:translate-x-[5px] hover:border-blue-200 hover:shadow-[0_12px_26px_rgba(15,23,42,.08)] [&_i]:w-[18px] [&_i]:text-center [&_i]:text-[13.5px] [&_i]:text-faint [&_i]:transition-colors';

const TAB_ACTIVE_CLASS =
  'border-brand-600 bg-grad-brand text-white shadow-[0_12px_26px_rgba(37,99,235,.25)] [&_i]:text-white';

export interface FieldNotesSectionProps {
  collections: ContentCollection[];
}

export function FieldNotesSection({
  collections: initialCollections,
}: FieldNotesSectionProps) {
  /**
   * Refetched client-side on purpose, on top of the server fetch: this is
   * what picks up a fresh publish without waiting out the revalidate window.
   */
  const { data: collections } = useContentCollections(initialCollections);

  const firstKind = collections[0]?.kind ?? 'blog';
  const [activeKind, setActiveKind] = useState<ContentKind>(firstKind);

  const active =
    collections.find((collection) => collection.kind === activeKind) ??
    collections[0];

  if (!active) return null;

  return (
    <section
      id="highlights"
      className="relative overflow-hidden bg-[#eaf8ff] py-12 before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(rgba(37,99,235,.09)_1px,transparent_1px)] before:content-[''] before:[background-size:28px_28px] before:[mask-image:radial-gradient(60%_55%_at_12%_0%,#000_0%,transparent_100%)] lg:py-16"
    >
      <div className="relative mx-auto max-w-shell px-6">
        <div
          className={cn('mb-10 lg:mb-12 text-center', reveal(), 'md:text-center')}
          {...revealAttrs()}
        >
          <h2 className={cn(HEADING_CLASS, 'mx-auto max-w-[640px]')}>
            {HIGHLIGHTS_CONTENT.headingLead}
            <GradientText>{HIGHLIGHTS_CONTENT.headingHighlight}</GradientText>
          </h2>
          <p className={cn(SUBHEADING_CLASS, 'mx-auto mt-4 max-w-[520px]')}>
            {HIGHLIGHTS_CONTENT.subheading}
          </p>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-[.62fr_1.38fr] items-start gap-8 lg:gap-12 [&>*]:min-w-0">
          {/* Left: content-type tabs */}
          <div>
            <div className={reveal('left')} {...revealAttrs()}>
              <b className="mb-1 block text-[20px] font-700 leading-[1.3] text-title">
                {HIGHLIGHTS_CONTENT.tabsColumnTitle}
              </b>
              <span className="text-[14.5px] text-muted">
                {HIGHLIGHTS_CONTENT.tabsColumnSubtitle}
              </span>
            </div>

            <Tabs
              label="Content type"
              orientation="vertical"
              idPrefix={TAB_ID_PREFIX}
              activeId={activeKind}
              onChange={(id) => setActiveKind(id as ContentKind)}
              className="mb-6 mt-[22px] flex flex-wrap lg:flex-nowrap lg:flex-col gap-2.5"
              tabClassName={TAB_CLASS}
              activeTabClassName={TAB_ACTIVE_CLASS}
              items={collections.map((collection, index) => ({
                id: collection.kind,
                /** Per-item, not on `tabClassName`: `reveal()`'s classes need
                 *  a matching `data-reveal` attribute, which only a per-item
                 *  `attrs` can carry. */
                className: reveal('up', index * 50),
                attrs: revealAttrs(),
                label: (
                  <>
                    <Icon name={collection.icon} /> {collection.label}
                  </>
                ),
              }))}
            />
          </div>

          {/* Right: heading + card rail + "View More" */}
          <div
            role="tabpanel"
            id={`${TAB_ID_PREFIX}-panel-${active.kind}`}
            aria-labelledby={`${TAB_ID_PREFIX}-tab-${active.kind}`}
            tabIndex={0}
          >
            <ContentCardRail
              key={active.kind}
              items={active.items}
              columnTitle={active.columnTitle}
              columnSubtitle={active.columnSubtitle}
              footer={
                <div className="mt-6 flex justify-end">
                  <SmartLink
                    href={active.moreHref}
                    className={buttonClass('secondary')}
                    {...(active.moreExternal ? { forceExternal: true } : {})}
                  >
                    {HIGHLIGHTS_CONTENT.moreLabel} <ArrowIcon />
                  </SmartLink>
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
