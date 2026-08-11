'use client';

import { useEffect, useRef, useState } from 'react';
import { formatNumber } from '@/lib/format';

/**
 * Animated counter for the results band.
 *
 * The legacy page ran this twice - once in `site.js` with a 16ms `setInterval`,
 * and again via a GSAP `ScrollTrigger` in the page script. Both fought over the
 * same element. This is the single implementation:
 *   • 2000ms duration and thousands separators, same as the original
 *   • rAF instead of `setInterval`, so it stays in step with the display and
 *     cannot drift or overshoot on a busy main thread
 *   • fires once, on entering the viewport at 50% (the original threshold)
 *   • reduced motion shows the final value immediately
 *
 * The reduced-motion case is *derived*, not written through `setState` in an
 * effect - that would trigger a cascading render on mount for no benefit, and is
 * the pattern `react-hooks/set-state-in-effect` exists to catch.
 */
export interface CountUpOptions {
  target: number;
  durationMs?: number;
  reducedMotion?: boolean;
  /** Visibility fraction that starts the count. */
  threshold?: number;
}

export function useCountUp({
  target,
  durationMs = 2000,
  reducedMotion = false,
  threshold = 0.5,
}: CountUpOptions): {
  ref: React.RefObject<HTMLSpanElement | null>;
  display: string;
} {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [animatedValue, setAnimatedValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (reducedMotion) return;

    const element = ref.current;
    if (!element) return;

    let frame = 0;
    let startTime = 0;

    const tick = (now: number) => {
      if (startTime === 0) startTime = now;
      const progress = Math.min(1, (now - startTime) / durationMs);
      // easeOutQuad - matches the 'power2.out' feel of the GSAP version.
      const eased = 1 - (1 - progress) * (1 - progress);
      setAnimatedValue(Math.floor(eased * target));
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        setAnimatedValue(target);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            observer.unobserve(entry.target);
            frame = window.requestAnimationFrame(tick);
          }
        }
      },
      { threshold },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [target, durationMs, reducedMotion, threshold]);

  return {
    ref,
    display: formatNumber(reducedMotion ? target : animatedValue),
  };
}
