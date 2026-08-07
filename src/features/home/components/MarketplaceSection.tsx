'use client';

import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import { useSnapCarousel } from '@/hooks/useSnapCarousel';
import type { MarketplaceApp } from '@/types/content';
import { Icon } from '@/components/ui/Icon';
import { AppImage } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';
import {
  GradientText,
  HEADING_CLASS,
  SUBHEADING_CLASS,
} from '@/components/ui/Typography';
import { MARKETPLACE_CONTENT } from '@/constants/home';

/**
 * Section 6 — Marketplace apps, as Tailwind utilities.
 *
 * `APP_CARD_CLASS` is the legacy `.app-card`: a 10px-radius card with the same
 * spring lift as `.card` but a tighter radius. It is spelled out here rather than
 * reusing `<Card variant="app">` because these cards are anchors whose content
 * layout differs per instance, and the class string is the part that needs sharing.
 *
 * Star ratings render from `rating` rather than five hard-coded glyphs, and carry an
 * `aria-label` with the actual score — the legacy markup drew five identical stars
 * with no text alternative, so a screen reader announced nothing at all. The visible
 * output for a 5.0 app is identical.
 *
 * Below `md` the tile grid becomes a one-card-at-a-time scroll-snap rail (same
 * `useSnapCarousel` hook the other card rails use), with dots for navigation.
 * `to-767:` utilities win over the `sm:grid-cols-2` ones in the 640–767px
 * overlap because max-width variants are declared after min-width ones in
 * `tailwind.config.ts` — same mechanism `TrustedBySection` uses.
 */
const CARD_GAP = 20; // matches `gap-5`
const APP_CARD_CLASS =
  'rounded-[10px] border border-line-soft bg-white [transition:transform_.3s_cubic-bezier(.34,1.56,.64,1),box-shadow_.3s,border-color_.3s] hover:-translate-y-[5px] hover:border-blue-200 hover:shadow-lift';

function StarRating({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount?: number;
}) {
  const stars = Math.round(rating);
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={
        reviewCount === undefined
          ? `Rated ${rating} out of 5`
          : `Rated ${rating} out of 5 from ${reviewCount} reviews`
      }
    >
      {Array.from({ length: stars }, (_, index) => (
        <Icon
          key={index}
          name="star"
          // The rail renders filled review stars, so the outline glyph is filled
          // with its own stroke colour. Lucide draws stroke-only by default.
          className="fill-current text-[10px] text-amber-400"
        />
      ))}
    </div>
  );
}

export interface MarketplaceSectionProps {
  apps: MarketplaceApp[];
}

