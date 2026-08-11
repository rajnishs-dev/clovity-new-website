'use client';

import { useAppSelector } from '@/store/hooks';

/**
 * The single source of truth for "should this animate?".
 *
 * Resolved once in StoreProvider and read from the store here, so every
 * animation (GSAP, Framer Motion, the canvas sphere, the carousels, the
 * counters) honours `prefers-reduced-motion` consistently - matching the
 * `reduceMotion` guards the legacy inline scripts used.
 */
export function useReducedMotion(): boolean {
  return useAppSelector((state) => state.theme.reducedMotion);
}

/** True once the OS motion preference has actually been read on the client. */
export function useMotionResolved(): boolean {
  return useAppSelector((state) => state.theme.motionResolved);
}
