'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { MilestoneStep } from '@/types/content';

const TRIGGER_VIEWPORT_RATIO = 0.5;

/** Half the 56px number chip - the vertical centre a step's fill measures from. */
const CHIP_HALF = 28;

export function MilestoneTimeline({ steps }: { steps: MilestoneStep[] }) {
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [fills, setFills] = useState<number[]>(() => steps.map(() => 0));
  const [activeCount, setActiveCount] = useState(0);
  const reducedMotion = useReducedMotion();

  // Reduced motion skips the scroll observer, so its resting state is derived here instead.
  const displayFills = reducedMotion ? steps.map(() => 1) : fills;
  const displayActiveCount = reducedMotion ? steps.length : activeCount;

  useEffect(() => {
    if (reducedMotion) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const triggerY = window.innerHeight * TRIGGER_VIEWPORT_RATIO;
      const centers = stepRefs.current.map(
        (el) => (el?.getBoundingClientRect().top ?? 0) + CHIP_HALF,
      );

      setFills(
        centers.map((centerY, index) => {
          const nextCenterY = centers[index + 1];
          const span =
            nextCenterY === undefined ? 0 : nextCenterY - centerY;
          if (span <= 0) return centerY <= triggerY ? 1 : 0;
          return Math.min(1, Math.max(0, (triggerY - centerY) / span));
        }),
      );
      setActiveCount(centers.filter((centerY) => centerY <= triggerY).length);
    };

    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <div
      className={cn('relative', revealAligned('left', 'right'))}
      {...revealAttrs()}
    >
      {steps.map((step, index) => {
        const active = index < displayActiveCount;
        return (
          <div
            key={step.id}
            ref={(el) => {
              stepRefs.current[index] = el;
            }}
            style={
              {
                '--fill': `${(displayFills[index] ?? 0) * 100}%`,
              } as CSSProperties
            }
            className={cn(
              'relative grid grid-cols-[56px_1fr] gap-6 pb-10 last:pb-0',
              '[&:not(:last-child)]:before:absolute [&:not(:last-child)]:before:bottom-0',
              '[&:not(:last-child)]:before:left-[27px] [&:not(:last-child)]:before:top-[56px]',
              '[&:not(:last-child)]:before:w-[2px] [&:not(:last-child)]:before:bg-line',
              '[&:not(:last-child)]:before:content-[""]',
              '[&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:left-[27px] [&:not(:last-child)]:after:top-[56px]',
              '[&:not(:last-child)]:after:h-[var(--fill)] [&:not(:last-child)]:after:w-[2px]',
              '[&:not(:last-child)]:after:bg-brand-200',
              '[&:not(:last-child)]:after:transition-[height] [&:not(:last-child)]:after:duration-300 [&:not(:last-child)]:after:ease-native',
              '[&:not(:last-child)]:after:content-[""]',
            )}
          >
            <div
              className={cn(
                'z-[1] flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-2xl border-2 text-[20px] font-900',
                '[transition:background_.3s,border-color_.3s,color_.3s,box-shadow_.3s]',
                active
                  ? 'border-brand-200 bg-brand-100 text-brand-600 shadow-[0_6px_16px_rgba(37,99,235,.15)]'
                  : 'border-transparent bg-line-faint text-faint shadow-none',
              )}
            >
              {index + 1}
            </div>
            <div>
              <span className="mb-2.5 inline-block text-[11.5px] font-800 uppercase tracking-[.08em] text-brand-600">
                {step.eyebrow}
              </span>
              <b className="mb-1.5 block text-[18px] font-500 text-title">
                {step.title}
              </b>
              <p className="m-0 text-[15px] leading-[1.7] text-muted">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
