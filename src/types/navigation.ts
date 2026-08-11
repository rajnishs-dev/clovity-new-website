import type { IconName } from './icon';

/**
 * Navigation is data, not markup. The header, mega menu, mobile drawer and
 * footer all render from these shapes, so when the CMS starts serving the
 * navigation tree in phase 2 only the data source changes - no component does.
 */

/** Top-level nav groups. Doubles as the `data-nav` value on <body>. */
export type NavGroupId =
  'home' | 'expertise' | 'resources' | 'discover' | 'none';

/** A single leaf link inside a mega-menu column or mobile accordion. */
export interface NavLink {
  /** Stable id - matches the legacy `data-nav-id` attribute. */
  id: string;
  label: string;
  href: string;
  /** Short supporting copy shown in the desktop mega menu. */
  description?: string;
  /** Icon shown in the mega-menu chip beside the link title. */
  icon?: IconName;
  /** True for links that leave the site. */
  external?: boolean;
  /** Renders the dashed "highlight" treatment in the mega menu. */
  highlight?: boolean;
}

/** A titled column of links inside a full-width mega panel. */
export interface NavColumn {
  id: string;
  title: string;
  links: NavLink[];
}

/** The promo card that closes the Expertise mega panel. */
export interface NavCtaCard {
  icon: IconName;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
}

/** A "What's New" editorial card in the Resources mega panel. */
export interface NavFeatureCard {
  id: string;
  tag: string;
  title: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
  ctaLabel: string;
  external?: boolean;
}

/** Right-hand rail of a mega panel - either a CTA card or feature cards. */
export type NavPanelRail =
  | { kind: 'cta'; card: NavCtaCard }
  | { kind: 'feature'; title: string; cards: NavFeatureCard[] };

/**
 * A top-level nav entry. `kind` decides how the header renders it:
 *  - `link`      → a plain anchor (Home)
 *  - `mega-full` → the full-bleed multi-column panel (Expertise, Resources)
 *  - `dropdown`  → the narrow single-column panel (Discover)
 */
export type NavItem =
  | { kind: 'link'; id: NavGroupId; label: string; href: string }
  | {
      kind: 'mega-full';
      id: NavGroupId;
      label: string;
      columns: NavColumn[];
      rail: NavPanelRail;
      /** Applies the alternate 3-column grid used by Resources. */
      variant?: 'resources';
    }
  | {
      kind: 'dropdown';
      id: NavGroupId;
      label: string;
      eyebrow: string;
      width: number;
      links: NavLink[];
    };

/** A footer link column. */
export interface FooterColumn {
  id: string;
  title: string;
  links: Array<NavLink & { group?: NavGroupId }>;
}

/** A social account in the footer brand column. */
export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: IconName;
}

/** Which nav entry the current page should light up. */
export interface ActiveNav {
  group: NavGroupId;
  item?: string;
}
