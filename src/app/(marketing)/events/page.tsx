import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { ROUTES } from '@/config/routes';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FinalCta } from '@/components/common/CTA';
import {
  RevealScope, RESOURCE_CTA_LINKS, ResourceHero, SplitMediaCta } from '@/components/common/Resources';
import { getEventItems } from '@/features/events/data';
import { EventsExplorer } from '@/features/events/components/EventsExplorer';

export const metadata: Metadata = buildMetadata({
  title: 'Events - Atlassian Tours, Summits & Community',
  description:
    "See where Clovity shows up next. Browse Atlassian Team on Tour stops, government summits, industry conferences, and community events - then subscribe to hear about what's coming up.",
  path: ROUTES.resources.events,
});

export default async function EventsPage() {
  const events = await getEventItems();

  return (
    <>
      <Header variant="pill" />
      <RevealScope />

      <main id="main-content">
        <ResourceHero
          breadcrumb={[
            { name: 'Home', href: ROUTES.home },
            { name: 'Events', href: ROUTES.resources.events },
          ]}
          heading={
            <>
              Atlassian{' '}
              <span className="text-[#93c5fd]">tours, summits &amp; community</span>{' '}
              we show up for.
            </>
          }
          subheading="Government tours, Atlassian conferences, and industry events where the Clovity team connects with the public sector and Atlassian community in person."
          image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1800&q=80"
        />

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-shell px-6">
            <EventsExplorer items={events} />
          </div>
        </section>

        <SplitMediaCta
          image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=70"
          imageAlt="Clovity team collaborating at an industry event"
          label="Partner With Us"
          heading={
            <>
              Want <span className="text-brand-600">Clovity</span> at Your Next Event?
            </>
          }
          description="If you're organizing a government IT summit, an Atlassian user group meetup, or an industry conference and want a speaker, panelist, or exhibitor with real public-sector Atlassian delivery experience, we'd like to hear from you."
          ctaLabel="Suggest an Event"
          ctaHref="mailto:info-global@clovity.com"
          className="bg-[#eaf8ff] pb-[240px] sm:pb-[240px]"
        />

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
