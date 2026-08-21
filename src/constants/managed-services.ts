import type {
  BenchRole,
  CtaLink,
  FaqItem,
  PillarCard,
  ProductBadge,
  ServiceOffering,
  StatBandItem,
} from '@/types/content';
import { ROUTES } from './routes';
import {
  logoBitbucket,
  logoCompass,
  logoConfluence,
  logoJira,
  logoJiraAlign,
  logoJiraProductDiscovery,
  logoJiraServiceManagement,
  logoRovo,
  logoTrello,
} from './media';

/**
 * `/expertise/managed-services` - Managed Services.
 *
 * ── WHERE THE COPY COMES FROM ──
 * Grounded in Clovity's own published material rather than a competitor's:
 *   • the hero angle is our HOME PAGE's own line. `FDE_CONTENT` in `constants/home.ts`
 *     reads "Forward-Deployed Engineers. Embedded, Not On-Call." - this page takes
 *     that promise and applies it to run-state work, so the two pages say the same
 *     thing in the same words rather than inventing a second positioning.
 *   • `MS_BENCH_ROLES` and `MS_EMBEDDED_CONTENT` restate the embedded model already
 *     described in `FDE_CONTENT.subheading` ("We embed with your team... share
 *     ownership, and stay until it's done").
 *   • the six capability areas and the closing CTA come from Clovity's published
 *     managed-services page.
 * The FAQ answers and the bench framing are written for this page.
 *
 * ── WHERE THE NUMBERS COME FROM ──
 *   • "99.9%"    - our own published stat bands, twice: `expertise/atlassian` states
 *                  "99.9% Platform uptime" and `expertise/cloud-migration` states
 *                  "99.9% Post-migration uptime". NOTE: the older `website-t` build
 *                  says 99.95% on its Atlassian page. The two disagree; this page
 *                  uses the LOWER of the two published figures, which is the safe
 *                  direction for a number a client may hold us to. Worth reconciling
 *                  at source.
 *   • "24×7"     - clovity.com/atlassian/itsm-improvement: "24 × 7 U.S. support".
 *                  The same source the ITSM and DevSecOps stat bands cite.
 *   • "Monthly"  - our own managed-services page, twice: "Governance reviewed and
 *                  enforced monthly" and "Monthly reviews keep the roadmap current".
 *   • "Platinum" - the Atlassian Platinum Solution Partner badge in
 *                  `assets/badges/platinum-solution-partner.png`.
 * No third-party market statistics are used. If a new figure is added here it needs a
 * source in this comment or it does not belong on the page.
 *
 * ── TWO THINGS DELIBERATELY NOT SAID ──
 * 1. NO RESPONSE-TIME SLAs. Competitor pages lead with them (4-hour/2-hour/90-minute,
 *    12/24/48 hours a month). They are contractual commitments nobody at Clovity has
 *    signed off, so this page states scope and leaves the numbers to the engagement.
 *    The FAQ answers the question directly rather than dodging it. Note that the tier
 *    packaging which used to carry that footnote was removed with the plans table -
 *    if plans come back, the disclaimer has to come back with them.
 * 2. NO COST COMPARISON. The competitor hook this section is modelled on is
 *    Praecipio's "a part-time full-stack admin at a fraction of the cost", and the
 *    cost half is dropped on purpose: we have no published or signed-off figure for
 *    what a managed engagement costs against a full-time hire, and "a fraction of the
 *    cost" invented here would be a pricing claim. `MS_EMBEDDED_CONTENT` therefore
 *    argues BREADTH - one hire gets you one person's skills, a pod gets you the whole
 *    bench - which is the defensible half of the same hook. Add the cost line only
 *    with a real number behind it.
 */

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const MS_HERO = {
  crumbs: [
    { name: 'Home', href: ROUTES.home },
    { name: 'Expertise', href: ROUTES.expertise.atlassian },
    { name: 'Managed Services', href: ROUTES.expertise.managedServices },
  ],
  titleLead: 'Embedded Support,',
  titleAccent: 'Not On-Call.',
  lead: 'Around-the-clock administration and platform health for Jira, Jira Service Management and Confluence - run by engineers who sit with your team and know your instance, not a queue that meets you for the first time when something breaks.',
} as const;

/* ── Stat band ──────────────────────────────────────────────────────────── */

