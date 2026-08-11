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
  DetailHero,
  RESOURCE_CTA_LINKS,
  RelatedGrid,
  ResourceSidebar,
  ShareRow, } from '@/components/common/Resources';
import { formatLongDate } from '@/utils/format';
import { resolveImageSrc } from '@/utils/image';
import {
  getAllNewsItems,
  getNewsItemBySlug,
  getNewsSlugs,
} from '@/features/news/data';

export function generateStaticParams() {
  return getNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsItemBySlug(slug);
  if (!item) return {};

  return buildMetadata({
    title: item.title,
    description: item.excerpt,
    path: `${ROUTES.resources.news}/${item.slug}`,
    type: 'article',
    image: resolveImageSrc(item.image.src),
    imageAlt: item.image.alt,
    publishedTime: item.publishedAt,
  });
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getNewsItemBySlug(slug);
  if (!item) notFound();

  const url = `${siteConfig.url}${ROUTES.resources.news}/${item.slug}`;
  const related = getAllNewsItems()
    .filter((news) => news.slug !== item.slug)
    .slice(0, 3);
  const topNews = getAllNewsItems().slice(0, 3);

  return (
    <>
      <Header variant="pill" />
      <RevealScope />
      <JsonLd
        schema={articleSchema({
          headline: item.title,
          description: item.excerpt,
          path: `${ROUTES.resources.news}/${item.slug}`,
          image: resolveImageSrc(item.image.src),
          publishedAt: item.publishedAt,
          tags: item.tags,
        })}
      />

      <main id="main-content">
        <section className="bg-[#f8fafc] pb-14 pt-[120px] sm:pb-20 sm:pt-[140px]">
          <div className="mx-auto grid max-w-shell grid-cols-1 gap-10 px-6 lg:grid-cols-[1fr_340px]">
            <article className="min-w-0">
              <DetailHero
                breadcrumb={[
                  { name: 'Home', href: ROUTES.home },
                  { name: 'News', href: ROUTES.resources.news },
                ]}
                currentLabel={item.title}
                image={item.image}
                title={item.title}
                meta={
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-800 uppercase tracking-[.06em] text-black">
                    <span>{formatLongDate(item.publishedAt)}</span>
                    {item.source ? (
                      <span className="normal-case tracking-normal">
                        Source: {item.source}
                      </span>
                    ) : null}
                  </div>
                }
              />

              {item.content ? <ArticleBody blocks={item.content} /> : null}

              <ShareRow url={url} title={item.title} />
            </article>

            <ResourceSidebar
              searchPlaceholder="Search news…"
              topLabel="Top News"
              items={topNews}
              className="lg:sticky lg:top-[130px]"
            />
          </div>
        </section>

        <section className="bg-white pt-14 pb-[240px] sm:pt-20">
          <div className="mx-auto max-w-shell px-6">
            <RelatedGrid label="Keep Reading" heading="Related News" items={related} />
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
          description="Reach out to our specialists today and unlock actionable insights shaped around your needs."
          ctas={RESOURCE_CTA_LINKS}
        />
      </main>

      <Footer overlap />
    </>
  );
}
