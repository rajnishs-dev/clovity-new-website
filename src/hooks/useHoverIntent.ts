'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Port of the legacy "hover-intent bridge" for the full-width mega menu.
 *
 * Why it exists (comment preserved from site.js): the panel is `position: fixed`
 * and sits well below its trigger, so plain CSS `:hover` breaks the instant the
 * cursor crosses the gap between them. A short close delay lets the cursor
 * travel from the nav link down into the panel.
 *
 * Same semantics as the original:
 *   • opening one item closes the others immediately (no delay)
 *   • leaving schedules a 250ms close that re-entering cancels
 *
 * Added: Escape closes the panel, which the original could not do.
 */
const CLOSE_DELAY_MS = 250;

export function useHoverIntent<TId extends string>(): {
  openId: TId | null;
  open: (id: TId) => void;
  scheduleClose: (id: TId) => void;
  closeNow: () => void;
} {
  const [openId, setOpenId] = useState<TId | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const open = useCallback(
    (id: TId) => {
      clearTimer();
      setOpenId(id);
    },
    [clearTimer],
  );

  const closeNow = useCallback(() => {
    clearTimer();
    setOpenId(null);
  }, [clearTimer]);

  const scheduleClose = useCallback(
    (id: TId) => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setOpenId((current) => (current === id ? null : current));
      }, CLOSE_DELAY_MS);
    },
    [clearTimer],
  );

  useEffect(() => clearTimer, [clearTimer]);

  // Escape dismisses the open panel - keyboard parity the legacy nav lacked.
  useEffect(() => {
    if (openId === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeNow();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [openId, closeNow]);

  return { openId, open, scheduleClose, closeNow };
}
