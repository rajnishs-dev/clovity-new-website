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
 * The label carries a 13px override of `.s-label`'s 14px for this one
 * instance - reproduced with `text-[13px]` rather than normalized to the
 * shared scale, since it's a deliberate size on the page.
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
