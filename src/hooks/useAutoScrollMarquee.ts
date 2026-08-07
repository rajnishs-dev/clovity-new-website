'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Idle auto-scroll for a marquee the user can also drag/swipe by hand.
 *
 * The track is a real `overflow-x-auto` element rather than a CSS
 * `translateX` animation, specifically so touch/mouse dragging is native
 * browser scrolling: swipe left moves the content left (increasing
 * `scrollLeft`), swipe right moves it right, with no custom gesture code.
 * `requestAnimationFrame` only nudges `scrollLeft` forward while nothing is
 * pressed — `pausedRef` flips on `pointerdown` and back on release, so a drag
 * in progress is never fought by the auto-advance.
 *
 * Looping is the classic doubled-content trick: the track renders its items
 * twice back to back, and once `scrollLeft` passes the first copy's width
 * (`scrollWidth / 2`) it wraps by subtracting that width. Because the second
 * copy is pixel-identical to the first, the wrap is invisible forward. It is
 * not invisible backward — dragging past the start just stops at 0, same as
 * any ordinary scroll container — which is an acceptable trade for not
 * tripling the DOM.
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