export const MS_STATS: StatBandItem[] = [
  {
    id: 'uptime',
    value: '99.9%',
    accent: true,
    label: 'Platform Uptime',
  },
  {
    id: 'support',
    value: '24×7',
    label: 'U.S.-Led Monitoring & Support',
  },
  {
    id: 'reviews',
    value: 'Monthly',
    label: 'Governance & Roadmap Review',
  },
  {
    id: 'partner',
    value: 'Platinum',
    label: 'Atlassian Solution Partner',
  },
];

/* ── Why teams hand over the platform ───────────────────────────────────── */

export const MS_BURDEN_CONTENT = {
  headingLead: 'Nobody Was Hired to ',
  headingHighlight: 'Administer Jira',
  subheading:
    'On most teams platform ownership is a side job held by whoever knows the most. It works until that person is busy, on leave, or gone.',
} as const;

export const MS_BURDEN_CARDS: PillarCard[] = [
  {
    id: 'side-job',
    icon: 'users-cog',
    iconChipClass: 'text-brand-600',
    title: 'Admin Is Someone’s Second Job',
    description:
      'The person who configured your instance has a delivery role too. Requests queue behind their real work, and the platform gets attention only when it breaks.',
  },
  {
    id: 'drift',
    icon: 'sliders',
    iconChipClass: 'text-[#7c3aed]',
    title: 'Configuration Drifts Quietly',
    description:
      'Schemes multiply, automations accumulate owners who left, and permissions loosen one exception at a time. None of it fails loudly - it just gets harder to change safely.',
  },
  {
    id: 'no-roadmap',
    icon: 'chart-line',
    iconChipClass: 'text-accent-500',
    title: 'Improvement Never Gets Scheduled',
    description:
      'Upgrades, app reviews and cleanup sit on a list nobody owns. New Atlassian capability ships and goes unused because no one has time to evaluate it.',
  },
];

/* ── What we deliver ────────────────────────────────────────────────────── */

export const MS_DELIVER_CONTENT = {
  headingLead: 'What It Takes to Keep ',
  headingHighlight: 'an Atlassian Estate Running',
  subheading:
    'Not a menu of options - this is the standing work of running an Atlassian estate. An engagement can start with any subset, but the list does not get shorter on its own.',
} as const;

export const MS_OFFERINGS: ServiceOffering[] = [
  {
    id: 'monitoring',
    icon: 'heart-pulse',
    iconChipClass: 'text-brand-600',
    title: '24/7 Monitoring & Support',
    description:
      'Continuous watch on performance, availability and error rates, with U.S.-led response when something moves - so problems surface before your teams report them.',
    points: [
      'Availability and performance monitoring',
      'Alert triage with a named owner',
      'Incident response and root-cause write-up',
    ],
  },
  {
    id: 'functional-admin',
    icon: 'settings',
    iconChipClass: 'text-brand-600',
    title: 'Functional Administration',
    description:
      'The configuration work teams queue up: workflows, fields, schemes, permissions and the project setup behind every new team that onboards.',
    points: [
      'Workflow, field and scheme changes',
      'Project and space setup',
      'Joiner, mover and leaver processing',
    ],
  },
  {
    id: 'technical-admin',
    icon: 'server',
    iconChipClass: 'text-[#7c3aed]',
    title: 'Technical Administration',
    description:
      'The layer underneath - releases, app upgrades, integration plumbing and the environments you test changes in before they reach production.',
    points: [
      'Release and app upgrade cycles',
      'Sandbox and test-environment upkeep',
      'Vendor tickets raised and chased for you',
    ],
  },
  {
    id: 'platform-health',
    icon: 'shield-half',
    iconChipClass: 'text-[#16a34a]',
    title: 'Proactive Platform Health',
    description:
      'Scheduled review of the things that degrade quietly: configuration drift, permission sprawl, unowned automations and reports nobody trusts any more.',
    points: [
      'Configuration drift detected and reported',
      'Permission and access review with an audit trail',
      'Findings ranked into an improvement backlog',
    ],
  },
  {
    id: 'licences',
    icon: 'file-signature',
    iconChipClass: 'text-accent-500',
    title: 'License Management & Optimization',
    description:
      'Seat counts, tiers and renewal dates tracked against actual usage, so you stop paying for dormant seats and apps nobody opened this quarter.',
    points: [
      'Seat and tier usage reviewed against billing',
      'Dormant accounts and unused apps flagged',
      'Renewal calendar with recommendations',
    ],
  },
  {
    id: 'workflow-evolution',
    icon: 'git-branch',
    iconChipClass: 'text-[#16a34a]',
    title: 'Workflow Evolution & Integration Upkeep',
    description:
      'Your process changes; the configuration has to follow it. This is the work of moving the platform with the business instead of freezing it at go-live.',
    points: [
      'Workflow changes as the process changes',
      'Automation rebuilt, owned and documented',
      'Integration failures monitored and repaired',
    ],
  },
];

