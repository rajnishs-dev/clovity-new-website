'use client';

import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` in the browser, `useEffect` on the server.
 *
 * GSAP timelines and measurement code need to run before paint to avoid a
 * visible flash, but `useLayoutEffect` warns during SSR. This picks the right
 * one without the warning.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
