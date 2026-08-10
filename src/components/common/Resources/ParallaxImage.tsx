'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { ImageSource } from '@/types/content';
import { AppImage } from '@/components/ui/Image';

/**
 * The hero photo's scroll parallax - ported from the legacy
 * `blog.html`/`case-study.html`/`events.html` inline scripts: the background
 * drifts down at 0.3x scroll speed, at a 1.15x scale so the drift never
 * exposes an edge.
 *
 * A `ref` + a raw scroll listener rather than a scroll-linked CSS variable,
 * because the transform has to react to the element's own position (it needs
 * `getBoundingClientRect().top`), not just a global scroll offset - this
 * component works no matter where its hero sits on the page.
 * `requestAnimationFrame`-throttled, and skipped entirely under
 * `prefers-reduced-motion`, same as the rest of this app's motion.
 */
export function ParallaxImage({
  src,
  alt,
}: {
  src: ImageSource;
  alt: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || reducedMotion) return;

    let ticking = false;
    const update = () => {
      const scrolled = Math.max(0, -el.getBoundingClientRect().top);
      el.style.transform = `translateY(${scrolled * 0.3}px) scale(1.15)`;
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

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 h-full w-full scale-[1.15] will-change-transform"
    >
      <AppImage
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        priority
        className="object-cover object-[center_30%]"
      />
    </div>
  );
}
