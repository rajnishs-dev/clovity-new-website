import { ROUTES } from '@/constants/routes';
import { CREDENTIAL_ROWS } from '@/constants/home';
import {
  cloudMigrationHeroBanner,
  dataCenterSupportPhoto,
  iconFullMigration,
  iconHybridApproach,
  iconPhasedMigration,
} from '@/constants/media';
import type {
  CtaLink,
  FaqItem,
  ImageSource,
  PillarCard,
  StatBandItem,
} from '@/types/content';

/**
 * Cloud Migration expertise page content.
 *
 * Reuses the real migration data already published on the home page
 * (`MIGRATION_SOURCES`/`MIGRATION_STEPS`/`MIGRATION_BENEFITS`/`AGC_STEPS` -
 * imported directly in the section files, not retyped here) rather than
 * inventing a separate migration story for this page. Same content-sourcing
 * rule as the Atlassian page: nothing here states a number or claim that
 * isn't already backed by a real Clovity asset.
 */

/* ── Hero ───────────────────────────────────────────────────────────────── */
/* Light, split hero with a vector illustration (server → cloud) instead of
 * the dark-photo `ExpertiseHero` the other pages use - a bespoke layout for
 * this page per an explicit visual reference, not a change to the shared
 * component. Copy stays ours; only the layout/illustration idea is borrowed. */

export const CLOUD_MIGRATION_HERO = {
  crumbs: [
    { name: 'Home', href: ROUTES.home },
    { name: 'Expertise', href: ROUTES.expertise.atlassian },
    { name: 'Cloud Migration', href: ROUTES.expertise.cloudMigration },
  ],
  titleLead: 'Data Center Is Ending.',
  titleAccent: 'Your Momentum Isn’t.',
  subheading:
    'We move your Atlassian stack to Cloud - or Government Cloud - in staged, validated waves, then stay behind with Pulse AI watching the result.',
  /**
   * A bundled supplied photograph - see `cloudMigrationHeroBanner` in
   * `constants/media.ts`.
   *
   * No `tabletSrc`/`mobileSrc`: a static import lets `next/image` build the responsive
   * srcset from one file. Those entries existed to carry three hand-sized Unsplash URLs
   * of a photo this page SHARED with the Atlassian hero - both pages now have their own
   * image and neither reaches a third-party host to paint its first screen.
   */
  image: {
    src: cloudMigrationHeroBanner,
    alt: 'A cloud data-transfer diagram above a laptop and a phone in hand',
  },
} as const;

/* ── Trust strip ─────────────────────────────────────────────────────────── */

export const CLOUD_MIGRATION_TRUST_CONTENT = {
  label: 'Atlassian Cloud Migration Specialized',
} as const;

export const CLOUD_MIGRATION_TRUST_BADGES = CREDENTIAL_ROWS.find(
  (row) => row.id === 'atlassian-partner',
)!.badges;

/* ── Problem statement ──────────────────────────────────────────────────── */

export const CLOUD_MIGRATION_PROBLEM_CONTENT = {
  headingLead: 'Data Center Support ',
  headingHighlight: 'Has a Deadline',
  headingSecondLine: 'Your Migration Plan Shouldn’t Be an Afterthought.',
  paragraphs: [
    "Atlassian is winding Data Center down. Waiting doesn't remove the migration - it just removes your choice of timeline, and turns a planned project into a scramble.",
    'We run the move as a staged, validated program - not a weekend cutover - so app compatibility, permission schemes, and integrations are proven before your team ever notices the switch.',
  ],
  /** Bundled asset - `src/assets/images/expertise/data-center-support.jpg`. */
  image: {
    src: dataCenterSupportPhoto,
    alt: 'A technician documenting a data center server rack during an instance audit',
  },
} as const;

/* ── Migration approach comparison ───────────────────────────────────────── */
/* Structural idea from catworkx's "Full / Hybrid / Fresh Start" comparison
 * and Praecipio's "big bang vs. phased" framing - rewritten as our own
 * three-path comparison, with qualitative call-outs (not invented durations
 * or costs we can't back up). */

export const CLOUD_MIGRATION_APPROACH_CONTENT = {
  headingLead: 'Choose What Works ',
  headingHighlight: 'Best for Your Team',
  subheading:
    'Three real migration strategies. Which one fits depends on the size and complexity of what you’re moving.',
} as const;

export interface ApproachOption {
  id: string;
  name: string;
  /** Bundled illustration - `src/assets/icons/expertise/`. */
  iconImage: ImageSource;
  description: string;
  points: string[];
}

