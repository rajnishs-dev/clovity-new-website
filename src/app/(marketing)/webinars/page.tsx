import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { ROUTES } from '@/constants/routes';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FinalCta } from '@/components/common/CTA';
import {
  RevealScope, RESOURCE_CTA_LINKS, ResourceCard, ResourceHero } from '@/components/common/Resources';
import { SectionHeader } from '@/components/ui/Section';
import { getWebinarItems } from '@/data/webinars';

export const metadata: Metadata = buildMetadata({
  title: 'Webinars - On-Demand Atlassian & Cloud Sessions',
  description:
    "Watch Clovity's on-demand webinars covering Atlassian modernization, cloud migration, and Jira Service Management for government and enterprise teams.",
  path: ROUTES.resources.webinars,
});

/** Safety net under the Strapi webhook — see the note in `/blog`. */
export const revalidate = 3600;

export default async function WebinarsPage() {
  const webinars = await getWebinarItems();

  return (
    <>
      <Header variant="pill" />
      <RevealScope />

      <main id="main-content">
        <ResourceHero
          breadcrumb={[
            { name: 'Home', href: ROUTES.home },
            { name: 'Webinars', href: ROUTES.resources.webinars },
          ]}
          heading={
            <>
              Transform your knowledge with our expert{' '}
              <span className="text-[#93c5fd]">led webinars</span>
            </>
          }
          subheading="Our webinars cover the latest innovations, best practices and solutions to help you drive efficiency and growth."
          image="https://images.unsplash.com/photo-1587440871875-191322ee64b0?auto=format&fit=crop&w=1800&q=80"
        />

        <section className="bg-[#f8fafc] pt-14 pb-[240px] sm:pt-20">
          <div className="mx-auto max-w-shell px-6">
            <SectionHeader
              heading="On-Demand Recordings"
              align="left"
              className="mb-10"
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {webinars.map((webinar) => (
                <ResourceCard
                  key={webinar.id}
                  href={webinar.href}
                  external={webinar.external}
                  image={webinar.image}
                  title={webinar.title}
                  excerpt={webinar.excerpt}
                  publishedAt={webinar.publishedAt}
                  ctaLabel="Get Recording"
                />
              ))}
            </div>
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
