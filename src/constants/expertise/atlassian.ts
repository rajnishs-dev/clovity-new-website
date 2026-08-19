import { ROUTES } from '@/constants/routes';
import { atlassianHeroBanner } from '@/constants/media';
import { CUSTOMER_STORIES, CREDENTIAL_ROWS } from '@/constants/home';
import type {
  CtaLink,
  CustomerStory,
  PillarCard,
  ProcessStep,
  StatBandItem,
} from '@/types/content';

/**
 * Atlassian Solutions expertise page content - the pilot for the 8-page
 * `/expertise/*` build (see the build plan for context).
 *
 * Content-sourcing rule for this page: everything here is either (a) a real
 * Clovity fact already published elsewhere in this codebase, imported from
 * its source of truth rather than retyped, or (b) fresh copy that states no
 * number, metric, or claim that isn't already backed by (a). Nothing is
 * invented. Blocks with no real Clovity asset behind them yet are marked
 * `[DRAFT — FOR REVIEW]` inline for a human to replace with real specifics.
 */

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const ATLASSIAN_HERO = {
  crumbs: [
    { name: 'Home', href: ROUTES.home },
    { name: 'Atlassian Solutions', href: ROUTES.expertise.atlassian },
  ],
  titleLead: 'Your Atlassian Instance,',
  titleAccent: 'Run Like It Matters.',
  /** Short hero subheading - kept brief on purpose, unlike `lead` below. */
  subheading:
    'Jira, Confluence, and JSM - run by a Platinum-tier Atlassian team.',
  /** Longer version of the same claim, used only for the page's meta description. */
  lead: 'Jira, Confluence, and Jira Service Management - implemented, administered, and kept healthy by the same Platinum-tier team that runs Atlassian for federal agencies and enterprise programs alike.',
  /**
   * A bundled supplied photograph - see `atlassianHeroBanner` in `constants/media.ts`.
   *
   * There is deliberately no `tabletSrc`/`mobileSrc` any more. This used to carry three
   * `images.unsplash.com` URLs, the same photo at 1800/1000/640px, one per breakpoint.
   * A static import lets `next/image` generate the whole responsive srcset from one
   * file, so the per-breakpoint entries were doing work the framework already does -
   * and they made the page's first screen depend on a third-party host staying up.
   */
  image: {
    src: atlassianHeroBanner,
    alt: 'Three colleagues reviewing an Atlassian implementation on screen together',
  },
} as const;

/* ── Trust strip (real Atlassian partner badges) ────────────────────────── */

export const ATLASSIAN_TRUST_CONTENT = {
  label: 'Recognized by Atlassian',
} as const;

/** The four real Atlassian partner badges - `CREDENTIAL_ROWS[0]` from `home.ts`. */
export const ATLASSIAN_TRUST_BADGES = CREDENTIAL_ROWS.find(
  (row) => row.id === 'atlassian-partner',
)!.badges;

/* ── Problem statement ──────────────────────────────────────────────────── */

export const ATLASSIAN_PROBLEM_CONTENT = {
  headingLead: 'Most Atlassian Instances ',
  headingHighlight: 'Outgrow Their Admins',
  paragraphs: [
    "Jira sprawls project by project, Confluence fills with orphaned spaces, and permission schemes drift until nobody on staff can say with confidence who can see what. Most teams keep it running, but 'running' and 'well-run' stop being the same thing long before anyone notices.",
    "We take over the parts of Atlassian administration that compound if left alone - workflow sprawl, app bloat, license waste, permission drift - and run them the way a regulated agency has to: documented, auditable, and built to hold up under review.",
  ],
} as const;

/* ── "What we deliver" grid ─────────────────────────────────────────────── */

export const ATLASSIAN_DELIVER_CONTENT = {
  headingLead: 'Atlassian, ',
  headingHighlight: 'End to End',
  subheading:
    'One partner across the whole stack, not a licensing reseller who stops at the invoice.',
} as const;

