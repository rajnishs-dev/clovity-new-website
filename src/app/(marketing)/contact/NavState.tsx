'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/**
 * Declares this route's nav identity — the legacy
 * `<body data-nav="discover" data-nav-item="contact">`.
 */
export function NavState() {
  useActiveNav({ group: 'discover', item: 'contact' });
  return null;
}
