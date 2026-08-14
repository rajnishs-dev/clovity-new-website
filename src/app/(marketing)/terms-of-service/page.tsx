/**
 * A single Server Component page: hero banner + prose body pulled from
 * `TermsBody`. No CMS, no CTA - a legal page doesn't need one. Only the
 * header, hero reveal animation and `NavState` reach the browser as
 * JavaScript.
 */
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbSchema } from '@/lib/schema';
import { ROUTES } from '@/constants/routes';
import { TERMS_HERO } from '@/constants/terms';
import { termsHeroBanner } from '@/constants/media';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { BannerHero, JsonLd, PageAnimations } from '@/components/common';
import { NavState } from './NavState';
import { TermsBody } from './TermsBody';

export const metadata: Metadata = buildMetadata({
  title: 'Terms of Service | Clovity',
  description:
    'The terms and conditions that govern your access to and use of the Clovity website.',
  path: ROUTES.legal.terms,
});

export default function TermsOfServicePage() {
  return (
    <>
      <NavState />
      <JsonLd schema={breadcrumbSchema([...TERMS_HERO.crumbs])} />

      <Header variant="pill" priorityLogo />

      <PageAnimations>
        <main id="main-content">
          <BannerHero
            breadcrumb={[...TERMS_HERO.crumbs]}
            heading={TERMS_HERO.title}
            subheading={TERMS_HERO.lead}
            image={termsHeroBanner}
            imageAlt=""
          />

          <section className="bg-white py-16 sm:py-20">
            <div className="mx-auto max-w-[1280px] px-6">
              <TermsBody />
            </div>
          </section>
        </main>
      </PageAnimations>

      <Footer />
    </>
  );
}
