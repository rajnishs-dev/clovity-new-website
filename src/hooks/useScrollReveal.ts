'use client';

import { useEffect } from 'react';

/**
 * Drives the scroll-reveal utilities in `lib/reveal.ts`.
 *
 * Observes `[data-reveal]` and sets `data-shown="true"` once an element crosses
 * the threshold. All styling lives in Tailwind utilities on the element itself -
 * this hook only flips one attribute, so there is no JS-to-CSS class contract to
 * keep in sync.
 *
 * Behaviour kept from the legacy `site.js` block:
 *   • threshold 0.12, rootMargin '0px 0px -40px 0px'
 *   • unobserves after the first reveal, so content never re-hides
 *
 * Improvements:
 *   • stagger is `transition-delay` on the element, not a `setTimeout` - nothing
 *     to leak on unmount
 *   • a MutationObserver picks up nodes React mounts after hydration (the card
 *     rails re-render on tab change); the original bound once on load and missed
 *     them
 *   • reduced motion reveals immediately instead of animating
 */
/**
 * Matches a revealed element either way it was marked.
 *
 * `[data-reveal]` is the explicit opt-in. `.transition-reveal` is the class every
 * `reveal()` string contains, and it is matched too so the classes alone are
 * sufficient - because relying on the caller to add *both* a class string and a
 * separate attribute is a foot-gun that already fired: the Field Notes tab list
 * got the utilities without the attribute and sat at `opacity: 0` permanently,
 * invisible to the observer and to the 2.5s fallback alike.
 *
 * `revealAttrs()` is still available and still worth using as a readable signal
 * in JSX, but it is no longer load-bearing.
 */
const REVEAL_SELECTOR = '[data-reveal], .transition-reveal';

/** Matches the legacy `setTimeout(… 2500)` that added `.sr-fallback` to <html>. */
const FALLBACK_MS = 2500;

export function useScrollReveal(enabled = true, reducedMotion = false): void {
  useEffect(() => {
    if (!enabled) return;

    const show = (el: HTMLElement) => {
      el.dataset['shown'] = 'true';
    };

    // Reduced motion: reveal everything now, no observer at all.
    if (reducedMotion) {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(show);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );

    const observeAll = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        if (el.dataset['shown'] !== 'true') observer.observe(el);
      });
    };

    observeAll(document);

    /**
     * Blanket reveal after 2.5s - the legacy site's safety net, kept.
     *
     * The original armed `setTimeout(… 2500)` on every load and then forced every
     * `.sr` element visible with `!important`. So the reveal animation only ever
     * played for content that entered the viewport in the first 2.5 seconds; after
     * that everything was simply shown.
     *
     * Reproducing it is both faithful and the right call defensively: without it, a
     * missed IntersectionObserver callback - a fast programmatic scroll is enough to
     * cause one - leaves content stuck at opacity 0 with no way to recover. Content
     * being visible always wins over content being animated.
     */
    const fallback = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(show);
    }, FALLBACK_MS);

    // Catch elements mounted after hydration.
    const mutationObserver = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          if (
            node.matches(REVEAL_SELECTOR) &&
            node.dataset['shown'] !== 'true'
          ) {
            observer.observe(node);
          }
          observeAll(node);
        }
      }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      clearTimeout(fallback);
    };
  }, [enabled, reducedMotion]);
}
