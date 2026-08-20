import { GradientText, Section, SectionHeader } from '@/components/ui';
import { MS_DELIVER_CONTENT, MS_OFFERINGS } from '@/constants/managed-services';
import { DeliverRail } from './DeliverRail';

/**
 * "Six Things Someone Has to Do Every Week" - a card rail.
 *
 * Same tilted colour-tile treatment as the ITSM page's `DeliverSection`: default
 * face is the coloured tile with the title and a ghosted icon, and it turns over
 * on hover/focus to a white, heavily bordered face carrying the description and
 * the three deliverables. All six areas are kept rather than trimmed to the four
 * that fit on screen - the heading says "six", and the rail scrolls for the rest
 * (see `DeliverRail`).
 *
 * Stays a Server Component. Only the rail's two arrow buttons need JavaScript,
 * and they live inside `DeliverRail`.
 */
export function DeliverSection() {
  return (
    <Section
      padding="tight"
      className="border-y border-line-faint bg-[#eaf8ff]"
    >
      <SectionHeader
        heading={
          <>
            {MS_DELIVER_CONTENT.headingLead}
            <GradientText>{MS_DELIVER_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={MS_DELIVER_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[730px] md:text-center"
      />

      <DeliverRail offerings={MS_OFFERINGS} />
    </Section>
  );
}
