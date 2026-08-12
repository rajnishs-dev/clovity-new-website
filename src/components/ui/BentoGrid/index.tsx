import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { BentoTile } from '@/types/content';
import { Icon } from '../Icon';

/**
 * `theme.css`'s `.bento-grid` / `.bento-tile` - About's "Our Values" and Careers'
 * "Benefits & Perks".
 *
 * WHY FOUR COLUMNS AND `col-span-2`, rather than two columns -
 * that is what the original declares, and it is not equivalent. The track is
 * `repeat(4,1fr)` with every tile spanning two, so two tiles sit per row; at ≤900px
 * the track becomes `repeat(2,1fr)` and a two-span tile fills the row, giving one per
 * row; at ≤560px the track is a single column and the span drops to 1. Rewriting it
 * as `grid-cols-2 → grid-cols-1` would lose the ≤900px step entirely, where the
 * design goes to full-width tiles while still above the phone breakpoint.
 *
 * `auto-rows-[minmax(160px,auto)]` is what keeps a short tile from collapsing next to
 * a tall one, so the two tiles in a row match height.
 *
 * The GRID carries one reveal, not each tile - matching the single `sr` the markup
 * puts on the container. Four separate reveals would fire at four different scroll
 * positions and read as a ripple the design does not have.
 *
 * ICON SIZE - 26px in a 50px chip (~52%), where the published markup said 20px. See
 * `PillarGrid` for why the ratio changed with the move from Font Awesome to Lucide.
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
            'col-span-2 flex flex-col rounded-[20px] border border-line-soft bg-white p-7 to-560:col-span-1',
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
            <Icon name={tile.icon} />
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
