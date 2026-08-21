/**
 * Cloud Migration - second of the `/expertise/*` pages, following the same
 * pattern established on `/expertise/atlassian`. Reuses the real migration
 * data already published on the home page (sources/steps/benefits/AGC
 * steps) rather than inventing a separate migration story for this page.
 */
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { ROUTES } from '@/constants/routes';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { FinalCta, JsonLd, PageAnimations } from '@/components/common';
import { getCloudMigrationPageData } from '@/data/cloud-migration';
import { NavState } from './NavState';
import { CaseStudiesSection } from './CaseStudiesSection';
import { HeroSection } from './HeroSection';
import { TrustSection } from './TrustSection';
import { ProblemSection } from './ProblemSection';
import { ApproachComparisonSection } from './ApproachComparisonSection';
import { ProductMigrationGrid } from './ProductMigrationGrid';
import { MigrationFlowSection } from './MigrationFlowSection';
import { AgcSection } from './AgcSection';
import { FaqSection } from './FaqSection';
import { MetricsSection } from './MetricsSection';
import {
  CLOUD_MIGRATION_FINAL_CTA,
  CLOUD_MIGRATION_FINAL_CTA_LINKS,
  CLOUD_MIGRATION_HERO,
} from '@/constants/expertise/cloud-migration';

export const metadata: Metadata = buildMetadata({
  title: 'Cloud Migration - Atlassian Data Center to Cloud & AGC',
  description:
    'Clovity migrates Atlassian Data Center instances to Cloud or Atlassian Government Cloud in staged, validated waves - assessment, architecture, execution, and post-migration health monitoring with Pulse AI.',
  path: ROUTES.expertise.cloudMigration,
  keywords: [
    'Atlassian Data Center migration',
    'Atlassian Cloud migration partner',
    'Atlassian Government Cloud',
    'Jira Confluence migration',
  ],
});

/**
 * Regenerated every five minutes. The case-study rail reads Strapi over Axios, which does
 * not participate in Next's fetch cache, so page-level ISR is what lets a newly published
 * case study appear here without a deploy. This page was fully static until that rail was
 * added.
 */
export const revalidate = 300;
export default async function CloudMigrationExpertisePage() {
  const { caseStudies } = await getCloudMigrationPageData();

  return (
    <>
      <NavState />
      <JsonLd schema={breadcrumbSchema([...CLOUD_MIGRATION_HERO.crumbs])} />

      <Header variant="pill" priorityLogo />

      <PageAnimations>
        <main id="main-content">
          <HeroSection />

          <TrustSection />

          <ProblemSection />

          <ApproachComparisonSection />

          <ProductMigrationGrid />

          <MigrationFlowSection />

          <AgcSection />


          <MetricsSection />

          <FaqSection />

          {/* The page's only proof band. A static `CUSTOMER_STORIES` quote block
              ("Migrations That Held Up to Real Scrutiny") sat directly above this one
              and was removed on request, so this rail now carries the proof alone. */}
          <CaseStudiesSection caseStudies={caseStudies} />

          <FinalCta
            heading={
              <>
                {CLOUD_MIGRATION_FINAL_CTA.headingLead}
                <br />
                {CLOUD_MIGRATION_FINAL_CTA.headingTail}
              </>
            }
            description={CLOUD_MIGRATION_FINAL_CTA.description}
            ctas={CLOUD_MIGRATION_FINAL_CTA_LINKS}
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
