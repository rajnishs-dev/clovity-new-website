/**
 * `/expertise/ai` - AI Solutions.
 *
 * Nine sections. The proof rail reads Strapi's case-study collection through `getAiPageData`;
 * every other section's copy is bundled in `constants/ai.ts` - except Pulse AI's, which is
 * imported from `constants/home.ts` rather than restated. See `PulseSection`.
 *
 * This route already existed everywhere except here: `ROUTES.expertise.ai`, the `ai` entry in
 * `EXPERTISE_PEOPLE` (which the mega menu, the mobile drawer and the footer all render) and a
 * `SITEMAP_ROUTES` row at priority 0.9 - the joint-highest on the site, alongside Atlassian
 * Solutions and Cloud Migration - all pointed at it. So until this page landed, the route the
 * sitemap ranked most important was a 404.
 *
 * Stays a Server Component - only the header, `BannerHero`'s parallax artwork, `PageAnimations`
 * and `NavState` reach the browser as JavaScript. Nothing here needs state, so there is no
 * client component of its own.
 *
 * ── BACKGROUNDS: EIGHT BANDS, SO ONE TONE HAS TO REPEAT ──
 * White and `bg-soft` only: Stats (soft), Pulse (white), Deliver (soft), Touchpoints (white),
 * Products (soft), Approach (white), Proof (soft), FAQ (soft), CTA (white).
 *
 * That is not a slip. Two bands are pinned to `bg-soft` by their own contents - the stat band
 * and the FAQ both paint WHITE cards, which vanish on a white background - and in a strict
 * alternation the first and eighth positions have opposite parity, so with eight content bands
 * they cannot both be soft. Exactly one repeat is unavoidable. It is placed at Proof → FAQ
 * because `FaqSection` already ships a `border-t` hairline to mark that seam, and because white
 * `ResourceCard`s read better on soft than on white.
 *
 * This page had nine bands and perfect alternation until the responsible-AI section
 * ("The Risk Is Not the Model. It's the Access.") was removed on request. Its band was soft, so
 * every tone below it flipped: the proof rail moved from white to soft, which is the one edit
 * that change actually required. Re-check the whole run after adding or removing a section, not
 * just the gap - and note that going back to an odd number of bands would restore strict
 * alternation and let the proof rail return to white.
 *
 * ── EVERY SECTION IS A DIFFERENT SHAPE, ON PURPOSE ──
 * A metric band, a copy-beside-product-card split, a bento grid, a linked practice list, a
 * four-up product grid, a horizontal numbered timeline, a paired dark compare panel, a card
 * grid, and an accordion. No two adjacent sections share a layout.
 *
 * ── WHAT THIS PAGE HAS THAT THE OTHERS DO NOT ──
 * A product. `PulseSection` is the reason this page exists in the shape it does: Pulse AI is
 * shipped, listed and free on the Atlassian Marketplace, which means this is the only expertise
 * page where a reader can evaluate the claim without contacting us. That is why the section sits
 * second - above the service grid, not inside it - and why the closing CTA leads with a free
 * install rather than a contact form. The two-button CTA itself is not special: it is already
 * the form used by `atlassian`, `cloud-migration`, `marketplace-apps` and the home page.
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
import { getAiPageData } from '@/data/ai';
import { AI_FINAL_CTA, AI_FINAL_CTA_LINKS, AI_HERO } from '@/constants/ai';
import { aiHeroBanner } from '@/constants/media';
import { NavState } from './NavState';
import { StatsSection } from './StatsSection';
import { PulseSection } from './PulseSection';
import { DeliverSection } from './DeliverSection';
import { TouchpointsSection } from './TouchpointsSection';
import { ProductsSection } from './ProductsSection';
import { ApproachSection } from './ApproachSection';
import { ProofSection } from './ProofSection';
import { FaqSection } from './FaqSection';

export const metadata: Metadata = buildMetadata({
  title: 'AI Solutions for Atlassian | Pulse AI, Rovo & Agents | Clovity',
  description:
    'Pulse AI - our own free Jira copilot on the Atlassian Marketplace - plus AI-assisted triage, Confluence knowledge synthesis, Rovo enablement, custom agents, and AI readiness and governance, from an Atlassian Platinum Solution Partner.',
  path: ROUTES.expertise.ai,
  keywords: [
    'Atlassian AI',
    'Pulse AI Jira',
    'Jira AI copilot',
    'Atlassian Rovo enablement',
    'AI issue triage Jira',
    'Confluence AI summaries',
    'AI governance Atlassian',
  ],
});

/**
 * Regenerated every five minutes: the proof rail's case studies come from Strapi over Axios,
 * which doesn't participate in Next's fetch cache, so page-level ISR is what lets a newly
 * published case study appear here without a deploy.
 */
export const revalidate = 300;

export default async function AiPage() {
  const { caseStudies } = await getAiPageData();

  return (
    <>
      <NavState />

      {/* Breadcrumb JSON-LD is emitted by `BannerHero` from the same crumbs it renders,
          so only the Service graph is declared here. */}
      <JsonLd
        schema={serviceSchema({
          name: 'Atlassian AI Solutions',
          description:
            'AI for Atlassian platforms: Pulse AI, our own Jira copilot with chat, dashboards, org health, anomaly detection and smart alerts; AI-assisted issue triage and classification; Confluence knowledge synthesis; Atlassian Rovo enablement and adoption; custom AI agents and workflow automation; and AI readiness assessment and governance.',
          path: ROUTES.expertise.ai,
          serviceType: 'Artificial Intelligence Consulting',
        })}
      />

      {/* Solid white from first paint rather than transparent-then-solid: the hero below
          is full-bleed artwork, so a transparent header would have nothing stable to
          sit on. */}
      <Header variant="pill" priorityLogo />

      <PageAnimations>
        <main id="main-content">
          {/* One 2.32:1 graphic, so no tablet/mobile variants and no `imagePosition` -
              being narrower than the slot it crops vertically, and its subject is
              vertically centred so the `50% 50%` default keeps it. See `aiHeroBanner`
              in `constants/media.ts` for the crop and the contrast figures. */}
          <BannerHero
            breadcrumb={[...AI_HERO.crumbs]}
            heading={
              <>
                {AI_HERO.titleLead}
                <br />
                <HeroAccent>{AI_HERO.titleAccent}</HeroAccent>
              </>
            }
            subheading={AI_HERO.lead}
            image={aiHeroBanner}
          />

          <StatsSection />

          {/* Second, above the service grid: the product is the claim, and everything
              below it is easier to believe once a reader knows we ship one. */}
          <PulseSection />

          <DeliverSection />

          {/* Directly after the service grid, because a grid of six AI services is
              exactly what invites "so this is a silo you're selling me". */}
          <TouchpointsSection />

          <ProductsSection />

          <ApproachSection />

          {/* Server-rendered from the build-time/ISR snapshot. No browser refetch: a
              case study is not time-critical, and ISR at five minutes covers an edit. */}
          <ProofSection caseStudies={caseStudies} />

          <FaqSection />

          <FinalCta
            heading={
              <>
                {AI_FINAL_CTA.headingLead}
                <br />
                {AI_FINAL_CTA.headingTail}
              </>
            }
            description={AI_FINAL_CTA.description}
            ctas={AI_FINAL_CTA_LINKS}
            // White behind the card, matching every other interior page: this page
            // alternates only white and `bg-soft`, and the FAQ above ends on `bg-soft`.
            // The card keeps the darker interior-page gradient. `pullUp={false}` because
            // there is no section above for it to tuck into - it overlaps down into the
            // footer only, which `<Footer overlap>` reserves space for.
            className="bg-soft"
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
