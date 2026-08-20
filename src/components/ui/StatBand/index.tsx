import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { StatBandItem } from '@/types/content';

/**
 * `theme.css`'s `.stat-band` - the four-cell metric strip (About, Careers).
 *
 * Paints its own white card rather than staying transparent over a dark
 * gradient like the original `.stat-band` did - that read poorly against
 * this site's light sections.
 *
 * Breakpoints are the design's: ≥900px four columns with right-border
 * dividers; ≤900px two columns, first two cells gain a bottom border; ≤520px
 * one column, right borders off, bottom borders on.
 *
 * `to-520` must be the named screen from `tailwind.config.ts`, not
 * `max-[520px]`: Tailwind only emits the `max-*` family when every `screens`
 * entry is a plain min-width string, and this config's `to-*` entries are
 * `{ max: … }` objects - the arbitrary form compiles to nothing.
 *
 * `value` is a string (cells read "Platinum", "24×7") - there's no counter to
 * animate, unlike the home page's results band.
 */
export interface StatBandProps {
  items: StatBandItem[];
  className?: string;
  /** Tint applied to `accent` values. The two pages both use `text-orange`. */
  accentClassName?: string;
}

export function StatBand({
  items,
  className,
  accentClassName = 'text-orange',
}: StatBandProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-4 overflow-hidden rounded-[10px] border border-line-soft bg-white to-900:grid-cols-2 to-520:grid-cols-1',
        revealAligned('center'),
        className,
      )}
      {...revealAttrs()}
    >
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            'relative border-r border-line-soft px-6 py-10 text-center last:border-r-0',
            // Two-column layout: only the first row needs a rule under it.
            index < 2 && 'to-900:border-b',
            'to-520:border-b to-520:border-r-0 to-520:last:border-b-0',
          )}
        >
          <div className="text-[clamp(30px,3.2vw,46px)] font-500 leading-none tracking-[-.02em] text-title">
            <span className={cn(item.accent && accentClassName)}>
              {item.value}
            </span>
          </div>
          <div className="mt-2 text-[13px] font-600 text-muted">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
