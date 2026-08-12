/**
 * About page.
 *
 * A faithful port of `about-us.html`: same eleven sections in the same order, same
 * copy, same spacing. What changed is where the content comes from - the
 * "Certifications & Diversity" badge row now reads the Strapi `award` collection, so
 * an editor adding an award in `clovity-admin` sees it here without a deploy. Every
 * other section's copy is bundled, which matches the source page: it had no CMS
 * behind any of it.
 *
 * The page stays a Server Component. Only four things reach the browser as
 * JavaScript: the header (scroll state), the hero (parallax), `PageAnimations` (the
 * reveal observer) and `NavState` (one dispatch).
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
import { aboutHeroBanner } from '@/constants/media';
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
 * Regenerated every five minutes.
 *
 * The award badges come from Strapi over Axios, which does not participate in Next's
 * fetch cache - so without this the page would re-request on every visit. ISR at the
 * page level is the right granularity here: the whole page is one cached HTML
 * document, and a published award appears within the window without a deploy.
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
            className="bg-[#f8faff]"
            cardClassName="-mt-0 bg-[linear-gradient(135deg,#152a6b_0%,#2557c9_65%,#3568e0_100%)]"
            headingClassName="text-[clamp(28px,3.6vw,44px)] leading-[1.12]"
            pullUp={false}
            flourish={false}
          />
        </main>
      </PageAnimations>

      {/*
        220px, not the Footer's default 260px - `.footer-overlap` is 220px on this
        page. The 900px and 640px steps (190px / 150px) are unchanged, so only the
        base value is overridden.
      */}
      <Footer overlap className="pt-[220px]" />
    </>
  );
}
