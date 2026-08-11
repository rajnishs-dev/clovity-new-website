import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import {
  GradientText,
  Icon,
  Section,
  SectionHeader,
} from '@/components/ui';
import {
  CAREERS_HIRING_STEPS,
  CAREERS_PROCESS_CONTENT,
} from '@/constants/careers';

/**
 * "A Straightforward, Five-Step Hiring Process".
 *
 * Five columns at desktop, two below 1024px, one below 560px. Five equal columns is
 * unusually tight, which is why the cards drop to 13.5px body copy — that is the
 * design's own value, not a compression.
 *
 * THE WATERMARK ORDINAL is the detail that makes these cards work: a 66px display
 * numeral in `#f1f5f9`, positioned 10px ABOVE the card's top edge so it is clipped by
 * `overflow-hidden`. It sits at `z-0` with the icon, title and copy at `z-1` over it,
 * and warms to `#dbeafe` on hover. `select-none` and `aria-hidden` because it is
 * decoration — the step's meaning is its title, and a screen reader announcing "zero
 * one" before "Apply" adds nothing.
 *
 * ICON SIZE — 23px in a 44px chip (~52%), where the published markup said 18px. See
 * `components/ui/PillarGrid` for why the ratio changed with the move to Lucide.
 */
export function HiringProcessSection() {
  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        label={CAREERS_PROCESS_CONTENT.label}
        labelClassName="mb-4"
        heading={
          <>
            {CAREERS_PROCESS_CONTENT.headingLead}
            <GradientText>
              {CAREERS_PROCESS_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        className="mx-auto mb-12 max-w-[680px] md:text-center"
      />

      <div
        className={cn(
          'grid grid-cols-5 gap-[18px] to-1024:grid-cols-2 to-560:grid-cols-1',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        {CAREERS_HIRING_STEPS.map((step) => (
          <div
            key={step.id}
            className={cn(
              'group relative overflow-hidden rounded-[18px] border border-line-soft bg-white px-5 pb-6 pt-[22px]',
              '[transition:transform_.3s_cubic-bezier(.34,1.56,.64,1),box-shadow_.3s_ease,border-color_.3s_ease]',
              'hover:-translate-y-[5px] hover:border-brand-200 hover:shadow-[0_20px_44px_rgba(15,23,42,.08)]',
            )}
          >
            <span
              aria-hidden
              className="absolute -top-2.5 right-1.5 z-0 select-none font-display text-[66px] font-700 leading-none text-[#f1f5f9] transition-colors duration-300 group-hover:text-brand-100"
            >
              {step.ordinal}
            </span>

            <span
              className={cn(
                'relative z-[1] mb-[18px] flex h-11 w-11 items-center justify-center rounded-xl text-[23px]',
                step.iconChipClass,
              )}
            >
              <Icon name={step.icon} />
            </span>
            <b className="relative z-[1] mb-1.5 block text-[15.5px] font-500 text-title">
              {step.title}
            </b>
            <p className="relative z-[1] m-0 text-[13.5px] leading-[1.6] text-[#64748b]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
