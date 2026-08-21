/**
 * Atlassian Solutions - the pilot build for the 8-page `/expertise/*` area.
 *
 * Ten sections per the build plan's skeleton: hero, trust strip, problem
 * statement, "what we deliver" grid, AI/automation, suite coverage (tabs),
 * delivery approach (timeline), outcome metrics, proof, closing CTA. Stays a
 * Server Component - only the hero's breadcrumb, `SuiteCoverageSection`'s
 * tabs, `NavState` and `PageAnimations` reach the browser as JavaScript.
 */
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { ROUTES } from '@/constants/routes';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { FinalCta, JsonLd, PageAnimations } from '@/components/common';
import { getAtlassianPageData } from '@/data/atlassian';
import { NavState } from './NavState';
import { HeroSection } from './HeroSection';
import { CaseStudiesSection } from './CaseStudiesSection';
import { FaqSection } from './FaqSection';
import { TrustSection } from './TrustSection';
import { ProblemSection } from './ProblemSection';
import { DeliverGridSection } from './DeliverGridSection';
import { AiAutomationSection } from './AiAutomationSection';
import { SuiteCoverageSection } from './SuiteCoverageSection';
import { DeliveryApproachSection } from './DeliveryApproachSection';
import { MetricsSection } from './MetricsSection';
import {
  ATLASSIAN_FINAL_CTA,
  ATLASSIAN_FINAL_CTA_LINKS,
  ATLASSIAN_HERO,
} from '@/constants/expertise/atlassian';

export const metadata: Metadata = buildMetadata({
  title: 'Atlassian Solutions - Jira, Confluence & JSM Delivery',
  description: ATLASSIAN_HERO.lead,
  path: ROUTES.expertise.atlassian,
  keywords: [
    'Atlassian consulting',
    'Jira implementation partner',
    'Confluence administration',
    'Jira Service Management partner',
  ],
});

/**
 * Regenerated every five minutes. The case-study rail reads Strapi over Axios, which does
 * not participate in Next's fetch cache, so page-level ISR is what lets a newly published
 * case study appear here without a deploy. This page was fully static until that rail was
 * added.
 */
export const revalidate = 300;

export default async function AtlassianExpertisePage() {
  const { caseStudies } = await getAtlassianPageData();

  return (
    <>
      <NavState />
      <JsonLd schema={breadcrumbSchema([...ATLASSIAN_HERO.crumbs])} />

      <Header variant="pill" priorityLogo />

      <PageAnimations>
        <main id="main-content">
          <HeroSection />

          <TrustSection />

          <ProblemSection />

          <DeliverGridSection />

          <AiAutomationSection />

          <SuiteCoverageSection />

          <DeliveryApproachSection />

          <MetricsSection />

          {/* The page's only proof band. A static `CUSTOMER_STORIES` quote block
              ("Built for Teams That Get Audited") sat directly above this one and was
              removed on request, so this rail now carries the proof alone. Removing it
              flipped the tone of every band from here down - see the note above. */}
          <FaqSection />
          <CaseStudiesSection caseStudies={caseStudies} />


          <FinalCta
            heading={
              <>
                {ATLASSIAN_FINAL_CTA.headingLead}
                <br />
                {ATLASSIAN_FINAL_CTA.headingTail}
              </>
            }
            description={ATLASSIAN_FINAL_CTA.description}
            ctas={ATLASSIAN_FINAL_CTA_LINKS}
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
