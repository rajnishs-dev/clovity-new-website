'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/** An event recap is still "in" Events for nav-highlight purposes - see `../NavState.tsx`. */
export function NavState() {
  useActiveNav({ group: 'resources', item: 'events' });
  return null;
}
