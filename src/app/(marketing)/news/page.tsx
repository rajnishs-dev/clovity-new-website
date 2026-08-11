import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { ROUTES } from '@/config/routes';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FinalCta } from '@/components/common/CTA';
import {
  RevealScope, FeaturedResourceCard,
  LoadMoreGrid,
  RESOURCE_CTA_LINKS,
  ResourceCard,
  ResourceHero,
  ResourceSidebar, } from '@/components/common/Resources';
import { formatContentDate } from '@/utils/format';
import { getNewsItems } from '@/features/news/data';

export const metadata: Metadata = buildMetadata({
  title: 'News - Company Updates & Press Releases',
  description:
    'Announcements, recognitions, and press coverage from the Clovity team - partnerships, awards, leadership moves, and company milestones.',
  path: ROUTES.resources.news,
});

/** Safety net under the Strapi webhook — see the note in `/blog`. */
export const revalidate = 3600;

export default async function NewsPage() {
  const items = await getNewsItems();
  const [featured, ...rest] = items;
  const topNews = items.slice(0, 4);

  return (
    <>
      <Header variant="pill" />
      <RevealScope />

      <main id="main-content">
        <ResourceHero
          breadcrumb={[
            { name: 'Home', href: ROUTES.home },
            { name: 'News', href: ROUTES.resources.news },
          ]}
          heading={
            <>
              Company updates &amp;{' '}
              <span className="text-[#93c5fd]">press releases</span>
            </>
          }
          subheading="Announcements, recognitions, and press coverage from the Clovity team."
          image={`https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1800&q=80`}
        />

        <section className="bg-[#f8fafc] pt-14 pb-[240px] sm:pt-20">
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
                      title={featured.title}
                      excerpt={featured.excerpt}
                      ctaLabel="Read Full Article"
                      meta={
                        <time
                          dateTime={featured.publishedAt}
                          className="mb-3 block text-[12.5px] font-700 text-black"
                        >
                          {formatContentDate(featured.publishedAt)}
                        </time>
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
                    />
                  )),
                ].filter(Boolean)}
                initialCount={10}
                step={10}
                gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2"
                loadMoreLabel="Load More Articles"
              />
            </div>

            <ResourceSidebar
              searchPlaceholder="Search news…"
              topLabel="Top News"
              items={topNews}
              className="lg:sticky lg:top-[110px]"
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
          description="Reach out to our specialists today and unlock actionable insights shaped around your needs."
          ctas={RESOURCE_CTA_LINKS}
        />
      </main>

      <Footer overlap />
    </>
  );
}
