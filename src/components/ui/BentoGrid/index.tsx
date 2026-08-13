import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { BentoTile } from '@/types/content';
import { Icon } from '../Icon';

/**
 * `theme.css`'s `.bento-grid` / `.bento-tile` - About's "Our Values" and Careers'
 * "Benefits & Perks".
 *
 * Four columns with `col-span-2`, not two columns: at ≤900px the track drops to
 * `repeat(2,1fr)` so a two-span tile fills the row (one per row), and only at
 * ≤560px does it become a single column with span-1. A plain `grid-cols-2 →
 * grid-cols-1` collapse would skip that ≤900px step.
 *
 * One reveal on the grid, not per tile, matches the legacy single `sr` - four
 * reveals would ripple instead of firing together.
 *
 * Icon at 26px in a 50px chip (~52%) - see `PillarGrid` for why the ratio changed
 * with the move from Font Awesome to Lucide.
 */
export interface BentoGridProps {
  tiles: BentoTile[];
  className?: string;
}

export function BentoGrid({ tiles, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid auto-rows-[minmax(160px,auto)] grid-cols-4 gap-5',
        'to-900:grid-cols-2 to-560:grid-cols-1',
        revealAligned('left'),
        className,
      )}
      {...revealAttrs()}
    >
      {tiles.map((tile) => (
        <div
          key={tile.id}
          className={cn(
            'col-span-2 flex flex-col rounded-[10px] border border-line-soft bg-white p-7 to-560:col-span-1',
            '[transition:transform_.3s_cubic-bezier(.34,1.56,.64,1),box-shadow_.3s_ease,border-color_.3s_ease]',
            'hover:-translate-y-[5px] hover:border-brand-200 hover:shadow-lift',
          )}
        >
          <span
            className={cn(
              'mb-4 flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[13px] text-[26px]',
              tile.iconChipClass,
            )}
          >
            <Icon name={tile.icon} size={40} />
          </span>
          <b className="mb-2 block text-[18px] font-500 tracking-[-.01em] text-title">
            {tile.title}
          </b>
          <p className="m-0 text-[15px] leading-[1.65] text-muted">
            {tile.description}
          </p>
        </div>
      ))}
    </div>
  );
}
