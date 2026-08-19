'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/cn';
import type { ImageSource } from '@/types/content';
import { AppImage } from '@/components/ui/Image';

/**
 * The hero photo's scroll parallax: the background drifts at 0.3x scroll
 * speed. Uses a ref + scroll listener (not a scroll-linked CSS variable)
 * since the transform needs the element's own `getBoundingClientRect().top`,
 * not just a global scroll offset. RAF-throttled and skipped under
 * `prefers-reduced-motion`.
 */
export function ParallaxImage({
  src,
  tabletSrc,
  mobileSrc,
  alt,
  objectPosition,
}: {
  src: ImageSource;
  /** Shown from 640px up to (not including) 1024px. Falls back to `src`. */
  tabletSrc?: ImageSource;
  /** Shown below 640px. Falls back to `tabletSrc`, then `src`. */
  mobileSrc?: ImageSource;
  alt: string;
  /**
   * `object-position` for the cropped photo. Defaults to the top-anchored
   * `center 0%` below.
   *
   * Exists because the default only suits the purpose-made 1920x600 banners: at
   * hero width those fill the band almost exactly, so anchoring to the top is a
   * no-op. Give it a source with a different aspect ratio - `/expertise/devsecops`
   * passes a 2220x3245 portrait - and `center 0%` shows the top ~20% of the image
   * and nothing else, which for that photo is out-of-focus ceiling. A caller that
   * knows where its subject sits can say so.
   *
   * An inline style rather than a class, because Tailwind cannot generate
   * `object-[...]` from a value that only exists at runtime.
   */
  objectPosition?: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || reducedMotion) return;

    let ticking = false;
    const update = () => {
      const scrolled = Math.max(0, -el.getBoundingClientRect().top);
      el.style.transform = `translateY(${scrolled * 0.3}px)`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reducedMotion]);

  const hasBreakpoints = Boolean(tabletSrc || mobileSrc);
  const imageClassName = 'object-cover';
  // Inline style wins over the class above, so the default stays in one place.
  const positionStyle = objectPosition ? { objectPosition } : {};

  if (!hasBreakpoints) {
    return (
      <div
        ref={wrapperRef}
        className="absolute inset-0 h-full w-full will-change-transform"
      >
        <AppImage
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          priority
          className={imageClassName}
          style={positionStyle}
        />
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 h-full w-full will-change-transform"
    >
      <AppImage
        src={mobileSrc ?? tabletSrc ?? src}
        alt={alt}
        fill
        sizes="100vw"
        priority
        className={cn(imageClassName, 'sm:hidden')}
        style={positionStyle}
      />
      <AppImage
        src={tabletSrc ?? src}
        alt={alt}
        fill
        sizes="100vw"
        priority
        className={cn(imageClassName, 'hidden sm:block lg:hidden')}
        style={positionStyle}
      />
      <AppImage
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        priority
        className={cn(imageClassName, 'hidden lg:block')}
        style={positionStyle}
      />
    </div>
  );
}
