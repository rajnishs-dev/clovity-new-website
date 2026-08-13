'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Idle auto-scroll for a marquee the user can also drag/swipe by hand.
 *
 * The track is a real `overflow-x-auto` element rather than a CSS `translateX`
 * animation, so dragging is native scrolling with no custom gesture code.
 * `requestAnimationFrame` only nudges `scrollLeft` while nothing is pressed -
 * `pausedRef` flips on `pointerdown`/release so a drag is never fought by the
 * auto-advance.
 *
 * Looping uses the doubled-content trick: items render twice back to back, and
 * `scrollLeft` wraps by subtracting `scrollWidth / 2` once it passes the first
 * copy. The wrap is invisible going forward; dragging past the start just
 * stops at 0, an acceptable trade for not tripling the DOM.
 */
export interface UseAutoScrollMarqueeOptions {
  /** Px/second the track advances while idle. */
  speed?: number;
}

export interface AutoScrollMarquee {
  trackRef: React.RefObject<HTMLDivElement | null>;
}

export function useAutoScrollMarquee({
  speed = 40,
}: UseAutoScrollMarqueeOptions = {}): AutoScrollMarquee {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion) return;

    let frame = 0;
    let lastTime = 0;

    const tick = (time: number) => {
      if (lastTime === 0) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (!pausedRef.current) {
        const loopWidth = track.scrollWidth / 2;
        let next = track.scrollLeft + speed * dt;
        if (loopWidth > 0 && next >= loopWidth) next -= loopWidth;
        track.scrollLeft = next;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);

    const pause = () => {
      pausedRef.current = true;
    };
    const resume = () => {
      pausedRef.current = false;
    };

    track.addEventListener('pointerdown', pause);
    track.addEventListener('pointerup', resume);
    track.addEventListener('pointercancel', resume);
    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);

    return () => {
      window.cancelAnimationFrame(frame);
      track.removeEventListener('pointerdown', pause);
      track.removeEventListener('pointerup', resume);
      track.removeEventListener('pointercancel', resume);
      track.removeEventListener('mouseenter', pause);
      track.removeEventListener('mouseleave', resume);
    };
  }, [speed, reducedMotion]);

  return { trackRef };
}
