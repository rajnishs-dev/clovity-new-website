'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/** A case study is still "in" Case Studies for nav-highlight purposes - see `../NavState.tsx`. */
export function NavState() {
  useActiveNav({ group: 'resources', item: 'case-studies' });
  return null;
}
