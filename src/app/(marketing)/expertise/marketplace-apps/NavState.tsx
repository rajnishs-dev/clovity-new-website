'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/** Lights up "Marketplace Apps" in the Expertise mega menu, mobile drawer, and footer. */
export function NavState() {
  useActiveNav({ group: 'expertise', item: 'marketplace-apps' });
  return null;
}
