'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/** Lights up "Cloud Migration" in the Expertise mega menu, mobile drawer, and footer. */
export function NavState() {
  useActiveNav({ group: 'expertise', item: 'cloud-migration' });
  return null;
}
