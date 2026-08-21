import type {
  BenchRole,
  CapabilityChip,
  CredentialBadge,
  CtaLink,
  EngagementContrast,
  FaqItem,
  ProcessStep,
  ServiceOffering,
  SourcingOption,
  StatBandItem,
} from '@/types/content';
import { ROUTES } from './routes';
import { CDN } from './media';


export const WF_HERO = {
  crumbs: [
    { name: 'Home', href: ROUTES.home },
    { name: 'Expertise', href: ROUTES.expertise.atlassian },
    { name: 'Workforce Solutions', href: ROUTES.expertise.workforce },
  ],
  titleLead: 'Atlassian Talent,',
  titleAccent: 'Inside Your Team.',
  lead: 'Certified engineers who join a team you still lead - your board, your standups, your change process - plus training that leaves the skill behind when they roll off.',
} as const;

/* ── Stat band ──────────────────────────────────────────────────────────── */

export const WF_STATS: StatBandItem[] = [
  {
    id: 'experts',
    value: '100+',
    accent: true,
    label: 'Atlassian-Certified Experts',
  },
  {
    id: 'accreditations',
    value: '235+',
    label: 'Delivery Accreditations',
  },
  {
    id: 'partner',
    value: 'Platinum',
    label: 'Atlassian Solution Partner',
  },
  {
    id: 'diversity',
    value: 'MBE',
    label: 'NMSDC & USPAACC Certified',
  },
];

/* ── Three ways to close a skill gap ────────────────────────────────────── */

export const WF_SOURCING_CONTENT = {
  headingLead: 'You Have Three Ways to Close a ',
  headingHighlight: 'Skill Gap',
  subheading:
    'Only one of them is hiring, and hiring is the slowest and the least reversible. This is the honest version of the trade, including ours.',
  note: 'Most engagements start as augmentation and end as enablement - the point of the third column is that it can.',
} as const;

/**
 * The three routes, in the order a buyer actually considers them.
 *
 * Every column states a real cost, including the recommended one. See the note on
 * `SourcingOption.tradeoff` for why that is a required field rather than a choice.
 */
export const WF_SOURCING: SourcingOption[] = [
  {
    id: 'hire',
    route: 'Hire a full-time specialist',
    strength:
      'The knowledge stays in-house permanently, and the role can grow with the platform.',
    tradeoff:
      'Months from approved requisition to productive, and you commit to one person’s skill set for a platform that needs six.',
    icon: 'briefcase',
    iconChipClass: 'text-[#7c3aed]',
  },
  {
    id: 'contract',
    route: 'Bring in a contractor',
    strength: 'Fast to start, and the commitment ends when the project does.',
    tradeoff:
      'Vetting is yours to do, the work leaves when they do, and nobody is accountable for what they left behind.',
    icon: 'file-signature',
    iconChipClass: 'text-accent-500',
  },
  {
    id: 'embed',
    route: 'Embed certified capacity',
    strength:
      'Certified engineers inside your team on your process, backed by a partner’s bench rather than one CV - and the option to convert the engagement into training your own people.',
    tradeoff:
      'You are adding a partner to your delivery model, so it needs a named owner on your side and a scope you are willing to review.',
    emphasis: true,
    icon: 'people-group',
    iconChipClass: 'text-brand-600',
  },
];

/* ── What we deliver ────────────────────────────────────────────────────── */

export const WF_DELIVER_CONTENT = {
  headingLead: 'Capacity, and the ',
  headingHighlight: 'Capability to Replace It',
  subheading:
    'Six services, and they are meant to be bought in that order: people first while the work is urgent, enablement next so the need shrinks.',
} as const;

/**
 * The six sub-services, split by intent.
 *
 * ── THE ORDER IS THE ARGUMENT ──
 * Augmentation and embedded engineers come first because that is what a team under
 * pressure searches for. Training, coaching and adoption follow because they are what
 * stops the first three becoming permanent.
 */
