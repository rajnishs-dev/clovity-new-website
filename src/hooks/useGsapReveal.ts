'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * GSAP + ScrollTrigger, wrapped for the App Router.
 *
 * The legacy page ran one long inline script with a `rv(...)` helper and a 3s
 * "safety net" that force-revealed anything still at opacity 0. That approach
 * leaks on client-side navigation - every ScrollTrigger it creates survives the
 * route change and keeps firing against detached nodes.
 *
 * This wrapper keeps the exact same animation definitions but scopes them to a
 * `gsap.context()` bound to a container element, so `ctx.revert()` on unmount
 * removes every tween, ScrollTrigger and inline style GSAP added. The safety
 * net is therefore no longer needed - nothing can be left stuck invisible.
 */

gsap.registerPlugin(ScrollTrigger);

export interface RevealTween {
  /** Selector, scoped to the container. */
  targets: string;
  from: gsap.TweenVars;
  to: gsap.TweenVars;
  /** Selector for the ScrollTrigger element, scoped to the container. */
  trigger: string;
  stagger?: number;
  duration?: number;
  ease?: string;
}

export interface UseGsapRevealOptions {
  tweens: RevealTween[];
  reducedMotion: boolean;
  /** Extra work inside the same context, e.g. scrub-based parallax. */
  onSetup?: (context: { container: HTMLElement; gsap: typeof gsap }) => void;
}

export function useGsapReveal<TElement extends HTMLElement = HTMLDivElement>({
  tweens,
  reducedMotion,
  onSetup,
}: UseGsapRevealOptions): React.RefObject<TElement | null> {
  const containerRef = useRef<TElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    const ctx = gsap.context(() => {
      for (const tween of tweens) {
        const {
          targets,
          from,
          to,
          trigger,
          stagger = 0,
          duration = 0.55,
          ease = 'power2.out',
        } = tween;

        if (
          container.querySelector(targets) === null ||
          container.querySelector(trigger) === null
        ) {
          continue;
        }

        gsap.fromTo(
          targets,
          // immediateRender:false is what stops a failed ScrollTrigger from
          // leaving the element stuck at its `from` state.
          { immediateRender: false, ...from },
          {
            ...to,
            duration,
            ease,
            stagger,
            scrollTrigger: { trigger, start: 'top 85%' },
          },
        );
      }

      onSetup?.({ container, gsap });
    }, container);

    return () => ctx.revert();
  }, [tweens, reducedMotion, onSetup]);

  return containerRef;
}

export { gsap, ScrollTrigger };
