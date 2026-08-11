import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { PillarCard } from '@/types/content';
import { Icon } from '../Icon';

/**
 * The `.why-grid` / `.why-card` three-across value-prop row.
 *
 * Declared identically in About's and Careers' page stylesheets: three equal
 * columns above 900px, one below, 24px gap; each card white on a `#e8edf4` border
 * with a 20px radius, lifting 5px on hover with a `#bfdbfe` border.
 *
 * `[transition:…]` as an arbitrary property, not `transition-transform`: the
 * original gives transform a springy `cubic-bezier(.34,1.56,.64,1)` while shadow
 * and border-color use plain `ease`. No combination of `transition-*` +
 * `duration-*` + `ease-*` utilities can express per-property easing.
 *
 * Cards stagger 0 / 50 / 100ms, matching the `transition-delay: .05s` and `.1s` the
 * markup puts on the second and third. `revealAligned('left')` because the card body
 * is left-aligned at every width — `reveal()` alone would centre it below 768px.
 *
 * ICON SIZE — the chip is 52px and the glyph is rendered at 27px (~52% of the chip),
 * not the 22px the published markup used. That 22px was tuned for a FILLED Font
 * Awesome glyph; a Lucide outline at the same pixel size reads noticeably lighter, so
 * the whole site was re-proportioned to ~52% when it moved to Lucide. Matching the
 * literal 22px here would make these three chips the only under-weighted ones on the
 * site. See the note in `components/ui/Icon/index.tsx`.
 */
export interface PillarGridProps {
  cards: PillarCard[];
  className?: string;
}

/** Reveal stagger per card index, in milliseconds. */
const STAGGER_MS = [0, 50, 100] as const;

export function PillarGrid({ cards, className }: PillarGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-3 gap-6 to-900:grid-cols-1',
        className,
      )}
    >
      {cards.map((card, index) => (
        <div
          key={card.id}
          className={cn(
            'rounded-[20px] border border-line-soft bg-white px-7 py-8',
            '[transition:transform_.3s_cubic-bezier(.34,1.56,.64,1),box-shadow_.3s_ease,border-color_.3s_ease]',
            'hover:-translate-y-[5px] hover:border-brand-200 hover:shadow-lift-soft',
            revealAligned('left', 'up', STAGGER_MS[index] ?? 0),
          )}
          {...revealAttrs()}
        >
          <span
            className={cn(
              'mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] text-[27px]',
              card.iconChipClass,
            )}
          >
            {/* Size is inherited from the chip's text-[27px] — see the note above. */}
            <Icon name={card.icon} />
          </span>
          <b className="mb-2.5 block text-[19px] font-500 tracking-[-.01em] text-title">
            {card.title}
          </b>
          <p className="m-0 text-[15px] leading-[1.7] text-muted">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  );
}
