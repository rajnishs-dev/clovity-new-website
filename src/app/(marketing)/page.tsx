/**
 * Home page.
 *
 * No page-scoped stylesheet. What used to be a ~940-line inline `<style>` block -
 * including `#navbar` overrides that redefined the header for this route only - is
 * now Tailwind utilities inside each section, and the header's two treatments are a
 * `variant` prop rather than a stylesheet that happens to load later.
 */
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { ROUTES } from '@/constants/routes';
import { siteConfig } from '@/constants/site';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { FinalCta } from '@/components/common/CTA';
import { AiDeliverySection } from './_home/AiDeliverySection';
import { CloudMigrationSection } from './_home/CloudMigrationSection';
import { CredentialsSection } from './_home/CredentialsSection';
import { FieldNotesSection } from './_home/FieldNotesSection';
import { ForwardDeployedSection } from './_home/ForwardDeployedSection';
import { HeroSection } from './_home/HeroSection';
import { HomeAnimations } from './_home/HomeAnimations';
import { MarketplaceSection } from './_home/MarketplaceSection';
import { PublicSectorSection } from './_home/PublicSectorSection';
import { PulseAiSection } from './_home/PulseAiSection';
import { ResultsSection } from './_home/ResultsSection';
import { SvgGradientDefs } from './_home/SvgGradientDefs';
import { TrustedBySection } from './_home/TrustedBySection';
import { getHomePageData } from '@/data/home';
import {
  AGC_STEPS,
  AI_DELIVERY_CAPABILITIES,
  FINAL_CTA_CONTENT,
  FINAL_CTA_LINKS,
  MIGRATION_BENEFITS,
  MIGRATION_SOURCES,
  MIGRATION_STEPS,
  PUBLIC_SECTOR_FACTS,
} from '@/constants/home';
import { HomeNavState } from './HomeNavState';

export const metadata: Metadata = buildMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  path: ROUTES.home,
  keywords: [
    'Atlassian AI partner',
    'AI-fication of Jira',
    'Pulse AI Jira copilot',
    'Atlassian Government Cloud migration',
  ],
});

/**
 * Static by default. Nothing on this page is per-request, so it prerenders at
 * build time and is served from the edge cache. Once the CMS is live, changing
 * this to `export const revalidate = 300` (or wiring the on-demand webhook) is
 * the only edit needed - the data layer in data/home.ts already fetches
 * through the API-with-fallback seam.
 */
export default async function HomePage() {
  const { stories, logos, apps, stats, credentialRows, collections } =
    await getHomePageData();

  return (
    <>
      <HomeNavState />
      <SvgGradientDefs />

      {/* Transparent floating pill over the dark hero; logo is prioritised. */}
      <Header variant="floating" priorityLogo />

      {/* Wraps the page in the GSAP context and arms scroll-reveal. */}
      <HomeAnimations>
        <main id="main-content">
          <HeroSection />

          <PulseAiSection />

          <TrustedBySection stories={stories} logos={logos} />

          <PublicSectorSection
            facts={PUBLIC_SECTOR_FACTS}
            agcSteps={AGC_STEPS}
          />

          <AiDeliverySection capabilities={AI_DELIVERY_CAPABILITIES} />


          <CloudMigrationSection
            sources={MIGRATION_SOURCES}
            steps={MIGRATION_STEPS}
            benefits={MIGRATION_BENEFITS}
          />

          <ForwardDeployedSection />

          <MarketplaceSection apps={apps} />

          <ResultsSection stats={stats} />

          <FieldNotesSection collections={collections} />

          <CredentialsSection rows={credentialRows} />

          <FinalCta
            heading={
              <>
                {FINAL_CTA_CONTENT.headingLead}
                <span style={{ whiteSpace: 'nowrap' }}>
                  {FINAL_CTA_CONTENT.headingNoWrap}
                </span>
                <br />
                {FINAL_CTA_CONTENT.headingTail}
              </>
            }
            description={FINAL_CTA_CONTENT.description}
            ctas={FINAL_CTA_LINKS}
          />
        </main>
      </HomeAnimations>

      {/* `overlap` makes room for the CTA card that tucks into the footer. */}
      <Footer overlap />
    </>
  );
}
