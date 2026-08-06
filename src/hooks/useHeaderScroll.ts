'use client';

import { useEffect, useState } from 'react';

/**
 * Port of the legacy `site.js` navbar block: add `.scrolled` past 24px.
 *
 * Identical threshold and passive listener, plus two improvements:
 *   • the read is batched into a rAF, so a fast scroll cannot queue dozens of
 *     synchronous `scrollY` reads and cause layout thrash
 *   • the initial value is computed on mount, which matters after a client-side
 *     navigation that restores a scrolled position
 */
const SCROLL_THRESHOLD = 24;

export function useHeaderScroll(): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const read = () => {
      frame = 0;
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return scrolled;
}
