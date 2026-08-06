'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Index rotator behind the public-sector card stack.
 *
 * Matches the legacy behaviour exactly: 5000ms autoplay, arrows jump and then
 * restart the timer, hover pauses and leaving resumes, and reduced motion
 * disables rotation entirely (which in the original left both cards visible in
 * normal block flow — the `enabled` flag reproduces that by never adding the
 * `gcs-slider` class).
 *
 * Added: the timer also pauses when the tab is hidden, so a backgrounded tab is
 * not burning a 5s interval and a wake-up does not fast-forward through slides.
 *
 * `count` is read directly rather than mirrored into a ref. Writing a ref during
 * render is a React anti-pattern (and a lint error); passing `count` through the
 * callback dependencies is both correct and simpler.
 */
export interface AutoRotateOptions {
  count: number;
  intervalMs?: number;
  enabled?: boolean;
}

export interface AutoRotate {
  index: number;
  goTo: (index: number) => void;
  next: () => void;
  previous: () => void;
  pause: () => void;
  resume: () => void;
}

export function useAutoRotate({
  count,
  intervalMs = 5000,
  enabled = true,
}: AutoRotateOptions): AutoRotate {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Bumping this restarts the interval — how an arrow click resets autoplay.
  const [cycle, setCycle] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      if (count <= 0) return;
      setIndex(((next % count) + count) % count);
      setCycle((c) => c + 1);
    },
    [count],
  );

  const next = useCallback(() => {
    if (count <= 0) return;
    setIndex((current) => (current + 1) % count);
    setCycle((c) => c + 1);
  }, [count]);

  const previous = useCallback(() => {
    if (count <= 0) return;
    setIndex((current) => (current - 1 + count) % count);
    setCycle((c) => c + 1);
  }, [count]);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  useEffect(() => {
    if (!enabled || paused || count <= 1) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [enabled, paused, intervalMs, count, cycle]);

  useEffect(() => {
    const onVisibilityChange = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  return { index, goTo, next, previous, pause, resume };
}
