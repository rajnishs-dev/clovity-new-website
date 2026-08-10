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
import { getAllBlogPosts, getBlogPost, getBlogSlugs } from '@/features/blog/data';

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `${ROUTES.resources.blog}/${post.slug}`,
    type: 'article',
    image: resolveImageSrc(post.image.src),
    imageAlt: post.image.alt,
    publishedTime: post.publishedAt,
    authors: post.author ? [post.author.name] : undefined,
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const url = `${siteConfig.url}${ROUTES.resources.blog}/${post.slug}`;
  const related = getAllBlogPosts()
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);
  const topPosts = getAllBlogPosts().slice(0, 3);

  return (
    <>
      <Header variant="pill" />
      <RevealScope />
      <JsonLd
        schema={articleSchema({
          headline: post.title,
          description: post.excerpt,
          path: `${ROUTES.resources.blog}/${post.slug}`,
          image: resolveImageSrc(post.image.src),
          publishedAt: post.publishedAt,
          authorName: post.author?.name,
          section: post.category,
          tags: post.tags,
        })}
      />

      <main id="main-content">
        <section className="bg-[#f8fafc] pb-14 pt-[120px] sm:pb-20 sm:pt-[140px]">
          <div className="mx-auto grid max-w-shell grid-cols-1 gap-10 px-6 lg:grid-cols-[1fr_340px]">
            <article className="min-w-0">
              <DetailHero
                breadcrumb={[
                  { name: 'Home', href: ROUTES.home },
                  { name: 'Blog', href: ROUTES.resources.blog },
                ]}
                currentLabel={post.title}
                image={post.image}
                title={post.title}
                meta={
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] font-800 uppercase tracking-[.06em] text-black">
                    <span>{formatLongDate(post.publishedAt)}</span>
                    {post.readingMinutes ? (
                      <span>{post.readingMinutes} min read</span>
                    ) : null}
                    {post.author ? (
                      <span className="normal-case tracking-normal">
                        By {post.author.name}
                      </span>
                    ) : null}
                  </div>
                }
              />

              {post.content ? <ArticleBody blocks={post.content} /> : null}

              <ShareRow url={url} title={post.title} />
            </article>

            <ResourceSidebar
              searchPlaceholder="Search articles…"
              topLabel="Top Blogs"
              items={topPosts}
              className="lg:sticky lg:top-[130px]"
            />
          </div>
        </section>

        <section className="bg-white pt-14 pb-[240px] sm:pt-20">
          <div className="mx-auto max-w-shell px-6">
            <RelatedGrid label="Keep Reading" heading="Related Insights" items={related} />
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
