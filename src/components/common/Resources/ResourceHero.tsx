import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import { breadcrumbSchema } from '@/lib/schema';
import type { BreadcrumbItem } from '@/types/seo';
import type { ImageSource } from '@/types/content';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/Link';
import { JsonLd } from '../JsonLd';
import { ParallaxImage } from './ParallaxImage';

/**
 * The split hero shared by every resource listing page (blog, case studies,
 * events, webinars, news) - a dark panel of copy on the left with a
 * diagonal-cut photo on the right, replacing the legacy `.blog-hero` /
 * `.cs-hero` / `.evt-hero` full-bleed banners. No CTA button - breadcrumb,
 * heading and subheading only. Below `md` there isn't room for the split, so
 * the photo runs full-bleed with a left-to-right dark-to-light scrim instead
 * of the solid panel.
 */
export interface ResourceHeroProps {
  breadcrumb: BreadcrumbItem[];
  heading: ReactNode;
  subheading: ReactNode;
  image: ImageSource;
  /** Shown from 640px up to (not including) 1024px. Falls back to `image`. */
  imageTablet?: ImageSource;
  /** Shown below 640px. Falls back to `imageTablet`, then `image`. */
  imageMobile?: ImageSource;
  imageAlt?: string;
}

export function ResourceHero({
  breadcrumb,
  heading,
  subheading,
  image,
  imageTablet,
  imageMobile,
  imageAlt = '',
}: ResourceHeroProps) {
  return (
    <section
      className={cn(
        // Symmetric `py-*` (a minimum safety margin, well past the floating
        // header) plus `items-center` do the vertical centering - not a big
        // one-sided `pt-*`, which pushes the block toward the bottom half
        // instead of centering it and reads as "too close to the header" no
        // matter how large it gets.
        'relative isolate flex min-h-[450px] md:min-h-[500px] items-center overflow-hidden bg-[#141620] py-24 pb-12',
        'sm:py-28 sm:pb-16',
      )}
    >
      <div className="absolute inset-0 z-0" aria-hidden>
        <ParallaxImage
          src={image}
          tabletSrc={imageTablet}
          mobileSrc={imageMobile}
          alt={imageAlt}
        />
      </div>

      {/* Below md: photo runs full-bleed, so a dark-to-light left-to-right
          scrim keeps the copy readable without hiding the photo. At md+:
          a solid panel clipped to a diagonal right edge, so the photo shows
          through beside it instead of under a scrim. */}
      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(20,22,32,.7)_0%,rgba(20,22,32,.44)_42%,rgba(20,22,32,.18)_72%,rgba(20,22,32,0)_100%)] md:bg-[#141620] md:[clip-path:polygon(0_0,48%_0,40%_100%,0_100%)]"
        aria-hidden
      />

      <div className="relative z-[2] mx-auto w-full max-w-shell px-6">
        {/* The md+ cap tracks the diagonal's narrowest point (40vw, minus the
            section's left padding and a safety gap) so the heading can never
            wrap wide enough to spill past the cut onto the photo; the 420px
            ceiling just keeps it from ballooning on very wide viewports. */}
        <div className="max-w-[300px] sm:max-w-[380px] md:max-w-[min(420px,calc(40vw-48px))]">
          <JsonLd schema={breadcrumbSchema(breadcrumb)} />
          <nav
            aria-label="Breadcrumb"
            className={cn('mb-6', reveal('up'), 'text-left')}
            {...revealAttrs()}
          >
            <ol className="flex flex-wrap items-center gap-2 text-[13px] font-600 text-white/60">
              {breadcrumb.map((item, index) => {
                const isLast = index === breadcrumb.length - 1;
                return (
                  <li key={item.href} className="flex items-center gap-2">
                    {isLast ? (
                      <span aria-current="page" className="text-white">
                        {item.name}
                      </span>
                    ) : (
                      <SmartLink
                        href={item.href}
                        className="text-white/60 transition-colors hover:text-white"
                      >
                        {item.name}
                      </SmartLink>
                    )}
                    {isLast ? null : (
                      <Icon
                        name="chevron-right"
                        className="text-[9px] text-white/35"
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <h1
            className={cn(
              'mb-4 text-[clamp(30px,5vw,44px)] font-normal leading-[1.15] tracking-[-0.03em] text-white',
              reveal('up', 100),
              'text-left',
            )}
            {...revealAttrs()}
          >
            {heading}
          </h1>
          <p
            className={cn(
              'text-[16px] leading-[1.65] text-white/85 sm:text-[17px]',
              reveal('up', 150),
              'text-left',
            )}
            {...revealAttrs()}
          >
            {subheading}
          </p>
        </div>
      </div>
    </section>
  );
}
