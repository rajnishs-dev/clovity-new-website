import { GradientText, PillarGrid, Section, SectionHeader } from '@/components/ui';
import { MS_BURDEN_CARDS, MS_BURDEN_CONTENT } from '@/constants/managed-services';

/**
 * "Nobody Was Hired to Administer Jira" - what goes wrong when platform
 * ownership is a side job, as three cards.
 *
 * Used to close with a before/after shift strip ("Reactive → Proactive" etc.)
 * pulled from Clovity's own published page. Removed along with `MS_SHIFTS` in
 * `constants/managed-services.ts` - the cards now make the point on their own.
 */
export function BurdenSection() {
  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        heading={
          <>
            {MS_BURDEN_CONTENT.headingLead}
            <GradientText>{MS_BURDEN_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={MS_BURDEN_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[720px] md:text-center"
      />

      <PillarGrid cards={MS_BURDEN_CARDS} />
    </Section>
  );
}
