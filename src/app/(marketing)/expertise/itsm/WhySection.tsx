import {
  GradientText,
  PillarGrid,
  Section,
  SectionHeader,
} from '@/components/ui';
import { ITSM_WHY_CARDS, ITSM_WHY_CONTENT } from '@/constants/itsm';

/**
 * "Three Reasons Teams Bring Us Their Service Desk" - the three-across value-prop
 * row, using the same `PillarGrid` as About's "Why Clovity" and Careers' "Why
 * build your career here".
 */
export function WhySection() {
  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        heading={
          <>
            {ITSM_WHY_CONTENT.headingLead}
            <GradientText>{ITSM_WHY_CONTENT.headingHighlight}</GradientText>
          </>
        }
        className="mx-auto mb-10 max-w-[680px] md:text-center"
      />
      <PillarGrid cards={ITSM_WHY_CARDS} />
    </Section>
  );
}
