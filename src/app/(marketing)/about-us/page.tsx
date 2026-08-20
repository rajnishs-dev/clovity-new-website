/**
 * Eleven sections. The "Certifications & Diversity" badge row reads the
 * Strapi `award` collection; every other section's copy is bundled.
 *
 * Stays a Server Component - only the header, hero, `PageAnimations` and
 * `NavState` reach the browser as JavaScript.
 *
 * ── BACKGROUNDS: TWO TONES, AND TWO DELIBERATE REPEATS ──
 * `bg-white` and `bg-[#eaf8ff]` only - two tones, no third. (T below is the tint.)
 * Reading down from the hero:
 *
 *     Why W · TrustedBy T · WhoWeAre W · Stats T · Values T · Milestones W ·
 *     Credentials T · FeaturedIn W · Mission W · WorkWithUs T · CTA W
 *
 * The two repeats are not slips, and neither should be "fixed" by flipping one of them:
 *
 * 1. Stats + Values are both PINNED to the tint by their contents. `StatBand` paints a
 *    white card and `BentoGrid` paints white tiles; either on a white band loses its edge
 *    and reads as floating text. They are adjacent, so one repeat is forced.
 * 2. FeaturedIn + Mission are one visual unit on purpose - `FeaturedInSection` ends on
 *    `pb-0` and `MissionSection` opens on `pt-4`, so a tone change between them would put
 *    a seam through the middle of a block designed to run continuously.
 *
 * Everything else alternates. Adding or removing a band flips the parity of every band
 * below it, so re-check the whole run rather than just the gap.
 */
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { ROUTES } from '@/constants/routes';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import {
  BannerHero,
  FinalCta,
  HeroAccent,
  JsonLd,
  PageAnimations,
} from '@/components/common';
import { CredentialsSection } from './CredentialsSection';
import { FeaturedInSection } from './FeaturedInSection';
import { MilestonesSection } from './MilestonesSection';
import { MissionSection } from './MissionSection';
import { StatsSection } from './StatsSection';
import { TrustedBySection } from './TrustedBySection';
import { ValuesSection } from './ValuesSection';
import { WhoWeAreSection } from './WhoWeAreSection';
import { WhySection } from './WhySection';
import { WorkWithUsSection } from './WorkWithUsSection';
import { getAboutPageData } from '@/data/about';
import {
  ABOUT_ATLASSIAN_BADGES,
  ABOUT_FINAL_CTA,
  ABOUT_FINAL_CTA_LINKS,
  ABOUT_HERO,
} from '@/constants/about';
import {
  aboutHeroBanner,
  aboutHeroBannerTablet,
  aboutHeroBannerMobile,
} from '@/constants/media';
import { NavState } from './NavState';

export const metadata: Metadata = buildMetadata({
  // The published page's own title and description, unchanged.
  title: 'About Us - Atlassian Platinum Partner | Clovity',
  description:
    'Clovity is a San Francisco based, Atlassian Platinum Solution Partner. Meet the U.S.-led team behind secure Atlassian, AI, and cloud transformation for enterprise and public-sector clients.',
  path: ROUTES.discover.about,
  keywords: [
    'Clovity about us',
    'Atlassian Platinum Solution Partner',
    'Great Place to Work certified',
    'Inc. 5000 Atlassian partner',
  ],
});

/**
 * Regenerated every five minutes: the award badges come from Strapi over
 * Axios, which doesn't participate in Next's fetch cache, so page-level ISR
 * is what lets a published award appear without a deploy.
 */
export const revalidate = 300;

export default async function AboutPage() {
  const { awardBadges, logos } = await getAboutPageData();

  return (
    <>
      <NavState />
      <JsonLd schema={breadcrumbSchema([...ABOUT_HERO.crumbs])} />

      {/* Solid white from first paint - the hero behind it is a dark photograph. */}
      <Header variant="pill" priorityLogo />

      <PageAnimations>
        <main id="main-content">
          <BannerHero
            breadcrumb={[...ABOUT_HERO.crumbs]}
            heading={
              <>
                {ABOUT_HERO.titleLead}
                <br />
                <HeroAccent>{ABOUT_HERO.titleAccent}</HeroAccent>
              </>
            }
            subheading={ABOUT_HERO.lead}
            image={aboutHeroBanner}
            imageTablet={aboutHeroBannerTablet}
            imageMobile={aboutHeroBannerMobile}
          />

          <WhySection />

          <TrustedBySection logos={logos} />

          <WhoWeAreSection />

          <StatsSection />

          <ValuesSection />

          <MilestonesSection />

          {/* `initial…` is the build-time snapshot; the section refetches in the
              browser so a newly published award appears without waiting for ISR. */}
          <CredentialsSection
            atlassianBadges={ABOUT_ATLASSIAN_BADGES}
            initialAwardBadges={awardBadges.badges}
          />

          <FeaturedInSection />

          <MissionSection />

          <WorkWithUsSection />

          <FinalCta
            heading={
              <>
                {ABOUT_FINAL_CTA.headingLead}
                <br />
                {ABOUT_FINAL_CTA.headingTail}
              </>
            }
            description={ABOUT_FINAL_CTA.description}
            ctas={ABOUT_FINAL_CTA_LINKS}
            // `.cta-sec` is `#f8faff` here, and the card sits a step darker than the
            // home page's. `pullUp={false}` because `.cta-card` sets `margin-top: 0`
            // on this page - it overlaps down into the footer only.
            className="bg-white"
            cardClassName="-mt-0 bg-[linear-gradient(135deg,#152a6b_0%,#2557c9_65%,#3568e0_100%)]"
            headingClassName="text-[clamp(28px,3.6vw,44px)] leading-[1.12]"
            pullUp={false}
            flourish={false}
          />
        </main>
      </PageAnimations>

      <Footer overlap />
    </>
  );
}
