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
  ResourceSidebar,
  ShareRow, } from '@/components/common/Resources';
import { formatLongDate } from '@/lib/format';
import { resolveImageSrc } from '@/lib/image';
import {
  getEventItemBySlug,
  getEventItems,
  getEventSlugs,
  getOtherEvents,
} from '@/data/events';
import { NavState } from './NavState';

export const revalidate = 3600;

export async function generateStaticParams() {
  return (await getEventSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventItemBySlug(slug);
  if (!event) return {};

  return buildMetadata({
    title: event.title,
    description: event.excerpt,
    path: `${ROUTES.resources.events}/${event.slug}`,
    type: 'article',
    image: resolveImageSrc(event.image.src),
    imageAlt: event.image.alt,
    publishedTime: event.publishedAt,
  });
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventItemBySlug(slug);
  if (!event) notFound();

  const url = `${siteConfig.url}${ROUTES.resources.events}/${event.slug}`;
  const [related, allEvents] = await Promise.all([
    getOtherEvents(event.slug, 3),
    getEventItems(),
  ]);
  const topEvents = allEvents.slice(0, 3);

  return (
    <>
      <NavState />
      <Header variant="pill" />
      <RevealScope />
      <JsonLd
        schema={articleSchema({
          headline: event.title,
          description: event.excerpt,
          path: `${ROUTES.resources.events}/${event.slug}`,
          image: resolveImageSrc(event.image.src),
          publishedAt: event.publishedAt,
          section: 'Events',
          tags: event.tags,
        })}
      />

      <main id="main-content">
        <section className="bg-[#f8fafc] pb-14 pt-[120px] sm:pb-20 sm:pt-[140px]">
          <div className="mx-auto grid max-w-shell grid-cols-1 gap-10 px-6 lg:grid-cols-[1fr_340px]">
            <article className="min-w-0">
              <DetailHero
                breadcrumb={[
                  { name: 'Home', href: ROUTES.home },
                  { name: 'Events', href: ROUTES.resources.events },
                ]}
                currentLabel={event.title}
                image={event.image}
                title={event.title}
                meta={
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <MetaItem icon="calendar-days">
                      {formatLongDate(event.startsAt ?? event.publishedAt)}
                    </MetaItem>
                    {event.location ? (
                      <MetaItem icon="map-pin">{event.location}</MetaItem>
                    ) : null}
                  </div>
                }
              />

              {event.content ? <ArticleBody blocks={event.content} /> : null}

              <ShareRow url={url} title={event.title} />
            </article>

            <ResourceSidebar
              searchPlaceholder="Search events…"
              topLabel="Top Events"
              items={topEvents}
              searchItems={allEvents}
              className="lg:sticky lg:top-[130px]"
            />
          </div>
        </section>

        <section className="bg-white pt-14 pb-[240px] sm:pt-20">
          <div className="mx-auto max-w-shell px-6">
            <RelatedGrid label="More From Us" heading="Related Events" items={related} />
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
