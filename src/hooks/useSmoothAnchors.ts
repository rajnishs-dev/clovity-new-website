'use client';

import { useEffect } from 'react';

/**
 * Port of the legacy `site.js` smooth-anchor block.
 *
 * The original bound a click listener to every `a[href^="#"]` on load, so links
 * added later (the mega menu, the rendered card rails) were never covered. This
 * uses one delegated listener on the document, which covers everything —
 * including nodes React mounts after hydration.
 *
 * `html { scroll-behavior: smooth }` in theme.css already handles most cases;
 * this exists so the behaviour is identical in browsers where a programmatic
 * jump would otherwise be instant, and so `#`-only links do not jump to top.
 */
export function useSmoothAnchors(enabled = true): void {
  useEffect(() => {
    if (!enabled) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.(
        'a[href^="#"]',
      );
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;

      let target: Element | null = null;
      try {
        target = document.querySelector(hash);
      } catch {
        return; // Not a valid selector — let the browser deal with it.
      }
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [enabled]);
}
