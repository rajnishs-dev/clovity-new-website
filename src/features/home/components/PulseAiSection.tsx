import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import { Chip } from '@/components/ui/Chip';
import { GradientText } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { CtaGroup } from '@/components/common/CTA';
import {
  PULSE_AI_CAPABILITIES,
  PULSE_AI_CONTENT,
  PULSE_AI_CTAS,
} from '@/constants/home';
import { PulseSphere } from './PulseSphere';

/**
 * Section 1.5 — the Pulse AI spotlight, as Tailwind utilities.
 *
 * `scroll-mt-[250px]` replaces the legacy `#pulse-ai-spotlight
 * { scroll-margin-top: 250px }`, which existed so the hero's scroll cue lands
 * below the fixed header rather than under it.
 *
 * Below 768px the section becomes a column and the sphere moves *after* the copy
 * (`order-2` / `order-1`) — the legacy `@media (max-width: 767px)` behaviour, kept
 * exactly, because on a narrow screen a decorative canvas above the headline just
 * pushes the message off-screen.
 *
 * One correctness fix carried over: the heading was a bare `<div>` in the original,
 * which left this section absent from the document outline. It is an `<h2>` here
 * with the same type scale.
 */
export function PulseAiSection() {
  return (
    <section
      id="pulse-ai-spotlight"
      className="relative scroll-mt-[250px] px-6 py-12 lg:py-16 overflow-hidden bg-[#eaf8ff] text-body to-1024:flex to-1024:flex-col"
    >
      <PulseSphere />

      <div className="relative z-10 mx-auto max-w-shell to-1024:order-1">
        <div
          // `reveal()` bakes in `md:text-left` — this column has to stay
          // centered through the whole stacked range (up to `lg`, where the
          // sphere has room beside it again), so `to-1024:text-center` has to
          // come after it to win. `to-1024:mx-auto` centers the block itself,
          // since the inline `maxWidth` below stops it from filling the row.
          className={cn(reveal('left'), 'to-1024:mx-auto to-1024:text-center')}
          {...revealAttrs()}
          // Capped so the copy reads well beside the sphere bleeding off the edge.
          style={{ maxWidth: '850px' }}
        >
          <h2 className="mb-[18px] text-[clamp(30px,3.2vw,46px)] font-normal leading-[1.08] tracking-[-0.03em] text-ink">
            {PULSE_AI_CONTENT.headingLead}
            <GradientText>{PULSE_AI_CONTENT.headingHighlight}</GradientText>
            {PULSE_AI_CONTENT.headingTail}
          </h2>

          <p className="mb-0 text-[18px] leading-[1.8] text-black">
            <span className="text-[21px] font-bold">
              {PULSE_AI_CONTENT.productName}
            </span>
            {PULSE_AI_CONTENT.description}
          </p>

          <div
            // `text-center` above only centers inline content — these chips
            // are a flex row, so it needs its own `justify-center`.
            className="mt-6 flex flex-wrap gap-2.5 to-1024:justify-center"
            aria-label="Pulse AI capabilities"
          >
            {PULSE_AI_CAPABILITIES.map((capability) => (
              <Chip
                key={capability.id}
                variant="a"
                icon={<Icon name={capability.icon} />}
              >
                {capability.label}
              </Chip>
            ))}
          </div>

          <CtaGroup
            ctas={PULSE_AI_CTAS}
            className="mt-7 flex flex-wrap gap-[13px] to-1024:justify-center"
          />
        </div>
      </div>
    </section>
  );
}
