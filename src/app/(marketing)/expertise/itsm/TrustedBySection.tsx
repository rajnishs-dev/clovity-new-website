import type { ClientLogo } from '@/types/content';
import { Container, GradientText, SectionHeader } from '@/components/ui';
import { ClientMarquee } from '@/components/common/ClientMarquee';
import { ITSM_TRUSTED_CONTENT } from '@/constants/itsm';

/**
 * The client-logo marquee, same treatment as the About page's: bare white pills
 * (no home-page-only border/shadow override) with edge fades matched to this
 * section's own background.
 *
 * Not a `<Section>` because the marquee is full-bleed while the header stays
 * inside the 1280px track.
 */
export function TrustedBySection({ logos }: { logos: ClientLogo[] }) {
  return (
    // White, so the page keeps alternating white / `bg-soft`. The marquee's edge
    // fades read `ITSM_TRUSTED_CONTENT.fadeColor`, which must match this background
    // or the loop seam shows as a pale band - it was changed to `#ffffff` alongside.
    <section className="bg-white py-8 sm:py-12">
      <Container className="mb-8 max-w-[767px]">
        <SectionHeader
          heading={
            <>
              {ITSM_TRUSTED_CONTENT.headingLead}
              <GradientText>
                {ITSM_TRUSTED_CONTENT.headingHighlight}
              </GradientText>
            </>
          }
          className="md:text-center"
        />
      </Container>

      <ClientMarquee logos={logos} fadeColor={ITSM_TRUSTED_CONTENT.fadeColor} />
    </section>
  );
}