export const CLOUD_MIGRATION_APPROACH_OPTIONS: ApproachOption[] = [
  {
    id: 'full-cutover',
    name: 'Full Migration',
    iconImage: iconFullMigration,
    description: 'Move everything to the cloud in one coordinated window.',
    points: [
      'End-to-end support',
      'Data integrity assurance',
      'Post-migration optimization',
    ],
  },
  {
    id: 'phased-waves',
    name: 'Phased Migration',
    iconImage: iconPhasedMigration,
    description:
      'Move in stages, validating each wave before the next, for maximum control.',
    points: ['Business continuity', 'Risk mitigation', 'Flexible timelines'],
  },
  {
    id: 'hybrid',
    name: 'Hybrid Approach',
    iconImage: iconHybridApproach,
    description:
      'Run cloud and Data Center in parallel for a gradual, lower-risk transition.',
    points: ['Gradual adoption', 'Custom roadmap', 'Reduced cutover risk'],
  },
];

/* ── Per-product migration grid ──────────────────────────────────────────── */
/* Structural idea from catworkx's per-product migration cards (Jira, JSM,
 * Confluence, Bitbucket), replacing the earlier generic 6-card "what we
 * deliver" grid with something more specific to the Atlassian suite. */

export const CLOUD_MIGRATION_PRODUCTS_CONTENT = {
  headingLead: 'What Actually Moves, ',
  headingHighlight: 'Product by Product',
  subheading:
    'Migration isn’t one operation - it’s a different checklist per product.',
} as const;

export interface ProductMigrationNote {
  id: string;
  icon: PillarCard['icon'];
  iconChipClass: string;
  name: string;
  note: string;
}

export const CLOUD_MIGRATION_PRODUCTS: ProductMigrationNote[] = [
  {
    id: 'jira',
    icon: 'jira',
    iconChipClass: 'text-[#0052cc]',
    name: 'Jira Software',
    note: 'Workflows, custom fields, and automation rules migrate with validation - JQL filters and dashboards get rebuilt for Cloud rather than assumed to carry over as-is.',
  },
  {
    id: 'confluence',
    icon: 'confluence',
    iconChipClass: 'text-[#026aa7]',
    name: 'Confluence',
    note: 'Spaces and permission schemes map over directly; some legacy macros need a Cloud-compatible replacement before the space is considered migrated.',
  },
  {
    id: 'jsm',
    icon: 'headset',
    iconChipClass: 'text-brand-600',
    name: 'Jira Service Management',
    note: 'Request types, SLAs, and queues migrate; every custom workflow is revalidated against Cloud’s JSM engine rather than ported blind.',
  },
  {
    id: 'bitbucket',
    icon: 'git-branch',
    iconChipClass: 'text-[#64748b]',
    name: 'Bitbucket',
    note: 'Repositories and pipelines migrate; forked repositories are the one structure that can’t always be moved automatically and get re-linked by hand.',
  },
];

/* ── Migration flow (reuses the real home-page data) ────────────────────── */

export const CLOUD_MIGRATION_FLOW_CONTENT = {
  headingLead: 'One Path, ',
  headingHighlight: 'Every Instance',
} as const;

/* ── AGC block ───────────────────────────────────────────────────────────── */

export const CLOUD_MIGRATION_AGC_CONTENT = {
  headingLead: 'Atlassian Government Cloud. ',
  headingHighlight: 'We Get You There.',
  subheading:
    'The same migration program, run to the compliance baseline federal and state agencies require - built on the readiness process we already run for public-sector clients.',
} as const;

/* ── AI tie-in ───────────────────────────────────────────────────────────── */

export const CLOUD_MIGRATION_AI_CONTENT = {
  headingLead: 'Pulse AI Picks Up ',
  headingHighlight: 'Where Migration Ends',
  subheading:
    'The same AI copilot that flags anomalies and tracks project health keeps watching your instance after go-live - not just during the migration window.',
} as const;

/* ── FAQ ──────────────────────────────────────────────────────────────────── */
/* Structural idea from ServiceRocket's FAQ accordion - answers here reuse
 * real content already established elsewhere on this page/site rather than
 * inventing new figures (timelines, pricing) we can't back up. */

export const CLOUD_MIGRATION_FAQ_CONTENT = {
  headingLead: 'Before You ',
  headingHighlight: 'Move Anything',
} as const;

