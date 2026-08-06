import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
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
 */
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
  return (
    <section
      id="marketplace"
      className="relative overflow-hidden bg-[#eaf8ff] py-16 sm:py-20"
    >
      <div className="relative mx-auto max-w-shell px-6">
        <div className="grid gap-16 lg:grid-cols-[460px_1fr]">
          {/* Left column */}
          <div
            className={cn('text-center lg:text-left', reveal('left'))}
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

            <SmartLink
              href={MARKETPLACE_CONTENT.exploreHref}
              className={cn(
                APP_CARD_CLASS,
                'mt-8 inline-flex items-center gap-4 border-dashed p-5 no-underline sm:col-span-2 lg:flex',
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
            className={cn('grid gap-5 sm:grid-cols-2', reveal('right'))}
            {...revealAttrs()}
          >
            {apps.map((app) => (
              <SmartLink
                key={app.id}
                href={app.href}
                className={cn(APP_CARD_CLASS, 'block p-6 no-underline')}
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
        </div>
      </div>
    </section>
  );
}
