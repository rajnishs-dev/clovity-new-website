import type {
  CapabilityDetail,
  CtaLink,
  DeliveryPhase,
  FactItem,
  FaqItem,
  GlossaryEntry,
  PillarCard,
  ServiceOffering,
  StatBandItem,
} from '@/types/content';
import { ROUTES } from './routes';

/**
 * `/expertise/itsm` - ITSM & Service Management.
 *
 * ── WHERE THE COPY COMES FROM ──
 * The JSM capability descriptions in `ITSM_JSM_CAPABILITIES` and the delivery
 * phases in `ITSM_PHASES` are adapted from Clovity's own published
 * `clovity.com/atlassian/itsm-improvement` page, so this page makes no claim the
 * company is not already making in public. Everything else is written for this
 * page.
 *
 * ── WHERE THE NUMBERS COME FROM ──
 * Every figure on this page traces to something already published:
 *   • "6 weeks"  - clovity.com/atlassian/itsm-improvement: "Production-ready
 *                  portals delivered as quickly as six weeks."
 *   • "24×7"     - the same page's "24 × 7 U.S. support".
 *   • "50%"      - the Hashgraph case study in `data/case-study.ts`, whose
 *                  published outcome is "50% faster ticket resolution". The stat
 *                  cell names the client so the claim is attributed, not floating.
 *   • "Specialized" - the Atlassian Service Management Specialization badge in
 *                  `assets/badges/atlassian-badge-itsm-amer.svg`.
 * No third-party market statistics are used. If a new figure is added here it
 * needs a source in this comment or it does not belong on the page.
 */

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const ITSM_HERO = {
  crumbs: [
    { name: 'Home', href: ROUTES.home },
    { name: 'Expertise', href: ROUTES.expertise.atlassian },
    { name: 'ITSM & Service Management', href: ROUTES.expertise.itsm },
  ],
  titleLead: 'Service Management That',
  titleAccent: 'Scales Past IT.',
  lead: 'Jira Service Management, implemented for real ticket volume - then extended to HR, Finance, Legal and Operations on the same platform. ITIL 4-aligned, audit-ready, and run by an Atlassian Platinum Solution Partner.',
} as const;

/* ── Why Clovity for service management ─────────────────────────────────── */

export const ITSM_WHY_CONTENT = {
  headingLead: 'Three Reasons Teams Bring Us ',
  headingHighlight: 'Their Service Desk',
} as const;

export const ITSM_WHY_CARDS: PillarCard[] = [
  {
    id: 'service-management-specialized',
    icon: 'atlassian',
    iconChipClass: 'text-brand-600',
    title: 'Service Management Specialized',
    description:
      'An Atlassian-verified Service Management Specialization on top of Platinum partner tier - the depth is assessed by Atlassian, not self-declared.',
  },
  {
    id: 'built-for-volume',
    icon: 'list-check',
    iconChipClass: 'text-[#7c3aed]',
    title: 'Configured for Real Volume',
    description:
      'Request types, queues, SLAs and automation shaped around the tickets you actually receive - not a default template dropped into your instance.',
  },
  {
    id: 'audit-ready',
    icon: 'shield-half',
    iconChipClass: 'text-accent-500',
    title: 'Audit-Ready by Default',
    description:
      'Least-privilege access, complete audit trails and approval gates built in from the first sprint - the standard our federal and state clients require.',
  },
];

/* ── Stat band ──────────────────────────────────────────────────────────── */

export const ITSM_STATS: StatBandItem[] = [
  {
    id: 'go-live',
    value: '6 wks',
    accent: true,
    label: 'Production-Ready Portal Go-Live',
  },
  {
    id: 'resolution',
    value: '50%',
    label: 'Faster Ticket Resolution at Hashgraph',
  },
  {
    id: 'support',
    value: '24×7',
    label: 'U.S.-Led Support & Optimization',
  },
  {
    id: 'specialization',
    value: 'Specialized',
    label: 'Atlassian Service Management Partner',
  },
];

/* ── What we deliver ────────────────────────────────────────────────────── */

export const ITSM_DELIVER_CONTENT = {
  headingLead: 'Six Engagements That Make Up a ',
  headingHighlight: 'Working Service Desk',
  subheading:
    'Scoped individually or run end to end. Most teams start with the first and add the rest as service management spreads past IT.',
} as const;

