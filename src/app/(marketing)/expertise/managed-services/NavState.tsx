'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/**
 * Declares this route's nav identity - the legacy
 * `<body data-nav="expertise" data-nav-item="managed-services">`.
 *
 * `item` is the `id` of the Managed Services entry in `EXPERTISE_DELIVERY`
 * (`constants/navigation.ts`), which is what the header, mega menu, mobile drawer and
 * footer all match against. That entry already existed and pointed here before this
 * page did.
 */
export function NavState() {
  useActiveNav({ group: 'expertise', item: 'managed-services' });
  return null;
}