/**
 * Service names only - each one is directly backed by a Clovity credential
 * already in this codebase (`ABOUT_ATLASSIAN_BADGES` / `CREDENTIAL_ROWS`:
 * ITSM specialization, Cloud Migration specialization, Marketplace Partner
 * status), not invented capabilities.
 */
export const ATLASSIAN_DELIVER_CARDS: PillarCard[] = [
  {
    id: 'jira-delivery',
    icon: 'jira',
    iconChipClass: 'text-[#0052cc]',
    title: 'Jira Software Delivery',
    description:
      'Workflow design, project and permission-scheme architecture, and ongoing administration for teams running real production volume.',
  },
  {
    id: 'confluence',
    icon: 'confluence',
    iconChipClass: 'text-[#026aa7]',
    title: 'Confluence & Knowledge Management',
    description:
      'Space structure, permissions, and content governance that keep documentation findable instead of abandoned.',
  },
  {
    id: 'jsm',
    icon: 'headset',
    iconChipClass: 'text-brand-600',
    title: 'Jira Service Management',
    description:
      'Request types, SLAs, and queues built for real ticket volume - the same ITSM specialization Atlassian has certified us for.',
  },
  {
    id: 'cloud-dc-admin',
    icon: 'server',
    iconChipClass: 'text-[#16a34a]',
    title: 'Cloud & Data Center Administration',
    description:
      'Day-to-day platform administration across Atlassian Cloud, Data Center, and Government Cloud instances.',
  },
  {
    id: 'marketplace-dev',
    icon: 'store',
    iconChipClass: 'text-orange',
    title: 'Marketplace App Development & Support',
    description:
      'We build and support our own published Atlassian Marketplace apps - Pulse AI among them - not just install third-party add-ons.',
  },
  {
    id: 'licensing-advisory',
    icon: 'shield-half',
    iconChipClass: 'text-[#7c3aed]',
    title: 'Licensing, Governance & Advisory',
    description:
      'License tiering, renewal planning, and governance guardrails set up before they become an audit finding.',
  },
];

/* ── AI + automation ─────────────────────────────────────────────────────── */

export const ATLASSIAN_AI_CONTENT = {
  headingLead: 'AI Runs Inside Every ',
  headingHighlight: 'Atlassian Engagement',
  subheading:
    "Pulse AI isn't a bolt-on demo - it's the same AI copilot our own delivery teams use to monitor the instances we run.",
} as const;

/* ── Suite coverage (tabs) ───────────────────────────────────────────────── */

export const ATLASSIAN_SUITE_CONTENT = {
  headingLead: 'Certified Across the ',
  headingHighlight: 'Atlassian Suite',
} as const;

export interface SuiteTab {
  id: string;
  /** The tab button's text. Not a section eyebrow - this one is load-bearing UI. */
  label: string;
  icon: PillarCard['icon'];
  title: string;
  description: string;
  points: string[];
}

export const ATLASSIAN_SUITE_TABS: SuiteTab[] = [
  {
    id: 'jira',
    label: 'Jira',
    icon: 'jira',
    title: 'Jira Software',
    description:
      'From single-team boards to multi-project programs spanning thousands of issues.',
    points: [
      'Workflow and screen-scheme design',
      'Automation rules and bulk-issue operations',
      'Advanced roadmaps and portfolio views',
    ],
  },
  {
    id: 'confluence',
    label: 'Confluence',
    icon: 'confluence',
    title: 'Confluence',
    description: 'Documentation and knowledge bases teams actually keep current.',
    points: [
      'Space architecture and permission schemes',
      'Templates and page-tree governance',
      'Migration from legacy wikis and shared drives',
    ],
  },
  {
    id: 'jsm',
    label: 'JSM',
    icon: 'headset',
    title: 'Jira Service Management',
    description: 'Service desks built to ITIL-aligned practice, not just a form.',
    points: [
      'Request types, SLAs, and approval workflows',
      'Asset and configuration management (CMDB)',
      'Customer portal and knowledge-base setup',
    ],
  },
  {
    id: 'bitbucket',
    label: 'Bitbucket',
    icon: 'git-branch',
    title: 'Bitbucket',
    description: 'Source control wired into the same workflows Jira already tracks.',
    points: [
      'Branching strategy and permission policy',
      'Pipeline and pull-request workflow setup',
      'Jira-Bitbucket smart-commit integration',
    ],
  },
];

