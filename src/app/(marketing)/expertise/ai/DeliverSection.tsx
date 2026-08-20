import { GradientText, Section, SectionHeader } from '@/components/ui';
import { AI_DELIVER_CONTENT, AI_OFFERINGS } from '@/constants/ai';
import { DeliverRail } from './DeliverRail';

/**
 * "Six Places AI Earns Its Keep in an Atlassian Estate" - a card rail.
 *
 * Same tilted colour-tile treatment as the ITSM, Managed Services and DevSecOps
 * pages' `DeliverSection`: default face is the coloured tile with the title and
 * a ghosted icon, and it turns over on hover/focus to a white, heavily bordered
 * face - here carrying just the description, since `AI_OFFERINGS` is
 * `BentoTile[]` with no `points` to list (see the note in `DeliverRail`). All
 * six places are kept rather than trimmed to the four that fit on screen - the
 * heading says "six", and the rail scrolls for the rest.
 *
 * Replaces the shared `BentoGrid` this section used before: that rendered a
 * static 2x3 grid of title-plus-sentence tiles, which read flatter than the
 * treatment the other three "what we deliver" sections now use.
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
            {AI_DELIVER_CONTENT.headingLead}
            <GradientText>{AI_DELIVER_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={AI_DELIVER_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[740px] md:text-center"
      />

      <DeliverRail offerings={AI_OFFERINGS} />
    </Section>
  );
}
