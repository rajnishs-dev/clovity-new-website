import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { ProcessStep } from '@/types/content';
import { Icon } from '@/components/ui/Icon';

/**
 * Horizontal numbered step flow ("Delivery approach" sections across the
 * expertise pages) - Trundl's 4-stage migration diagram and Praecipio's
 * step-cards were the strongest versions of this pattern among the
 * competitor sites reviewed.
 *
 * `grid-flow-col auto-cols-fr` gives N equal-width columns for whatever
 * length `steps` happens to be, without hand-picking `grid-cols-4` vs `-5` -
 * the delivery methods across the 8 pages don't all have the same step count.
 * Collapses to a single vertical column below `md`, where the connecting
 * line rotates from a horizontal bar to a vertical one.
 */
export interface ProcessTimelineProps {
  steps: ProcessStep[];
  className?: string;
}

export function ProcessTimeline({ steps, className }: ProcessTimelineProps) {
  return (
    <div
      className={cn(
        'relative grid gap-10 md:grid-flow-col md:auto-cols-fr md:gap-6',
        revealAligned('left'),
        className,
      )}
      {...revealAttrs()}
    >
      <span
        aria-hidden
        className="absolute left-[27px] top-[27px] bottom-[27px] w-px bg-line-soft md:inset-x-[27px] md:bottom-auto md:left-[27px] md:right-[27px] md:top-[27px] md:h-px md:w-auto"
      />

      {steps.map((step) => (
        <div
          key={step.id}
          className="relative flex gap-4 md:flex-col md:items-center md:gap-4 md:text-center"
        >
          <span className="relative z-[1] flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border-2 border-brand-100 bg-white text-[15px] font-700 text-brand-600 shadow-[0_4px_14px_rgba(15,23,42,.08)]">
            {step.icon ? (
              <Icon name={step.icon} size={22} />
            ) : (
              String(step.order).padStart(2, '0')
            )}
          </span>
          <div className="pt-1 md:pt-0">
            <b className="mb-1.5 block text-[16px] font-500 tracking-[-.01em] text-title">
              {step.title}
            </b>
            <p className="m-0 text-[14px] leading-[1.6] text-muted">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
