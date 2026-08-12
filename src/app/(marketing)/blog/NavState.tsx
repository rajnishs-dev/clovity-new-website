'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/**
 * Declares this route's nav identity, so the header's "Resources" trigger and
 * its "Blog" mega-panel item light up - see `about-us/NavState.tsx` for why
 * this has to be its own dispatch rather than something the header infers
 * from the URL.
 */
export function NavState() {
  useActiveNav({ group: 'resources', item: 'blog' });
  return null;
}
