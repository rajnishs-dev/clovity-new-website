'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/** A news release is still "in" News for nav-highlight purposes - see `../NavState.tsx`. */
export function NavState() {
  useActiveNav({ group: 'resources', item: 'news' });
  return null;
}
