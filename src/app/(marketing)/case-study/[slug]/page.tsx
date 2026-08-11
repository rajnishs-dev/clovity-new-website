import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { articleSchema } from '@/lib/schema';
import { ROUTES } from '@/config/routes';
import { siteConfig } from '@/config/site';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FinalCta } from '@/components/common/CTA';
import { JsonLd } from '@/components/common/JsonLd';
import {
  RevealScope, ArticleBody,
  CategoryPill,
  DetailHero,
  MetaItem,
  RESOURCE_CTA_LINKS,
  RelatedGrid,
  ResourceSidebar,
  ShareRow, } from '@/components/common/Resources';
import { formatLongDate } from '@/utils/format';
import { resolveImageSrc } from '@/utils/image';
import {
  getCaseStudyItemBySlug,
  getCaseStudyItems,
  getCaseStudySlugs,
  getOtherCaseStudies,
} from '@/features/case-study/data';
import { resolveCategoryMeta } from '@/features/case-study/categoryMeta';

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getCaseStudySlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyItemBySlug(slug);
  if (!caseStudy) return {};

  return buildMetadata({
    title: caseStudy.title,
    description: caseStudy.excerpt,
    path: `${ROUTES.resources.caseStudy}/${caseStudy.slug}`,
    type: 'article',
    image: resolveImageSrc(caseStudy.image.src),
    imageAlt: caseStudy.image.alt,
    publishedTime: caseStudy.publishedAt,
  });
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyItemBySlug(slug);
  if (!caseStudy) notFound();

  const url = `${siteConfig.url}${ROUTES.resources.caseStudy}/${caseStudy.slug}`;
  const categoryMeta = resolveCategoryMeta(caseStudy.category);
  const [related, topCaseStudies] = await Promise.all([
    getOtherCaseStudies(caseStudy.slug, 3),
    getCaseStudyItems().then((items) => items.slice(0, 3)),
  ]);

  return (
    <>
      <Header variant="pill" />
      <RevealScope />
      <JsonLd
        schema={articleSchema({
          headline: caseStudy.title,
          description: caseStudy.excerpt,
          path: `${ROUTES.resources.caseStudy}/${caseStudy.slug}`,
          image: resolveImageSrc(caseStudy.image.src),
          publishedAt: caseStudy.publishedAt,
          section: caseStudy.category,
          tags: caseStudy.tags,
        })}
      />

      <main id="main-content">
        <section className="bg-[#f8fafc] pb-14 pt-[120px] sm:pb-20 sm:pt-[140px]">
          <div className="mx-auto grid max-w-shell grid-cols-1 gap-10 px-6 lg:grid-cols-[1fr_340px]">
            <article className="min-w-0">
              <DetailHero
                breadcrumb={[
                  { name: 'Home', href: ROUTES.home },
                  { name: 'Case Studies', href: ROUTES.resources.caseStudy },
                ]}
                currentLabel={caseStudy.title}
                image={caseStudy.image}
                title={caseStudy.title}
                meta={
                  <>
                    <CategoryPill
                      label={caseStudy.category ?? 'Case Study'}
                      icon={categoryMeta.icon}
                      tone={categoryMeta.tone}
                    />
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      <MetaItem icon="calendar-days">
                        {formatLongDate(caseStudy.publishedAt)}
                      </MetaItem>
                      {caseStudy.client ? (
                        <MetaItem icon="building">
                          {caseStudy.client}
                          {caseStudy.industry ? ` · ${caseStudy.industry}` : ''}
                        </MetaItem>
                      ) : null}
                    </div>
                  </>
                }
              />

              {caseStudy.content ? <ArticleBody blocks={caseStudy.content} /> : null}

              <ShareRow url={url} title={caseStudy.title} />
            </article>

            <ResourceSidebar
              searchPlaceholder="Search case studies…"
              topLabel="Top Case Studies"
              items={topCaseStudies}
              className="lg:sticky lg:top-[130px]"
            />
          </div>
        </section>

        <section className="bg-white pt-14 pb-[240px] sm:pt-20">
          <div className="mx-auto max-w-shell px-6">
            <RelatedGrid
              label="More Case Studies"
              heading="Related Case Studies"
              items={related}
            />
          </div>
        </section>

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
