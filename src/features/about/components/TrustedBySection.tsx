import type { ClientLogo } from '@/types/content';
import { Container, GradientText, SectionHeader } from '@/components/ui';
// Imported from the module, not `features/home/components` — that barrel re-exports
// every home section, and pulling it in here would drag the hero, the Pulse AI
// canvas and the GSAP timeline into this page's bundle for one marquee.
import { ClientMarquee } from '@/features/home/components/ClientMarquee';
import { ABOUT_TRUSTED_CONTENT } from '@/constants/about';

/**
 * The client-logo marquee, reused from the home page.
 *
 * Differences from that page, all of them the published design's:
 *  • the section is a `#f5f9ff → #ffffff` vertical gradient rather than flat
 *  • the edge fades match that gradient's top colour, not the home page's `#f7f9fc`
 *  • the pills are bare white — the border and shadow come from a `.trusted-sec
 *    .logo-pill` override that only the home page's stylesheet declares
 *  • no customer-story cards; this page shows the marquee alone
 *
 * `ClientMarquee` is imported from `features/home` rather than copied. It is the
 * same 23 logos from the same CDN, and duplicating it would mean two components to
 * keep in step every time the logo set changes.
 *
 * Not a `<Section>` because the marquee has to be full-bleed while the header stays
 * inside the 1280px track — one padding value cannot do both.
 */
export function TrustedBySection({ logos }: { logos: ClientLogo[] }) {
  return (
    <section className="bg-[linear-gradient(180deg,#f5f9ff_0%,#ffffff_100%)] py-8 sm:py-12">
      <Container className="mb-8">
        <SectionHeader
          label={ABOUT_TRUSTED_CONTENT.label}
          labelClassName="mb-3"
          heading={
            <>
              {ABOUT_TRUSTED_CONTENT.headingLead}
              <GradientText>
                {ABOUT_TRUSTED_CONTENT.headingHighlight}
              </GradientText>
            </>
          }
          className="md:text-center"
        />
      </Container>

      <ClientMarquee
        logos={logos}
        fadeColor={ABOUT_TRUSTED_CONTENT.fadeColor}
      />
    </section>
  );
}
