'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { BreadcrumbItem } from '@/types/seo';
import { Icon } from '@/components/ui/Icon';
import { AppImage, IMAGE_SIZES } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';

/**
 * The dark photo hero shared by Careers and Contact.
 *
 * Both declare the same block in their own page stylesheet under two different
 * prefixes (`.cr-hero`, `.ct-hero`) with the same values: 550px minimum height,
 * 150px top / 56px bottom padding, `#0a0b10` behind the photo, the photo
 * pre-scaled to 1.12 so the parallax has room to travel, and a left-to-right
 * graphite scrim over it. Everything the two pages actually differ on is a prop:
 *
 *  • `overlay` - the scrim gradient. Careers holds its mid-stops slightly more
 *    opaque than Contact's.
 *  • `objectPosition` - which part of the photograph stays in frame (32% / 40%
 *    from the top).
 *  • `orbs` - Careers is the only one of the two that renders them.
 *  • `titleClassName` - the max-width and bottom margin on the h1, which differ by
 *    ~20px per page.
 *
 * About Us used to be the third page here, but its hero now runs through
 * `BannerHero` (the same layout as Blog/Events/Webinars/News/Case Studies)
 * instead - see `about-us/page.tsx`.
 *
 * A CLIENT COMPONENT, for one reason: the parallax. Each page ran an inline script
 * that drove `transform` from the scroll position, and reproducing it needs a
 * listener. Everything else here would server-render happily, and still does - this
 * is prerendered HTML; the `useEffect` only adds the listener afterwards.
 */

/** The photo is pre-scaled by this much so the parallax never exposes an edge. */
const HERO_SCALE = 1.12;

/** Parallax rate: the photo travels at 30% of the page's scroll. */
const PARALLAX_RATE = 0.3;

export interface PageHeroProps {
  id: string;
  image: { src: string; alt?: string };
  /** CSS `object-position` for the photo, e.g. `'center 30%'`. */
  objectPosition: string;
  /** CSS `background` for the scrim laid over the photo. */
  overlay: string;
  /** Visible trail. The last entry is the current page and is not linked. */
  crumbs: BreadcrumbItem[];
  /** Classes for the crumb row - the three pages differ only in bottom margin. */
  crumbClassName?: string;
  title: ReactNode;
  /** Classes for the h1 - carries the per-page max-width and bottom margin. */
  titleClassName?: string;
  lead: ReactNode;
  leadClassName?: string;
  /** Decorative gradient orbs. Careers only. */
  orbs?: ReactNode;
  /** Buttons under the lead. Careers only. */
  actions?: ReactNode;
}

export function PageHero({
  id,
  image,
  objectPosition,
  overlay,
  crumbs,
  crumbClassName,
  title,
  titleClassName,
  lead,
  leadClassName,
  orbs,
  actions,
}: PageHeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const img = mediaRef.current?.querySelector('img');
    if (!section || !img) return;
    // Same guard the inline script used - no parallax for reduced motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ticking = false;

    const update = () => {
      // How far the hero's top edge has passed above the viewport. Clamped at 0
      // so the photo never travels while the hero is still below the fold.
      const scrolled = Math.max(0, -section.getBoundingClientRect().top);
      img.style.transform = `translateY(${scrolled * PARALLAX_RATE}px) scale(${HERO_SCALE})`;
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative flex min-h-[550px] items-center overflow-hidden bg-[#0a0b10] pb-14 pt-[150px]"
    >
      <div ref={mediaRef} aria-hidden className="absolute inset-0 z-0">
        <AppImage
          src={image.src}
          alt={image.alt ?? ''}
          fill
          priority
          quality={75}
          sizes={IMAGE_SIZES.full}
          className="h-full w-full object-cover"
          style={{
            objectPosition,
            transform: `scale(${HERO_SCALE})`,
            willChange: 'transform',
          }}
        />
        {/* The scrim. A real element rather than an `after:` variant, because the
            gradient has five colour stops and reads far better as a value than as
            an arbitrary-property class. */}
        <span className="absolute inset-0" style={{ background: overlay }} />
      </div>

      {orbs ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        >
          {orbs}
        </div>
      ) : null}

      <div className="relative mx-auto w-full max-w-shell px-6">
        <nav
          aria-label="Breadcrumb"
          className={cn(
            'relative z-[2] flex items-center gap-2 text-[13px] font-600 text-white/[.55]',
            crumbClassName,
          )}
        >
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <span key={crumb.href} className="flex items-center gap-2">
                {isLast ? (
                  <span aria-current="page">{crumb.name}</span>
                ) : (
                  <SmartLink
                    href={crumb.href}
                    className="text-white/80 no-underline transition-colors hover:text-white"
                  >
                    {crumb.name}
                  </SmartLink>
                )}
                {isLast ? null : (
                  <Icon name="chevron-right" className="text-[9px]" />
                )}
              </span>
            );
          })}
        </nav>

        <h1
          className={cn(
            'relative z-[2] text-[clamp(28px,3.8vw,54px)] font-normal leading-[1.16] tracking-[-0.03em] text-white',
            titleClassName,
          )}
        >
          {title}
        </h1>

        <p
          className={cn(
            'relative z-[2] max-w-[600px] text-[16px] font-500 leading-[1.65] text-white/[.88]',
            leadClassName,
          )}
        >
          {lead}
        </p>

        {actions ? (
          <div className="relative z-[2] flex flex-wrap gap-3.5">{actions}</div>
        ) : null}
      </div>
    </section>
  );
}

/**
 * The `.accent` span inside a hero headline - the light-blue second line.
 *
 * A named export rather than a class string at each call site, because all three
 * heroes use it and it is the one piece of the headline that carries meaning
 * (the emphasised half of the claim) rather than layout.
 */
export function HeroAccent({ children }: { children: ReactNode }) {
  return <span className="text-[#93c5fd]">{children}</span>;
}

/** The two orbs on the Careers hero. Exported so only that page pays for them. */
export function CareersHeroOrbs() {
  return (
    <>
      <span className="absolute -top-[140px] right-[-90px] h-[360px] w-[360px] rounded-[50%] bg-[radial-gradient(circle_at_32%_32%,#6ea3ff,#3568e0_65%,#1c3f9e_100%)] opacity-[.28] blur-[10px] motion-safe:animate-hero-orb" />
      <span className="absolute -bottom-[90px] left-[16%] h-[220px] w-[220px] rounded-[50%] bg-[radial-gradient(circle_at_35%_30%,#fb923c,#ea580c_70%)] opacity-[.16] blur-[12px] motion-safe:animate-hero-orb-reverse" />
    </>
  );
}
