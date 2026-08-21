import { ROUTES } from '@/constants/routes';
import { atlassianHeroBanner } from '@/constants/media';
import { CREDENTIAL_ROWS } from '@/constants/home';
import type {
  CtaLink,
  FaqItem,
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
    'We take over the parts of Atlassian administration that compound if left alone - workflow sprawl, app bloat, license waste, permission drift - and run them the way a regulated agency has to: documented, auditable, and built to hold up under review.',
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
    description:
      'Documentation and knowledge bases teams actually keep current.',
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
    description:
      'Service desks built to ITIL-aligned practice, not just a form.',
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
    description:
      'Source control wired into the same workflows Jira already tracks.',
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
    description:
      'Instance audit - workflows, permissions, apps, and license usage.',
    icon: 'search',
  },
  {
    id: 'design',
    order: 2,
    title: 'Design',
    description:
      'A documented target architecture, reviewed before anything changes.',
    icon: 'pen-nib',
  },
  {
    id: 'build',
    order: 3,
    title: 'Build',
    description:
      'Configuration and migration work, staged and tested before rollout.',
    icon: 'settings',
  },
  {
    id: 'launch',
    order: 4,
    title: 'Launch',
    description:
      'Phased rollout with validation gates, not a single cutover weekend.',
    icon: 'cloud-upload',
  },
  {
    id: 'support',
    order: 5,
    title: 'Support',
    description:
      'Ongoing administration and Pulse AI health monitoring after go-live.',
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
  {
    id: 'engagements',
    value: '300+',
    accent: true,
    label: 'Enterprise Engagements',
  },
  {
    id: 'certified-experts',
    value: '100+',
    label: 'Atlassian-Certified Experts',
  },
  { id: 'accreditations', value: '235+', label: 'Delivery Accreditations' },
];

/* ── Closing CTA ─────────────────────────────────────────────────────────── */

export const ATLASSIAN_FINAL_CTA = {
  headingLead: 'Ready to talk to',
  headingTail: 'an expert?',
  description:
    'Tell us what you’re working on and a Clovity specialist will get back to you with next steps.',
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
    id: 'talk-to-an-expert',
    label: 'Talk to an expert',
    href: ROUTES.expertise.ai,
    variant: 'ghost-dark',
  },
];

/* ── Case-study rail ────────────────────────────────────────────────────── */

/**
 * The Strapi-backed case-study rail, ported from the ITSM page's
 * "Service Management Already Running" band.
 *
 * NOTE this page now carries TWO proof bands, and they are different in kind:
 * `ATLASSIAN_PROOF_CONTENT` above is the static `CUSTOMER_STORIES` quote block, and this
 * one is the live case-study grid. That was a deliberate choice - the quotes were kept
 * rather than replaced - so if the page ever needs shortening, this is the pair to look at
 * first.
 */
export const ATLASSIAN_CASE_STUDIES_CONTENT = {
  headingLead: 'Atlassian Estates We ',
  headingHighlight: 'Already Run',
  subheading:
    'Implementation, administration and governance work on real instances, in the clients’ own words.',
  moreLabel: 'See all case studies',
  moreHref: ROUTES.resources.caseStudy,
} as const;

/* ── FAQ ────────────────────────────────────────────────────────────────── */

export const ATLASSIAN_FAQ_CONTENT = {
  headingLead: 'Before You Hand Over ',
  headingHighlight: 'Your Instance',
} as const;

/**
 * Six disclosures. Same discipline as the ITSM, Managed Services and Workforce FAQs: no
 * response-time commitment, no timeline, no price. Where a reader wants a number, the
 * answer says what it depends on and offers to put it in writing - a figure invented here
 * is a figure the delivery team has to negotiate down later.
 *
 * Two answers deliberately point AWAY from this page, to Managed Services and Workforce.
 * This is the broadest expertise page on the site, so the most useful thing several of
 * these answers can do is tell a reader they are in the wrong place.
 */
export const ATLASSIAN_FAQ: FaqItem[] = [
  {
    id: 'licensing',
    question: 'Do you resell licences, or only consult?',
    answer:
      'Both, and they are separable. We are an Atlassian Platinum Solution Partner, so licensing can run through us alongside the delivery work - tiering, renewal planning and the governance guardrails that stop a renewal becoming an audit finding. If you would rather keep licensing where it is and buy only the delivery, that is a normal engagement and we will not make it awkward.',
  },
  {
    id: 'hosting',
    question: 'Cloud, Data Center or Government Cloud - which do you support?',
    answer:
      'All three, and the choice between them is usually the first real decision in an engagement rather than a given. Cloud is where most teams should end up; Data Center still makes sense for specific constraints; Atlassian Government Cloud is the FedRAMP Moderate path for federal and state work. If a move is what you are actually planning, our Cloud Migration practice is where that lives - this page covers running the platform once you are there.',
  },
  {
    id: 'internal-admin',
    question: 'We already have an Atlassian admin. What would you do?',
    answer:
      'Usually the work your admin cannot get to: the configuration decisions that need a second opinion, the upgrade and app-review backlog, and the governance nobody has time to write down. Two adjacent pages may fit better than this one - Managed Services if you want the platform owned outright, and Workforce Solutions if what you need is more hands inside a team you keep leading.',
  },
  {
    id: 'timeline',
    question: 'How long does an implementation take?',
    answer:
      'It depends on how much of your current configuration survives, and we would rather scope that with you than publish an average here. What we will commit to early is the assessment output - what state the instance is in, what has to change, and in what order - because that is the document the timeline comes from. Ask for it before you ask for a date.',
  },
  {
    id: 'sandbox',
    question: 'Do you work directly in our production instance?',
    answer:
      'Configuration changes are built and tested in a sandbox first and promoted through your change process; production access is at the least privilege the scope requires, through named accounts that are yours and revocable at any time. Actions are traceable to an individual - the same standard we apply to our federal and state work.',
  },
  {
    id: 'after-golive',
    question: 'What happens after go-live?',
    answer:
      'You get the documentation to run it yourself - current configuration notes, runbooks and documented automations, maintained during the engagement rather than assembled at the end. If you would rather not run it, Managed Services picks up administration, monitoring and the improvement backlog from there. There is no state where the handover leaves you with a blank page.',
  },
];
