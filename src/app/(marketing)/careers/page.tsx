/**
 * Careers page - a port of `careers.html` with two sections wired to Strapi instead of
 * static copy: Open Positions reads the `job` collection (the legacy `/talent` page did
 * too; the nine sample roles are kept as the offline fallback), and Life At Clovity
 * reads `life-at-clovity` for its heading, photo and intro. Everything else is bundled
 * copy.
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
import { BenefitsSection } from './BenefitsSection';
import { CultureSection } from './CultureSection';
import { FaqSection } from './FaqSection';
import { HiringProcessSection } from './HiringProcessSection';
import { OpenPositionsSection } from './OpenPositionsSection';
import { StatsSection } from './StatsSection';
import { WhySection } from './WhySection';
import { getCareersPageData } from '@/data/careers';
import {
  CAREERS_FINAL_CTA,
  CAREERS_FINAL_CTA_LINKS,
  CAREERS_HERO,
} from '@/constants/careers';
import {
  careerHeroBanner,
  careerHeroBannerTablet,
  careerHeroBannerMobile,
} from '@/constants/media';
import { NavState } from './NavState';

export const metadata: Metadata = buildMetadata({
  title: 'Careers - Join Our Team | Clovity',
  description:
    'Build your career at Clovity, a San Francisco based Atlassian Platinum Solution Partner. Explore open roles across Atlassian, AI, DevSecOps, and ITSM, and see why our teams stay.',
  path: ROUTES.discover.careers,
  keywords: [
    'Clovity careers',
    'Atlassian consultant jobs',
    'remote Atlassian jobs',
    'DevSecOps engineer jobs',
  ],
});

/**
 * Regenerated every five minutes - shorter than the About page's, since a filled
 * opening should stop showing quickly and Strapi (read over Axios, outside Next's
 * fetch cache) relies on page-level ISR to bound staleness.
 */
export const revalidate = 300;

export default async function CareersPage() {
  // `filters` is not passed down: the section derives its tabs from whichever job
  // list is currently on screen, which after the client refresh may not be this one.
  const { jobs, culture } = await getCareersPageData();

  return (
    <>
      <NavState />
      <JsonLd schema={breadcrumbSchema([...CAREERS_HERO.crumbs])} />

      <Header variant="pill" priorityLogo />

      <PageAnimations>
        <main id="main-content">
          <BannerHero
            breadcrumb={[...CAREERS_HERO.crumbs]}
            heading={
              <>
                {CAREERS_HERO.titleLead}
                <br />
                <HeroAccent>{CAREERS_HERO.titleAccent}</HeroAccent>
              </>
            }
            subheading={CAREERS_HERO.lead}
            image={careerHeroBanner}
            imageTablet={careerHeroBannerTablet}
            imageMobile={careerHeroBannerMobile}
          />

          <WhySection />

          <StatsSection />

          {/* `initial…` is the build-time snapshot; both sections refetch in the
              browser so a CMS change lands without waiting for ISR. */}
          <CultureSection initialHighlight={culture} />

          <BenefitsSection />

          <HiringProcessSection />

          <OpenPositionsSection initialJobs={jobs} />

          <FaqSection />

          <FinalCta
            heading={
              <>
                {CAREERS_FINAL_CTA.headingLead}
                <br />
                {CAREERS_FINAL_CTA.headingTail}
              </>
            }
            description={CAREERS_FINAL_CTA.description}
            ctas={CAREERS_FINAL_CTA_LINKS}
            className="bg-[#eaf8ff]"
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