/* ── The embedded pod ───────────────────────────────────────────────────── */

export const MS_EMBEDDED_CONTENT = {
  headingLead: 'One Hire Gets You One Person. ',
  headingHighlight: 'This Gets You the Bench.',
  subheading:
    'An Atlassian estate needs six or seven disciplines and rarely a full week of any one of them. Hiring for that means picking which gap you can live with. An embedded pod means you do not have to.',
  /**
   * The honest version of the value hook - capability breadth, not a cost multiple.
   * See the note at the top of this file on why the cost half is absent.
   */
  note: 'You get one point of contact, not seven. The routing happens on our side.',
  ctaLabel: 'Talk to our delivery team',
  ctaHref: ROUTES.discover.contact,
} as const;

export const MS_BENCH_ROLES: BenchRole[] = [
  {
    id: 'jira-admin',
    role: 'Jira administrator',
    depth: 'Workflows, schemes, fields and the permission model.',
    icon: 'jira',
    iconChipClass: 'text-brand-600',
  },
  {
    id: 'jsm-specialist',
    role: 'Service management specialist',
    depth: 'Queues, SLAs, request types and escalation paths.',
    icon: 'headset',
    iconChipClass: 'text-[#7c3aed]',
  },
  {
    id: 'automation',
    role: 'Automation engineer',
    depth: 'Rules, integrations and the scripts holding them together.',
    icon: 'zap',
    iconChipClass: 'text-accent-500',
  },
  {
    id: 'platform-engineer',
    role: 'Platform engineer',
    depth: 'Upgrades, environments, apps and performance.',
    icon: 'server',
    iconChipClass: 'text-[#16a34a]',
  },
  {
    id: 'security',
    role: 'Access & security reviewer',
    depth: 'Least-privilege groups, access reviews and audit trails.',
    icon: 'lock',
    iconChipClass: 'text-brand-600',
  },
  {
    id: 'lead',
    role: 'Engagement lead',
    depth: 'The roadmap, the monthly review and your escalation path.',
    icon: 'handshake',
    iconChipClass: 'text-[#7c3aed]',
  },
];

/* ── Products we keep running ───────────────────────────────────────────── */

export const MS_PRODUCTS_CONTENT = {
  headingLead: 'Every Product We Keep Running ',
  headingHighlight: 'for Clients',
} as const;

/**
 * Nine official lockups, the same set and the same reasoning as
 * `DEVSECOPS_PRODUCTS` - see the note on those assets in `constants/media.ts`.
 * `icon` and `tintClass` stay populated on every entry even though `logo` is always
 * present: that is the documented degradation path if a lockup file is ever removed.
 */
export const MS_PRODUCTS: ProductBadge[] = [
  {
    id: 'jira',
    name: 'Jira',
    logo: { src: logoJira, alt: 'Jira', width: 83, height: 32 },
    icon: 'jira',
    tintClass: 'bg-brand-50 text-brand-600',
  },
  {
    id: 'confluence',
    name: 'Confluence',
    logo: { src: logoConfluence, alt: 'Confluence', width: 188, height: 32 },
    icon: 'confluence',
    tintClass: 'bg-brand-50 text-brand-600',
  },
  {
    id: 'jira-service-management',
    name: 'Jira Service Management',
    logo: {
      src: logoJiraServiceManagement,
      alt: 'Jira Service Management',
      width: 372,
      height: 32,
    },
    icon: 'headset',
    tintClass: 'bg-brand-50 text-brand-600',
  },
  {
    id: 'jira-align',
    name: 'Jira Align',
    logo: { src: logoJiraAlign, alt: 'Jira Align', width: 156, height: 32 },
    icon: 'grip',
    tintClass: 'bg-brand-50 text-brand-600',
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket',
    logo: { src: logoBitbucket, alt: 'Bitbucket', width: 166, height: 32 },
    icon: 'git-branch',
    tintClass: 'bg-brand-50 text-brand-600',
  },
  {
    id: 'compass',
    name: 'Compass',
    logo: { src: logoCompass, alt: 'Compass', width: 162, height: 32 },
    icon: 'compass',
    tintClass: 'bg-brand-50 text-brand-600',
  },
  {
    id: 'jira-product-discovery',
    name: 'Jira Product Discovery',
    logo: {
      src: logoJiraProductDiscovery,
      alt: 'Jira Product Discovery',
      width: 327,
      height: 32,
    },
    icon: 'sliders',
    tintClass: 'bg-brand-50 text-brand-600',
  },
  {
    id: 'rovo',
    name: 'Rovo',
    logo: { src: logoRovo, alt: 'Rovo', width: 106, height: 32 },
    icon: 'robot',
    tintClass: 'bg-brand-50 text-brand-600',
  },
  {
    id: 'trello',
    name: 'Trello',
    logo: { src: logoTrello, alt: 'Trello', width: 113, height: 32 },
    icon: 'grip',
    tintClass: 'bg-brand-50 text-brand-600',
  },
];