export const ITSM_OFFERINGS: ServiceOffering[] = [
  {
    id: 'jsm-implementation',
    icon: 'headset',
    iconChipClass: 'text-brand-600',
    title: 'JSM Implementation',
    description:
      'Jira Service Management stood up for the ticket volume you actually handle, with the intake and routing rules your agents will live in.',
    points: [
      'Request types and forms mapped to real intake',
      'Queues, assignment rules and escalation paths',
      'SLA calendars, targets and breach automation',
    ],
  },
  {
    id: 'enterprise-service-management',
    icon: 'people-group',
    iconChipClass: 'text-[#7c3aed]',
    title: 'Enterprise Service Management',
    description:
      'The same platform extended to HR, Finance, Legal and Operations - department-scoped portals, one reporting layer underneath.',
    points: [
      'Department portals with their own request catalogs',
      'Permission boundaries so HR cases stay in HR',
      'Shared dashboards across every service team',
    ],
  },
  {
    id: 'itil-process-design',
    icon: 'clipboard-list',
    iconChipClass: 'text-accent-500',
    title: 'ITIL 4-Aligned Process Design',
    description:
      'Practices designed against ITIL 4 and then encoded in the tool, so the process your auditor reads is the process your agents follow.',
    points: [
      'Service catalog and request fulfilment design',
      'Workflow, status and approval modelling',
      'Continual improvement cadence and metrics',
    ],
  },
  {
    id: 'incident-problem-change',
    icon: 'alert-triangle',
    iconChipClass: 'text-brand-green',
    title: 'Incident, Problem & Change',
    description:
      'The three practices that decide whether an outage is a bad hour or a bad quarter, wired together with on-call and post-incident review.',
    points: [
      'Alerting, on-call rotas and major-incident escalation',
      'Problem records linked to recurring incidents',
      'Change calendars, CAB approvals and risk scoring',
    ],
  },
  {
    id: 'cmdb-assets',
    icon: 'database',
    iconChipClass: 'text-brand-600',
    title: 'CMDB, Asset & Configuration',
    description:
      'Assets modelled so every ticket arrives with the infrastructure attached, and ownership and lifecycle stop living in a spreadsheet.',
    points: [
      'Object schemas for hardware, software and services',
      'Discovery, import and reconciliation pipelines',
      'Dependency mapping for change-impact analysis',
    ],
  },
  {
    id: 'portal-catalog',
    icon: 'store',
    iconChipClass: 'text-[#7c3aed]',
    title: 'Service Portal & Catalog',
    description:
      'A portal people use without being told to, backed by a knowledge base that answers the request before a ticket is ever opened.',
    points: [
      'Portal information architecture and branding',
      'Knowledge base articles surfaced at intake',
      'Deflection reporting on what self-service resolved',
    ],
  },
];

/* ── Plain-language education: ITSM / ITIL / ESM ────────────────────────── */

export const ITSM_GLOSSARY_CONTENT = {
  headingLead: 'ITSM, ITIL and ESM - ',
  headingHighlight: 'What Each One Actually Means',
  subheading:
    'The three get used interchangeably in vendor decks. They are not the same thing, and knowing which one you need changes what you should buy.',
} as const;

/**
 * The three terms, in READING order (ITSM first - it is what most visitors arrive
 * looking for). `nest` carries the containment order the scope diagram draws, which
 * is the reverse: ITIL innermost, ESM outermost.
 */
export const ITSM_GLOSSARY: GlossaryEntry[] = [
  {
    id: 'itsm',
    term: 'ITSM',
    expansion: 'IT Service Management',
    definition:
      'How an IT team manages the services it delivers to the rest of the business - intake, incidents, changes, assets. It is the practice, not a product you install.',
    scope: 'IT Ops · Service Desk · Engineering · Security',
    nest: 1,
    icon: 'headset',
    iconChipClass: 'text-brand-600',
  },
  {
    id: 'itil',
    term: 'ITIL 4',
    expansion: 'IT Infrastructure Library',
    definition:
      'The framework of practices ITSM is usually designed against. It tells you what good incident, change and request management look like; it does not tell you which tool to run them in.',
    scope: 'The practices underneath both',
    nest: 0,
    icon: 'clipboard-list',
    iconChipClass: 'text-[#7c3aed]',
  },
  {
    id: 'esm',
    term: 'ESM',
    expansion: 'Enterprise Service Management',
    definition:
      'The same discipline applied outside IT. HR onboarding, finance approvals and legal reviews are all services with requests, owners and SLAs - ESM runs them the same way.',
    scope: 'HR · Finance · Legal · Facilities · Procurement',
    nest: 2,
    icon: 'people-group',
    iconChipClass: 'text-brand-700',
  },
];

/** The case for extending past IT, as a checked list under the definitions. */
export const ITSM_ESM_BENEFITS_CONTENT = {
  title: 'Why teams extend it past IT',
  description:
    'Once one department runs on structured intake, the others notice. These are the reasons the second and third rollouts get funded.',
} as const;

export const ITSM_ESM_BENEFITS: string[] = [
  'Every request handled the same way, whoever fulfils it',
  'One place to see what is queued across the business',
  'Requests turn into tracked work instead of buried email threads',
  'Reporting stops being a monthly spreadsheet exercise',
  'A knowledge base that answers repeat questions on its own',
  'No second platform to license, secure and administer',
];

