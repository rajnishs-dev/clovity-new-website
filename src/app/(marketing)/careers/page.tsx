/**
 * Careers page.
 *
 * A faithful port of `careers.html`, with the two sections that should never have been
 * static wired to Strapi:
 *
 *  • OPEN POSITIONS reads the `job` collection. The published markup carries a comment
 *    on its role list — "wire up to a live ATS feed and swap in real req IDs when
 *    available" — and `clovity-admin` already has that collection; the legacy
 *    frontend's `/talent` page read it. The nine sample roles are kept as the offline
 *    fallback rather than deleted.
 *  • LIFE AT CLOVITY reads `life-at-clovity` for its heading, photo and intro.
 *
 * Everything else is bundled copy, which matches the source page.
 */
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { ROUTES } from '@/constants/routes';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowIcon } from '@/components/ui/Icon';
import {
  CareersHeroOrbs,
  FinalCta,
  HeroAccent,
  JsonLd,
  PageAnimations,
  PageHero,
} from '@/components/common';
import { BenefitsSection } from './BenefitsSection';
import { CultureSection } from './CultureSection';
import { FaqSection } from './FaqSection';
import { HiringProcessSection } from './HiringProcessSection';
import { OpenPositionsSection } from './OpenPositionsSection';
import { StatsSection } from './StatsSection';
import { WhySection } from './WhySection';
import { getCareersPageData } from '@/data/careers';
import {
  CAREERS_FINAL_CTA,
  CAREERS_FINAL_CTA_LINKS,
  CAREERS_HERO,
} from '@/constants/careers';
import { NavState } from './NavState';

export const metadata: Metadata = buildMetadata({
  title: 'Careers - Join Our Team | Clovity',
  description:
    'Build your career at Clovity, a San Francisco based Atlassian Platinum Solution Partner. Explore open roles across Atlassian, AI, DevSecOps, and ITSM, and see why our teams stay.',
  path: ROUTES.discover.careers,
  keywords: [
    'Clovity careers',
    'Atlassian consultant jobs',
    'remote Atlassian jobs',
    'DevSecOps engineer jobs',
  ],
});

/**
 * Regenerated every five minutes.
 *
 * Shorter-lived content than the About page's: an opening that has been filled should
 * stop showing quickly, and a new requisition should appear without a deploy. Strapi is
 * read over Axios, which does not participate in Next's fetch cache, so page-level ISR
 * is what bounds how stale the list can get.
 */
export const revalidate = 300;

export default async function CareersPage() {
  // `filters` is not passed down: the section derives its tabs from whichever job
  // list is currently on screen, which after the client refresh may not be this one.
  const { jobs, culture } = await getCareersPageData();

  return (
    <>
      <NavState />
      <JsonLd schema={breadcrumbSchema([...CAREERS_HERO.crumbs])} />

      <Header variant="opaque" priorityLogo />

      <PageAnimations>
        <main id="main-content">
          <PageHero
            id="careers-hero"
            image={CAREERS_HERO.image}
            objectPosition={CAREERS_HERO.objectPosition}
            overlay={CAREERS_HERO.overlay}
            orbs={<CareersHeroOrbs />}
            crumbs={[...CAREERS_HERO.crumbs]}
            crumbClassName="mb-[18px]"
            title={
              <>
                {CAREERS_HERO.titleLead}
                <HeroAccent>{CAREERS_HERO.titleAccent}</HeroAccent>
              </>
            }
            titleClassName="mb-3 max-w-[740px]"
            lead={CAREERS_HERO.lead}
            leadClassName="mb-3"
            actions={
              <>
                <ButtonLink
                  href={CAREERS_HERO.openRolesAnchor}
                  trailingIcon={<ArrowIcon />}
                >
                  View Open Positions
                </ButtonLink>
                {/*
                  The published markup overrides `.btn-secondary`'s brand border and
                  text with an inline `style` — white text on a 30%-white border, so
                  the button reads against the dark photo. Inline here too, because an
                  inline style is what the original used and a class could not have
                  won against it if any were added later.
                */}
                <ButtonLink
                  href={CAREERS_HERO.cultureAnchor}
                  variant="secondary"
                  style={{ borderColor: 'rgba(255,255,255,.3)', color: '#fff' }}
                >
                  Life at Clovity
                </ButtonLink>
              </>
            }
          />

          <WhySection />

          <StatsSection />

          {/* `initial…` is the build-time snapshot; both sections refetch in the
              browser so a CMS change lands without waiting for ISR. */}
          <CultureSection initialHighlight={culture} />

          <BenefitsSection />

          <HiringProcessSection />

          <OpenPositionsSection initialJobs={jobs} />

          <FaqSection />

          <FinalCta
            heading={
              <>
                {CAREERS_FINAL_CTA.headingLead}
                <br />
                {CAREERS_FINAL_CTA.headingTail}
              </>
            }
            description={CAREERS_FINAL_CTA.description}
            ctas={CAREERS_FINAL_CTA_LINKS}
            className="bg-[#f8faff]"
            cardClassName="-mt-0 bg-[linear-gradient(135deg,#152a6b_0%,#2557c9_65%,#3568e0_100%)]"
            headingClassName="text-[clamp(28px,3.6vw,44px)] leading-[1.12]"
            pullUp={false}
            flourish={false}
          />
        </main>
      </PageAnimations>

      <Footer overlap className="pt-[220px]" />
    </>
  );
}