export const WF_OFFERINGS: ServiceOffering[] = [
  {
    id: 'staff-augmentation',
    icon: 'users',
    iconChipClass: 'text-brand-600',
    title: 'Atlassian-Certified Staff Augmentation',
    description:
      'Certified administrators, developers and architects who join your team at the seniority the work needs - matched on the products and the process in front of them, not on a job title.',
    points: [
      'Certified on the products in your estate',
      'Interviewed by your team before they start',
      'Scaled up or down by the sprint',
    ],
  },
  {
    id: 'forward-deployed',
    icon: 'people-group',
    iconChipClass: 'text-brand-600',
    title: 'Embedded Admins & Forward-Deployed Engineers',
    description:
      'The home page’s promise applied to capacity work: engineers who sit in your standups, your board and your channels, and share ownership of the outcome rather than clearing a queue.',
    points: [
      'In your tools and your ceremonies from week one',
      'Named engineers, not a rotating pool',
      'Decisions documented as they are made',
    ],
  },
  {
    id: 'role-training',
    icon: 'graduation-cap',
    iconChipClass: 'text-[#7c3aed]',
    title: 'Role-Based Training & Enablement',
    description:
      'Enablement written for the seat someone actually occupies. A project admin, a service-desk agent and a release manager need three different courses, and a single "Jira training" day serves none of them well.',
    points: [
      'Curriculum mapped to your roles and your config',
      'Run on your own instance, not a demo site',
      'Reference material your team keeps after',
    ],
  },
  {
    id: 'certified-programs',
    icon: 'clipboard-list',
    iconChipClass: 'text-[#7c3aed]',
    title: 'Certified Atlassian Training Programs',
    description:
      'The formal path, for teams that need the credential and not only the skill: official Atlassian courseware delivered by our certified practitioners, with certification as the stated outcome.',
    points: [
      'Official Atlassian course content',
      'Delivered by certified practitioners',
      'Certification tracked to completion',
    ],
  },
  {
    id: 'agile-coaching',
    icon: 'refresh',
    iconChipClass: 'text-accent-500',
    title: 'Agile & SAFe Coaching',
    description:
      'Coaching for the teams and the leaders above them, at whatever scale you actually run - a handful of squads or a full portfolio in Jira Align. The practice and the tooling get changed together, because changing one without the other never holds.',
    points: [
      'Team, program and portfolio level',
      'Ceremonies coached, not just documented',
      'Jira and Jira Align configured to match',
    ],
  },
  {
    id: 'change-adoption',
    icon: 'handshake',
    iconChipClass: 'text-[#16a34a]',
    title: 'Change Management & Adoption Support',
    description:
      'The work that decides whether any of the above survives go-live: who is told what, when, by whom, and how you find out which teams quietly went back to the old way.',
    points: [
      'Stakeholder and comms plan per audience',
      'Champions identified and equipped',
      'Adoption measured, not assumed',
    ],
  },
];

/* ── Workforce vs Managed Services ──────────────────────────────────────── */

export const WF_CONTRAST_CONTENT = {
  headingLead: 'Embedded Either Way. The Difference Is ',
  headingHighlight: 'Who Owns the Platform',
  subheading:
    'Both of these put Clovity engineers inside your Atlassian estate, and both are staffed from the same bench. They are not the same purchase, and picking the wrong one is expensive, so here is the line between them.',
} as const;

export const WF_CONTRAST: EngagementContrast[] = [
  {
    id: 'workforce',
    title: 'Workforce Solutions',
    owns: 'You do',
    description:
      'You keep the platform, the roadmap and the decisions. We add certified people into your team to increase what it can deliver, and enablement so the gap closes for good.',
    points: [
      'Your backlog, your priorities, your change process',
      'Engineers report into your delivery lead',
      'Scale by the sprint as the work moves',
      'Exit is a roll-off, not a handover',
    ],
    chooseWhen:
      'Choose this when the team is right and there is simply not enough of it.',
    icon: 'users',
    iconChipClass: 'text-brand-600',
    current: true,
  },
  {
    id: 'managed-services',
    title: 'Managed Services',
    owns: 'We do',
    description:
      'We take the platform: administration, monitoring, upgrades, licences and a monthly governance review, with the improvement backlog owned on our side.',
    points: [
      'Our backlog, reviewed with you monthly',
      'Named engineers accountable for platform health',
      'Around-the-clock U.S.-led monitoring',
      'Exit is a documented handover',
    ],
    chooseWhen:
      'Choose this when nobody on your side should have to own Jira at all.',
    href: ROUTES.expertise.managedServices,
    icon: 'settings',
    iconChipClass: 'text-[#7c3aed]',
  },
];

