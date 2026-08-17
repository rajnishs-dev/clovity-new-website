import { EXTERNAL_LINKS, ROUTES } from '@/constants/routes';
import { MARKETPLACE_APPS } from '@/constants/home';
import type { CtaLink, MarketplaceApp, PillarCard, StatBandItem } from '@/types/content';

/**
 * Clovity's help center (`clovity-help-center.vercel.app`) lists two more
 * published apps than the home page's carousel does. Fetched and verified
 * directly from that live site (name, description, and icon URL - each icon
 * URL confirmed to resolve before use) rather than invented; the home page's
 * own `MARKETPLACE_APPS` is left untouched since its 4-app carousel wasn't
 * part of this request. No install count or rating is stated for either -
 * the help center doesn't publish one, so `metaLabel` is left blank rather
 * than a guessed number.
 */
const HELP_CENTER_ORIGIN = 'https://clovity-help-center.vercel.app';

const CONFLUENCE_REPORTS_APP: MarketplaceApp = {
  id: 'reports-charts-confluence',
  name: 'Reports, Charts, Templates, CQL & Export for Confluence',
  description:
    'Create live Confluence reports from CQL - with exports to Excel, PDF and more.',
  href: `${HELP_CENTER_ORIGIN}/apps/reports-charts-confluence`,
  logo: {
    src: `${HELP_CENTER_ORIGIN}/images/global/png/custom-reports-for-confluence.png`,
    alt: 'Reports, Charts, Templates, CQL & Export for Confluence logo',
  },
  badge: 'Marketplace',
  metaLabel: '',
};

const LATEX_DIAGRAMS_APP: MarketplaceApp = {
  id: 'latex-diagrams-confluence',
  name: 'LaTeX Formulas & Diagrams',
  description:
    'Embed LaTeX equations and UML diagrams directly into Confluence for clearer technical documentation.',
  href: `${HELP_CENTER_ORIGIN}/apps/latex-diagrams-confluence`,
  logo: {
    src: `${HELP_CENTER_ORIGIN}/images/global/png/latex-uml-diagram.png`,
    alt: 'LaTeX Formulas & Diagrams logo',
  },
  badge: 'Marketplace',
  metaLabel: '',
};

/**
 * Marketplace Apps expertise page content.
 *
 * Per the build plan, this page is mostly Clovity's own content - the real,
 * already-published `MARKETPLACE_APPS` catalog (installs, ratings, listing
 * links) is the centerpiece, shown in a tab view rather than restated as
 * generic service copy. Same content-sourcing rule as the other expertise
 * pages: no invented numbers.
 */

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const MARKETPLACE_APPS_HERO = {
  crumbs: [
    { name: 'Home', href: ROUTES.home },
    { name: 'Marketplace Apps', href: ROUTES.expertise.marketplaceApps },
  ],
  titleLead: 'AI-Powered Apps,',
  titleAccent: 'Built for the Atlassian Ecosystem.',
  subheading:
    'From an AI copilot for Jira to time tracking, dashboards, and Confluence formatting - built, published, and supported by Clovity, an official Atlassian Marketplace Partner.',
  /** Same verified photo used on the other expertise pages - see the Atlassian page's note. */
  image: {
    src: 'https://images.unsplash.com/photo-1758873268745-dd2cf0d677b5?auto=format&fit=crop&w=1800&q=80',
    tabletSrc:
      'https://images.unsplash.com/photo-1758873268745-dd2cf0d677b5?auto=format&fit=crop&w=1000&q=80',
    mobileSrc:
      'https://images.unsplash.com/photo-1758873268745-dd2cf0d677b5?auto=format&fit=crop&w=640&q=80',
    alt: 'Clovity engineers building an Atlassian Marketplace app',
  },
} as const;

/* ── Problem statement ──────────────────────────────────────────────────── */

export const MARKETPLACE_APPS_PROBLEM_CONTENT = {
  label: 'Why We Build Our Own',
  headingLead: 'Generic Templates ',
  headingHighlight: 'Rarely Fit Jira Exactly',
  paragraphs: [
    "Most Marketplace add-ons solve someone else's workflow, close enough to be tempting and just different enough to fight you every day.",
    'We publish and support our own apps instead of just installing third-party ones - Pulse AI, time tracking, dashboards, and Confluence formatting, all built by the same team that runs Atlassian instances for a living.',
  ],
} as const;

/* ── Apps showcase (filterable grid) ─────────────────────────────────────── */

export const MARKETPLACE_APPS_SHOWCASE_CONTENT = {
  label: 'Our Published Apps',
  headingLead: 'Six Apps, ',
  headingHighlight: 'One Support Team',
} as const;

/**
 * The real, published app catalog: the home page's 4-app carousel plus the
 * 2 more listed on the help center but not on the home page.
 */
