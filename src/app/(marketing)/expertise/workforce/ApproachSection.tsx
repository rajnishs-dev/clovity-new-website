import { ProcessTimeline } from '@/components/expertise';
import { GradientText, Section, SectionHeader } from '@/components/ui';
import { WF_APPROACH_CONTENT, WF_APPROACH_STEPS } from '@/constants/workforce';

/**
 * "From Requirement to Productive" - the five-step engagement flow.
 *
 * Uses the shared `ProcessTimeline`, which is the app's port of the comp's `tl-process`
 * numbered spine: it lays the steps out horizontally with a connecting rule at `md` and up,
 * rotates to a vertical spine below that, and prints the two-digit ordinal from
 * `ProcessStep.order` when a step has no icon - which is why `WF_APPROACH_STEPS` carries
 * no icons. The numbers ARE the content here.
 *
 * The header is centred rather than set in a left column beside the timeline. The comp puts
 * it in a 420px left column, but `ProcessTimeline` runs horizontally and needs the full
 * content track for five steps - squeezing it into the remaining space would drop it back
 * to a vertical list and lose the sense of a sequence, which is the only reason to use this
 * component instead of a plain list.
 */
export function ApproachSection() {
  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        heading={
          <>
            {WF_APPROACH_CONTENT.headingLead}
            <GradientText>{WF_APPROACH_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={WF_APPROACH_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-12 max-w-[700px] md:text-center"
      />

      <ProcessTimeline steps={WF_APPROACH_STEPS} />
    </Section>
  );
}
