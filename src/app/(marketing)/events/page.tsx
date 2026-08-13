import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { ROUTES } from '@/constants/routes';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BannerHero } from '@/components/common';
import { FinalCta } from '@/components/common/CTA';
import {
  RevealScope,
  RESOURCE_CTA_LINKS,
  SplitMediaCta,
} from '@/components/common/Resources';
import { getEventItems } from '@/data/events';
import { EventsExplorer } from './EventsExplorer';
import { NavState } from './NavState';
import {
  eventsHeroBanner,
  eventsHeroBannerTablet,
  eventsHeroBannerMobile,
  eventsCtaPhoto,
} from '@/constants/media';

export const metadata: Metadata = buildMetadata({
  title: 'Events - Atlassian Tours, Summits & Community',
  description:
    "See where Clovity shows up next. Browse Atlassian Team on Tour stops, government summits, industry conferences, and community events - then subscribe to hear about what's coming up.",
  path: ROUTES.resources.events,
});

/** Safety net under the Strapi webhook - see the note in `/blog`. */
export const revalidate = 3600;

export default async function EventsPage() {
  const events = await getEventItems();

  return (
    <>
      <NavState />
      <Header variant="pill" />
      <RevealScope />

      <main id="main-content">
        <BannerHero
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
          image={eventsHeroBanner}
          imageTablet={eventsHeroBannerTablet}
          imageMobile={eventsHeroBannerMobile}
        />

        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-shell px-6">
            <EventsExplorer items={events} />
          </div>
        </section>

        <SplitMediaCta
          image={eventsCtaPhoto}
          imageAlt="Clovity team shaking hands with a partner"
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
