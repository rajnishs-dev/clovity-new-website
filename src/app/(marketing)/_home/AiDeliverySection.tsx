'use client';

import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import { useSnapCarousel } from '@/hooks/useSnapCarousel';
import type { FeatureCard, ImageSource } from '@/types/content';
import { Icon } from '@/components/ui/Icon';
import {
  GradientText,
  HEADING_CLASS,
  SUBHEADING_CLASS,
} from '@/components/ui/Typography';
import { AI_DELIVERY_CONTENT } from '@/constants/home';

/**
 * Horizontal scroll-snap rail: arrows on desktop, dots below 900px.
 *
 * `[scrollbar-width:none]` + `[&::-webkit-scrollbar]:hidden` hides the native
 * scrollbar - no single Tailwind utility covers both engines, so these are
 * arbitrary property/variant instead of a stylesheet.
 *
 * `--card-photo` composites a darkening scrim over the photo in one
 * `background-image`, since two stacked background utilities can't do that.
 */

const CARD_GAP = 22; // must match the rail's scroll step distance

/** Resolve a static import or URL string into a CSS `url()` value. */
function toCssUrl(source: ImageSource): string {
  return `url(${typeof source === 'string' ? source : source.src})`;
}

const ARROW_CLASS =
  'absolute top-1/2 flex h-[42px] w-[42px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-[50%] border border-line bg-white text-[18px] text-[#334155] shadow-[0_4px_14px_rgba(15,23,42,.14)] transition-all duration-200 [pointer-events:auto] hover:border-brand-600 hover:bg-brand-600 hover:text-white disabled:cursor-default disabled:opacity-35 disabled:hover:border-line disabled:hover:bg-white disabled:hover:text-[#334155]';

export interface AiDeliverySectionProps {
  capabilities: FeatureCard[];
}

export function AiDeliverySection({ capabilities }: AiDeliverySectionProps) {
  const {
    trackRef,
    activeIndex,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    scrollToIndex,
  } = useSnapCarousel({ gap: CARD_GAP, itemCount: capabilities.length });

  return (
    <section id="ai-delivery" className="py-12 lg:py-16">
      <div className="mx-auto max-w-shell px-6">
        <div
          // `md:text-center` has to come after `reveal()` - it bakes in
          // `md:text-left`, which would otherwise beat the plain `text-center`
          // at desktop widths.
          className={cn(
            'mx-auto mb-8 lg:mb-10 max-w-[680px] text-center',
            reveal(),
            'md:text-center',
          )}
          {...revealAttrs()}
        >
          <h2 className={HEADING_CLASS}>
            {AI_DELIVERY_CONTENT.headingLead}
            <br />
            It Is{' '}
            <GradientText>{AI_DELIVERY_CONTENT.headingHighlight}</GradientText>.
          </h2>
          <p className={cn(SUBHEADING_CLASS, 'mt-4')}>
            {AI_DELIVERY_CONTENT.subheading}
          </p>
        </div>

        <div className={cn('relative -mx-1.5', reveal())} {...revealAttrs()}>
          {/* Arrow layer: ignores pointer events so it never blocks the rail. */}
          <div className="pointer-events-none absolute bottom-4 left-0 right-0 top-0 z-[4] to-900:hidden">
            <button
              type="button"
              aria-label="Previous capability"
              disabled={!canScrollPrev}
              onClick={scrollPrev}
              className={cn(ARROW_CLASS, 'left-[-20px]')}
            >
              <Icon name="chevron-left" />
            </button>
            <button
              type="button"
              aria-label="Next capability"
              disabled={!canScrollNext}
              onClick={scrollNext}
              className={cn(ARROW_CLASS, 'right-[-20px]')}
            >
              <Icon name="chevron-right" />
            </button>
          </div>

          <div
            ref={trackRef}
            role="group"
            aria-roledescription="carousel"
            aria-label="How we deliver"
            className="flex gap-4 overflow-x-auto px-1.5 pb-4 pt-2.5 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {capabilities.map((capability) => (
              <div
                key={capability.id}
                className="relative flex h-[400px] flex-[0_0_100%] flex-col justify-end overflow-hidden rounded-[10px] bg-deliver-card bg-cover bg-[center_top] bg-no-repeat p-6 text-white [scroll-snap-align:start] sm:flex-[0_0_calc((100%-16px)/2)] md:flex-[0_0_calc((100%-32px)/3)] xl:flex-[0_0_calc((100%-48px)/4)]"
                {...(capability.backgroundImage
                  ? {
                      style: {
                        '--card-photo': toCssUrl(capability.backgroundImage),
                      } as CSSProperties,
                    }
                  : {})}
              >
                <span className="relative z-[1] mb-auto flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-white/[.18] text-[26px] text-white">
                  <Icon name={capability.icon} />
                </span>
                <div className="relative z-[1]">
                  <b className="block text-[22px] font-normal leading-[1.28]">
                    {capability.title}
                  </b>
                  <span
                    aria-hidden
                    className="my-4 block h-px w-full bg-current opacity-25"
                  />
                  <p className="m-0 min-h-[46.4px] text-[14.5px] leading-[1.6] opacity-[.92]">
                    {capability.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots replace the arrows below 900px, where the rail is swipeable. */}
          <div className="mt-[22px] hidden justify-center gap-[7px] to-900:flex">
            {capabilities.map((capability, cardIndex) => (
              <button
                key={capability.id}
                type="button"
                aria-label={`Go to capability ${cardIndex + 1}`}
                aria-current={activeIndex === cardIndex || undefined}
                onClick={() => scrollToIndex(cardIndex)}
                className={cn(
                  'h-[9px] cursor-pointer border-none p-0 transition-all duration-200',
                  activeIndex === cardIndex
                    ? 'w-[22px] rounded-[5px] bg-brand-600'
                    : 'w-[9px] rounded-[50%] bg-[#dbe7ff]',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
