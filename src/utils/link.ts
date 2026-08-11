import { isAppRoute } from '@/config/routes';
import { siteConfig } from '@/config/site';

/**
 * Link classification. Every anchor in the app runs through this so the choice
 * between `next/link` (client-side navigation + prefetch) and a plain `<a>`
 * with `rel="noopener noreferrer"` is decided by one rule, not per call site.
 */

/**
 * In-app path that `next/link` can route: `/about-us`, `/expertise/ai`.
 *
 * A `/`-rooted href is always treated as internal - a developer wrote it against
 * this app's own routes, and during a phased migration it may point at a page not
 * built yet, which is a routing concern rather than a link-classification one.
 *
 * An ABSOLUTE same-host URL is different. The legacy markup contains several CTAs
 * pointing at `https://clovity.com/...` pages that live on the production site and
 * are not part of this application (`/clovity-ai-apps-studio`). Matching on
 * hostname alone handed those to `next/link`, which turned a working external link
 * into a client-side navigation to a route that does not exist - a 404 on click,
 * plus a failing RSC prefetch on hover. So an absolute same-host URL only counts as
 * internal when its path is actually one of ours, and self-corrects as pages are
 * migrated.
 */
export function isInternalHref(href: string): boolean {
  if (!href) return false;
  if (href.startsWith('/')) return true;
  if (href.startsWith('#')) return false;
  if (/^(mailto:|tel:|sms:)/i.test(href)) return false;
  try {
    const url = new URL(href);
    const site = new URL(siteConfig.url);
    // www/apex variants of our own domain count as the same host.
    const sameHost =
      url.hostname.replace(/^www\./, '') ===
      site.hostname.replace(/^www\./, '');
    return sameHost && isAppRoute(url.pathname);
  } catch {
    return false;
  }
}

/** Same-page fragment target: `#pulse-ai-spotlight`. */
export function isHashHref(href: string): boolean {
  return href.startsWith('#');
}

/** `mailto:` / `tel:` / `sms:`. */
export function isProtocolHref(href: string): boolean {
  return /^(mailto:|tel:|sms:)/i.test(href);
}

/** Anything that leaves the site and needs `target`/`rel` hardening. */
export function isExternalHref(href: string): boolean {
  return (
    !isInternalHref(href) &&
    !isHashHref(href) &&
    !isProtocolHref(href) &&
    href !== '#'
  );
}

/** The `rel` value required for a safe new-tab link. */
export const EXTERNAL_REL = 'noopener noreferrer' as const;

/** Attributes to spread onto an external anchor. */
export function externalLinkAttrs(): {
  target: '_blank';
  rel: typeof EXTERNAL_REL;
} {
  return { target: '_blank', rel: EXTERNAL_REL };
}

/** Strip the origin off an absolute same-site URL so next/link can route it. */
export function toRoutablePath(href: string): string {
  if (href.startsWith('/') || href.startsWith('#')) return href;
  try {
    const url = new URL(href);
    return `${url.pathname}${url.search}${url.hash}` || '/';
  } catch {
    return href;
  }
}
