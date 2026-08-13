import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import { breadcrumbSchema } from '@/lib/schema';
import type { BreadcrumbItem } from '@/types/seo';
import type { ImageSource } from '@/types/content';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/Link';
import { JsonLd } from '../JsonLd';
import { ParallaxImage } from '../Resources';

/**
 * The hero shared by every resource listing page (blog, case studies,
 * events, webinars, news) and by About Us - a full-bleed photo with a
 * left-to-right dark-to-light scrim and copy on the left. No CTA button -
 * breadcrumb, heading and subheading only.
 *
 * Lives outside `common/Resources` (it used to be `ResourceHero` in there)
 * because About Us reaching into a folder named for the Resources section
 * for its own hero read backwards - this component is shared infrastructure,
 * the same way `PageHero` is for Careers and Contact.
 */
export interface BannerHeroProps {
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

export function BannerHero({
  breadcrumb,
  heading,
  subheading,
  image,
  imageTablet,
  imageMobile,
  imageAlt = '',
}: BannerHeroProps) {
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

      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(10,12,20,.85)_0%,rgba(10,12,20,.45)_50%,rgba(10,12,20,0)_100%)]"
        aria-hidden
      />

      <div className="relative z-[2] mx-auto w-full max-w-shell px-6">
        <div className="max-w-[300px] sm:max-w-[380px] md:max-w-[480px]">
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
              'mb-4 text-[clamp(30px,5vw,46px)] font-normal leading-[1.15] tracking-[-0.03em] text-white',
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
