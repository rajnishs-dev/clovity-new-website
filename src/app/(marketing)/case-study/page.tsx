import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { ROUTES } from '@/config/routes';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FinalCta } from '@/components/common/CTA';
import {
  RevealScope, CategoryPill,
  FeaturedResourceCard,
  LoadMoreGrid,
  MetaItem,
  RESOURCE_CTA_LINKS,
  ResourceCard,
  ResourceHero,
  ResourceSidebar,
  SplitMediaCta, } from '@/components/common/Resources';
import { Icon } from '@/components/ui/Icon';
import { Section, SectionHeader } from '@/components/ui/Section';
import { formatContentDate } from '@/utils/format';
import { getCaseStudyItems } from '@/features/case-study/data';
import { resolveCategoryMeta } from '@/features/case-study/categoryMeta';
import { caseStudyHeroBanner } from '@/constants/media';

export const metadata: Metadata = buildMetadata({
  title: 'Case Studies - Atlassian & AI Transformations',
  description:
    "See how Clovity helps enterprises and government agencies modernize service management, migrate to Atlassian Cloud, and scale with AI - told through the clients we've delivered for.",
  path: ROUTES.resources.caseStudy,
});

const TRUST_CHIPS = [
  'Security-Cleared Architects',
  '24/7 Global Coverage',
  'U.S. Data Compliance',
];

/** Safety net under the Strapi webhook — see the note in `/blog`. */
export const revalidate = 3600;

export default async function CaseStudyPage() {
  const caseStudies = await getCaseStudyItems();
  const [featured, ...rest] = caseStudies;
  const topCaseStudies = caseStudies;

  return (
    <>
      <Header variant="pill" />
      <RevealScope />

      <main id="main-content">
        <ResourceHero
          breadcrumb={[
            { name: 'Home', href: ROUTES.home },
            { name: 'Case Studies', href: ROUTES.resources.caseStudy },
          ]}
          heading={
            <>
              Real challenges, real{' '}
              <span className="text-[#93c5fd]">Atlassian + AI transformations.</span>
            </>
          }
          subheading="See how Clovity helps enterprises and government agencies modernize service management, migrate to Atlassian Cloud, and scale with AI - told through the clients we've delivered for."
          image={caseStudyHeroBanner}
        />

        <section className="bg-white py-14 sm:py-20">
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
        </section>

        <Section className="bg-[#eaf8ff]">
          <SectionHeader
            label="How We Deliver"
            heading={
              <>
                U.S.-Led <span className="text-brand-600">24&times;7</span> Coverage
              </>
            }
            subheading="Security-cleared U.S. architects guide every project, with compliant teams across three continents keeping progress moving around the clock."
          />

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {TRUST_CHIPS.map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-2 rounded-full border border-line-soft bg-white px-4 py-2 text-[13.5px] font-600 text-title"
              >
                <Icon name="circle-check" className="text-[#16a34a]" />
                {chip}
              </span>
            ))}
          </div>
        </Section>

        <SplitMediaCta
          image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=70"
          imageAlt="Team reviewing project results and dashboards"
          label="Start Your Transformation"
          heading={
            <>
              Ready To Become Our Next{' '}
              <span className="text-brand-600">Success Story?</span>
            </>
          }
          description="Whether you're modernizing legacy Jira infrastructure, rolling out AI-powered workflows, or standardizing service management across agencies, our delivery team can help you get there."
          ctaLabel="Talk to an Expert"
          ctaHref="mailto:info-global@clovity.com"
          className="pb-[240px] sm:pb-[240px]"
        />

        <FinalCta
          heading={
            <>
              Ready to take
              <br />
              the next step?
            </>
          }
          description="Talk to our specialists today and gain practical guidance customized to your goals."
          ctas={RESOURCE_CTA_LINKS}
        />
      </main>

      <Footer overlap />
    </>
  );
}
