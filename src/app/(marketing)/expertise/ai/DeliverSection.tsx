import {
  BentoGrid,
  GradientText,
  Section,
  SectionHeader,
} from '@/components/ui';
import { AI_DELIVER_CONTENT, AI_OFFERINGS } from '@/constants/ai';

/**
 * "Six Places AI Earns Its Keep in an Atlassian Estate" - the six sub-services.
 *
 * Uses the shared `BentoGrid`, which is the app's port of `theme.css`'s `.bento-grid` and the
 * shape this page's comp specifies here. Reusing it rather than hand-rolling a grid also means
 * this section inherits the ≤900px two-column step that a plain `grid-cols-3 → grid-cols-1`
 * collapse would skip.
 *
 * ── ONE THING THE PORTED COMPONENT DOES NOT DO ──
 * The comp's first tile is `.bento-tile--lg`, a double-width feature tile for "Enterprise AI
 * Strategy". `BentoGrid` renders every tile at `col-span-2` uniformly, so there is no large
 * tile here and the grid reads as an even 2x3. That is the better outcome on this page anyway:
 * the feature slot would have gone to Pulse AI, which already has the full section directly
 * above this one. Emphasising it a third time in the grid would be repetition, not hierarchy.
 */
export function DeliverSection() {
  return (
    <Section padding="tight" className="border-y border-line-faint bg-soft">
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

      <BentoGrid tiles={AI_OFFERINGS} />
    </Section>
  );
}
