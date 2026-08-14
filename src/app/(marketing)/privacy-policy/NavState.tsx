'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/**
 * Privacy Policy is a footer-only link, not a header/mega-menu item, so this
 * clears any group left active by whichever page the visitor came from
 * instead of declaring one of its own.
 */
export function NavState() {
  useActiveNav({ group: 'none' });
  return null;
}
