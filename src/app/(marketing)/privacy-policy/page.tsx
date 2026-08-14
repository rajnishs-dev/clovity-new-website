/**
 * A single Server Component page: hero banner + prose body pulled from
 * `constants/privacy.ts`. No CMS, no CTA - a legal page doesn't need one.
 * Only the header, hero reveal animation and `NavState` reach the browser
 * as JavaScript.
 */
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { ROUTES } from '@/constants/routes';
import { PRIVACY_HERO } from '@/constants/privacy';
import { privacyHeroBanner } from '@/constants/media';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { BannerHero, JsonLd, PageAnimations } from '@/components/common';
import { NavState } from './NavState';
import { PrivacyBody } from './PrivacyBody';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy Policy | Clovity',
  description:
    'How Clovity collects, uses, and protects the information you share with us on our website, at events, and through email communications.',
  path: ROUTES.legal.privacy,
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <NavState />
      <JsonLd schema={breadcrumbSchema([...PRIVACY_HERO.crumbs])} />

      <Header variant="pill" priorityLogo />

      <PageAnimations>
        <main id="main-content">
          <BannerHero
            breadcrumb={[...PRIVACY_HERO.crumbs]}
            heading={PRIVACY_HERO.title}
            subheading={PRIVACY_HERO.lead}
            image={privacyHeroBanner}
            imageAlt=""
          />

          <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-[1280px] px-6">
              <PrivacyBody />
            </div>
          </section>
        </main>
      </PageAnimations>

      <Footer />
    </>
  );
}
