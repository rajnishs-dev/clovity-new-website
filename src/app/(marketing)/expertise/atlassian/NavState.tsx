'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/** Declares this route's nav identity - lights up "Atlassian Solutions" in the Expertise mega menu, mobile drawer, and footer. */
export function NavState() {
  useActiveNav({ group: 'expertise', item: 'atlassian' });
  return null;
}
