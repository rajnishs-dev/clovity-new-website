import { GradientText, Section, SectionHeader } from '@/components/ui';
import { WF_DELIVER_CONTENT, WF_OFFERINGS } from '@/constants/workforce';
import { DeliverRail } from './DeliverRail';

/**
 * "Capacity, and the Capability to Replace It" - a card rail.
 *
 * Same tilted colour-tile treatment as the ITSM, Managed Services and DevSecOps
 * pages' `DeliverSection`: default face is the coloured tile with the title and
 * a ghosted icon, and it turns over on hover/focus to a white, heavily bordered
 * face carrying the description and the three deliverables. All six services
 * are kept rather than trimmed to the four that fit on screen - the rail
 * scrolls for the rest (see `DeliverRail`).
 *
 * Replaces the two-group spine list this section used before - `WF_OFFERINGS`
 * split into "Add capacity" (2) then "Build capability" (4) under their own
 * labelled headings, with a connecting line down the middle. That ordering
 * argument still holds in the data (`WF_OFFERINGS` is still built capacity-first
 * in `constants/workforce.ts`), it is just no longer restated as a visible
 * group break, to match the flat six-card rail every other "what we deliver"
 * section on this site now uses.
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
            {WF_DELIVER_CONTENT.headingLead}
            <GradientText>{WF_DELIVER_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={WF_DELIVER_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[730px] md:text-center"
      />

      <DeliverRail offerings={WF_OFFERINGS} />
    </Section>
  );
}
