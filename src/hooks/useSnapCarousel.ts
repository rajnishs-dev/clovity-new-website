'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Shared behaviour for the two scroll-snap rails on the home page: the AI
 * Delivery capability carousel and the Expert Insights card rail.
 *
 * Faithful to the legacy scripts:
 *   • arrows step by one card width + gap, with `behavior: 'smooth'`
 *   • arrows disable at each end using the same `scrollLeft <= 8` /
 *     `>= scrollWidth - clientWidth - 2` tests
 *   • the active dot is the card whose offset is closest to `scrollLeft`
 *
 * Improvements over the original: the scroll listener is passive and
 * rAF-batched, and a ResizeObserver re-measures when the rail's own box changes
 * (the original only listened to `window.resize`, so it went stale when the
 * mega menu or a font swap changed the layout).
 */
export interface SnapCarouselOptions {
  /** Gap between cards in px - must match the CSS `gap`. */
  gap: number;
  /** Number of cards, used to size the dot list. */
  itemCount: number;
}

export interface SnapCarousel {
  trackRef: React.RefObject<HTMLDivElement | null>;
  activeIndex: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
  scrollToIndex: (index: number) => void;
}

const START_EPSILON = 8;
const END_EPSILON = 2;

export function useSnapCarousel({
  gap,
  itemCount,
}: SnapCarouselOptions): SnapCarousel {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(itemCount > 1);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const max = track.scrollWidth - track.clientWidth - END_EPSILON;
    setCanScrollPrev(track.scrollLeft > START_EPSILON);
    setCanScrollNext(track.scrollLeft < max);

    const cards = Array.from(track.children) as HTMLElement[];
    let closest = 0;
    let minDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const distance = Math.abs(
        card.offsetLeft - track.offsetLeft - track.scrollLeft,
      );
      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });
    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          measure();
        });
      }
    };

    measure();
    track.addEventListener('scroll', onScroll, { passive: true });

    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(track);

    return () => {
      track.removeEventListener('scroll', onScroll);
      resizeObserver.disconnect();
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [measure, itemCount]);

  const step = useCallback(
    (direction: 1 | -1) => {
      const track = trackRef.current;
      const first = track?.firstElementChild as HTMLElement | null;
      if (!track || !first) return;
      track.scrollBy({
        left: (first.offsetWidth + gap) * direction,
        behavior: 'smooth',
      });
    },
    [gap],
  );

  const scrollPrev = useCallback(() => step(-1), [step]);
  const scrollNext = useCallback(() => step(1), [step]);

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({
      left: card.offsetLeft - track.offsetLeft,
      behavior: 'smooth',
    });
  }, []);

  return {
    trackRef,
    activeIndex,
    canScrollPrev,
    canScrollNext,
    scrollPrev,
    scrollNext,
    scrollToIndex,
  };
}
