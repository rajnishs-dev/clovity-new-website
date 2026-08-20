import { GradientText, Section, SectionHeader } from '@/components/ui';
import { ITSM_DELIVER_CONTENT, ITSM_OFFERINGS } from '@/constants/itsm';
import { DeliverRail } from './DeliverRail';

/**
 * "Six Engagements That Make Up a Working Service Desk" - a card rail.
 *
 * ── WHAT THIS REPLACED ──
 * A full-width service index: six rows in one bordered panel with the deliverables
 * in their own column. Scannable, but flat. The cards are the requested treatment -
 * tilted colour tiles that straighten and turn over to a white, heavily bordered
 * face carrying the description and the three deliverables.
 *
 * All six engagements are kept rather than trimmed to the four that fit on screen:
 * the heading says "six", and dropping two would make the heading false. Four are
 * visible and the rail scrolls - see `DeliverRail`.
 *
 * Stays a Server Component. Only the rail's two arrow buttons need JavaScript, and
 * they live inside `DeliverRail`.
 */
export function DeliverSection() {
  return (
    // `bg-[#eaf8ff]`, with no `border-y`.
    //
    // The sections either side are both white, so this is a deliberate `#f8fafc`
    // band rather than part of a strict alternation. The border is left off on
    // purpose: the tone change already marks the edges, and adding rules on top
    // gave the seams a doubled look.
    <Section padding="tight" className="bg-[#eaf8ff]">
      <SectionHeader
        heading={
          <>
            {ITSM_DELIVER_CONTENT.headingLead}
            <GradientText>{ITSM_DELIVER_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={ITSM_DELIVER_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[720px] md:text-center"
      />

      {/* Spread because `ITSM_OFFERINGS` is a readonly array and the rail takes a
          mutable one - a Client Component boundary needs a plain serialisable value. */}
      <DeliverRail offerings={[...ITSM_OFFERINGS]} />
    </Section>
  );
}
