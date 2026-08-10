'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import { useSnapCarousel } from '@/hooks/useSnapCarousel';
import type { ContentItem } from '@/types/content';
import { formatContentDate } from '@/utils/format';
import { Icon } from '@/components/ui/Icon';
import { CoverImage } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';

/**
 * The heading row plus the horizontal card rail beneath it, as Tailwind utilities.
 *
 * Head and track are one component because the heading and the arrow pair are
 * siblings inside a `justify-between` flex row while the track sits below - and the
 * arrows need the track's scroll state, so all three share one hook.
 *
 * Card structure: the image fills the card and the dark caption panel is translated
 * 100% down, sliding up on hover (`group-hover:translate-y-0`). That hover-only
 * reveal is a real accessibility problem in the original - the title existed only
 * inside a panel shown on `:hover`, so keyboard and touch users got an unlabelled
 * image link. Fixed with an `aria-label` on the anchor; the visual behaviour is
 * untouched.
 *
 * `[-webkit-line-clamp]` is applied through Tailwind's `line-clamp-2`, which sets
 * the display, orient and clamp properties together.
 *
 * Dates are ISO in the data and formatted at render, so the CMS can supply real
 * timestamps instead of the pre-formatted display strings the original hard-coded.
 * `<time dateTime>` also makes them machine-readable.
 */
const CARD_GAP = 20;

const ARROW_CLASS =
  'flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[50%] border border-line bg-white text-[16px] text-[#334155] shadow-xs transition-all duration-200 hover:border-brand-600 hover:bg-brand-600 hover:text-white disabled:cursor-default disabled:opacity-35 disabled:hover:border-line disabled:hover:bg-white disabled:hover:text-[#334155]';

export interface ContentCardRailProps {
  items: ContentItem[];
  columnTitle: string;
  columnSubtitle: string;
  /** Rendered after the rail - the "View More" row. */
  footer?: ReactNode;
}

export function ContentCardRail({
  items,
  columnTitle,
  columnSubtitle,
  footer,
}: ContentCardRailProps) {
  const { trackRef, canScrollPrev, canScrollNext, scrollPrev, scrollNext } =
    useSnapCarousel({ gap: CARD_GAP, itemCount: items.length });

  return (
    <>
      <div className="mb-[18px] flex items-end justify-between gap-5">
        <div className={reveal('right')} {...revealAttrs()}>
          <b className="mb-1 block text-[20px] font-700 leading-[1.3] text-title">
            {columnTitle}
          </b>
          <span className="text-[14.5px] text-muted">{columnSubtitle}</span>
        </div>

        <div
          className={cn('flex shrink-0 gap-2', reveal('right'))}
          {...revealAttrs()}
        >
          <button
            type="button"
            aria-label="Previous card"
            disabled={!canScrollPrev}
            onClick={scrollPrev}
            className={ARROW_CLASS}
          >
            <Icon name="chevron-left" />
          </button>
          <button
            type="button"
            aria-label="Next card"
            disabled={!canScrollNext}
            onClick={scrollNext}
            className={ARROW_CLASS}
          >
            <Icon name="chevron-right" />
          </button>
        </div>
      </div>

      {/*
        Only `-mr-1.5` on this wrapper, not `-mx-1.5`. The track's `px-1.5`
        exists so a card's hover border/shadow has room before the scroll
        container's own clipping - but browsers don't render a scroll
        container's START padding at `scrollLeft: 0` (only the END padding is
        respected), so a matching `-ml-1.5` here would pull the first card
        6px past the section's actual gutter instead of cancelling anything.
        Dropping the left margin lines the first card back up with the
        heading above it; the right margin still cancels `px-1.5` on the end,
        where it does render.
      */}
      <div className={cn('relative -mr-1.5', reveal())} {...revealAttrs()}>
        <div
          ref={trackRef}
          role="group"
          aria-roledescription="carousel"
          aria-label={columnTitle}
          className="flex gap-5 overflow-x-auto px-1.5 pb-1.5 pt-1 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <SmartLink
              key={item.id}
              href={item.href}
              aria-label={item.title}
              className="group relative block h-[240px] md:h-[255px] flex-[0_0_calc((100%-20px)/2)] overflow-hidden rounded-[14px] border border-line bg-white text-inherit no-underline [scroll-snap-align:start] [transition:box-shadow_.3s,border-color_.3s] hover:border-blue-200 to-640:flex-[0_0_100%]"
              {...(item.external ? { forceExternal: true } : {})}
            >
              <div className="absolute inset-0 h-full overflow-hidden bg-slate-100">
                <CoverImage
                  src={item.image.src}
                  alt={item.image.alt}
                  sizes="(min-width: 1020px) 380px, 86vw"
                />
              </div>

              <div className="absolute inset-0 flex translate-y-full flex-col items-center justify-center bg-[rgba(2,6,23,.88)] px-6 py-5 text-center transition-transform duration-[450ms] ease-native [will-change:transform] group-hover:translate-y-0">
                <time
                  dateTime={item.publishedAt}
                  className="mb-[9px] block text-[11px] font-800 uppercase tracking-[.07em] text-[#cbd5e1]"
                >
                  {formatContentDate(item.publishedAt)}
                </time>
                <div className="mb-2 line-clamp-2 text-[17px] font-700 leading-[1.35] text-white">
                  {item.title}
                </div>
                <p className="m-0 line-clamp-2 min-h-[3.2em] text-[15px] leading-[1.6] text-line">
                  {item.excerpt}
                </p>
              </div>
            </SmartLink>
          ))}
        </div>
      </div>

      {footer}
    </>
  );
}
