/**
 * Contact page.
 *
 * A faithful port of `contact.html`. Two things are wired to `clovity-admin` where the
 * source page had nothing behind them:
 *
 *  • THE FORM SUBMITS. The published handler called `preventDefault()` and revealed the
 *    thank-you panel — no message was ever sent. Submissions now write to Strapi
 *    (`contact-us` for the enquiry text, `get-in-touch-lead` for the structured
 *    fields), through a Server Action so the write token stays server-side.
 *  • ITS FIELDS ARE CONFIGURABLE. The `get-in-touch` row for the `contact` slug decides
 *    whether name, company and phone show and whether each is required.
 *
 * The eight offices stay bundled: `clovity-admin` has no location content type, and
 * postal addresses for a federal contractor should change through review rather than a
 * CMS field.
 */
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { ROUTES } from '@/constants/routes';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import {
  FinalCta,
  HeroAccent,
  JsonLd,
  PageAnimations,
  PageHero,
} from '@/components/common';
import { ContactSection } from './ContactSection';
import { OfficesSection } from './OfficesSection';
import { getContactFormConfig } from '@/data/contact';
import {
  CONTACT_FINAL_CTA,
  CONTACT_FINAL_CTA_LINKS,
  CONTACT_HERO,
} from '@/constants/contact';
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
 * Regenerated every hour.
 *
 * Longer than About and Careers because the only CMS-backed thing here is the form's
 * field configuration, which changes when someone deliberately reconfigures the form —
 * not on a content schedule. The submission path is a Server Action and is never
 * cached, so a stale page cannot mean a lost enquiry.
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
          <PageHero
            id="contact-hero"
            image={CONTACT_HERO.image}
            objectPosition={CONTACT_HERO.objectPosition}
            overlay={CONTACT_HERO.overlay}
            crumbs={[...CONTACT_HERO.crumbs]}
            crumbClassName="mb-[22px]"
            title={
              <>
                {CONTACT_HERO.titleLead}
                <br />
                <HeroAccent>{CONTACT_HERO.titleAccent}</HeroAccent>
              </>
            }
            titleClassName="mb-3.5 max-w-[700px]"
            lead={CONTACT_HERO.lead}
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
