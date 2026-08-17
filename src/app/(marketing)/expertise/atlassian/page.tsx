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
import { NavState } from './NavState';
import { HeroSection } from './HeroSection';
import { TrustSection } from './TrustSection';
import { ProblemSection } from './ProblemSection';
import { DeliverGridSection } from './DeliverGridSection';
import { AiAutomationSection } from './AiAutomationSection';
import { SuiteCoverageSection } from './SuiteCoverageSection';
import { DeliveryApproachSection } from './DeliveryApproachSection';
import { MetricsSection } from './MetricsSection';
import { ProofSection } from './ProofSection';
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

export default function AtlassianExpertisePage() {
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

          <ProofSection />

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
