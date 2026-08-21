/**
 * `/expertise/workforce` - Workforce Solutions.
 *
 * Nine sections. The proof rail reads Strapi's case-study collection through
 * `getWorkforcePageData`; every other section's copy is bundled in
 * `constants/workforce.ts`.
 *
 * This route already existed everywhere except here: `ROUTES.expertise.workforce`, the
 * `workforce` entry in `EXPERTISE_PEOPLE` (which the mega menu, the mobile drawer and the
 * footer all render) and a `SITEMAP_ROUTES` row at priority 0.8 all pointed at it, so until
 * this page landed every one of them was advertising a 404.
 *
 * Stays a Server Component - only the header, `BannerHero`'s parallax photo,
 * `PageAnimations` and `NavState` reach the browser as JavaScript. Nothing here needs state,
 * so there is no client component of its own.
 *
 * ── THE BANNER IS THE SHARED ONE, CALLED DIRECTLY ──
 * `BannerHero`, inline below rather than wrapped in a `HeroSection.tsx`, matching ITSM,
 * DevSecOps and Managed Services. Breadcrumb, heading and subheading only: that component
 * ships no eyebrow, CTA row or proof strip, and the expertise banners across the site do
 * not carry them.
 *
 * An earlier version of this page used `ExpertiseHero` with an eyebrow, two buttons and a
 * 100+/235+ strip on the photo. Those are gone - the numbers now appear once, in the stat
 * band directly below, and the banner reads the same as every other one. Worth knowing
 * that this swap WEAKENED the scrim behind the copy (.85-to-0 rather than .88-to-.2), so
 * the contrast figure recorded on `workforceHeroBanner` moved with it; both values are
 * documented there and both clear WCAG AA.
 *
 * ── BACKGROUNDS ──
 * White and `bg-[#eaf8ff]` only, alternating strictly from the hero down: Stats (soft), Sourcing
 * (white), Deliver (soft), Contrast (white), Disciplines (soft), Approach (white),
 * Credentials (soft), Proof (white), FAQ (soft), CTA (white). Same discipline as the ITSM and
 * Managed Services pages, and starting on the same tone.
 *
 * Removing any single section flips the parity of every band below it, so re-check the whole
 * run rather than just the gap - the Managed Services page got away with dropping two only
 * because they were adjacent and carried opposite tones.
 *
 * ── EVERY SECTION IS A DIFFERENT SHAPE, ON PURPOSE ──
 * Header-over-grid repeated nine times is what makes a page read as generated, so each
 * section states its content in the form that content actually takes: a metric band, a
 * three-column trade-off comparison, two labelled spine lists, a two-card ownership
 * contrast, a bordered roster closing on a chip strip, a horizontal numbered timeline, a
 * copy-beside-credentials split, a card grid, and an accordion. No two adjacent sections
 * share a layout.
 *
 * ── ONE ARGUMENT THIS PAGE HAS TO WIN ──
 * `ContrastSection` is not padding. This page and `/expertise/managed-services` both apply
 * the home page's "embedded, not on-call" promise to their own work, and a reader who cannot
 * tell them apart buys the wrong one. That section names the discriminator - who owns the
 * platform - and links out to the other page rather than competing with it.
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
import { getWorkforcePageData } from '@/data/workforce';
import {
  WF_FINAL_CTA,
  WF_FINAL_CTA_LINKS,
  WF_HERO,
} from '@/constants/workforce';
import { workforceHeroBanner } from '@/constants/media';
import { NavState } from './NavState';
import { StatsSection } from './StatsSection';
import { SourcingSection } from './SourcingSection';
import { DeliverSection } from './DeliverSection';
import { ContrastSection } from './ContrastSection';
import { DisciplinesSection } from './DisciplinesSection';
import { ApproachSection } from './ApproachSection';
import { CredentialsSection } from './CredentialsSection';
import { ProofSection } from './ProofSection';
import { FaqSection } from './FaqSection';

export const metadata: Metadata = buildMetadata({
  title:
    'Workforce Solutions | Atlassian Staff Augmentation & Training | Clovity',
  description:
    'Atlassian-certified staff augmentation, embedded admins and forward-deployed engineers, role-based training, Agile and SAFe coaching, and change management - from an Atlassian Platinum Solution Partner with MBE, NMSDC and USPAACC certifications.',
  path: ROUTES.expertise.workforce,
  keywords: [
    'Atlassian staff augmentation',
    'Atlassian certified consultants',
    'embedded Atlassian admin',
    'Atlassian training partner',
    'SAFe coaching',
    'Jira administrator staffing',
    'MBE certified IT staffing',
  ],
});

/**
 * Regenerated every five minutes: the proof rail's case studies come from Strapi over Axios,
 * which doesn't participate in Next's fetch cache, so page-level ISR is what lets a newly
 * published case study appear here without a deploy.
 */