/* ── Delivery approach ───────────────────────────────────────────────────── */

export const ATLASSIAN_APPROACH_CONTENT = {
  headingLead: 'A Delivery Method ',
  headingHighlight: 'Built for Audits, Not Just Launches',
} as const;

export const ATLASSIAN_APPROACH_STEPS: ProcessStep[] = [
  {
    id: 'discover',
    order: 1,
    title: 'Discover',
    description: 'Instance audit - workflows, permissions, apps, and license usage.',
    icon: 'search',
  },
  {
    id: 'design',
    order: 2,
    title: 'Design',
    description: 'A documented target architecture, reviewed before anything changes.',
    icon: 'pen-nib',
  },
  {
    id: 'build',
    order: 3,
    title: 'Build',
    description: 'Configuration and migration work, staged and tested before rollout.',
    icon: 'settings',
  },
  {
    id: 'launch',
    order: 4,
    title: 'Launch',
    description: 'Phased rollout with validation gates, not a single cutover weekend.',
    icon: 'cloud-upload',
  },
  {
    id: 'support',
    order: 5,
    title: 'Support',
    description: 'Ongoing administration and Pulse AI health monitoring after go-live.',
    icon: 'life-ring',
  },
];

/* ── Metrics ─────────────────────────────────────────────────────────────── */

export const ATLASSIAN_METRICS_CONTENT = {
  headingLead: 'Numbers From the ',
  headingHighlight: 'Whole Practice',
} as const;

/**
 * A subset of the real, already-published `RESULT_STATS` (home page),
 * reshaped into `StatBandItem`'s string-value format. Values are copied
 * verbatim (300, 100, 235 + their exact labels) - nothing recalculated or
 * rounded.
 */
export const ATLASSIAN_METRICS: StatBandItem[] = [
  { id: 'engagements', value: '300+', accent: true, label: 'Enterprise Engagements' },
  { id: 'certified-experts', value: '100+', label: 'Atlassian-Certified Experts' },
  { id: 'accreditations', value: '235+', label: 'Delivery Accreditations' },
];

/* ── Proof ───────────────────────────────────────────────────────────────── */

/** All three real case-study teasers from `home.ts` - real copy, real links. */
export const ATLASSIAN_PROOF_STORIES: CustomerStory[] = [...CUSTOMER_STORIES];

export const ATLASSIAN_PROOF_CONTENT = {
  headingLead: 'Built for Teams That Get ',
  headingHighlight: 'Audited',
} as const;

/* ── Closing CTA ─────────────────────────────────────────────────────────── */

export const ATLASSIAN_FINAL_CTA = {
  headingLead: 'Ready to put a Platinum team',
  headingTail: 'on your Atlassian instance?',
  description:
    'Talk to our specialists about your Jira, Confluence, or JSM environment - or see how AI fits into the same engagement.',
} as const;

export const ATLASSIAN_FINAL_CTA_LINKS: CtaLink[] = [
  {
    id: 'schedule-consultation',
    label: 'Schedule a Consultation',
    href: ROUTES.discover.contact,
    variant: 'white-pill',
    icon: 'arrow-up-right',
  },
  {
    id: 'explore-ai',
    label: 'Explore AI Solutions',
    href: ROUTES.expertise.ai,
    variant: 'ghost-dark',
  },
];
