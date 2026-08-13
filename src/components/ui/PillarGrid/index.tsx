import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { PillarCard } from '@/types/content';
import { Icon } from '../Icon';

/**
 * The `.why-grid` / `.why-card` three-across value-prop row (About, Careers).
 *
 * Three columns above 900px, one below, 24px gap; white cards with a
 * `#bfdbfe` hover border lifting 5px. Uses an arbitrary `[transition:…]`
 * property because the original gives transform a springy easing while
 * shadow/border-color use plain `ease` - no `transition-*` combination
 * expresses per-property easing.
 *
 * Cards stagger 0/50/100ms per the markup's `transition-delay`.
 * `revealAligned('left')` because the card body stays left-aligned at every
 * width - plain `reveal()` would centre it below 768px.
 *
 * Icon rendered at a fixed 50px via `size`, not inherited from the chip's
 * font-size - a deliberate override of the convention in `Icon/index.tsx`.
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
            'rounded-[10px] border border-line-soft bg-white px-7 py-8',
            '[transition:transform_.3s_cubic-bezier(.34,1.56,.64,1),box-shadow_.3s_ease,border-color_.3s_ease]',
            'hover:-translate-y-[5px] hover:border-brand-200 hover:shadow-lift-soft',
            revealAligned('left', 'up', STAGGER_MS[index] ?? 0),
          )}
          {...revealAttrs()}
        >
          <span
            className={cn(
              'mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px]',
              card.iconChipClass,
            )}
          >
            <Icon name={card.icon} size={50} />
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
