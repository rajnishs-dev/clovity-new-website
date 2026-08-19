'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/**
 * Declares this route's nav identity - the legacy comp's
 * `<body data-nav="expertise" data-nav-item="ai">`.
 *
 * `item` is the `id` of the AI Solutions entry in `EXPERTISE_PEOPLE`
 * (`constants/navigation.ts`), which is what the header, mega menu, mobile drawer and footer
 * all match against. That entry already existed and pointed here before this page did - as did
 * `ROUTES.expertise.ai` and its `SITEMAP_ROUTES` row at priority 0.9, the joint-highest on the
 * site, so until now all four were advertising a 404.
 */
export function NavState() {
  useActiveNav({ group: 'expertise', item: 'ai' });
  return null;
}
