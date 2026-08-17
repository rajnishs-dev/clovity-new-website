import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import type { BreadcrumbItem } from '@/types/seo';
import type { CtaLink, ImageSource } from '@/types/content';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/Link';
import { CtaGroup } from '@/components/common/CTA';
import { ParallaxImage } from '@/components/common/Resources';

/**
 * The expertise-page hero: `common/BannerHero`'s visual language (full-bleed
 * photo, dark scrim, left-aligned copy) plus a CTA row and an optional
 * credibility strip - `BannerHero` deliberately ships neither (see its own
 * doc comment), but every expertise page in the brief needs both.
 *
 * Breadcrumb JSON-LD is left to the caller (render `<JsonLd>` once in
 * `page.tsx`) rather than emitted here too, so a page doesn't end up with the
 * same `BreadcrumbList` schema twice.
 */
export interface ExpertiseHeroProps {
  breadcrumb: BreadcrumbItem[];
  eyebrow?: string;
  heading: ReactNode;
  /** Optional - some pages run heading-only, no supporting paragraph. */
  subheading?: ReactNode;
  /** Optional - some pages run breadcrumb + heading only, no CTA row. */
  ctas?: CtaLink[];
  image: ImageSource;
  imageTablet?: ImageSource;
  imageMobile?: ImageSource;
  imageAlt?: string;
  /** Small credibility row under the CTAs - a badge strip or stat chips. */
  proofStrip?: ReactNode;
}

export function ExpertiseHero({
  breadcrumb,
  eyebrow,
  heading,
  subheading,
  ctas,
  image,
  imageTablet,
  imageMobile,
  imageAlt = '',
  proofStrip,
}: ExpertiseHeroProps) {
  return (
    <section
      className={cn(
        'relative isolate flex min-h-[450px] items-center overflow-hidden bg-[#141620] py-24 pb-12',
        'md:min-h-[500px] sm:py-28 sm:pb-16',
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
        className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(10,12,20,.88)_0%,rgba(10,12,20,.6)_55%,rgba(10,12,20,.2)_100%)]"
        aria-hidden
      />

      <div className="relative z-[2] mx-auto w-full max-w-shell px-6">
        <div className="max-w-[300px] sm:max-w-[420px] md:max-w-[560px]">
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

          {eyebrow ? (
            <span
              className={cn(
                'mb-4 inline-block text-[13px] font-600 uppercase tracking-[.14em] text-[#93c5fd]',
                reveal('up', 50),
                'text-left',
              )}
              {...revealAttrs()}
            >
              {eyebrow}
            </span>
          ) : null}

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

          {subheading ? (
            <p
              className={cn(
                'mb-8 max-w-[480px] text-[16px] leading-[1.65] text-white/85 sm:text-[17px]',
                reveal('up', 150),
                'text-left',
              )}
              {...revealAttrs()}
            >
              {subheading}
            </p>
          ) : null}

          {ctas && ctas.length > 0 ? (
            <div className={cn(reveal('up', 200), 'text-left')} {...revealAttrs()}>
              <CtaGroup ctas={ctas} />
            </div>
          ) : null}

          {proofStrip ? (
            <div
              className={cn(
                'mt-10 border-t border-white/15 pt-6',
                reveal('up', 250),
                'text-left',
              )}
              {...revealAttrs()}
            >
              {proofStrip}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
