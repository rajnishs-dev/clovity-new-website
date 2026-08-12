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
import { getNewsItems } from '@/data/news';
import { NewsList } from './NewsList';

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
          <NewsList initialItems={items} />
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
