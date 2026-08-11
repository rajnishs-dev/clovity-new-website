'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/**
 * Declares this route's nav identity — the legacy
 * `<body data-nav="discover" data-nav-item="about-us">`.
 *
 * The header, mega menu, mobile drawer and footer all read the pair from the store,
 * so the "About Us" link highlights in every one of them from this single
 * declaration. A tiny client component so the page itself stays a Server Component.
 */
export function NavState() {
  useActiveNav({ group: 'discover', item: 'about-us' });
  return null;
}
