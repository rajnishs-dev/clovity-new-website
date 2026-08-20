/**
 * `/expertise/itsm` - ITSM & Service Management.
 *
 * Twelve sections. The case-study proof rail reads Strapi's `case-study`
 * collection through `getItsmPageData`; every other section's copy is bundled in
 * `constants/itsm.ts`.
 *
 * Stays a Server Component - only the header, `PageAnimations` and `NavState`
 * reach the browser as JavaScript. The public-sector panel is deliberately a
 * static version of the home page's rotating one for exactly that reason; see
 * `PublicSectorSection`.
 */
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { serviceSchema } from '@/lib/schema';
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
import { getItsmPageData } from '@/data/itsm';
import {
  ITSM_FINAL_CTA,
  ITSM_FINAL_CTA_LINKS,
  ITSM_HERO,
} from '@/constants/itsm';
import { itsmServiceDeskBanner } from '@/constants/media';
import { ApproachSection } from './ApproachSection';
import { DeliverSection } from './DeliverSection';
import { FaqSection } from './FaqSection';
import { GlossarySection } from './GlossarySection';
import { JsmSection } from './JsmSection';
import { NavState } from './NavState';
import { ProofSection } from './ProofSection';
import { PublicSectorSection } from './PublicSectorSection';
import { StatsSection } from './StatsSection';
import { TrustedBySection } from './TrustedBySection';
import { WhySection } from './WhySection';

export const metadata: Metadata = buildMetadata({
  title:
    'ITSM & Enterprise Service Management | Jira Service Management | Clovity',
  description:
    'Jira Service Management implemented for real ticket volume, then extended to HR, Finance, Legal and Operations. ITIL 4-aligned process design, CMDB and assets, and legacy service-desk migration from an Atlassian Platinum Solution Partner.',
  path: ROUTES.expertise.itsm,
  keywords: [
    'ITSM services',
    'Enterprise Service Management',
    'Jira Service Management implementation',
    'ITIL 4 process design',
    'JSM migration from ServiceNow',
    'CMDB and asset management',
  ],
});

/**
 * Regenerated every five minutes: the proof rail's case studies come from Strapi
 * over Axios, which doesn't participate in Next's fetch cache, so page-level ISR is
 * what lets a newly published case study appear here without a deploy.
 */
export const revalidate = 300;

export default async function ItsmPage() {
  const { caseStudies, logos } = await getItsmPageData();

  return (
    <>
      <NavState />
      {/* Breadcrumb JSON-LD is emitted by `BannerHero` from the same crumbs it
          renders, so only the Service graph is declared here. */}
      <JsonLd
        schema={serviceSchema({
          name: 'ITSM & Enterprise Service Management',
          description:
            'Jira Service Management implementation, ITIL 4-aligned process design, enterprise service management beyond IT, CMDB and asset management, and migration from legacy service desks.',
          path: ROUTES.expertise.itsm,
          serviceType: 'IT Service Management Consulting',
        })}
      />

      {/* Solid white from first paint rather than transparent-then-solid: the hero
          below is a photograph, so a transparent header would have nothing stable
          to sit on. */}
      <Header variant="pill" priorityLogo />

      <PageAnimations>
        <main id="main-content">
          <BannerHero
            breadcrumb={[...ITSM_HERO.crumbs]}
            heading={
              <>
                {ITSM_HERO.titleLead}
                <br />
                <HeroAccent>{ITSM_HERO.titleAccent}</HeroAccent>
              </>
            }
            subheading={ITSM_HERO.lead}
            image={itsmServiceDeskBanner}
          />

          <StatsSection />

          <WhySection />

          <DeliverSection />

          <GlossarySection />

          <JsmSection />

          <ApproachSection />

          <PublicSectorSection />

          {/* Server-rendered from the build-time/ISR snapshot. Unlike About's
              credentials row there is no browser refetch here: a case study is not
              time-critical the way a newly published award is, and ISR at five
              minutes already covers it. */}
          <ProofSection caseStudies={caseStudies} />

          <TrustedBySection logos={logos} />

          <FaqSection />

          <FinalCta
            heading={
              <>
                {ITSM_FINAL_CTA.headingLead}
                <br />
                {ITSM_FINAL_CTA.headingTail}
              </>
            }
            description={ITSM_FINAL_CTA.description}
            ctas={ITSM_FINAL_CTA_LINKS}
            // White behind the card rather than About's `#eaf8ff`: this page now
            // alternates only white and `bg-[#eaf8ff]`, and the FAQ above ends on
            // `bg-[#eaf8ff]`. The card itself keeps the darker interior-page gradient.
            // `pullUp={false}` because there is no section above for it to tuck
            // into - it overlaps down into the footer only, which
            // `<Footer overlap>` reserves space for.
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