/**
 * Six disclosures, rendered by `FaqSection` as native `<details>` with FAQPage JSON-LD -
 * the same treatment as the Atlassian, ITSM, Managed Services, Workforce, AI and
 * Marketplace Apps FAQs.
 *
 * ── IT USED TO BE AN `<Accordion>`, AND THAT COST IT ITS SCHEMA ──
 * This was the one FAQ on the site built on the shared `<Accordion>` component, which
 * meant it emitted no `FAQPage` structured data - so search engines could not read it as
 * an FAQ at all, unlike every sibling page. Rebuilding it on `<details>` fixed that and
 * dropped a client component from the page at the same time.
 *
 * The five original answers are kept as they were: each one is grounded in something this
 * page already states above (the migration sources, the phased waves, app compatibility,
 * the AGC path, Pulse AI after go-live) rather than introducing a timeline or a price. The
 * sixth is new and follows the same rule - it states what the assessment produces, not how
 * long it takes.
 *
 * Typed as `FaqItem[]` rather than left `as const`, because `faqSchema()` takes the array
 * directly and a readonly tuple does not satisfy it.
 */
export const CLOUD_MIGRATION_FAQS: FaqItem[] = [
  {
    id: 'sources',
    question:
      'Do you only migrate from Atlassian Data Center, or other tools too?',
    answer:
      'Data Center is the most common starting point, but we’ve also moved teams off Cherwell, BMC Remedy, ServiceNow, and YouTrack onto the Atlassian suite - see the migration sources above.',
  },
  {
    id: 'downtime',
    question: 'Will my team experience downtime during the migration?',
    answer:
      'That’s the reason we default to phased waves instead of a single cutover window - each wave is validated and has its own rollback point, so a problem in one wave doesn’t take down the rest of the instance.',
  },
  {
    id: 'apps',
    question: 'What happens to our Marketplace apps and add-ons?',
    answer:
      'Every installed app is checked for a Cloud-compatible version before migration, and remediated where one doesn’t exist yet - covered under Marketplace App Compatibility above.',
  },
  {
    id: 'agc',
    question:
      'Can you migrate us to Atlassian Government Cloud instead of standard Cloud?',
    answer:
      'Yes - the AGC path above runs the same migration program to the FedRAMP-aligned baseline federal and state agencies require.',
  },
  {
    id: 'after',
    question: 'Who runs the instance after migration?',
    answer:
      'You can take it from there, or hand ongoing administration to our Managed Services team, with Pulse AI watching instance health from day one after go-live.',
  },
  {
    id: 'assessment',
    question: 'What do we actually get from the assessment before we commit?',
    answer:
      'A written picture of what you are moving: an inventory of projects, spaces and users, every installed app checked against its Cloud availability, the configuration that will not survive the move as-is, and the wave plan that falls out of all three. That document is what a date and a cost come from - which is why we would rather give you it than quote a timeline before anyone has looked inside the instance.',
  },
];

/* ── Metrics ─────────────────────────────────────────────────────────────── */

export const CLOUD_MIGRATION_METRICS_CONTENT = {
  headingLead: 'Numbers From the ',
  headingHighlight: 'Whole Practice',
} as const;

/** Same real, company-wide subset of `RESULT_STATS` used on the Atlassian page. */
export const CLOUD_MIGRATION_METRICS: StatBandItem[] = [
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

export const CLOUD_MIGRATION_FINAL_CTA = {
  headingLead: 'Ready to talk to',
  headingTail: 'an expert?',
  description:
    'Tell us what you’re working on and a Clovity specialist will get back to you with next steps.',
} as const;

export const CLOUD_MIGRATION_FINAL_CTA_LINKS: CtaLink[] = [
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
 * This page now carries TWO proof bands of different kinds: `CLOUD_MIGRATION_PROOF_CONTENT`
 * above is the static `CUSTOMER_STORIES` quote block, and this one is the live case-study
 * grid. The quotes were kept rather than replaced, on request.
 *
 * Of the three rails added at the same time, this one is the most likely to find genuine
 * matches - the live `jsm-resource` collection contains real migration stories, Forcepoint's
 * Data Center to Cloud move among them. See `data/cloud-migration.ts`.
 */
export const CLOUD_MIGRATION_CASE_STUDIES_CONTENT = {
  headingLead: 'Migrations We ',
  headingHighlight: 'Already Delivered',
  subheading:
    'Data Center and server estates moved to Cloud and Government Cloud, in the clients’ own words.',
  moreLabel: 'See all case studies',
  moreHref: ROUTES.resources.caseStudy,
} as const;
