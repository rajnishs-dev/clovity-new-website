import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { buildMetadata } from '@/lib/seo';
import { articleSchema } from '@/lib/schema';
import { ROUTES } from '@/constants/routes';
import { siteConfig } from '@/constants/site';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FinalCta } from '@/components/common/CTA';
import { JsonLd } from '@/components/common/JsonLd';
import {
  RevealScope, ArticleBody,
  DetailHero,
  MetaItem,
  RESOURCE_CTA_LINKS,
  RelatedGrid,
  ShareRow, } from '@/components/common/Resources';
import { formatLongDate } from '@/lib/format';
import { resolveImageSrc } from '@/lib/image';
import {
  getOtherWebinars,
  getWebinarItemBySlug,
  getWebinarSlugs,
} from '@/data/webinars';
import { WebinarSidebar } from '../WebinarSidebar';

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getWebinarSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const webinar = await getWebinarItemBySlug(slug);
  if (!webinar) return {};

  return buildMetadata({
    title: webinar.title,
    description: webinar.excerpt,
    path: `${ROUTES.resources.webinars}/${webinar.slug}`,
    type: 'article',
    image: resolveImageSrc(webinar.image.src),
    imageAlt: webinar.image.alt,
    publishedTime: webinar.publishedAt,
  });
}

export default async function WebinarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const webinar = await getWebinarItemBySlug(slug);
  if (!webinar) notFound();

  const url = `${siteConfig.url}${ROUTES.resources.webinars}/${webinar.slug}`;
  const related = await getOtherWebinars(webinar.slug, 3);

  return (
    <>
      <Header variant="pill" />
      <RevealScope />
      <JsonLd
        schema={articleSchema({
          headline: webinar.title,
          description: webinar.excerpt,
          path: `${ROUTES.resources.webinars}/${webinar.slug}`,
          image: resolveImageSrc(webinar.image.src),
          publishedAt: webinar.publishedAt,
          section: 'Webinars',
          tags: webinar.tags,
        })}
      />

      <main id="main-content">
        <section className="bg-[#f8fafc] pb-14 pt-[120px] sm:pb-20 sm:pt-[140px]">
          <div className="mx-auto grid max-w-shell grid-cols-1 gap-10 px-6 lg:grid-cols-[1fr_340px]">
            <article className="min-w-0">
              <DetailHero
                breadcrumb={[
                  { name: 'Home', href: ROUTES.home },
                  { name: 'Webinars', href: ROUTES.resources.webinars },
                ]}
                currentLabel={webinar.title}
                image={webinar.image}
                title={webinar.title}
                meta={
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <MetaItem icon="calendar-days">
                      {formatLongDate(webinar.publishedAt)}
                    </MetaItem>
                    {webinar.durationMinutes ? (
                      <MetaItem icon="video">{webinar.durationMinutes} min</MetaItem>
                    ) : null}
                  </div>
                }
              />

              {webinar.content ? <ArticleBody blocks={webinar.content} /> : null}

              <ShareRow url={url} title={webinar.title} />
            </article>

            <aside className="lg:sticky lg:top-[130px] lg:self-start">
              <WebinarSidebar webinar={webinar} />
            </aside>
          </div>
        </section>

        <section className="bg-white pt-14 pb-[240px] sm:pt-20">
          <div className="mx-auto max-w-shell px-6">
            <RelatedGrid label="More Webinars" heading="Related Webinars" items={related} />
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
          description="Speak with our team today and discover valuable insights suited to your needs."
          ctas={RESOURCE_CTA_LINKS}
        />
      </main>

      <Footer overlap />
    </>
  );
}
