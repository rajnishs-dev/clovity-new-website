import {
  GradientText,
  PillarGrid,
  Section,
  SectionHeader,
} from '@/components/ui';
import { ABOUT_WHY_CARDS, ABOUT_WHY_CONTENT } from '@/constants/about';

/**
 * `padding="tight"` matches this page throughout (the home page's sections
 * are one step looser).
 *
 * `md:text-center` isn't redundant: `SectionHeader` composes `reveal()`,
 * whose base string ends in `md:text-left`, so centering must be restated at
 * `md` to win the cascade.
 */
export function WhySection() {
  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        labelClassName="mb-4"
        heading={
          <>
            {ABOUT_WHY_CONTENT.headingLead}
            <GradientText>{ABOUT_WHY_CONTENT.headingHighlight}</GradientText>
          </>
        }
        className="mx-auto mb-8 max-w-[680px] md:text-center"
      />
      <PillarGrid cards={ABOUT_WHY_CARDS} />
    </Section>
  );
}
