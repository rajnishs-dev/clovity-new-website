/**
 * Marketplace Apps - the third `/expertise/*` page. Mostly Clovity's own
 * content per the build plan: the real, already-published app catalog is
 * the centerpiece (shown as a tab view), not a generic services pitch.
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
import { ProblemSection } from './ProblemSection';
import { AppsTabsSection } from './AppsTabsSection';
import { SupportGridSection } from './SupportGridSection';
import { MetricsSection } from './MetricsSection';
import { ProofSection } from './ProofSection';
import {
  MARKETPLACE_APPS_FINAL_CTA,
  MARKETPLACE_APPS_FINAL_CTA_LINKS,
  MARKETPLACE_APPS_HERO,
} from '@/constants/expertise/marketplace-apps';

export const metadata: Metadata = buildMetadata({
  title: 'Marketplace Apps - Pulse AI, Time Tracking & More',
  description:
    'Clovity builds and supports its own Atlassian Marketplace apps - Pulse AI, Time Tracking & Resource Planning, Dashboard Templates, and Content Formatting Macros - plus custom Forge app development.',
  path: ROUTES.expertise.marketplaceApps,
  keywords: [
    'Atlassian Marketplace apps',
    'Pulse AI for Jira',
    'Jira dashboard app',
    'Confluence formatting macros',
  ],
});

export default function MarketplaceAppsExpertisePage() {
  return (
    <>
      <NavState />
      <JsonLd schema={breadcrumbSchema([...MARKETPLACE_APPS_HERO.crumbs])} />

      <Header variant="pill" priorityLogo />

      <PageAnimations>
        <main id="main-content">
          <HeroSection />

          <ProblemSection />

          <AppsTabsSection />

          <SupportGridSection />

          <MetricsSection />

          <ProofSection />

          <FinalCta
            heading={
              <>
                {MARKETPLACE_APPS_FINAL_CTA.headingLead}
                <br />
                {MARKETPLACE_APPS_FINAL_CTA.headingTail}
              </>
            }
            description={MARKETPLACE_APPS_FINAL_CTA.description}
            ctas={MARKETPLACE_APPS_FINAL_CTA_LINKS}
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
