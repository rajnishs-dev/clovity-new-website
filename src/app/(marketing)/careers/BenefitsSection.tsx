import {
  BentoGrid,
  GradientText,
  Section,
  SectionHeader,
} from '@/components/ui';
import {
  CAREERS_BENEFITS,
  CAREERS_BENEFITS_CONTENT,
} from '@/constants/careers';

/**
 * "What You Get For Doing Great Work" - the four-tile bento grid.
 *
 * `#eaf8ff` here, not the About page's `#f8fafc`: this page alternates its banded
 * sections between that pale blue and white, which is what keeps the roles list
 * further down visually grouped with the benefits rather than the FAQ.
 */
export function BenefitsSection() {
  return (
    <Section padding="tight" className="border-y border-line-faint bg-soft">
      <SectionHeader
        labelClassName="mb-4"
        heading={
          <>
            {CAREERS_BENEFITS_CONTENT.headingLead}
            <GradientText>
              {CAREERS_BENEFITS_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        className="mx-auto mb-8 max-w-[680px] md:text-center"
      />
      <BentoGrid tiles={CAREERS_BENEFITS} />
    </Section>
  );
}