/* ── The JSM advantage ──────────────────────────────────────────────────── */

export const ITSM_JSM_CONTENT = {
  headingLead: 'Why We Build On ',
  headingHighlight: 'Jira Service Management',
  subheading:
    'Four capabilities do most of the work. Adapted from our own JSM implementation practice - the same four we configure on every engagement.',
  ctaLabel: 'See what a build includes',
  ctaHref: ROUTES.discover.contact,
} as const;

export const ITSM_JSM_CAPABILITIES: CapabilityDetail[] = [
  {
    id: 'request-management',
    icon: 'inbox',
    iconChipClass: 'text-brand-600',
    title: 'Request Management',
    description:
      'One platform for work across teams, so employees and customers get help without knowing who owns it. Requests from anywhere in the company are viewed, tracked and queued in a service desk agents can actually work in.',
  },
  {
    id: 'incident-management',
    icon: 'alert-triangle',
    iconChipClass: 'text-accent-500',
    title: 'Incident Management',
    description:
      'Development and IT operations respond to the same incident in the same place - with clear alerting, on-call management, control over major-incident escalation, and the reporting that makes a post-incident review worth holding.',
  },
  {
    id: 'change-management',
    icon: 'git-branch',
    iconChipClass: 'text-[#7c3aed]',
    title: 'Change Management',
    description:
      'Changes arrive carrying context from your development tools, so approvers can judge risk instead of guessing at it. Low-risk changes clear through automation rather than sitting in a weekly CAB queue.',
  },
  {
    id: 'asset-management',
    icon: 'database',
    iconChipClass: 'text-brand-green',
    title: 'Asset Management',
    description:
      'An open data structure that models any asset, not just hardware. Tracking, discovery and review give teams real ownership and lifecycle visibility - which is where the cost reductions actually come from.',
  },
];

/* ── Delivery approach ─────────────────────────────────────────────────── */

export const ITSM_APPROACH_CONTENT = {
  headingLead: 'From First Blueprint to ',
  headingHighlight: 'Steady State',
  subheading:
    'Six phases, adapted from our own implementation framework. The last one is the reason clients stay: an implementation that nobody tunes goes stale inside a year.',
} as const;

export const ITSM_PHASES: DeliveryPhase[] = [
  {
    id: 'assess',
    ordinal: '01',
    icon: 'search',
    iconChipClass: 'text-brand-600',
    title: 'Assess',
    description:
      'Discovery across your current tooling, ticket data, SLAs and audit posture. We come out with maturity, gaps and a scoped plan.',
  },
  {
    id: 'design',
    ordinal: '02',
    icon: 'clipboard-list',
    iconChipClass: 'text-[#7c3aed]',
    title: 'Design',
    description:
      'Practices designed against ITIL 4 and your security requirements - service catalog, workflows, permissions and SLA model on paper first.',
  },
  {
    id: 'configure',
    ordinal: '03',
    icon: 'settings',
    iconChipClass: 'text-accent-500',
    title: 'Configure',
    description:
      'Jira Service Management, Assets and Confluence built to the design. Tailored setups your team can administer, ready on day one.',
  },
  {
    id: 'integrate',
    ordinal: '04',
    icon: 'git-branch',
    iconChipClass: 'text-brand-green',
    title: 'Integrate',
    description:
      'Data flowing to ERP, HRIS, monitoring and DevSecOps pipelines, so a ticket is not the only place the truth lives.',
  },
  {
    id: 'adopt',
    ordinal: '05',
    icon: 'graduation-cap',
    iconChipClass: 'text-brand-600',
    title: 'Drive Adoption',
    description:
      'Role-based enablement for agents, admins and approvers, plus the runbooks and documentation that outlast the engagement.',
  },
  {
    id: 'sustain',
    ordinal: '06',
    icon: 'trending-up',
    iconChipClass: 'text-[#7c3aed]',
    title: 'Sustain',
    description:
      '24×7 U.S.-led support with quarterly health checks and a roadmap review, so the configuration keeps pace with the org.',
  },
];

/* ── Public-sector proof ────────────────────────────────────────────────── */

export const ITSM_PUBLIC_SECTOR_CONTENT = {
  headingLead: 'Service Desks That Pass ',
  headingHighlight: 'a Federal Audit',
  subheading:
    'Federal, state, county and city agencies run service management with us - which means the compliance work is part of the build, not a remediation project afterwards.',
  ctaLabel: 'Talk to a public-sector lead',
  ctaHref: ROUTES.discover.contact,
} as const;

