
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


export const revalidate = 300;

export default async function AiPage() {
  const { caseStudies } = await getAiPageData();

  return (
    <>
      <NavState />
      <JsonLd
        schema={serviceSchema({
          name: 'Atlassian AI Solutions',
          description:
            'AI for Atlassian platforms: Pulse AI, our own Jira copilot with chat, dashboards, org health, anomaly detection and smart alerts; AI-assisted issue triage and classification; Confluence knowledge synthesis; Atlassian Rovo enablement and adoption; custom AI agents and workflow automation; and AI readiness assessment and governance.',
          path: ROUTES.expertise.ai,
          serviceType: 'Artificial Intelligence Consulting',
        })}
      />

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

          <FaqSection />
          <ProofSection caseStudies={caseStudies} />

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
            // alternates only white and `bg-[#eaf8ff]`, and the FAQ above ends on `bg-[#eaf8ff]`.
            // The card keeps the darker interior-page gradient. `pullUp={false}` because
            // there is no section above for it to tuck into - it overlaps down into the
            // footer only, which `<Footer overlap>` reserves space for.
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
