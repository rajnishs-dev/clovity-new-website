/**
 * `/expertise/devsecops` - DevSecOps.
 *
 * Eight sections. The case-study rail reads Strapi's case-study collection through
 * `getDevSecOpsPageData`; every other section's copy is bundled in
 * `constants/devsecops.ts`.
 *
 * ── BACKGROUNDS ──
 * White and `bg-[#eaf8ff]` only, alternating strictly from the hero down: Stats (white),
 * Products (tint), Delivery (white), Scaling (tint), Toolchain (white), Security (tint),
 * FAQ (white), Case studies (tint), CTA (white).
 *
 * The run starts on WHITE rather than the tint (which is where the ITSM page starts)
 * purely so the parity lands correctly - it puts each band on the tone its inner cards
 * were built for. Adding or removing a section flips the whole run, so re-check every
 * band rather than just the new one. That has now happened twice in a row: adding the
 * case-study rail, then removing the featured-article band below it.
 *
 * Stays a Server Component - only the header, `BannerHero`'s parallax photo,
 * `PageAnimations` and `NavState` reach the browser as JavaScript.
 *
 * The hero is the SHARED `BannerHero` - the same component and treatment every
 * resource page and About Us uses, so only the copy and the photograph differ. An
 * earlier version painted its own gradient with a CTA row and a pipeline motif
 * beside the copy; that is gone deliberately, because the banner is meant to match
 * the rest of the site rather than introduce a second hero style.
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
import { getDevSecOpsPageData } from '@/data/devsecops';
import {
  DEVSECOPS_FINAL_CTA,
  DEVSECOPS_FINAL_CTA_LINKS,
  DEVSECOPS_HERO,
} from '@/constants/devsecops';
import { devsecopsHeroBanner } from '@/constants/media';
import { DeliverSection } from './DeliverSection';
import { FaqSection } from './FaqSection';
import { NavState } from './NavState';
import { ProductFamilySection } from './ProductFamilySection';
import { CaseStudiesSection } from './CaseStudiesSection';
import { ScalingSection } from './ScalingSection';
import { SecuritySection } from './SecuritySection';
import { StatsSection } from './StatsSection';
import { ToolchainSection } from './ToolchainSection';

export const metadata: Metadata = buildMetadata({
  title: 'DevSecOps & Secure CI/CD Pipelines | Clovity',
  description:
    'CI/CD pipeline design with security controls at every stage, not one review before release. Bitbucket, GitHub, GitLab and Azure DevOps toolchains, audit-ready evidence, and release automation from an Atlassian Platinum Solution Partner.',
  path: ROUTES.expertise.devsecops,
  keywords: [
    'DevSecOps services',
    'secure CI/CD pipeline',
    'shift-left security',
    'Bitbucket pipelines',
    'audit-ready pipeline compliance',
    'SAST DAST pipeline integration',
  ],
});

/**
 * Regenerated every five minutes: the case-study rail comes from Strapi over Axios, which
 * doesn't participate in Next's fetch cache, so page-level ISR is what lets a newly
 * published case study appear here without a deploy.
 */
export const revalidate = 300;

export default async function DevSecOpsPage() {
  const { caseStudies } = await getDevSecOpsPageData();

  return (
    <>
      <NavState />
      {/* Breadcrumb JSON-LD is emitted by `BannerHero` from the same crumbs it
          renders, so only the Service graph is declared here. */}
      <JsonLd
        schema={serviceSchema({
          name: 'DevSecOps & Secure Software Delivery',
          description:
            'CI/CD pipeline design and automation, security integrated across the SDLC, Bitbucket/GitHub/GitLab/Azure DevOps toolchains, release and deployment automation, audit-ready compliance pipelines, and toolchain orchestration.',
          path: ROUTES.expertise.devsecops,
          serviceType: 'DevSecOps Consulting',
        })}
      />

      {/* Solid white from first paint - the hero behind it is a dark photograph. */}
      <Header variant="pill" priorityLogo />

      <PageAnimations>
        <main id="main-content">
          {/* No tablet/mobile variants: one 2:1 landscape banner, not the three-file
              set the resource pages ship. No `imagePosition` either - the shared
              top-anchored crop keeps the whole HUD ring; see `constants/media.ts`. */}
          <BannerHero
            breadcrumb={[...DEVSECOPS_HERO.crumbs]}
            heading={
              <>
                {DEVSECOPS_HERO.titleLead}
                <br />
                <HeroAccent>{DEVSECOPS_HERO.titleAccent}</HeroAccent>
              </>
            }
            subheading={DEVSECOPS_HERO.lead}
            image={devsecopsHeroBanner}
          />

          <StatsSection />

          {/* High on the page, like a capability showcase: the breadth of surface
              we work across, before any of the argument starts. */}
          <ProductFamilySection />

          <DeliverSection />

          {/* The visual summary of the toolchain, ahead of the layer-by-layer
              detail in `ToolchainSection`: orbit first, then the breakdown. */}
          <ScalingSection />

          <ToolchainSection />

          <SecuritySection />

          <FaqSection />

          {/* The page's only proof band. A featured long-form article ("Our Own
              Thinking, Written Down") sat directly below this one and was removed on
              request, along with the blog lookup that fed it. Server-rendered from the
              build-time/ISR snapshot - a case study is not time-critical, and ISR at
              five minutes covers an edit. */}
          <CaseStudiesSection caseStudies={caseStudies} />

          <FinalCta
            heading={
              <>
                {DEVSECOPS_FINAL_CTA.headingLead}
                <br />
                {DEVSECOPS_FINAL_CTA.headingTail}
              </>
            }
            description={DEVSECOPS_FINAL_CTA.description}
            ctas={DEVSECOPS_FINAL_CTA_LINKS}
            // White behind the card: this page alternates only white and `bg-[#eaf8ff]`,
            // and the band directly above is now the case-study rail, which is tinted.
            // (It used to be the FAQ; the featured-article band that sat between them
            // is gone.) The card keeps the darker interior-page gradient.
            // `pullUp={false}` because there is no section above for it to tuck into -
            // it overlaps down into the footer only, which `<Footer overlap>` reserves
            // space for.
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
