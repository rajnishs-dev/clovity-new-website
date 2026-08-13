'use client';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollReveal } from '@/hooks/useScrollReveal';

/**
 * Arms the site's scroll-reveal observer (`useScrollReveal`) for a page.
 *
 * Elements using `reveal()`/`revealAttrs()` render at `opacity-0` until
 * something flips `data-shown="true"` - without this mounted somewhere in
 * the tree, they stay invisible forever, not just unanimated. Deliberately
 * not `<HomeAnimations>`, which also drives home-page-only GSAP tweens that
 * would be dead weight here. `useScrollReveal` queries `document` globally,
 * so one instance anywhere in the page is enough.
 */
export function RevealScope() {
  const reducedMotion = useReducedMotion();
  useScrollReveal(true, reducedMotion);
  return null;
}
