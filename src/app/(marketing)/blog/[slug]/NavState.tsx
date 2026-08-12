'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/** A blog post is still "in" Blog for nav-highlight purposes - see `../NavState.tsx`. */
export function NavState() {
  useActiveNav({ group: 'resources', item: 'blog' });
  return null;
}
