import type { ReactNode } from 'react';

/**
 * Marketing route group.
 *
 * A pass-through by design. The header and footer are NOT rendered here, because
 * the home page's header is a transparent pill floating over a full-bleed dark
 * hero, while interior pages get the solid white bar - and the footer's
 * `.footer-overlap` padding only applies where the final CTA card tucks into it.
 * Hoisting them into this layout would force one of those two treatments onto the
 * other. Each page composes its own chrome instead, which is also what the legacy
 * per-page HTML did.
 *
 * The group still earns its place: it scopes shared metadata defaults and gives
 * the marketing routes a single place to add cross-page concerns (analytics,
 * consent banner, breadcrumb context) later.
 */
export default function MarketingLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <>{children}</>;
}
