import { ProcessTimeline } from '@/components/expertise';
import { GradientText, Section, SectionHeader } from '@/components/ui';
import { AI_APPROACH_CONTENT, AI_APPROACH_STEPS } from '@/constants/ai';

/**
 * "From Readiness to Adoption" - the five-step delivery flow.
 *
 * Uses the shared `ProcessTimeline`, the app's port of the comp's `hz-process` horizontal
 * stepper: five equal columns with a connecting rule at `md` and up, rotating to a vertical
 * spine below that, and printing the two-digit ordinal from `ProcessStep.order` when a step
 * carries no icon - which is why `AI_APPROACH_STEPS` has none. The numbers are the content.
 *
 * Same component and same centred-header treatment as `/expertise/workforce`'s approach
 * section. That is deliberate reuse rather than a missed chance to differentiate: a delivery
 * methodology is the one thing on an expertise page that genuinely is the same shape
 * everywhere, and giving each page its own stepper implementation is how five slightly
 * different steppers end up in one codebase.
 */
export function ApproachSection() {
  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        heading={
          <>
            {AI_APPROACH_CONTENT.headingLead}
            <GradientText>{AI_APPROACH_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={AI_APPROACH_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-12 max-w-[720px] md:text-center"
      />

      <ProcessTimeline steps={AI_APPROACH_STEPS} />
    </Section>
  );
}
