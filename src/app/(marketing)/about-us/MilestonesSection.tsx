import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import {
  GradientText,
  HEADING_CLASS,
  LABEL_CLASS,
  Section,
  SUBHEADING_CLASS,
} from '@/components/ui';
import {
  ABOUT_MILESTONES,
  ABOUT_MILESTONES_CONTENT,
} from '@/constants/about';

/**
 * "Milestones That Mark Our Progress" — copy on the left, a numbered vertical
 * timeline on the right at a `1fr 1.4fr` split.
 *
 * THE SPINE IS THE PART WORTH READING. `theme.css` draws it with
 * `.tl-step:not(:last-child)::before` — absolutely positioned at `left: 27px`,
 * starting at `top: 56px` (immediately under the 56px number chip) and running to the
 * step's bottom edge. Three consequences the Tailwind version has to preserve:
 *
 *  • `left-[27px]`, not `left-7`. 27px is the chip's 56px halved minus the rule's own
 *    2px halved — one pixel off and the line misses the centre of the chip above it.
 *  • it hangs off the STEP, not the container, so its length follows that step's own
 *    height. A single full-height line behind the column would overshoot the last
 *    chip.
 *  • the last step must not draw one, which is `[&:not(:last-child)]:before:…`.
 *
 * The gradient fades `#2563eb → #e2e8f0` downward, so the spine reads as brand blue
 * at the top and dissolves toward the next step.
 */
export function MilestonesSection() {
  return (
    <Section padding="tight" className="bg-white">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr]">
        <div className={revealAligned('left', 'left')} {...revealAttrs()}>
          <p className={cn(LABEL_CLASS, 'mb-4')}>
            {ABOUT_MILESTONES_CONTENT.label}
          </p>
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

        <div
          className={cn('relative', revealAligned('left', 'right'))}
          {...revealAttrs()}
        >
          {ABOUT_MILESTONES.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'relative grid grid-cols-[56px_1fr] gap-6 pb-10 last:pb-0',
                // The connecting spine. See the note above for why 27px / 56px.
                '[&:not(:last-child)]:before:absolute [&:not(:last-child)]:before:bottom-0',
                '[&:not(:last-child)]:before:left-[27px] [&:not(:last-child)]:before:top-[56px]',
                '[&:not(:last-child)]:before:w-[2px] [&:not(:last-child)]:before:bg-grad-spine',
                '[&:not(:last-child)]:before:content-[""]',
              )}
            >
              <div className="z-[1] flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-2xl bg-grad-brand text-[20px] font-900 text-white shadow-[0_10px_24px_rgba(37,99,235,.28)]">
                {index + 1}
              </div>
              <div>
                <span className="mb-2.5 inline-block text-[11.5px] font-800 uppercase tracking-[.08em] text-brand-600">
                  {step.eyebrow}
                </span>
                <b className="mb-1.5 block text-[18px] font-500 text-title">
                  {step.title}
                </b>
                <p className="m-0 text-[15px] leading-[1.7] text-muted">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
