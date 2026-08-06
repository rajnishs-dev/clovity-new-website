'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { makePersistor, makeStore } from './index';
import { setHydrated } from './slices/globalSlice';
import { setReducedMotion } from './slices/themeSlice';

/**
 * Client-side Redux provider.
 *
 * Three deliberate choices:
 *
 *  1. The store is created via a lazy `useState` initializer, not at module
 *     scope. Module scope would share one store across every SSR request, leaking
 *     one visitor's state into another's render. The initializer runs exactly
 *     once per mount and — unlike the `useRef` variant — never reads a ref during
 *     render, which React 19 correctly flags.
 *
 *  2. `PersistGate` is intentionally NOT used. Gating render on rehydration would
 *     blank the first paint and throw away the server-rendered HTML, which would
 *     tank LCP on a marketing site. Persistence here only restores preferences,
 *     so letting it land a tick later is strictly better.
 *
 *  3. Reduced-motion is resolved once, here, and pushed into the store for every
 *     animation hook to read — one `matchMedia` subscription instead of a dozen.
 */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);

  useEffect(() => {
    // Created here rather than during render: it touches localStorage.
    const persistor = makePersistor(store);
    store.dispatch(setHydrated());

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => store.dispatch(setReducedMotion(query.matches));
    sync();
    query.addEventListener('change', sync);

    return () => {
      query.removeEventListener('change', sync);
      void persistor.flush();
    };
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
