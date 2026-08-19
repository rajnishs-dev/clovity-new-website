'use client';

import { useMemo, useState } from 'react';
import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { Tabs } from '@/components/ui/Tabs';
import { Icon } from '@/components/ui/Icon';
import { AppImage } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import type { MarketplaceApp } from '@/types/content';
import {
  MARKETPLACE_APPS_CATALOG,
  MARKETPLACE_APPS_PLATFORM,
  MARKETPLACE_APPS_SHOWCASE_CONTENT,
  PLATFORM_LABEL,
  type AppPlatform,
} from '@/constants/expertise/marketplace-apps';

/** Tinted category pill - blue for Jira, violet for Confluence. */
const PLATFORM_PILL_CLASS: Record<AppPlatform, string> = {
  jira: 'bg-blue-50 text-brand-700',
  confluence: 'bg-[#f3e8ff] text-[#7c3aed]',
};

type FilterId = 'all' | AppPlatform;

function AppCard({ app }: { app: MarketplaceApp }) {
  const platform = MARKETPLACE_APPS_PLATFORM[app.id] ?? 'jira';

  return (
    <SmartLink
      href={app.href}
      forceExternal
      className={cn(
        'group flex flex-col rounded-[10px] border border-line-soft bg-white p-6 no-underline',
        '[transition:transform_.3s_cubic-bezier(.34,1.56,.64,1),box-shadow_.3s,border-color_.3s]',
        'hover:-translate-y-[5px] hover:border-blue-200 hover:shadow-lift',
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="relative h-14 w-14 overflow-hidden rounded-[14px] shadow-[0_6px_16px_-4px_rgba(15,23,42,.18)]">
          <AppImage
            src={app.logo.src}
            alt={app.logo.alt}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        {app.free ? (
          <span className="rounded-full bg-[#f0fdf4] px-2.5 py-1 text-[10.5px] font-800 text-brand-green">
            FREE
          </span>
        ) : null}
      </div>

      <b className="mb-2 block text-[16px] font-500 leading-[1.35] tracking-[-.01em] text-title">
        {app.name}
      </b>
      <p className="mb-4 flex-1 text-[13.5px] leading-[1.65] text-muted">
        {app.description}
      </p>

      <div className="flex items-center justify-between border-t border-line-faint pt-4">
        <span
          className={cn(
            'inline-block rounded-full px-2.5 py-1 text-[11px] font-700',
            PLATFORM_PILL_CLASS[platform],
          )}
        >
          {PLATFORM_LABEL[platform]}
        </span>
        {app.metaLabel ? (
          <span className="flex items-center gap-1.5 text-[12px] font-600 text-faint">
            {app.rating !== undefined ? (
              <Icon name="star" className="fill-current text-amber-400" />
            ) : null}
            {app.metaLabel}
          </span>
        ) : null}
      </div>
    </SmartLink>
  );
}

/** Filterable grid of every real, published app - "All / Jira / Confluence" tabs filter the grid below, rather than switching a single detail panel. */
export function AppsTabsSection() {
  const [filter, setFilter] = useState<FilterId>('all');

  const counts = useMemo(() => {
    let jira = 0;
    let confluence = 0;
    for (const app of MARKETPLACE_APPS_CATALOG) {
      if ((MARKETPLACE_APPS_PLATFORM[app.id] ?? 'jira') === 'jira') jira += 1;
      else confluence += 1;
    }
    return { all: MARKETPLACE_APPS_CATALOG.length, jira, confluence };
  }, []);

  const filteredApps = useMemo(() => {
    if (filter === 'all') return MARKETPLACE_APPS_CATALOG;
    return MARKETPLACE_APPS_CATALOG.filter(
      (app) => (MARKETPLACE_APPS_PLATFORM[app.id] ?? 'jira') === filter,
    );
  }, [filter]);

  const filterTabs = [
    { id: 'all' as const, label: 'All Apps', count: counts.all },
    { id: 'jira' as const, label: 'Jira Apps', count: counts.jira },
    {
      id: 'confluence' as const,
      label: 'Confluence Apps',
      count: counts.confluence,
    },
  ];

  return (
    <Section className="bg-white">
      <SectionHeader
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {MARKETPLACE_APPS_SHOWCASE_CONTENT.headingLead}
            <GradientText>
              {MARKETPLACE_APPS_SHOWCASE_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
      />

      <div className="mt-10">
        <Tabs
          items={filterTabs.map((tab) => ({
            id: tab.id,
            label: (
              <span className="flex items-center gap-2">
                {tab.label}
                <span
                  className={cn(
                    'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-700',
                    filter === tab.id
                      ? 'bg-blue-50 text-brand-700'
                      : 'bg-slate-100 text-slate-500',
                  )}
                >
                  {tab.count}
                </span>
              </span>
            ),
          }))}
          activeId={filter}
          onChange={(id) => setFilter(id as FilterId)}
          label="Filter apps by product"
          orientation="horizontal"
          idPrefix="marketplace-filter"
          className="flex gap-8 border-b border-line-soft"
          tabClassName="border-b-2 border-transparent px-1 pb-3 text-[14px] font-600 text-muted transition-colors"
          activeTabClassName="border-brand-600 text-brand-600"
        />

        <div
          className={cn(
            'mt-8 grid grid-cols-3 gap-5 to-900:grid-cols-2 to-640:grid-cols-1',
            reveal('up'),
          )}
          {...revealAttrs()}
        >
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </Section>
  );
}
