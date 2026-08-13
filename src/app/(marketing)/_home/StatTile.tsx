'use client';

import { cn } from '@/lib/cn';
import { useCountUp } from '@/hooks/useCountUp';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { StatItem } from '@/types/content';
import { AppImage } from '@/components/ui/Image';

/**
 * Own component because `useCountUp` can't be called in a loop, and each
 * tile needs its own IntersectionObserver so it only counts when in view.
 *
 * `isolate` keeps the hover flood's scaled `before:` circle inside this
 * card's stacking context instead of painting over neighbours.
 *
 * SVG icons pass `unoptimized`: Next's optimizer rejects SVG without
 * `dangerouslyAllowSVG`, and there's nothing to gain rasterizing a vector.
 */

/** Icon backgrounds and matching hover floods, in tile order. */
const ACCENT = [
  { icon: 'bg-[#fee2e2]', flood: 'before:bg-[#fee2e2]' },
  { icon: 'bg-[#ffedd5]', flood: 'before:bg-[#ffedd5]' },
  { icon: 'bg-[#fef9c3]', flood: 'before:bg-[#fef9c3]' },
  { icon: 'bg-[#dcfce7]', flood: 'before:bg-[#dcfce7]' },
  { icon: 'bg-[#dbeafe]', flood: 'before:bg-[#dbeafe]' },
] as const;

const FALLBACK_ACCENT = { icon: 'bg-[#d6e6fb]', flood: 'before:bg-[#4078ed]' };

export function StatTile({ stat, index }: { stat: StatItem; index: number }) {
  const reducedMotion = useReducedMotion();
  const { ref, display } = useCountUp({
    target: stat.value,
    reducedMotion,
  });

  const accent = ACCENT[index] ?? FALLBACK_ACCENT;

  /**
   * Responsive dividers between tiles, expressed as index checks rather than
   * `nth-child` - clearer, and immune to a wrapper shifting the child count.
   * `to-480` wins over `to-640` where they overlap because it's declared
   * later in the screens config.
   */
  const n = index + 1;
  const dividers = cn(
    n % 2 === 0 && 'to-640:border-l to-640:border-line to-640:pl-6',
    n >= 3 && 'to-640:border-t to-640:border-line to-640:pt-6',
    n >= 2 && 'to-480:border-t to-480:border-line to-480:pt-6',
  );

  return (
    <div
      className={cn(
        // No `border-none`: preflight leaves borders at width 0 / style solid,
        // which is what lets the responsive `border-t`/`border-l` above draw.
        'group relative isolate transition-[transform,box-shadow] duration-[250ms] shadow-[0_10px_26px_rgba(5,10,35,0.14)] flex flex-col items-start overflow-hidden rounded-[10px] bg-white p-7 px-6',
        dividers,
        '[transition:transform_.25s,box-shadow_.25s] hover:-translate-y-[3px] hover:shadow-card-hover',
        // The flood: a 70px circle behind the icon that scales up to cover the card.
        'before:absolute before:left-6 before:top-7 before:z-0 before:h-[70px] before:w-[70px] before:origin-center before:scale-0 before:rounded-[50%] before:transition-transform before:duration-[600ms] before:ease-flood before:content-[""] before:[pointer-events:none]',
        'hover:before:scale-[14]',
        accent.flood,
      )}
    >
      <span
        className={cn(
          'relative z-[1] mb-4 flex h-[55px] w-[55px] shrink-0 items-center justify-center rounded-[100%] text-[19px] shadow-[0_2px_8px_rgba(0,0,0,.06)] transition-[background] duration-300 group-hover:shadow-none',
          accent.icon,
        )}
      >
        <AppImage
          src={stat.icon.src}
          alt={stat.icon.alt}
          width={55}
          height={55}
          unoptimized
          className="h-[55px] w-[55px] object-contain transition-[filter] duration-300"
        />
      </span>

      <div className="relative z-[1] flex items-baseline gap-[3px]">
        <span
          ref={ref}
          className="inline-block text-[clamp(30px,3vw,42px)] font-700 leading-none tracking-[-.03em] text-title transition-color duration-300"
        >
          {display}
        </span>
        {stat.suffix ? (
          <span className="text-[clamp(20px,2.8vw,28px)] font-500 text-title transition-color duration-300">
            {stat.suffix}
          </span>
        ) : null}
      </div>

      <div className="relative z-[1] mt-1.5 text-[14px] font-normal leading-[1.4] text-muted transition-color duration-300">
        {stat.label}
      </div>
    </div>
  );
}