/* ── The disciplines on the bench ───────────────────────────────────────── */

export const WF_DISCIPLINES_CONTENT = {
  headingLead: 'The Disciplines You Can ',
  headingHighlight: 'Draw From',
  subheading:
    'Six specialisms, staffed from the same certified bench. Most engagements take two or three of them at different intensities rather than one of each.',
} as const;

export const WF_DISCIPLINES: BenchRole[] = [
  {
    id: 'atlassian',
    role: 'Atlassian architects & admins',
    depth: 'Workflows, schemes, permissions and instance architecture.',
    icon: 'atlassian',
    iconChipClass: 'text-brand-600',
  },
  {
    id: 'ai',
    role: 'AI & automation engineers',
    depth: 'Automation rules, integrations and AI workflows that ship.',
    icon: 'brain',
    iconChipClass: 'text-[#7c3aed]',
  },
  {
    id: 'cloud',
    role: 'Cloud & DevOps engineers',
    depth: 'Migrations, pipelines and the infrastructure underneath.',
    icon: 'cloud',
    iconChipClass: 'text-accent-500',
  },
  {
    id: 'itsm',
    role: 'ITSM & JSM specialists',
    depth: 'Queues, SLAs, request types and service design.',
    icon: 'headset',
    iconChipClass: 'text-[#16a34a]',
  },
  {
    id: 'delivery',
    role: 'Project & program managers',
    depth: 'Delivery leadership across teams and dependencies.',
    icon: 'clipboard-list',
    iconChipClass: 'text-brand-600',
  },
  {
    id: 'qa',
    role: 'QA & testing teams',
    depth: 'Test strategy and automation built in, not bolted on.',
    icon: 'list-check',
    iconChipClass: 'text-[#7c3aed]',
  },
];

/** The comp's engagement-model tag row, rendered under the disciplines grid. */
export const WF_MODELS_LABEL = 'Engagement models';

export const WF_MODELS: CapabilityChip[] = [
  { id: 'augmentation', label: 'Staff augmentation', icon: 'users' },
  { id: 'pods', label: 'Project-based teams', icon: 'people-group' },
  { id: 'managed', label: 'Managed workforce', icon: 'settings' },
  { id: 'c2h', label: 'Contract-to-hire', icon: 'file-signature' },
  { id: 'direct', label: 'Direct placement', icon: 'handshake' },
  { id: 'tech-pods', label: 'Technology pods', icon: 'code' },
];

/* ── How an engagement runs ─────────────────────────────────────────────── */

export const WF_APPROACH_CONTENT = {
  headingLead: 'From Requirement to ',
  headingHighlight: 'Productive',
  subheading:
    'Five steps. The first one is the one most staffing processes skip, and it is why the later ones go wrong.',
} as const;

/**
 * The comp's five `tl-step` entries, reworded.
 *
 * Rendered through the shared `ProcessTimeline`, which numbers the steps from `order`
 * and lays them out horizontally at `md` and up - so this stays data, and the page does
 * not carry a second timeline implementation. No icons: the sequence is the content
 * here, and `ProcessTimeline` prints the ordinal when `icon` is absent.
 */
export const WF_APPROACH_STEPS: ProcessStep[] = [
  {
    id: 'understand',
    order: 1,
    title: 'Understand the actual need',
    description:
      'What the work requires, read off your board and your config - not a generic job title.',
  },
  {
    id: 'map',
    order: 2,
    title: 'Map the role',
    description:
      'Skills, seniority, certifications and availability, agreed in writing before anyone is put forward.',
  },
  {
    id: 'screen',
    order: 3,
    title: 'Screen and shortlist',
    description:
      'Vetted against real Atlassian and delivery work by people who do it, then interviewed by you.',
  },
  {
    id: 'onboard',
    order: 4,
    title: 'Embed and ramp',
    description:
      'Into your tools, ceremonies and change process, with a named owner on both sides from day one.',
  },
  {
    id: 'measure',
    order: 5,
    title: 'Review and adjust',
    description:
      'Delivery reviewed against what you hired for, and the engagement resized - up, down, or into enablement.',
  },
];

