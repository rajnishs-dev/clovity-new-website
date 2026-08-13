'use client';

import type { ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useSmoothAnchors } from '@/hooks/useSmoothAnchors';

/**
 * Page-level motion for interior pages (About/Careers/Contact): scroll-reveal
 * and smooth-scrolling anchors, the two behaviours `site.js` provided on
 * every page. Split out from `HomeAnimations` so these pages don't pull in
 * GSAP for ~14 ScrollTriggers that would just no-op against selectors that
 * only exist on the home page.
 */
export function PageAnimations({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();

  useScrollReveal(true, reducedMotion);
  useSmoothAnchors(true);

  return <>{children}</>;
}
