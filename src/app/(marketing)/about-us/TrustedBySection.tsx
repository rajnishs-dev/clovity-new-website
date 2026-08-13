import type { ClientLogo } from '@/types/content';
import { Container, GradientText, SectionHeader } from '@/components/ui';
// Lives in `components/common`, not the home page's folder, since two pages render it.
import { ClientMarquee } from '@/components/common/ClientMarquee';
import { ABOUT_TRUSTED_CONTENT } from '@/constants/about';

/**
 * The client-logo marquee, reused from the home page, with a few differences:
 * a vertical gradient background instead of flat, matching edge fades, bare
 * white pills (no home-page-only border/shadow override), and no story cards.
 *
 * Not a `<Section>` because the marquee needs to be full-bleed while the
 * header stays inside the 1280px track.
 */
export function TrustedBySection({ logos }: { logos: ClientLogo[] }) {
  return (
    <section className="bg-[#eaf8ff] py-8 sm:py-12">
      <Container className="mb-8 max-w-[767px]">
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