export const MARKETPLACE_APPS_CATALOG: MarketplaceApp[] = [
  ...MARKETPLACE_APPS,
  CONFLUENCE_REPORTS_APP,
  LATEX_DIAGRAMS_APP,
];

export type AppPlatform = 'jira' | 'confluence';

/**
 * Which product each app targets - not a field on `MarketplaceApp` itself
 * (the home page never needed to filter by it), so it's a local lookup keyed
 * by the same real `id`s rather than a change to the shared type.
 */
export const MARKETPLACE_APPS_PLATFORM: Record<string, AppPlatform> = {
  'pulse-ai': 'jira',
  'time-tracking': 'jira',
  'dashboard-templates': 'jira',
  'content-formatting': 'confluence',
  'reports-charts-confluence': 'confluence',
  'latex-diagrams-confluence': 'confluence',
};

export const PLATFORM_LABEL: Record<AppPlatform, string> = {
  jira: 'Jira Cloud',
  confluence: 'Confluence Cloud',
};

/* ── Support & secondary offerings ──────────────────────────────────────── */

export const MARKETPLACE_APPS_SUPPORT_CONTENT = {
  label: 'Beyond Our Own Apps',
  headingLead: 'Support That Doesn’t ',
  headingHighlight: 'Stop at Install',
} as const;

export const MARKETPLACE_APPS_SUPPORT_CARDS: PillarCard[] = [
  {
    id: 'app-support',
    icon: 'life-ring',
    iconChipClass: 'text-brand-600',
    title: 'App Support & SLAs',
    description: 'Direct support for every app we publish, through our help center.',
  },
  {
    id: 'forge-development',
    icon: 'code',
    iconChipClass: 'text-[#7c3aed]',
    title: 'Custom Forge App Development',
    description:
      'A workflow that doesn’t exist on the Marketplace yet? We build it as a Forge app.',
  },
  {
    id: 'third-party-addons',
    icon: 'store',
    iconChipClass: 'text-orange',
    title: 'Third-Party Add-On Support',
    description:
      'We also install, configure, and support Marketplace add-ons beyond our own apps.',
  },
];

export const MARKETPLACE_APPS_SUPPORT_LINK: CtaLink = {
  id: 'help-center',
  label: 'Visit the Help Center',
  href: EXTERNAL_LINKS.appSupport,
  external: true,
  variant: 'secondary',
};

/* ── Metrics (derived from the real app catalog) ────────────────────────── */

export const MARKETPLACE_APPS_METRICS_CONTENT = {
  label: 'Track Record',
  headingLead: 'Numbers From Our ',
  headingHighlight: 'Own Apps',
} as const;

const TOTAL_INSTALLS = MARKETPLACE_APPS_CATALOG.reduce(
  (sum, app) => sum + (app.installs ?? 0),
  0,
); // 193 + 193 + 219 + 62 = 667 - the 2 help-center-only apps publish no install count, so they add 0, not a guess.

/**
 * Computed directly from the real `MARKETPLACE_APPS_CATALOG`, not a separate
 * claim - `TOTAL_INSTALLS` sums the published install counts, the rating is
 * the one every *rated* app in the catalog currently shares, and the app
 * count is the catalog's own length.
 */
export const MARKETPLACE_APPS_METRICS: StatBandItem[] = [
  {
    id: 'installs',
    value: `${TOTAL_INSTALLS}+`,
    accent: true,
    label: 'Installs Across Our Apps',
  },
  { id: 'rating', value: '5.0', label: 'Average Rating (Rated Apps)' },
  { id: 'apps', value: String(MARKETPLACE_APPS_CATALOG.length), label: 'Published Apps' },
];

/* ── Proof ───────────────────────────────────────────────────────────────── */
/* One featured story, not the 3-card grid the other pages use - selected
 * directly from `CUSTOMER_STORIES` in `ProofSection.tsx`. */

export const MARKETPLACE_APPS_PROOF_CONTENT = {
  label: 'Proof, Not Promises',
  headingLead: 'The Same Team Behind ',
  headingHighlight: 'Mission-Critical Instances',
} as const;

/* ── Closing CTA ─────────────────────────────────────────────────────────── */

export const MARKETPLACE_APPS_FINAL_CTA = {
  headingLead: 'Ready to put Pulse AI',
  headingTail: 'on your own Jira instance?',
  description:
    'Install Pulse AI free from the Atlassian Marketplace, or talk to us about a Forge app custom to your workflow.',
} as const;

export const MARKETPLACE_APPS_FINAL_CTA_LINKS: CtaLink[] = [
  {
    id: 'try-pulse',
    label: 'Try Pulse AI Free',
    href: EXTERNAL_LINKS.pulseAiListing,
    external: true,
    variant: 'white-pill',
  },
  {
    id: 'explore-managed-services',
    label: 'Explore Managed Services',
    href: ROUTES.expertise.managedServices,
    variant: 'ghost-dark',
  },
];