export function MarketplaceSection({ apps }: MarketplaceSectionProps) {
  const { trackRef, activeIndex, scrollToIndex } = useSnapCarousel({
    gap: CARD_GAP,
    itemCount: apps.length,
  });

  return (
    <section
      id="marketplace"
      className="relative overflow-hidden bg-[#eaf8ff] py-12 lg:py-16"
    >
      <div className="relative mx-auto max-w-shell px-6">
        <div className="grid gap-8 lg:gap-10 lg:grid-cols-[460px_1fr]">
          {/* Left column */}
          <div
            // `reveal()` bakes in `md:text-left`, which would otherwise beat
            // `lg:text-left` below — the column has to stay centered through
            // the 768–1024px range too, since the grid doesn't go two-column
            // until `lg`.
            className={cn(reveal('left'), 'md:text-center lg:text-left')}
            {...revealAttrs()}
          >
            <h2 className={cn(HEADING_CLASS, 'mb-6')}>
              <GradientText>
                {MARKETPLACE_CONTENT.headingHighlight}
              </GradientText>
              {MARKETPLACE_CONTENT.headingTail}
            </h2>
            <p className={cn(SUBHEADING_CLASS, 'mb-8')}>
              {MARKETPLACE_CONTENT.subheading}
            </p>

            <div className="mt-8 flex items-center justify-center gap-3 border-t border-blue-100 pt-8 lg:justify-start">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-atlassian text-[18px]">
                {/* Size comes from the chip's `text-[18px]`; only colour here. */}
                <Icon name="atlassian" className="text-white" />
              </div>
              <div>
                <div className="text-[14px] font-700 text-slate-800">
                  {MARKETPLACE_CONTENT.trustTitle}
                </div>
                <div className="text-[13px] text-slate-800">
                  {MARKETPLACE_CONTENT.trustSubtitle}
                </div>
              </div>
            </div>

            {/*
              Visible at `lg`+ only. Below that the grid collapses to one
              column and this has to fall after the app tiles instead — see
              the second copy below.
            */}
            <SmartLink
              href={MARKETPLACE_CONTENT.exploreHref}
              className={cn(
                APP_CARD_CLASS,
                'mt-8 hidden items-center gap-4 border-dashed p-5 no-underline lg:flex',
              )}
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[13px] bg-blue-50 text-[22px]">
                <Icon name="grip" className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-[15px] font-800 text-slate-900">
                  {MARKETPLACE_CONTENT.exploreLabel}
                </h3>
              </div>
              <Icon name="arrow-right"
                className="flex-shrink-0 text-sm text-slate-400"
              />
            </SmartLink>
          </div>

          {/* App tiles */}
          <div
            ref={trackRef}
            role="group"
            aria-roledescription="carousel"
            aria-label="Marketplace apps"
            className={cn(
              'grid gap-5 sm:grid-cols-2',
              'to-767:flex to-767:snap-x to-767:snap-mandatory to-767:overflow-x-auto to-767:pb-1 to-767:[scrollbar-width:none] to-767:[&::-webkit-scrollbar]:hidden',
              reveal('right'),
            )}
            {...revealAttrs()}
          >
            {apps.map((app) => (
              <SmartLink
                key={app.id}
                href={app.href}
                className={cn(
                  APP_CARD_CLASS,
                  'block p-6 no-underline to-767:w-full to-767:flex-[0_0_100%] to-767:[scroll-snap-align:start]',
                )}
              >
                <div className="mb-4 flex items-start justify-between">
                  {/* Fixed 44×44 tile icon — no `sizes`, so Next emits 1x/2x. */}
                  <AppImage
                    src={app.logo.src}
                    alt={app.logo.alt}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-[4px] object-cover"
                  />
                  <span className="rounded-md bg-atlassian px-2 py-1 text-[10px] font-800 text-white">
                    {app.badge}
                  </span>
                </div>

                <h3 className="mb-2 text-[17px] font-800 text-slate-900">
                  {app.name}
                </h3>
                <p className="mb-4 text-[15px] leading-relaxed text-slate-800">
                  {app.description}
                </p>

                <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                  {app.free ? (
                    <span className="rounded-full bg-[#f0fdf4] px-2 py-0.5 text-[10.5px] font-800 text-brand-green">
                      FREE
                    </span>
                  ) : app.rating !== undefined ? (
                    <StarRating
                      rating={app.rating}
                      {...(app.reviewCount === undefined
                        ? {}
                        : { reviewCount: app.reviewCount })}
                    />
                  ) : null}
                  <span className="text-[12.5px] font-600 text-slate-800">
                    {app.metaLabel}
                  </span>
                </div>
              </SmartLink>
            ))}
          </div>

          {apps.length > 1 && (
            <div className="hidden justify-center gap-[7px] to-767:flex">
              {apps.map((app, index) => (
                <button
                  key={app.id}
                  type="button"
                  aria-label={`Go to app ${index + 1}`}
                  aria-current={activeIndex === index || undefined}
                  onClick={() => scrollToIndex(index)}
                  className={cn(
                    'h-[9px] cursor-pointer border-none p-0 transition-all duration-200',
                    activeIndex === index
                      ? 'w-[22px] rounded-[5px] bg-brand-600'
                      : 'w-[9px] rounded-[50%] bg-[#dbe7ff]',
                  )}
                />
              ))}
            </div>
          )}

          {/*
            Same link, `lg`-hidden twin of the one above — see that comment.
            `justify-self-center`: a grid item is blockified regardless of its
            own `display`, so without it this would stretch to the full
            column width instead of staying a content-sized card.
          */}
          <SmartLink
            href={MARKETPLACE_CONTENT.exploreHref}
            className={cn(
              APP_CARD_CLASS,
              'inline-flex items-center gap-4 border-dashed p-5 no-underline justify-self-center lg:hidden',
            )}
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[13px] bg-blue-50 text-[22px]">
              <Icon name="grip" className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-[15px] font-800 text-slate-900">
                {MARKETPLACE_CONTENT.exploreLabel}
              </h3>
            </div>
            <Icon name="arrow-right" className="flex-shrink-0 text-sm text-slate-400" />
          </SmartLink>
        </div>
      </div>
    </section>
  );
}
