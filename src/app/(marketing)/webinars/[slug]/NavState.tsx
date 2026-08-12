'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/** A webinar recording is still "in" Webinars for nav-highlight purposes - see `../NavState.tsx`. */
export function NavState() {
  useActiveNav({ group: 'resources', item: 'webinars' });
  return null;
}
