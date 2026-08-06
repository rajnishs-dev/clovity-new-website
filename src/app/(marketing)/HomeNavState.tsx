'use client';

import { useActiveNav } from '@/hooks/useActiveNav';

/**
 * Declares which nav entry is current for this route.
 *
 * Replaces the legacy `<body data-nav="home">` attribute and the `site.js` DOM
 * sweep that read it and added `.active` to matching elements. Publishing the
 * pair into the store instead means the header, mobile drawer and footer all
 * derive their highlight declaratively and cannot desync from the route.
 *
 * A tiny client component so the page itself stays a Server Component — only the
 * `useEffect` that dispatches needs to run in the browser.
 */
export function HomeNavState() {
  useActiveNav({ group: 'home' });
  return null;
}
