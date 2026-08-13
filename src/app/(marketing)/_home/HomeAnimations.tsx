'use client';

import { useMemo } from 'react';
import { useGsapReveal, type RevealTween } from '@/hooks/useGsapReveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useSmoothAnchors } from '@/hooks/useSmoothAnchors';

/**
 * All page-level motion for the home page, in one place, so every tween
 * lives in a single `gsap.context()` reverted on unmount - previously
 * ScrollTriggers survived client-side navigation and kept firing against
 * detached nodes.
 *
 * Tween values are copied unchanged from the original for identical motion.
 * Selectors not present on the page are skipped rather than throwing.
 *
 * Renders nothing: it only scopes the GSAP context around the page.
 */
export function HomeAnimations({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  useScrollReveal(true, reducedMotion);
  useSmoothAnchors(true);

  const tweens = useMemo<RevealTween[]>(
    () => [
      // ── Pulse AI: copy slides in from the left, sphere scales up ──
      {
        targets: '.pulse-copy',
        from: { opacity: 0, x: -24 },
        to: { opacity: 1, x: 0 },
        duration: 0.6,
        trigger: '#pulse-ai-spotlight',
      },
      {
        targets: '.sphere-wrap',
        from: { opacity: 0, scale: 0.94 },
        to: { opacity: 1, scale: 1 },
        duration: 0.65,
        trigger: '#pulse-ai-spotlight',
      },

      // ── AI delivery: capability cards pop in with stagger ──
      {
        targets: '.deliver-card',
        from: { opacity: 0, y: 24, scale: 0.96 },
        to: { opacity: 1, y: 0, scale: 1 },
        duration: 0.5,
        stagger: 0.08,
        trigger: '#ai-delivery',
      },

      // ── Migration flow: source card, steps, destination card ──
      {
        targets: '.mflow-card:first-child',
        from: { opacity: 0, x: -24 },
        to: { opacity: 1, x: 0 },
        duration: 0.55,
        trigger: '.mflow',
      },
      {
        targets: '.mflow-step',
        from: { opacity: 0, y: 16 },
        to: { opacity: 1, y: 0 },
        duration: 0.4,
        stagger: 0.08,
        trigger: '.mflow-steps',
      },
      {
        targets: '.mflow-cloud',
        from: { opacity: 0, x: 24 },
        to: { opacity: 1, x: 0 },
        duration: 0.55,
        trigger: '.mflow',
      },

      // ── Marketplace app tiles ──
      {
        targets: '.app-card',
        from: { opacity: 0, y: 20, scale: 0.94 },
        to: { opacity: 1, y: 0, scale: 1 },
        duration: 0.45,
        ease: 'back.out(1.4)',
        stagger: 0.06,
        trigger: '#marketplace',
      },

      // ── Results: the numbers themselves scale in ──
      {
        targets: '#results .stat-num',
        from: { scale: 0.8 },
        to: { scale: 1 },
        duration: 0.5,
        ease: 'back.out(1.7)',
        stagger: 0.07,
        trigger: '#results',
      },

      // ── Credential badges ──
      {
        targets: '.cred-badge',
        from: { opacity: 0, y: 14, scale: 0.92 },
        to: { opacity: 1, y: 0, scale: 1 },
        duration: 0.4,
        ease: 'back.out(1.4)',
        stagger: 0.05,
        trigger: '.cred-badge-grid',
      },

      // ── Final CTA card ──
      {
        targets: '.cta-card',
        from: { opacity: 0, y: 36 },
        to: { opacity: 1, y: 0 },
        duration: 0.6,
        trigger: '.cta-sec',
      },

      // ── Forward-deployed engineers: proof cards + sparkline draw ──
      {
        targets: '.fde-float',
        from: { opacity: 0, y: 22, scale: 0.75 },
        to: { opacity: 1, y: 0, scale: 1 },
        duration: 0.55,
        ease: 'back.out(1.5)',
        stagger: 0.16,
        trigger: '.fde-photo-wrap',
      },
      {
        targets: '.fde-spark polyline',
        from: { strokeDashoffset: 180 },
        to: { strokeDashoffset: 0 },
        duration: 1,
        trigger: '.fde-photo-wrap',
      },
    ],
    [],
  );

  const containerRef = useGsapReveal<HTMLDivElement>({
    tweens,
    reducedMotion,
    onSetup: ({ container, gsap }) => {
      // ── Ken Burns: slow zoom-out on the FDE photo while it is in view ──
      if (container.querySelector('.fde-photo img')) {
        gsap.fromTo(
          '.fde-photo img',
          { scale: 1.12 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.fde-photo-wrap',
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        );
      }
    },
  });

  return <div ref={containerRef}>{children}</div>;
}
