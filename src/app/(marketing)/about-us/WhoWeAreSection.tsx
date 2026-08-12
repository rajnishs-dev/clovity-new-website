import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import {
  GradientText,
  HEADING_CLASS,
  LABEL_CLASS,
  Section,
  SplitMedia,
  SplitMediaFrame,
} from '@/components/ui';
import { ABOUT_WHO_CONTENT } from '@/constants/about';

/**
 * "A Delivery Partner Built for Regulated, High-Stakes Teams" - photo left, copy
 * right, the standard `.split-media` layout.
 *
 * The label here carries an inline `font-size: 13px` in the published markup, which
 * overrides `.s-label`'s 14px for this one instance. Reproduced with `text-[13px]`
 * rather than "corrected" to the shared scale - it is a deliberate size on the page
 * and the migration is not the place to normalise it.
 *
 * `.who-sec p` sets 16px / 1.75 / `#1e293b` with a 14px bottom margin and none on the
 * last paragraph, which is `last:mb-0`.
 */
export function WhoWeAreSection() {
  return (
    <Section padding="tight" className="bg-white">
      <SplitMedia
        media={
          <SplitMediaFrame
            image={ABOUT_WHO_CONTENT.image}
            revealFrom="left"
          />
        }
      >
        <div className={revealAligned('left', 'right')} {...revealAttrs()}>
          <p className={cn(LABEL_CLASS, 'mb-4 text-[13px]')}>
            {ABOUT_WHO_CONTENT.label}
          </p>
          <h2 className={cn(HEADING_CLASS, 'mb-6')}>
            {ABOUT_WHO_CONTENT.headingLead}
            <GradientText>{ABOUT_WHO_CONTENT.headingHighlight}</GradientText>
          </h2>
          {ABOUT_WHO_CONTENT.paragraphs.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="mb-3.5 text-[16px] leading-[1.75] text-muted last:mb-0"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </SplitMedia>
    </Section>
  );
}