/* ── Credentials ────────────────────────────────────────────────────────── */

export const WF_CREDENTIALS_CONTENT = {
  headingLead: 'Certifications That ',
  headingHighlight: 'Clear Procurement',
  subheading:
    'On enterprise and public-sector staffing bids, the supplier-diversity question is scored before anyone reads the résumés. Clovity is certified on all three of the programs those forms ask about.',
  /**
   * The one thing this section must NOT be read as promising. See the note at the top of
   * this file on why no contract vehicle is named anywhere on this page.
   */
  footnote:
    'Certifications held by Clovity, Inc. Contract vehicles and set-aside eligibility vary by solicitation - ask us for current status in writing before citing any of it in a bid.',
  ctaLabel: 'Request our capability statement',
  ctaHref: ROUTES.discover.contact,
} as const;

/**
 * The three supplier-diversity badges, plus the partner tier.
 *
 * Served from `CDN.clovityWww` at the same paths the About page already uses - see
 * `ABOUT_AWARD_BADGES_FALLBACK` in `constants/about.ts`. Deliberately NOT re-hosted as
 * bundled assets: these marks belong to the certifying bodies, the About page already
 * loads them from this host, and a second copy in `assets/` is a second thing to update
 * when a certification is renewed under new artwork.
 *
 * `width`/`height` are the reserved box, not the intrinsic size - next/image needs a
 * ratio for a remote source, and 210x90 is the pair the About and home page badges
 * already use, so a badge on two pages reserves identical space.
 */
const BADGE_BOX = { width: 210, height: 90 } as const;

export const WF_CREDENTIAL_BADGES: CredentialBadge[] = [
  {
    id: 'mbe',
    name: 'MBE Certified',
    image: {
      src: `${CDN.clovityWww}images/about/png/mbe.png`,
      alt: 'MBE Certified - Minority Business Enterprise',
      ...BADGE_BOX,
    },
  },
  {
    id: 'nmsdc',
    name: 'NMSDC Certified',
    image: {
      src: `${CDN.clovityWww}images/about/png/nmsdc.png`,
      alt: 'NMSDC Certified - National Minority Supplier Development Council',
      ...BADGE_BOX,
    },
  },
  {
    id: 'uspaacc',
    name: 'USPAACC Certified',
    image: {
      src: `${CDN.clovityWww}images/about/png/uspaacc.png`,
      alt: 'USPAACC Certified - U.S. Pan Asian American Chamber of Commerce',
      ...BADGE_BOX,
    },
  },
];

/** What each certification is, for the reader who has not met the acronym. */
export const WF_CREDENTIAL_FACTS = [
  {
    id: 'mbe',
    title: 'Minority Business Enterprise',
    description:
      'The certification most enterprise supplier-diversity programs and state agencies score against.',
  },
  {
    id: 'nmsdc',
    title: 'NMSDC',
    description:
      'National Minority Supplier Development Council - the network corporate diversity spend is reported through.',
  },
  {
    id: 'uspaacc',
    title: 'USPAACC',
    description:
      'U.S. Pan Asian American Chamber of Commerce, certifying our supplier-diversity standing and delivery record.',
  },
] as const;

/** The comp's industries tag row, rendered as a secondary strip here. */
export const WF_INDUSTRIES_LABEL = 'Where we staff';

export const WF_INDUSTRIES: CapabilityChip[] = [
  { id: 'government', label: 'Government & public sector', icon: 'landmark' },
  { id: 'education', label: 'Higher education', icon: 'graduation-cap' },
  { id: 'healthcare', label: 'Healthcare', icon: 'heart-pulse' },
  { id: 'financial', label: 'Financial services', icon: 'chart-line' },
  { id: 'manufacturing', label: 'Manufacturing', icon: 'settings' },
  { id: 'technology', label: 'Enterprise technology', icon: 'server' },
];

/* ── Proof ──────────────────────────────────────────────────────────────── */

