'use client';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/**
 * Arms the site's scroll-reveal observer (`useScrollReveal`) for a page.
 *
 * `reveal()`/`revealAttrs()` (see `lib/reveal.ts`) render an element at
 * `opacity-0` until something flips `data-shown="true"` on it - on the home
 * page that "something" is `<HomeAnimations>`. Every resource page (blog,
 * case studies, events, webinars, news) uses `BannerHero`, `FeaturedResourceCard`
 * and `<FinalCta>`, all of which use `reveal()` - without this mounted
 * somewhere in the tree, all three stay invisible forever, not just
 * unanimated. `useScrollReveal` queries `document` globally rather than a
 * scoped ref, so one instance anywhere in the page is enough; it doesn't need
 * to wrap `children`.
 *
 * Deliberately not `<HomeAnimations>` - that component also drives a set of
 * GSAP tweens keyed to home-page-only class names (`.pulse-copy`,
 * `.mflow-card`, `.fde-float`, …), which would be dead weight here.
 */
export function RevealScope() {
  const reducedMotion = useReducedMotion();
  useScrollReveal(true, reducedMotion);
  return null;
}
