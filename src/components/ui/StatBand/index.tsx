import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { StatBandItem } from '@/types/content';

/**
 * `theme.css`'s `.stat-band` — the four-cell metric strip on a dark gradient.
 *
 * Used by About and Careers, which wrap it in the same navy gradient section
 * (`#0b1730 → #152a6b → #1d3a8a`) and pass `background: transparent` on the grid
 * itself so the section's gradient shows through instead of the band's own `#0f172a`.
 * That inline override is reproduced here as `bg-transparent`.
 *
 * THE THREE BREAKPOINTS ARE THE DESIGN'S, not a simplification:
 *   • ≥900px  four columns, cells divided by right borders
 *   • ≤900px  two columns; the FIRST TWO cells gain a bottom border, because they
 *             are now a row with cells under them
 *   • ≤520px  one column; right borders off, bottom borders on, last cell bare
 *
 * `to-520` is a NAMED screen in `tailwind.config.ts`, not an arbitrary
 * `max-[520px]` variant. The arbitrary form compiles to nothing here — Tailwind
 * only emits the `max-*` family when every `screens` entry is a plain min-width
 * string, and this config's `to-*` entries are `{ max: … }` objects — so the band
 * silently kept four columns on a phone. See the comment on that screen.
 *
 * `value` is a string, not a number — the design's cells read "Platinum", "24×7",
 * "SF" and "GPTW". There is no counter to animate, which is also why this does not
 * reach for `useCountUp` the way the home page's results band does.
 */
export interface StatBandProps {
  items: StatBandItem[];
  className?: string;
  /** Tint applied to `accent` values. The two pages both use `#fdba74`. */
  accentClassName?: string;
}

export function StatBand({
  items,
  className,
  accentClassName = 'text-[#fdba74]',
}: StatBandProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-4 overflow-hidden rounded-3xl bg-transparent to-900:grid-cols-2 to-520:grid-cols-1',
        revealAligned('center'),
        className,
      )}
      {...revealAttrs()}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            'relative border-r border-white/[.08] px-6 py-10 text-center last:border-r-0',
            // Two-column layout: only the first row needs a rule under it.
            index < 2 && 'to-900:border-b',
            'to-520:border-b to-520:border-r-0 to-520:last:border-b-0',
          )}
        >
          <div className="text-[clamp(32px,4vw,48px)] font-500 leading-none tracking-[-.02em] text-white">
            <span className={cn(item.accent && accentClassName)}>
              {item.value}
            </span>
          </div>
          <div className="mt-2 text-[13px] font-600 text-faint">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