/* ── Proof ──────────────────────────────────────────────────────────────── */

export const MS_PROOF_CONTENT = {
  headingLead: 'Platforms We Already ',
  headingHighlight: 'Run',
  subheading:
    'Engagements where the work continued past go-live, in the clients’ own words.',
  moreLabel: 'See all case studies',
  moreHref: ROUTES.resources.caseStudy,
} as const;

/* ── FAQ ────────────────────────────────────────────────────────────────── */

export const MS_FAQ_CONTENT = {
  headingLead: 'Before You Hand Over ',
  headingHighlight: 'Admin Rights',
} as const;

export const MS_FAQ: FaqItem[] = [
  {
    id: 'embedded',
    question: 'What does "embedded, not on-call" actually mean in practice?',
    answer:
      'Named engineers who know your instance, working to your calendar and reachable in your channels - not a rota that meets your configuration for the first time when a ticket arrives. It is the same model our delivery teams use on project work, applied to run-state. You get one point of contact; the routing across disciplines happens on our side.',
  },
  {
    id: 'sla',
    question: 'What are your response times and coverage hours?',
    answer:
      'They are set per engagement and written into the agreement rather than fixed by plan here. Monitoring and support coverage is U.S.-led and around the clock; what a given engagement commits to depends on which systems are in scope and what your business actually needs overnight. We would rather agree that with you than publish a number you then have to negotiate down.',
  },
  {
    id: 'uptime',
    question: 'Where does the 99.9% uptime figure come from?',
    answer:
      'It is the platform uptime Clovity publishes for the estates we run, and it describes the Atlassian platform under management rather than a contractual credit. The uptime commitment that carries financial consequence is Atlassian’s own for Cloud, plus whatever is written into your agreement with us - ask for both in writing before you rely on either.',
  },
  {
    id: 'pulse',
    question: 'Is the AI health layer making changes to our instance?',
    answer:
      'No. Pulse AI reads and reports - org health, anomaly detection, alerting and the Pulse Score. Every change to your configuration is made by a person, through your change process. An anomaly is a prompt for an engineer to look, not an instruction for software to act.',
  },
  {
    id: 'admin-access',
    question: 'Do you need full admin access to our instance?',
    answer:
      'We work at the least privilege the scope requires, through named accounts that are yours and revocable at any time. Actions are traceable to an individual, and access reviews are part of the monthly cycle - the same standard we apply to our federal and state work.',
  },
  {
    id: 'in-house',
    question:
      'We have an internal Atlassian admin. Does this still make sense?',
    answer:
      'Often yes, and the shape changes. Where there is an internal admin we usually cover escalation, upgrades, app and vendor management and the improvement backlog, so your admin spends their time on the configuration decisions that need someone who knows the business. We are equally happy being the second pair of hands rather than the only one.',
  },
  {
    id: 'exit',
    question: 'What happens if we want to take it back in-house?',
    answer:
      'You get what you would need to do that, throughout - runbooks, documented automations and current configuration notes are maintained as part of the engagement rather than assembled at the end. There is no state where leaving means starting from a blank page.',
  },
];

/* ── Final CTA ──────────────────────────────────────────────────────────── */

export const MS_FINAL_CTA = {
  headingLead: 'Ready to talk to',
  headingTail: 'an expert?',
  description:
    'Tell us what you’re working on and a Clovity specialist will get back to you with next steps.',
} as const;


export const MS_FINAL_CTA_LINKS: CtaLink[] = [
  {
    id: 'talk-to-an-expert',
    label: 'Talk to an expert',
    href: ROUTES.discover.contact,
    variant: 'white-pill',
    icon: 'arrow-up-right',
  },
];
