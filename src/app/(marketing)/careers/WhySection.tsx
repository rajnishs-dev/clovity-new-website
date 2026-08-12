import {
  GradientText,
  PillarGrid,
  Section,
  SectionHeader,
} from '@/components/ui';
import { CAREERS_WHY_CARDS, CAREERS_WHY_CONTENT } from '@/constants/careers';

/** "Three Reasons Our Teams Stay and Grow" - the same `.why-grid` the About page uses. */
export function WhySection() {
  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        label={CAREERS_WHY_CONTENT.label}
        labelClassName="mb-4"
        heading={
          <>
            {CAREERS_WHY_CONTENT.headingLead}
            <GradientText>{CAREERS_WHY_CONTENT.headingHighlight}</GradientText>
          </>
        }
        className="mx-auto mb-8 max-w-[680px] md:text-center"
      />
      <PillarGrid cards={CAREERS_WHY_CARDS} />
    </Section>
  );
}
