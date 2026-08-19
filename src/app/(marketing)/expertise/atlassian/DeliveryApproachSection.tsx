import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { ProcessTimeline } from '@/components/expertise';
import {
  ATLASSIAN_APPROACH_CONTENT,
  ATLASSIAN_APPROACH_STEPS,
} from '@/constants/expertise/atlassian';

export function DeliveryApproachSection() {
  return (
    <Section className="bg-white">
      <SectionHeader
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {ATLASSIAN_APPROACH_CONTENT.headingLead}
            <GradientText>
              {ATLASSIAN_APPROACH_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
      />
      <ProcessTimeline steps={ATLASSIAN_APPROACH_STEPS} className="mt-14" />
    </Section>
  );
}
