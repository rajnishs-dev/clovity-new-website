import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import type { StatItem } from '@/types/content';
import { GradientText } from '@/components/ui/Typography';
import { RESULTS_CONTENT } from '@/constants/home';
import { StatTile } from './StatTile';

/**
 * Section 7 — Customer results, as Tailwind utilities.
 *
 * Five metrics across, stepping to 3 at 1020px, 2 at 640px and 1 at 480px — the
 * original's breakpoints. The heading uses its own slightly different scale from
 * `.s-heading` (same clamp, but this block set it independently), so it is spelled
 * out rather than borrowed.
 *
 * This wrapper stays a Server Component; only the tiles are client components,
 * because only they need the count-up observer. That keeps the section's copy out
 * of the JS bundle.
 *
 * All five figures are the legacy site's own published numbers — none was adjusted,
 * rounded or added.
 */
export interface ResultsSectionProps {
  stats: StatItem[];
}

export function ResultsSection({ stats }: ResultsSectionProps) {
  return (
    <section
      id="results"
      className="relative overflow-hidden py-12 lg:py-16"
    >
      <div className="relative mx-auto w-full max-w-shell px-6">
        <div
          // `md:text-center` has to come after `reveal()` — it bakes in
          // `md:text-left`, which would otherwise beat the plain `text-center`
          // at desktop widths.
          className={cn(
            'mx-auto mb-8 lg:mb-10 max-w-[680px] text-center',
            reveal(),
            'md:text-center',
          )}
          {...revealAttrs()}
        >
          <h2 className="text-[clamp(30px,3.2vw,46px)] font-normal leading-[1.1] tracking-[-0.03em] text-title to-480:text-[26px]">
            {RESULTS_CONTENT.headingLead}
            <GradientText>{RESULTS_CONTENT.headingHighlight}</GradientText>
          </h2>
          <p className="mt-4 text-[16px] leading-[1.65] text-muted">
            {RESULTS_CONTENT.subheading}
          </p>
        </div>

        <div
          className={cn(
            'grid w-full grid-cols-5 gap-5',
            'to-1020:grid-cols-3 to-640:grid-cols-2 to-480:grid-cols-1',
            reveal(),
          )}
          {...revealAttrs()}
        >
          {stats.map((stat, index) => (
            <StatTile key={stat.id} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
