'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Index rotator behind the public-sector card stack.
 *
 * Matches the legacy 5000ms autoplay/arrow-reset/hover-pause behaviour. Reduced
 * motion disables rotation entirely (the `enabled` flag never adds the
 * `gcs-slider` class) rather than just stopping it. Also pauses when the tab is
 * hidden, so a background tab doesn't fast-forward through slides on wake.
 *
 * `count` is read directly rather than mirrored into a ref - writing a ref
 * during render is a React anti-pattern (and a lint error).
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
  // Bumping this restarts the interval - how an arrow click resets autoplay.
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
