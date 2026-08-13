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
 * `scroll-mt-[250px]` keeps the hero's scroll cue landing below the fixed
 * header rather than under it.
 *
 * Below 768px the sphere moves after the copy (`order-2` / `order-1`) so a
 * decorative canvas above the headline doesn't push the message off-screen.
 */
export function PulseAiSection() {
  return (
    <section
      id="pulse-ai-spotlight"
      className="relative scroll-mt-[250px] py-12 lg:py-16 overflow-hidden bg-[#eaf8ff] text-body to-1024:flex to-1024:flex-col"
    >
      <PulseSphere />

      <div className="relative z-10 mx-auto max-w-shell to-1024:order-1 px-6">
        <div
          // `reveal()` bakes in `md:text-left`, so `to-1024:text-center` has
          // to come after it to win through the stacked range. `to-1024:mx-auto`
          // centers the block since the inline `maxWidth` stops it filling the row.
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
            // `text-center` above only centers inline content - these chips
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
