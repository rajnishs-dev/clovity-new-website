import { EXTERNAL_LINKS, ROUTES } from '@/constants/routes';
import { marketplaceAppsHeroBanner } from '@/constants/media';
import { MARKETPLACE_APPS } from '@/constants/home';
import type {
  CtaLink,
  FaqItem,
  MarketplaceApp,
  PillarCard,
  StatBandItem,
} from '@/types/content';

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
    { name: 'Expertise', href: ROUTES.expertise.atlassian },
    { name: 'Marketplace Apps', href: ROUTES.expertise.marketplaceApps },
  ],
  titleLead: 'AI-Powered Apps,',
  titleAccent: 'Built for the Atlassian Ecosystem.',
  subheading:
    'From an AI copilot for Jira to time tracking, dashboards, and Confluence formatting - built, published, and supported by Clovity, an official Atlassian Marketplace Partner.',
  /**
   * A bundled supplied diagram - see `marketplaceAppsHeroBanner` in
   * `constants/media.ts` for why it is the unlabelled version and why it is a JPEG.
   *
   * No `tabletSrc`/`mobileSrc`: a static import lets `next/image` build the responsive
   * srcset from one file. Those entries held three hand-sized Unsplash URLs of a photo
   * this page shared with the Atlassian and Cloud Migration heroes - all three now have
   * their own image, so no page reaches a third-party host to paint its first screen.
   *
   * The alt text names the badge and the arrangement but NOT the six apps. It listed
   * them while the artwork carried captions; the captions are gone, so describing them
   * would be describing something that is not in the picture. The apps are named in
   * `MARKETPLACE_APPS_CATALOG` below, which is where a reader gets them.
   */
  image: {
    src: marketplaceAppsHeroBanner,
    alt: 'Six Clovity app icons arranged in a ring around the Atlassian Platinum Solution Partner badge',
  },
} as const;

/* ── Problem statement ──────────────────────────────────────────────────── */

export const MARKETPLACE_APPS_PROBLEM_CONTENT = {
  headingLead: 'Generic Templates ',
  headingHighlight: 'Rarely Fit Jira Exactly',
  paragraphs: [
    "Most Marketplace add-ons solve someone else's workflow, close enough to be tempting and just different enough to fight you every day.",
    'We publish and support our own apps instead of just installing third-party ones - Pulse AI, time tracking, dashboards, and Confluence formatting, all built by the same team that runs Atlassian instances for a living.',
  ],
} as const;

/* ── Apps showcase (filterable grid) ─────────────────────────────────────── */

export const MARKETPLACE_APPS_SHOWCASE_CONTENT = {
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
  headingLead: 'Support That Doesn’t ',
  headingHighlight: 'Stop at Install',
} as const;

