import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { ROUTES } from '@/constants/routes';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FinalCta } from '@/components/common/CTA';
import {
  RevealScope,
  RESOURCE_CTA_LINKS,
  ResourceHero,
} from '@/components/common/Resources';
import { getBlogPosts } from '@/data/blog';
import { BlogList } from './BlogList';

export const metadata: Metadata = buildMetadata({
  title: 'Blog - Atlassian, AI & Cloud Insights',
  description:
    "Field notes from Clovity's Atlassian, AI, and Cloud delivery teams - practical guidance on Jira, Confluence, JSM, cloud migration, and public sector IT modernization.",
  path: ROUTES.resources.blog,
});

/** Safety net under the Strapi webhook - see the note in `/api/revalidate`. */
export const revalidate = 3600;

/**
 * `/blog`.
 *
 * The page fetches the posts on the SERVER and hands them to `<BlogList>`, which refetches
 * in the browser. That split is what gives both things at once: the posts are in the HTML
 * for crawlers, and the CMS request is visible in a visitor's Network tab. See the note in
 * `BlogList` for why neither half is redundant.
 */
export default async function BlogPage() {
  const posts = await getBlogPosts();

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
          <BlogList initialPosts={posts} />
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
