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
 * The dark photo hero shared by every resource listing page (blog, case
 * studies, events, webinars, news) - the legacy `.blog-hero` / `.cs-hero` /
 * `.evt-hero` banners, unified into one component since they only ever
 * differed in copy and background photo.
 */
export interface ResourceHeroProps {
  breadcrumb: BreadcrumbItem[];
  heading: ReactNode;
  subheading: ReactNode;
  image: ImageSource;
  imageAlt?: string;
}

export function ResourceHero({
  breadcrumb,
  heading,
  subheading,
  image,
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
        'relative isolate flex min-h-[450px] md:min-h-[500px] items-center overflow-hidden bg-[#0a0b10] py-24 pb-12',
        'sm:py-28 sm:pb-16',
      )}
    >
      <div className="absolute inset-0 z-0" aria-hidden>
        <ParallaxImage src={image} alt={imageAlt} />
        <div className="absolute inset-0 bg-[linear-gradient(92deg,rgba(8,9,14,.82)_0%,rgba(10,11,18,.76)_30%,rgba(12,13,22,.56)_52%,rgba(12,13,22,.22)_72%,rgba(12,13,22,.03)_100%)]" />
      </div>

      <div className="relative z-[1] mx-auto w-full max-w-shell px-6">
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
            'mb-4 max-w-[820px] text-[clamp(30px,5vw,54px)] font-normal leading-[1.15] tracking-[-0.03em] text-white',
            reveal('up', 100),
            'text-left',
          )}
          {...revealAttrs()}
        >
          {heading}
        </h1>
        <p
          className={cn(
            'max-w-[600px] text-[16px] leading-[1.65] text-white/85 sm:text-[17px]',
            reveal('up', 150),
            'text-left',
          )}
          {...revealAttrs()}
        >
          {subheading}
        </p>
      </div>
    </section>
  );
}