export const ITSM_PUBLIC_SECTOR_FACTS: FactItem[] = [
  {
    id: 'audit-ready',
    title: 'Audit-ready workflows',
    description:
      'Compliance-first workflows and complete audit trails - the approach behind our federal tax-administration work.',
  },
  {
    id: 'least-privilege',
    title: 'Least-privilege access',
    description:
      'Permission schemes scoped per queue and per department, so agents see only the cases they are meant to.',
  },
  {
    id: 'agc',
    title: 'Government Cloud capable',
    description:
      'Service management designed to sit on Atlassian Government Cloud where the mission requires it.',
  },
  {
    id: 'us-led',
    title: 'U.S.-led delivery',
    description:
      'Security-cleared U.S. architects lead the engagement, with compliant teams keeping progress moving around the clock.',
  },
];

/* ── Proof: case studies ────────────────────────────────────────────────── */

export const ITSM_PROOF_CONTENT = {
  headingLead: 'Service Management ',
  headingHighlight: 'Already Running',
  subheading:
    'Published outcomes from service-desk engagements, with the numbers as the clients reported them.',
  /** Category on `CaseStudyItem` this section filters for. */
  category: 'ITSM & Service Management',
  moreLabel: 'View all case studies',
  moreHref: ROUTES.resources.caseStudy,
} as const;

/* ── Trusted by ─────────────────────────────────────────────────────────── */

export const ITSM_TRUSTED_CONTENT = {
  headingLead: 'Enterprise & Public-Sector Teams ',
  headingHighlight: 'Running Service Management',
  /** Must match this section's background, or the fade shows as a pale band. */
  fadeColor: '#ffffff',
} as const;

/* ── FAQ ────────────────────────────────────────────────────────────────── */

export const ITSM_FAQ_CONTENT = {
  headingLead: 'Before You ',
  headingHighlight: 'Book a Call',
} as const;

export const ITSM_FAQ: FaqItem[] = [
  {
    id: 'itsm-vs-esm',
    question: 'What is the difference between ITSM and ESM?',
    answer:
      'ITSM manages IT services - incidents, changes, requests and the assets behind them. ESM applies the same discipline to HR, Finance, Legal and Facilities. Both run on one Jira Service Management instance with department-scoped portals and a shared reporting layer, so extending past IT is a configuration exercise rather than a second platform purchase.',
  },
  {
    id: 'timeline',
    question: 'How long does a JSM implementation take?',
    answer:
      'A production-ready portal can go live in as little as six weeks. Replacing an existing service desk takes longer, because configuration mapping and parallel running are part of the work, and the range depends on integration depth. Every engagement is scoped and priced before build starts, so the timeline is fixed at kickoff rather than discovered halfway through.',
  },
  {
    id: 'migration',
    question: 'Can you migrate us off ServiceNow, Remedy or Cherwell?',
    answer:
      'Yes. We map every configuration in the existing system to its JSM equivalent first, then rebuild workflows the way JSM is designed to work rather than porting the old shape across. The old and new queues run in parallel until the new one holds, and we validate against real ticket data before cutover.',
  },
  {
    id: 'itil',
    question: 'Do we have to adopt ITIL to use Jira Service Management?',
    answer:
      'No. ITIL 4 is the framework we design against because it gives incident, change and request management a defensible shape, and auditors recognise it. How much of it you adopt is a scoping decision. Teams that only need structured intake and SLAs get exactly that, without the practices they will not run.',
  },
  {
    id: 'cmdb',
    question: 'Is a CMDB worth configuring, or is it a phase-two problem?',
    answer:
      'It is worth configuring when your agents are resolving tickets without seeing the infrastructure they own. If change impact is currently guesswork and asset ownership lives in a spreadsheet, Assets pays for itself in the first quarter. If your estate is small and stable, it can genuinely wait.',
  },
  {
    id: 'compliance',
    question: 'How do you handle compliance and access control?',
    answer:
      'Least-privilege permission schemes, approval gates and complete audit trails are part of the first build, not a hardening pass afterwards. This is the standard our federal and state clients require, and it is the same baseline we apply to commercial engagements.',
  },
  {
    id: 'after-go-live',
    question: 'What happens after go-live?',
    answer:
      'Your team owns the instance. Documentation, runbooks and role-based training for agents, approvers and admins are part of every engagement. Teams that want ongoing tuning take our 24×7 U.S.-led support with quarterly health checks and a roadmap review; teams that would rather run it themselves are equipped to.',
  },
];

/* ── Final CTA ──────────────────────────────────────────────────────────── */

export const ITSM_FINAL_CTA = {
  headingLead: 'Ready to fix',
  headingTail: 'your service desk?',
  description:
    'Bring us your current service model and what is not working in it. We come back with a phased plan and a scoped price.',
} as const;

export const ITSM_FINAL_CTA_LINKS: CtaLink[] = [
  {
    id: 'talk-to-an-expert',
    label: 'Talk to an expert',
    href: ROUTES.discover.contact,
    variant: 'white-pill',
    icon: 'arrow-up-right',
  },
];
