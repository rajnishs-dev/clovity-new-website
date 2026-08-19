import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import {
  GradientText,
  HEADING_CLASS,
  Section,
  SUBHEADING_CLASS,
} from '@/components/ui';
import { ABOUT_MILESTONES, ABOUT_MILESTONES_CONTENT } from '@/constants/about';
import { MilestoneTimeline } from './MilestoneTimeline';

/**
 * "Milestones That Mark Our Progress" - copy on the left, a numbered vertical
 * timeline on the right at a `1fr 1.4fr` split.
 *
 * The timeline itself - the connecting spine, its scroll-driven fill, and the
 * chip colours - lives in `MilestoneTimeline`, a client component. See its
 * own docstring for how the fill is measured and why it replaced the flat
 * blue-to-grey gradient this section used to render statically.
 */
export function MilestonesSection() {
  return (
    <Section padding="tight" className="bg-white">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
        <div className={revealAligned('left', 'left')} {...revealAttrs()}>
          <h2 className={cn(HEADING_CLASS, 'mb-6')}>
            {ABOUT_MILESTONES_CONTENT.headingLead}
            <GradientText>
              {ABOUT_MILESTONES_CONTENT.headingHighlight}
            </GradientText>
          </h2>
          <p className={SUBHEADING_CLASS}>
            {ABOUT_MILESTONES_CONTENT.subheading}
          </p>
        </div>

        <MilestoneTimeline steps={ABOUT_MILESTONES} />
      </div>
    </Section>
  );
}
