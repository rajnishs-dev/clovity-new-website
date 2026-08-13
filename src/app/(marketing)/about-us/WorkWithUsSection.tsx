import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import {
  ArrowIcon,
  ButtonLink,
  GradientText,
  HEADING_CLASS,
  LABEL_CLASS,
  Section,
  SplitMedia,
  SplitMediaFrame,
  SUBHEADING_CLASS,
} from '@/components/ui';
import { ABOUT_WORK_WITH_US } from '@/constants/about';

/**
 * `reverse` moves the photo to the right column at `lg` while leaving it
 * first in the DOM, so on a phone it still sits above the copy.
 *
 * Reveal directions mirror "Who We Are" (media from the right, copy from the
 * left), so the two split sections read as a pair rather than a repeat.
 */
export function WorkWithUsSection() {
  return (
    <Section padding="tight" className="bg-[#eaf8ff]">
      <SplitMedia
        reverse
        media={
          <SplitMediaFrame
            image={ABOUT_WORK_WITH_US.image}
            revealFrom="right"
          />
        }
      >
        <div className={revealAligned('left', 'left')} {...revealAttrs()}>
          <p className={cn(LABEL_CLASS, 'mb-4')}>
            {ABOUT_WORK_WITH_US.label}
          </p>
          <h2 className={cn(HEADING_CLASS, 'mb-6')}>
            {ABOUT_WORK_WITH_US.headingLead}
            <GradientText>
              {ABOUT_WORK_WITH_US.headingHighlight}
            </GradientText>
          </h2>
          <p className={cn(SUBHEADING_CLASS, 'mb-6')}>
            {ABOUT_WORK_WITH_US.subheading}
          </p>
          <ButtonLink
            href={ABOUT_WORK_WITH_US.ctaHref}
            trailingIcon={<ArrowIcon />}
          >
            {ABOUT_WORK_WITH_US.ctaLabel}
          </ButtonLink>
        </div>
      </SplitMedia>
    </Section>
  );
}