export const revalidate = 300;

export default async function WorkforcePage() {
  const { caseStudies } = await getWorkforcePageData();

  return (
    <>
      <NavState />

      {/* Breadcrumb JSON-LD is emitted by `BannerHero` from the same crumbs it
          renders, so only the Service graph is declared here. */}
      <JsonLd
        schema={serviceSchema({
          name: 'Atlassian Workforce Solutions',
          description:
            'Atlassian-certified staff augmentation and team enablement: embedded administrators and forward-deployed engineers, role-based training, certified Atlassian training programs, Agile and SAFe coaching, and change management and adoption support.',
          path: ROUTES.expertise.workforce,
          serviceType: 'IT Staff Augmentation and Training',
        })}
      />

      {/* Solid white from first paint rather than transparent-then-solid: the hero below
          is a photograph, so a transparent header would have nothing stable to sit on. */}
      <Header variant="pill" priorityLogo />

      <PageAnimations>
        <main id="main-content">
          {/* One supplied 3.42:1 photograph, so no tablet/mobile variants and no
              `imagePosition`. Being wider than the slot, it crops horizontally, and
              the browser's `50% 50%` default keeps all four faces with the frame's
              empty left third still sitting under this copy. Anchoring left would
              hold the brightest part of the wall and cost contrast - see
              `workforceHeroBanner` in `constants/media.ts` for the measurements. */}
          <BannerHero
            breadcrumb={[...WF_HERO.crumbs]}
            heading={
              <>
                {WF_HERO.titleLead}
                <br />
                <HeroAccent>{WF_HERO.titleAccent}</HeroAccent>
              </>
            }
            subheading={WF_HERO.lead}
            image={workforceHeroBanner}
          />

          <StatsSection />

          {/* The page's opening argument, so it comes before the list of services it
              is the justification for. */}
          <SourcingSection />

          <DeliverSection />

          {/* Directly after the service list, because that list is what a reader will
              otherwise confuse with the Managed Services one. */}
          <ContrastSection />

          <DisciplinesSection />

          <ApproachSection />

          {/* Late rather than high: the certifications matter to a procurement reader
              who has already decided the capability is real, and leading with them
              would answer a question nobody has asked yet. */}
          <CredentialsSection />

          {/* Server-rendered from the build-time/ISR snapshot. No browser refetch: a
              case study is not time-critical, and ISR at five minutes covers an edit. */}
          <FaqSection />
          <ProofSection caseStudies={caseStudies} />


          <FinalCta
            heading={
              <>
                {WF_FINAL_CTA.headingLead}
                <br />
                {WF_FINAL_CTA.headingTail}
              </>
            }
            description={WF_FINAL_CTA.description}
            ctas={WF_FINAL_CTA_LINKS}
            // White behind the card, matching ITSM, DevSecOps and Managed Services:
            // this page alternates only white and `bg-[#eaf8ff]`, and the FAQ above ends on
            // `bg-[#eaf8ff]`. The card keeps the darker interior-page gradient.
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
