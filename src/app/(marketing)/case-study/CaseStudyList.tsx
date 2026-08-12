'use client';

import type { CaseStudyItem } from '@/types/content';
import {
  CategoryPill,
  FeaturedResourceCard,
  LoadMoreGrid,
  MetaItem,
  ResourceCard,
  ResourceSidebar,
} from '@/components/common/Resources';
import { useCaseStudies } from '@/api/cms.hooks';
import { formatContentDate } from '@/lib/format';
import { resolveCategoryMeta } from './categoryMeta';

/**
 * The /case-study grid and sidebar. FETCHED TWICE, on purpose - see the note in
 * `BlogList`: `initialItems` is the page's server-side fetch, so the studies are in the
 * HTML for crawlers, and `useCaseStudies` refetches in the browser, which is what puts
 * `GET https://cms.clovity.com/api/jsm-resources` in a visitor's Network tab.
 */
export function CaseStudyList({
  initialItems,
}: {
  initialItems: CaseStudyItem[];
}) {
  const { data: caseStudies } = useCaseStudies(initialItems);

  const [featured, ...rest] = caseStudies;
  const topCaseStudies = caseStudies;

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
                  ribbon="Featured"
                  title={featured.title}
                  excerpt={featured.excerpt}
                  ctaLabel="Read Case Study"
                  meta={
                    <>
                      <CategoryPill
                        label={featured.category ?? 'Case Study'}
                        icon={resolveCategoryMeta(featured.category).icon}
                        tone={resolveCategoryMeta(featured.category).tone}
                      />
                      <div className="mb-2 flex flex-wrap gap-4">
                        <MetaItem icon="calendar-days">
                          {formatContentDate(featured.publishedAt)}
                        </MetaItem>
                        {featured.client ? (
                          <MetaItem icon="building">
                            {featured.client}
                            {featured.industry ? ` · ${featured.industry}` : ''}
                          </MetaItem>
                        ) : null}
                      </div>
                    </>
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
                  ctaLabel="Read Case Study"
                  meta={
                    item.client ? (
                      <div className="mb-2">
                        <MetaItem icon="building">
                          {item.client}
                          {item.industry ? ` · ${item.industry}` : ''}
                        </MetaItem>
                      </div>
                    ) : undefined
                  }
                />
              )),
            ].filter(Boolean)}
            initialCount={10}
            step={10}
            gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2"
            loadMoreLabel="Load More Case Studies"
          />
        </div>

        <ResourceSidebar
          searchPlaceholder="Search case studies…"
          topLabel="Top Case Studies"
          items={topCaseStudies}
          className="lg:sticky lg:top-[110px]"
        />
      </div>
  );
}
