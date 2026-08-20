import { GradientText, Section, SectionHeader } from '@/components/ui';
import {
  DEVSECOPS_DELIVER_CONTENT,
  DEVSECOPS_OFFERINGS,
} from '@/constants/devsecops';
import { DeliverRail } from './DeliverRail';

/**
 * "Six Pieces of a Secure Delivery Practice" - a card rail.
 *
 * Same tilted colour-tile treatment as the ITSM and Managed Services pages'
 * `DeliverSection`: default face is the coloured tile with the title and a
 * ghosted icon, and it turns over on hover/focus to a white, heavily bordered
 * face carrying the description and the three deliverables. All six pieces are
 * kept rather than trimmed to the four that fit on screen - the heading says
 * "six", and the rail scrolls for the rest (see `DeliverRail`).
 *
 * Stays a Server Component. Only the rail's two arrow buttons need JavaScript,
 * and they live inside `DeliverRail`.
 */
export function DeliverSection() {
  return (
    <Section padding="tight" className="border-y border-line-faint bg-white">
      <SectionHeader
        heading={
          <>
            {DEVSECOPS_DELIVER_CONTENT.headingLead}
            <GradientText>
              {DEVSECOPS_DELIVER_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        subheading={DEVSECOPS_DELIVER_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[720px] md:text-center"
      />

      <DeliverRail offerings={DEVSECOPS_OFFERINGS} />
    </Section>
  );
}
