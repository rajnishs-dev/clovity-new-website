'use client';

import { useEffect } from 'react';

/**
 * Freeze background scrolling while an overlay is open.
 *
 * The legacy mobile menu set `document.body.style.overflow = 'hidden'` directly
 * and restored it to `''`. This does the same but restores the *previous*
 * inline value, so two overlays closing out of order cannot leave the page
 * permanently unscrollable.
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
