/**
 * Contact page - a port of `contact.html`. Two things are now wired to `clovity-admin`
 * where the source page had nothing: the form actually submits (writes to Strapi via a
 * Server Action, so the write token stays server-side), and its fields are configurable
 * through the `get-in-touch` row for the `contact` slug.
 *
 * The eight offices stay bundled copy: no location content type exists, and postal
 * addresses for a federal contractor should change through review, not a CMS field.
 */
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
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
import { ContactSection } from './ContactSection';
import { OfficesSection } from './OfficesSection';
import { getContactFormConfig } from '@/data/contact';
import {
  CONTACT_FINAL_CTA,
  CONTACT_FINAL_CTA_LINKS,
  CONTACT_HERO,
} from '@/constants/contact';
import {
  contactHeroBanner,
  contactHeroBannerTablet,
  contactHeroBannerMobile,
} from '@/constants/media';
import { NavState } from './NavState';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Clovity - Talk to an Atlassian & AI Expert',
  description:
    "Get in touch with Clovity's Atlassian, AI and cloud specialists. Share your project and the right delivery team will follow up within one business day.",
  path: ROUTES.discover.contact,
  keywords: [
    'contact Clovity',
    'Atlassian partner contact',
    'Clovity offices',
    'Atlassian consulting enquiry',
  ],
});

/**
 * Regenerated every hour - longer than About/Careers since the only CMS-backed content
 * here is the form config, which changes by deliberate reconfiguration, not on a
 * schedule. Submissions go through a Server Action and are never cached.
 */
export const revalidate = 3600;

export default async function ContactPage() {
  const formConfig = await getContactFormConfig();

  return (
    <>
      <NavState />
      <JsonLd schema={breadcrumbSchema([...CONTACT_HERO.crumbs])} />

      <Header variant="pill" priorityLogo />

      <PageAnimations>
        <main id="main-content">
          <BannerHero
            breadcrumb={[...CONTACT_HERO.crumbs]}
            heading={
              <>
                {CONTACT_HERO.titleLead}
                <br />
                <HeroAccent>{CONTACT_HERO.titleAccent}</HeroAccent>
              </>
            }
            subheading={CONTACT_HERO.lead}
            image={contactHeroBanner}
            imageTablet={contactHeroBannerTablet}
            imageMobile={contactHeroBannerMobile}
          />

          <ContactSection config={formConfig} />

          <OfficesSection />

          <FinalCta
            heading={
              <>
                {CONTACT_FINAL_CTA.headingLead}
                <br />
                {CONTACT_FINAL_CTA.headingTail}
              </>
            }
            description={CONTACT_FINAL_CTA.description}
            ctas={CONTACT_FINAL_CTA_LINKS}
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
