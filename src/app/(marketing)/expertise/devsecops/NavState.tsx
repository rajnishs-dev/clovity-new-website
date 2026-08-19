'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/**
 * Declares this route's nav identity - the legacy
 * `<body data-nav="expertise" data-nav-item="devsecops">`.
 *
 * `item` is the `id` of the DevSecOps entry in `EXPERTISE_DELIVERY`
 * (`constants/navigation.ts`), which is what the header, mega menu, mobile drawer
 * and footer all match against.
 */
export function NavState() {
  useActiveNav({ group: 'expertise', item: 'devsecops' });
  return null;
}
