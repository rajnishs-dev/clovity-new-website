'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

/**
 * Subscribe to a CSS media query.
 *
 * Uses `useSyncExternalStore`, which is the correct primitive here: `matchMedia`
 * is an external store, and this is exactly the case the API exists for. It also
 * avoids the `useEffect` + `setState` pattern, which causes a cascading render on
 * mount and gets flagged by `react-hooks/set-state-in-effect`.
 *
 * The server snapshot is `false` so the SSR HTML matches the first client render
 * and hydration cannot mismatch. Components that must not flash on a match
 * should also read `hasResolved`.
 */
function noopSubscribe(): () => void {
  return () => {};
}

export function useMediaQuery(query: string): {
  matches: boolean;
  hasResolved: boolean;
} {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onStoreChange);
      return () => list.removeEventListener('change', onStoreChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  // Server render: assume no match, so the markup is identical on both sides.
  const getServerSnapshot = useCallback(() => false, []);

  const matches = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  // True on the client, false during SSR — no state, no effect.
  const hasResolved = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  return useMemo(() => ({ matches, hasResolved }), [matches, hasResolved]);
}

/** `(hover: hover) and (pointer: fine)` — a real mouse, not a touch screen. */
export function useHasFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)').matches;
}

/** Matches the `lg` breakpoint the header uses to swap desktop/mobile nav. */
export function useIsDesktopNav(): { matches: boolean; hasResolved: boolean } {
  return useMediaQuery('(min-width: 1024px)');
}