export const WF_PROOF_CONTENT = {
  headingLead: 'Teams We Have ',
  headingHighlight: 'Staffed and Trained',
  subheading:
    'Engagements where our people worked inside the client’s team, in the clients’ own words.',
  moreLabel: 'See all case studies',
  moreHref: ROUTES.resources.caseStudy,
} as const;

/* ── FAQ ────────────────────────────────────────────────────────────────── */

export const WF_FAQ_CONTENT = {
  headingLead: 'Before You Add Someone to ',
  headingHighlight: 'Your Standup',
} as const;

export const WF_FAQ: FaqItem[] = [
  {
    id: 'difference',
    question:
      'How is this different from your Managed Services offer? They both sound embedded.',
    answer:
      'Who owns the platform. Under Workforce Solutions you own it - our engineers work your backlog, report into your delivery lead, and follow your change process. Under Managed Services we own it, including the improvement backlog and a monthly governance review. Both are staffed from the same certified bench and both are embedded rather than on-call, which is exactly why the distinction is worth stating: pick augmentation when your team is right and there is not enough of it, and managed services when nobody on your side should have to own Jira at all.',
  },
  {
    id: 'certified',
    question: 'Is everyone you place actually Atlassian-certified?',
    answer:
      'Certification is the bar for the Atlassian roles, and we will tell you which certifications a specific person holds before you interview them. Not every discipline on the bench has an Atlassian certification to hold - a QA automation engineer or a program manager is vetted on delivery work instead - so ask for the credential that matters for the seat rather than assuming one badge covers all six specialisms.',
  },
  {
    id: 'speed',
    question: 'How fast can someone start?',
    answer:
      'It depends on the seniority and the certification you need, and we would rather scope that with you than publish a number here. What we will commit to in writing is the shortlist date, agreed when the role is mapped in step two - so you have a date to hold us to that reflects your actual requirement instead of an average. If a published turnaround is what you need for a bid, ask and we will give you one for that specific role.',
  },
  {
    id: 'diversity',
    question:
      'Can we count Clovity spend toward our supplier-diversity targets?',
    answer:
      'Clovity holds MBE, NMSDC and USPAACC certifications, which is what most corporate diversity programs and public-sector solicitations score against. Whether a particular spend counts under your program is your program’s rule, not ours, so ask us for current certificates and we will send them with our capability statement rather than have you infer eligibility from a badge on a web page.',
  },
  {
    id: 'vehicles',
    question: 'Which contract vehicles can we buy this through?',
    answer:
      'Ask us, and we will confirm current status in writing for your solicitation. We deliberately do not list vehicles on this page: availability changes, it varies by agency and scope, and a stale claim on a website is a serious problem in a bid. We do run a U.S.-led public-sector practice and can talk through the routes that are actually open to you.',
  },
  {
    id: 'conversion',
    question: 'Can we hire the person permanently if it works out?',
    answer:
      'Yes - contract-to-hire and direct placement are both engagement models here, and conversion terms are agreed at the start rather than negotiated once you have decided you want to keep someone. If the goal is a permanent team rather than ongoing capacity, say so early and the engagement gets structured for it.',
  },
  {
    id: 'training-only',
    question: 'We only want the training, not the people. Is that a thing?',
    answer:
      'It is, and it is the half of this page we would rather sell you. Role-based enablement, certified Atlassian programs, Agile and SAFe coaching and adoption support are all available on their own, run on your instance and your configuration. Several engagements have gone the other way too - augmentation first while the work was urgent, then enablement to close the gap so the capacity was no longer needed.',
  },
];

/* ── Final CTA ──────────────────────────────────────────────────────────── */

export const WF_FINAL_CTA = {
  headingLead: 'Ready to talk to',
  headingTail: 'an expert?',
  description:
    'Tell us what you’re working on and a Clovity specialist will get back to you with next steps.',
} as const;


export const WF_FINAL_CTA_LINKS: CtaLink[] = [
  {
    id: 'talk-to-an-expert',
    label: 'Talk to an expert',
    href: ROUTES.discover.contact,
    variant: 'white-pill',
    icon: 'arrow-up-right',
  },
];