export const MARKETPLACE_APPS_SUPPORT_CARDS: PillarCard[] = [
  {
    id: 'app-support',
    icon: 'life-ring',
    iconChipClass: 'text-brand-600',
    title: 'App Support & SLAs',
    description:
      'Direct support for every app we publish, through our help center.',
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
  {
    id: 'apps',
    value: String(MARKETPLACE_APPS_CATALOG.length),
    label: 'Published Apps',
  },
];

/* ── Closing CTA ─────────────────────────────────────────────────────────── */

export const MARKETPLACE_APPS_FINAL_CTA = {
  headingLead: 'Ready to talk to',
  headingTail: 'an expert?',
  description:
    'Tell us what you’re working on and a Clovity specialist will get back to you with next steps.',
} as const;

export const MARKETPLACE_APPS_FINAL_CTA_LINKS: CtaLink[] = [
  {
    id: 'talk-to-an-expert',
    label: 'Talk to an expert',
    href: ROUTES.discover.contact,
    variant: 'white-pill',
    icon: 'arrow-up-right',
  },
];

/* ── Case-study rail ────────────────────────────────────────────────────── */

/**
 * The Strapi-backed case-study rail, ported from the ITSM page's
 * "Service Management Already Running" band.
 *
 * This page now carries TWO proof bands of different kinds: `MARKETPLACE_APPS_PROOF_CONTENT`
 * above is the static `CUSTOMER_STORIES` quote block, and this one is the live case-study
 * grid. The quotes were kept rather than replaced, on request.
 *
 * ── THE HEADING IS DELIBERATELY BROADER THAN THIS PAGE ──
 * "Work behind the apps" rather than "case studies about our apps", because Clovity's
 * published case studies are about delivery engagements and there may be no row that is
 * genuinely about an app build. The rail tops up from adjacent work when that happens - see
 * `data/marketplace-apps.ts` - so the heading has to stay true of whatever it shows.
 */
export const MARKETPLACE_APPS_CASE_STUDIES_CONTENT = {
  headingLead: 'The Delivery Work ',
  headingHighlight: 'Behind the Apps',
  subheading:
    'The same team builds these apps and runs the engagements below - in the clients’ own words.',
  moreLabel: 'See all case studies',
  moreHref: ROUTES.resources.caseStudy,
} as const;

/* ── FAQ ────────────────────────────────────────────────────────────────── */

export const MARKETPLACE_APPS_FAQ_CONTENT = {
  headingLead: 'Before You ',
  headingHighlight: 'Install Anything',
} as const;

/**
 * Six disclosures.
 *
 * ── WHAT IS NOT STATED HERE ──
 * NO PRICES. Pulse AI is described as free because `MARKETPLACE_APPS` in `constants/home.ts`
 * carries `free: true` on that record, matching its listing. Nothing is said about what the
 * other five cost: the Marketplace listing is the only authoritative price, it changes
 * without touching this repo, and a stale number on a web page is worse than none.
 *
 * NO INSTALL COUNTS either, for the same reason the AI page omits them - they are live
 * counters. The apps showcase above prints them where they belong, next to each listing.
 *
 * Cloud-only is safe to state: `PLATFORM_LABEL` resolves to "Jira Cloud" and "Confluence
 * Cloud", which is the full set of platforms our own catalog declares.
 */
export const MARKETPLACE_APPS_FAQ: FaqItem[] = [
  {
    id: 'pricing',
    question: 'What do these apps cost?',
    answer:
      'Pulse AI is free to install. For the rest, the price is on the Atlassian Marketplace listing and that is the only place worth trusting - it changes with tiering and user count, and any figure we printed here would eventually be wrong. Every listing has a free trial, so evaluating one costs nothing but the install.',
  },
  {
    id: 'platforms',
    question: 'Do they work on Data Center, or Cloud only?',
    answer:
      'Cloud. Our published apps target Jira Cloud and Confluence Cloud - that is the full set of platforms in our catalog. If you are on Data Center and the capability is what you need, talk to us: a custom build is a different conversation from installing a listed app, and the answer may be to solve it in configuration instead.',
  },
  {
    id: 'support',
    question: 'Who supports the app after we install it?',
    answer:
      'We do - the same team that builds them and runs Atlassian instances for a living, not a separate vendor desk. There is a public help center for all of our apps, and a support request goes to people who can change the code rather than to people who can only file it.',
  },
  {
    id: 'custom',
    question: 'Can you build something specific to our workflow?',
    answer:
      'Yes, and that is a Forge app rather than a fork of a listed one - built on Atlassian’s own platform so it inherits your instance’s permission model instead of working around it. The first question we will ask is whether configuration or automation gets you there without a build, because it often does and it is cheaper to own.',
  },
  {
    id: 'data',
    question: 'What do the apps do with our data?',
    answer:
      'Each listing carries its own data-handling and privacy declaration, which is the version Atlassian reviews and the version to send to your security team. For anything beyond what a listing states - a custom build, or a specific residency requirement - we will put the data flow in the architecture document rather than answer it generally here.',
  },
  {
    id: 'uninstall',
    question: 'What happens if we uninstall?',
    answer:
      'Your Jira and Confluence data is yours and stays where it is - these apps read and add to your instance rather than holding your content somewhere else. What goes is the app’s own configuration. If you are trialling and want the exit path in writing before you install, ask and we will send it.',
  },
];
