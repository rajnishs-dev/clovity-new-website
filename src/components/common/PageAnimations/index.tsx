'use client';

import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useSmoothAnchors } from '@/hooks/useSmoothAnchors';

/**
 * Page-level motion for interior pages.
 *
 * The home page has `HomeAnimations`, which additionally owns a GSAP timeline for
 * its bespoke section tweens. About / Careers / Contact need only the two
 * behaviours the shared `site.js` provided on every page:
 *
 *  • the scroll-reveal observer that flips `data-shown` on `[data-reveal]`
 *  • smooth scrolling for same-page `#anchor` links (Careers links its hero
 *    buttons at `#open-roles` and `#culture`)
 *
 * Split out rather than reusing `HomeAnimations` because that component would
 * register ~14 ScrollTriggers against selectors that exist on the home page only.
 * They would each no-op, but GSAP would still be pulled into the bundle of three
 * pages that have no use for it.
 *
 * Renders its children in a fragment — nothing here needs a DOM node, unlike the
 * home page's GSAP context which must be scoped to an element.
 */
export function PageAnimations({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useScrollReveal(true, reducedMotion);
  useSmoothAnchors(true);

  return <>{children}</>;
}
