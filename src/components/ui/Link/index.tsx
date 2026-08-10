import NextLink from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import {
  EXTERNAL_REL,
  isExternalHref,
  isHashHref,
  isInternalHref,
  isProtocolHref,
  toRoutablePath,
} from '@/utils/link';

/**
 * The only anchor in the app.
 *
 * Routing every link through here means the `next/link` vs `<a>` decision - and
 * the `rel="noopener noreferrer"` hardening on external links - is made by one
 * rule instead of remembered at ~400 call sites in the migrated markup.
 *
 *  • in-app path  → next/link (client-side nav + automatic prefetch)
 *  • `#fragment`  → plain <a>, so it never triggers a route change
 *  • mailto/tel   → plain <a>
 *  • off-site     → plain <a> with target="_blank" rel="noopener noreferrer"
 *
 * `forceExternal` covers the legacy markup's own choices: several links point at
 * `https://www.clovity.com/...` and were authored to open in a new tab even
 * though that host is technically our own.
 */
export interface SmartLinkProps extends Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
> {
  href: string;
  children: ReactNode;
  /** Open in a new tab regardless of what the href looks like. */
  forceExternal?: boolean;
  /** Disable prefetch for links unlikely to be followed (footer bulk lists). */
  prefetch?: boolean;
}

export function SmartLink({
  href,
  children,
  className,
  forceExternal = false,
  prefetch,
  ...rest
}: SmartLinkProps) {
  const treatAsExternal = forceExternal || isExternalHref(href);

  if (treatAsExternal) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel={EXTERNAL_REL}
        {...rest}
      >
        {children}
      </a>
    );
  }

  // Fragments and protocol links must not go through the router.
  if (isHashHref(href) || isProtocolHref(href) || href === '#') {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }

  if (isInternalHref(href)) {
    return (
      <NextLink
        href={toRoutablePath(href)}
        className={className}
        {...(prefetch === undefined ? {} : { prefetch })}
        {...rest}
      >
        {children}
      </NextLink>
    );
  }

  // Anything unclassifiable is treated as off-site - fail safe, not open.
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel={EXTERNAL_REL}
      {...rest}
    >
      {children}
    </a>
  );
}

/** Inline text link with the brand underline treatment. */
export function TextLink({ className, ...props }: SmartLinkProps) {
  return (
    <SmartLink
      className={cn(
        'text-brand-600 underline decoration-brand-200 underline-offset-2 transition-colors hover:text-brand-700 hover:decoration-brand-600',
        className,
      )}
      {...props}
    />
  );
}
