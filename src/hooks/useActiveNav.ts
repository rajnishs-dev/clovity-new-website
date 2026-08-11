'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setActiveNav, setCurrentPath } from '@/store/slices/navigationSlice';
import type { ActiveNav } from '@/types/navigation';

/**
 * Publish the current page's nav identity into the store.
 *
 * Replaces the legacy `<body data-nav="expertise" data-nav-item="ai">` plus the
 * DOM sweep in `site.js` that added `.active` to matching elements. Each page
 * declares its own pair once; the header, mobile drawer and footer read it and
 * render `.active` declaratively.
 *
 * Destructures `group`/`item` so the effect depends on those primitives rather
 * than on a fresh object identity every render - otherwise an inline
 * `useActiveNav({ group: 'home' })` would re-dispatch on every render.
 */
export function useActiveNav(active: ActiveNav): void {
  const { group, item } = active;
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(setActiveNav(item === undefined ? { group } : { group, item }));
  }, [dispatch, group, item]);

  useEffect(() => {
    dispatch(setCurrentPath(pathname));
  }, [dispatch, pathname]);
}
