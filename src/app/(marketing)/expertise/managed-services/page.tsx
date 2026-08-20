/**
 * `/expertise/managed-services` - Managed Services.
 *
 * Seven sections. The proof rail reads Strapi's `case-study` collection through
 * `getManagedServicesPageData`; every other section's copy is bundled in
 * `constants/managed-services.ts`.
 *
 * This route already existed everywhere except here: `ROUTES.expertise.managedServices`,
 * the `managed-services` entry in `EXPERTISE_DELIVERY` and an entry in `SITEMAP_ROUTES`
 * all pointed at it, so until this page landed the mega menu, the footer and the
 * sitemap were all advertising a 404.
 *
 * Stays a Server Component - only the header, `BannerHero`'s parallax photo,
 * `PageAnimations` and `NavState` reach the browser as JavaScript. Nothing on this page
 * needs state, so there is no client component of its own.
 *
 * ── BACKGROUNDS ──
 * White and `bg-[#eaf8ff]` only, alternating strictly from the hero down: Stats (soft),
 * Burden (white), Delivery (soft), Embedded (white), Products (soft), Proof (white),
 * FAQ (soft), CTA (white). Same discipline as the ITSM page, and starting on the same
 * tone.
 *
 * The alternation survived removing the Pulse and Plans sections only because they
 * were ADJACENT and carried opposite tones - taking out one soft and one white band
 * together leaves the parity of everything below unchanged. Remove a single section
 * and the whole run below it flips, so re-check every band rather than just the gap.
 *
 * ── EVERY SECTION IS A DIFFERENT SHAPE, ON PURPOSE ──
 * Header-over-grid repeated seven times is what makes a page read as generated, so each
 * section states its content in the form that content actually takes: a metric band, a
 * pillar row closing on a before/after strip, a two-column hairline list, a
 * copy-beside-roster split, a flush logo strip, a card grid, and an accordion. No two
 * adjacent sections share a layout.
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
import { getManagedServicesPageData } from '@/data/managed-services';
import {
  MS_FINAL_CTA,
  MS_FINAL_CTA_LINKS,
  MS_HERO,
} from '@/constants/managed-services';
import { managedServicesHeroBanner } from '@/constants/media';
import { BurdenSection } from './BurdenSection';
import { DeliverSection } from './DeliverSection';
import { EmbeddedSection } from './EmbeddedSection';
import { FaqSection } from './FaqSection';
import { NavState } from './NavState';
import { ProductsSection } from './ProductsSection';
import { ProofSection } from './ProofSection';
import { StatsSection } from './StatsSection';

export const metadata: Metadata = buildMetadata({
  title:
    'Atlassian Managed Services | Jira & Confluence Administration | Clovity',
  description:
    'Ongoing Atlassian administration, governance and improvement for Jira, Jira Service Management and Confluence. Platform health checks, user and permission management, app support and a monthly governance review, from an Atlassian Platinum Solution Partner.',
  path: ROUTES.expertise.managedServices,
  keywords: [
    'Atlassian managed services',
    'Jira administration services',
    'Confluence administration',
    'Atlassian platform support',
    'Jira Service Management support',
    'Atlassian health check',
  ],
});

/**
 * Regenerated every five minutes: the proof rail's case studies come from Strapi over
 * Axios, which doesn't participate in Next's fetch cache, so page-level ISR is what
 * lets a newly published case study appear here without a deploy.
 */
export const revalidate = 300;

export default async function ManagedServicesPage() {
  const { caseStudies } = await getManagedServicesPageData();

  return (
    <>
      <NavState />
      {/* Breadcrumb JSON-LD is emitted by `BannerHero` from the same crumbs it
          renders, so only the Service graph is declared here. */}
      <JsonLd
        schema={serviceSchema({
          name: 'Atlassian Managed Services',
          description:
            'Ongoing administration, governance and continuous improvement of Atlassian platforms: platform health monitoring, Jira and Confluence administration, Jira Service Management support, user and permission management, and app and integration support.',
          path: ROUTES.expertise.managedServices,
          serviceType: 'Atlassian Managed Services',
        })}
      />

      {/* Solid white from first paint rather than transparent-then-solid: the hero
          below is a photograph, so a transparent header would have nothing stable to
          sit on. */}
      <Header variant="pill" priorityLogo />

      <PageAnimations>
        <main id="main-content">
          {/* No tablet/mobile variants: one supplied 2.58:1 photograph, not the
              three-file banner set the resource pages ship. No `imagePosition`
              either - the shared top-anchored crop keeps both faces; see
              `constants/media.ts`. */}
          <BannerHero
            breadcrumb={[...MS_HERO.crumbs]}
            heading={
              <>
                {MS_HERO.titleLead}
                <br />
                <HeroAccent>{MS_HERO.titleAccent}</HeroAccent>
              </>
            }
            subheading={MS_HERO.lead}
            image={managedServicesHeroBanner}
          />

          <StatsSection />

          <BurdenSection />

          <DeliverSection />

          {/* The page's actual argument, so it sits directly after the list of work
              it is the answer to. */}
          <EmbeddedSection />

          {/* Late on the page rather than high like the DevSecOps strip: there, the
              product breadth IS the opening claim. Here the argument is who owns the
              platform, and the list of products that ownership covers only means
              something once the reader has accepted the premise. */}
          <ProductsSection />

          {/* Server-rendered from the build-time/ISR snapshot. No browser refetch: a
              case study is not time-critical, and ISR at five minutes covers an edit. */}
          <ProofSection caseStudies={caseStudies} />

          <FaqSection />

          <FinalCta
            heading={
              <>
                {MS_FINAL_CTA.headingLead}
                <br />
                {MS_FINAL_CTA.headingTail}
              </>
            }
            description={MS_FINAL_CTA.description}
            ctas={MS_FINAL_CTA_LINKS}
            // White behind the card, matching ITSM and DevSecOps: this page alternates
            // only white and `bg-[#eaf8ff]`, and the FAQ above ends on `bg-[#eaf8ff]`. The card
            // keeps the darker interior-page gradient. `pullUp={false}` because there
            // is no section above for it to tuck into - it overlaps down into the
            // footer only, which `<Footer overlap>` reserves space for.
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
