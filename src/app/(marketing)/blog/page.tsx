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
import { getBlogPosts } from '@/features/blog/data';

export const metadata: Metadata = buildMetadata({
  title: 'Blog - Atlassian, AI & Cloud Insights',
  description:
    "Field notes from Clovity's Atlassian, AI, and Cloud delivery teams - practical guidance on Jira, Confluence, JSM, cloud migration, and public sector IT modernization.",
  path: ROUTES.resources.blog,
});

/**
 * Safety net under the Strapi webhook.
 *
 * `POST /api/revalidate` is what makes a publish appear immediately; this hour is what
 * covers the webhook being misconfigured, blocked or silently failing. Matches the
 * window `/contact` already uses.
 */
export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;
  // Same list as the grid, so the sidebar can never advertise a post the page does not
  // have — which is exactly what happened while this read the bundled content instead.
  const topPosts = posts.slice(0, 4);

  return (
    <>
      <Header variant="pill" />
      <RevealScope />

      <main id="main-content">
        <ResourceHero
          breadcrumb={[
            { name: 'Home', href: ROUTES.home },
            { name: 'Blog', href: ROUTES.resources.blog },
          ]}
          heading={
            <>
              Inspiring stories, ideas and{' '}
              <span className="text-[#93c5fd]">insights every day</span>
            </>
          }
          subheading="Discover fresh perspectives and powerful ideas that spark innovation and drive success daily."
          image={`https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1800&q=80`}
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
                  ...rest.map((post) => (
                    <ResourceCard
                      key={post.id}
                      href={post.href}
                      external={post.external}
                      image={post.image}
                      title={post.title}
                      excerpt={post.excerpt}
                      publishedAt={post.publishedAt}
                    />
                  )),
                ].filter(Boolean)}
                initialCount={5}
                step={4}
                gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2"
                loadMoreLabel="Load More Articles"
              />
            </div>

            <ResourceSidebar
              searchPlaceholder="Search articles…"
              topLabel="Top Blogs"
              items={topPosts}
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
          description="Get in touch with our specialists today and receive valuable guidance built around your goals."
          ctas={RESOURCE_CTA_LINKS}
        />
      </main>

      <Footer overlap />
    </>
  );
}
