import type {
  BentoTile,
  CtaLink,
  CultureHighlight,
  FaqItem,
  HiringStep,
  JobOpening,
  PillarCard,
  StatBandItem,
} from '@/types/content';
import { EXTERNAL_LINKS, ROUTES } from '@/constants/routes';
import { siteConfig } from '@/constants/site';

/**
 * Careers page content.
 *
 * Copied verbatim from the published `careers.html`. Two sections here are FALLBACKS
 * for Strapi-backed content rather than the page's only source of truth:
 *
 *  • `CAREERS_JOBS_FALLBACK`    — the nine sample requisitions the page ships with.
 *                                 Live openings come from the `job` collection.
 *  • `CAREERS_CULTURE_FALLBACK` — the "Life at Clovity" heading, photo and intro.
 *                                 Live copy comes from `life-at-clovity`.
 *
 * Both exist so the page renders identically when Strapi is unreachable or empty.
 * The published markup even labels the roles as samples — "wire up to a live ATS feed
 * and swap in real req IDs when available" — which is exactly what the CMS wiring
 * does; the samples are kept as the offline state, not deleted.
 */

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const CAREERS_HERO = {
  image: {
    src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1800&q=70',
    alt: '',
  },
  objectPosition: 'center 32%',
  /**
   * Careers holds its mid-stops a touch more opaque than About and Contact
   * (.76/.36 against .73/.32), which is what keeps the headline readable over the
   * brighter conference-room photograph behind it.
   */
  overlay:
    'linear-gradient(92deg,rgba(8,9,14,.97) 0%,rgba(10,11,18,.76) 32%,rgba(12,13,22,.36) 54%,rgba(12,13,22,.22) 74%,rgba(12,13,22,0) 100%)',
  crumbs: [
    { name: 'Home', href: ROUTES.home },
    { name: 'Careers', href: ROUTES.discover.careers },
  ],
  titleLead: 'Build the Career That ',
  titleAccent: 'Grows With Every Engagement.',
  lead: 'Join a Platinum Atlassian Solution Partner where certified consultants, engineers, and architects deliver secure Atlassian, AI, and cloud transformation for enterprise and public-sector teams — and build deep expertise doing it.',
  /** Anchor targets for the two hero buttons. */
  openRolesAnchor: '#open-roles',
  cultureAnchor: '#culture',
} as const;

/* ── Why build your career here ─────────────────────────────────────────── */

export const CAREERS_WHY_CONTENT = {
  label: 'Why Clovity',
  headingLead: 'Three Reasons Our Teams ',
  headingHighlight: 'Stay and Grow',
} as const;

export const CAREERS_WHY_CARDS: PillarCard[] = [
  {
    id: 'depth',
    icon: 'atlassian',
    iconChipClass: 'bg-brand-50 text-brand-600',
    title: 'Depth, Not Just a Badge',
    description:
      'Work inside real Platinum-tier engagements — Jira, Confluence, JSM, and Government Cloud migrations — and leave with certifications that hold their value in the market.',
  },
  {
    id: 'build-with-ai',
    icon: 'robot',
    iconChipClass: 'bg-[#f5f3ff] text-[#7c3aed]',
    title: 'Build With AI, Daily',
    description:
      'Ship and use Pulse AI, our own Atlassian Marketplace copilot, so the AI you build shows up in the tools you and every client use.',
  },
  {
    id: 'work-that-matters',
    icon: 'landmark',
    iconChipClass: 'bg-[#fff7ed] text-accent-500',
    title: 'Work That Matters',
    description:
      'Deliver for federal and state agencies — including the IRS, U.S. Coast Guard, NASA, and California EDD — where secure, audit-ready delivery is the whole job, not a side note.',
  },
];

/* ── Stat band ──────────────────────────────────────────────────────────── */

export const CAREERS_STATS: StatBandItem[] = [
  {
    id: 'platinum',
    value: 'Platinum',
    accent: true,
    label: 'Highest Atlassian Solution Partner Tier',
  },
  {
    id: 'gptw',
    value: 'GPTW',
    label: 'Great Place to Work® Certified Culture',
  },
  {
    id: 'inc-5000',
    value: '4×',
    label: 'Inc. 5000 Honoree, Consecutive Years',
  },
  {
    id: 'headquarters',
    value: 'SF',
    label: 'Headquartered in San Francisco',
  },
];

/* ── Life at Clovity ────────────────────────────────────────────────────── */

/**
 * The culture block's copy.
 *
 * STATIC, and deliberately so — see the long note in
 * `app/(marketing)/careers/CultureSection.tsx`. The Strapi `life-at-clovity`
 * collection is a photo gallery: each row is one image with a caption, and its
 * `header_*` fields name the gallery a row belongs to, not the row. Mapping them
 * onto this section's headline and paragraph would print a gallery title and a photo
 * caption where the design has a culture pitch. Only the PHOTOGRAPH comes from the
 * CMS.
 */
export const CAREERS_CULTURE_CONTENT = {
  label: 'Life at Clovity',
  headingLead: 'A Culture Built on ',
  headingHighlight: 'Ownership and Craft',
  intro:
    "We're a security-cleared, U.S.-led team backed by compliant delivery talent working around the clock — every engagement is owned end to end, not handed off in pieces.",
  bullets: [
    'Certification and enablement support for Atlassian, cloud, and security credentials.',
    'Flexible, remote-friendly work built around delivery outcomes, not desk time.',
    'Direct exposure to enterprise and public-sector engagements from day one.',
    'A Great Place to Work®-certified, MBE and NMSDC-certified employer.',
  ],
} as const;

/**
 * Fallback for the culture block's PHOTOGRAPH — the published page's stock image.
 *
 * Used when Strapi is unreachable or `life-at-clovity` is empty. The heading and
 * intro on this record are never read (the component uses
 * `CAREERS_CULTURE_CONTENT`); they are here only because `CultureHighlight` requires
 * them, and they hold the same copy so the two can never disagree.
 *
 * `h=800` on the URL for the same reason as the About page's split-media images:
 * next/image needs an intrinsic pair for a remote source, and pinning the request
 * makes the declared ratio exact instead of a guess.
 */
export const CAREERS_CULTURE_FALLBACK: CultureHighlight = {
  id: 'culture-fallback',
  headingLead: CAREERS_CULTURE_CONTENT.headingLead,
  headingHighlight: CAREERS_CULTURE_CONTENT.headingHighlight,
  info: CAREERS_CULTURE_CONTENT.intro,
  image: {
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&h=800&q=70',
    alt: 'Clovity team collaborating on a delivery engagement',
    width: 1200,
    height: 800,
  },
};

/* ── Benefits & perks ───────────────────────────────────────────────────── */

export const CAREERS_BENEFITS_CONTENT = {
  label: 'Benefits & Perks',
  headingLead: 'What You Get For ',
  headingHighlight: 'Doing Great Work',
} as const;

export const CAREERS_BENEFITS: BentoTile[] = [
  {
    id: 'certification',
    icon: 'graduation-cap',
    iconChipClass: 'bg-brand-50 text-brand-600',
    title: 'Certification & Learning Support',
    description:
      'Structured support toward Atlassian, cloud, and security certifications — the credentials our delivery teams use every day.',
  },
  {
    id: 'flexible',
    icon: 'remote-work',
    iconChipClass: 'bg-[#f5f3ff] text-[#7c3aed]',
    title: 'Flexible & Remote-Friendly',
    description:
      'Distributed, U.S.-led teams with flexible schedules built around delivery milestones, not fixed hours.',
  },
  {
    id: 'health',
    icon: 'heart-pulse',
    iconChipClass: 'bg-[#fff7ed] text-accent-500',
    title: 'Health & Wellness Coverage',
    description:
      'Health coverage and wellness support designed to keep our teams performing on multi-year public-sector engagements.',
  },
  {
    id: 'recognition',
    icon: 'people-group',
    iconChipClass: 'bg-[#f0fdf4] text-brand-green',
    title: 'Recognition-Driven Culture',
    description:
      'Great Place to Work® certified because how we treat our own team shows up directly in how we treat clients.',
  },
];

/* ── Hiring process ─────────────────────────────────────────────────────── */

export const CAREERS_PROCESS_CONTENT = {
  label: "How You'll Get Hired",
  headingLead: 'A Straightforward, Five-Step ',
  headingHighlight: 'Hiring Process',
} as const;

export const CAREERS_HIRING_STEPS: HiringStep[] = [
  {
    id: 'apply',
    ordinal: '01',
    icon: 'send',
    iconChipClass: 'bg-brand-50 text-brand-600',
    title: 'Apply',
    description:
      'Send your resume for an open role, or reach out directly if nothing posted fits yet.',
  },
  {
    id: 'recruiter-screen',
    ordinal: '02',
    icon: 'phone-call',
    iconChipClass: 'bg-[#f5f3ff] text-[#7c3aed]',
    title: 'Recruiter Screen',
    description:
      "A short call to align on experience, expectations, and the role's scope.",
  },
  {
    id: 'technical-interview',
    ordinal: '03',
    icon: 'comments',
    iconChipClass: 'bg-[#fff7ed] text-accent-500',
    title: 'Technical Interview',
    description:
      "A working conversation with the delivery team you'd actually join.",
  },
  {
    id: 'offer',
    ordinal: '04',
    icon: 'file-signature',
    iconChipClass: 'bg-[#f0fdf4] text-brand-green',
    title: 'Offer',
    description: 'References and final alignment, followed by a formal offer.',
  },
  {
    id: 'onboard',
    ordinal: '05',
    icon: 'door-open',
    iconChipClass: 'bg-[#fdf2f8] text-[#db2777]',
    title: 'Onboard',
    description:
      'Structured onboarding into your team, tooling, and first engagement.',
  },
];

/* ── Open positions ─────────────────────────────────────────────────────── */

export const CAREERS_ROLES_CONTENT = {
  label: 'Open Positions',
  headingLead: 'Current Openings Across Our ',
  headingHighlight: 'Delivery Teams',
  subheading:
    "Filter by team to find where you'd fit — every role reports into a real client engagement.",
  /** Shown when a filter selects a team with no current openings. */
  emptyMessage:
    "No open roles in this team right now — send us a general application below and we'll reach out when one opens.",
  generalTitle: "Don't see the right role?",
  generalDescription:
    "We're always meeting strong Atlassian, AI, and delivery talent. Send your resume for general consideration.",
  generalCtaLabel: 'Send General Application',
} as const;

/* ── The role card's three expandable panels ────────────────────────────── */

/**
 * Labels for the panels inside a role card, in the order the legacy card shows them.
 *
 * `job-description` is the only one backed by the CMS (`job.job_description`); the
 * other two are the same boilerplate on every posting, which is exactly why they are
 * copy and not a per-row CMS field.
 */
export const CAREERS_JOB_PANELS = [
  { id: 'about', label: 'About Us:' },
  { id: 'job-description', label: 'Job Description:' },
  { id: 'benefits', label: 'Our Benefits:' },
] as const;

export type CareersJobPanelId = (typeof CAREERS_JOB_PANELS)[number]['id'];

/**
 * "About Us" and "Our Benefits" panel copy, ported verbatim from the legacy
 * `/talent` card.
 *
 * ⚠ NEEDS A CONTENT REVIEW BEFORE LAUNCH. Reproduced word for word rather than
 * quietly rewritten, because it is published copy and editing a company's own
 * marketing claims is not a migration decision. But two of them are stale and now
 * contradict the rest of this site:
 *
 *   • "CIO's Top Global IoT Solutions provider with a Microsoft Platinum status" —
 *     a Microsoft tier and an IoT positioning, on a site whose every other page
 *     leads with Atlassian Platinum. The linked CIO Review listing is from 2019.
 *   • "read more about us in the Yahoo Finance" — that article is the 2019 IoT
 *     innovation award.
 *
 * Split into segments so the inline links stay real anchors instead of being
 * reconstructed from a string at render time.
 */
export const CAREERS_JOB_ABOUT_PARAGRAPHS = [
  [
    { text: 'Join ' },
    { text: 'Clovity', href: ROUTES.discover.about },
    {
      text: " and help transform leading enterprises and communities around the world. The end to end scale of our capabilities and client engagements and the way we cooperate, communicate and deliver value provides an unparalleled opportunity to grow and advance in your career. Choose Clovity and make delivering innovative work part of your outstanding career.",
    },
  ],
  [
    { text: 'At Clovity, You will now become a part of ' },
    {
      text: "CIO's Top Global IoT Solutions provider",
      href: EXTERNAL_LINKS.cioReviewProfile,
      external: true,
    },
    {
      text: ' with a Microsoft Platinum status building NextGen solutions. You will have access to cutting-edge resources, Subject Matter Experts and an opportunity to transform your career!',
    },
  ],
  [
    {
      text: "Our Clients include some of America's biggest names in Retail, Fintech, Banking, Healthcare, Telecom and fast-paced Product companies who challenge the every day status-quo. You may also read more about us in the ",
    },
    {
      text: 'Yahoo Finance',
      href: EXTERNAL_LINKS.yahooFinanceFeature,
      external: true,
    },
    { text: ' and find ' },
    {
      text: 'here',
      href: EXTERNAL_LINKS.legacyCaseStudy,
      external: true,
    },
    { text: ' our customer case studies.' },
  ],
] as const;

export const CAREERS_JOB_BENEFITS_PARAGRAPH = [
  {
    text: 'Our team culture is very open, highly collaborative and fun! We support our employees at work (and play) and provide fantastic perks: opportunity for rapid growth, paid courses and training, career counseling and mentorship, exposure to state of the art technology solutions, Time off to relax and recharge, flexible working hours, Work from Home, Paid days off to spend time with your loved ones, Office parties with plenty of food and beverages, ergonomic workstations and much more. Check out some glimpse of ',
  },
  {
    text: 'Life At Clovity',
    href: EXTERNAL_LINKS.legacyLifeAtClovity,
    external: true,
  },
] as const;

/** Labels for the role card's overflow menu. */
export const CAREERS_JOB_MENU = {
  copyLabel: 'Copy link to post',
  copiedLabel: 'Copied',
  detailsLabel: 'View Details',
} as const;

/** The published "general application" mailto, encoded exactly as the page has it. */
export const CAREERS_GENERAL_APPLICATION_HREF = `mailto:${siteConfig.contact.globalEmail}?subject=${encodeURIComponent(
  'General Application – Clovity Careers',
)}&body=${encodeURIComponent(
  "Hi Clovity Team,\n\nI'm interested in future opportunities at Clovity. Please find my resume attached.\n\nThanks,\n",
)}`;

/**
 * Build the same prefilled mailto the CMS mapper builds, for the fallback roles.
 *
 * Duplicating the format here rather than importing `mappers.ts` keeps a constants
 * file free of a dependency on the service layer — and the fallback roles are static
 * data, so the link can be composed once at module scope.
 */
function fallbackApplyHref(title: string, trackLabel: string): string {
  const subject = encodeURIComponent(`Application: ${title} – ${trackLabel}`);
  const body = encodeURIComponent(
    `Hi Clovity Team,\n\nI'd like to apply for the ${title} role. Please find my resume attached.\n\nThanks,\n`,
  );
  return `mailto:${siteConfig.contact.globalEmail}?subject=${subject}&body=${body}`;
}

/** Tints for the fallback roles' track pills, matching the published markup. */
const TAG_BLUE = 'bg-brand-50 text-brand-600';
const TAG_VIOLET = 'bg-[#f5f3ff] text-[#7c3aed]';
const TAG_ORANGE = 'bg-[#fff7ed] text-[#c2410c]';
const TAG_GREEN = 'bg-[#f0fdf4] text-brand-green';
const TAG_GREY = 'bg-[#f1f5f9] text-[#334155]';

interface FallbackRoleSeed {
  id: string;
  title: string;
  track: string;
  tagClass: string;
  location: string;
  /** The published page's second meta chip. `'contract'` for the one contract role. */
  employment: 'full-time' | 'contract';
  description: string;
}

/** The two employment chips the published role cards use, icon included. */
const EMPLOYMENT: Record<
  FallbackRoleSeed['employment'],
  NonNullable<JobOpening['employmentType']>
> = {
  'full-time': { label: 'Full-time', icon: 'briefcase' },
  contract: { label: 'Contract', icon: 'file-signature' },
};

/**
 * The nine sample requisitions the page publishes today.
 *
 * Tracks here are the DESIGN's team names (Atlassian & Cloud, AI & Innovation, …),
 * not the Strapi `track` enumeration (Consulting, Engineering, …). That is
 * deliberate: this is the offline state, and it should look exactly like the
 * published page, filter tabs included. Once Strapi is serving openings, the tabs are
 * derived from whatever tracks those rows actually use.
 */
const FALLBACK_ROLE_SEEDS: FallbackRoleSeed[] = [
  {
    id: 'senior-atlassian-consultant',
    title: 'Senior Atlassian Consultant',
    track: 'Atlassian & Cloud',
    tagClass: TAG_BLUE,
    location: 'Remote (U.S.)',
    employment: 'full-time',
    description:
      'Lead Jira, Confluence, and JSM implementations for enterprise and public-sector clients, from discovery through go-live.',
  },
  {
    id: 'cloud-migration-engineer',
    title: 'Cloud Migration Engineer – Atlassian Government Cloud',
    track: 'Atlassian & Cloud',
    tagClass: TAG_BLUE,
    location: 'Remote (U.S.)',
    employment: 'full-time',
    description:
      'Plan and execute Data Center to Cloud migrations for regulated clients, with a focus on audit-ready, zero-downtime cutovers.',
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI/ML Engineer – Pulse AI',
    track: 'AI & Innovation',
    tagClass: TAG_VIOLET,
    location: 'San Francisco, CA (Hybrid)',
    employment: 'full-time',
    description:
      'Build and ship features for Pulse AI, our Atlassian Marketplace copilot, working closely with product and delivery teams.',
  },
  {
    id: 'product-manager-marketplace',
    title: 'Product Manager, Marketplace Apps',
    track: 'AI & Innovation',
    tagClass: TAG_VIOLET,
    location: 'Remote (U.S.)',
    employment: 'full-time',
    description:
      'Own the roadmap for our Atlassian Marketplace app portfolio, from customer discovery to release.',
  },
  {
    id: 'devsecops-engineer',
    title: 'DevSecOps Engineer',
    track: 'DevSecOps',
    tagClass: TAG_ORANGE,
    location: 'Remote (U.S.)',
    employment: 'full-time',
    description:
      'Design and secure CI/CD pipelines across the software delivery lifecycle for enterprise and government clients.',
  },
  {
    id: 'itsm-consultant',
    title: 'ITSM Consultant (Jira Service Management)',
    track: 'ITSM & Service Mgmt',
    tagClass: TAG_GREEN,
    location: 'Remote (U.S.)',
    employment: 'full-time',
    description:
      'Configure and optimize ITIL-aligned service desks on JSM for enterprise clients moving off legacy ITSM tooling.',
  },
  {
    id: 'service-desk-analyst',
    title: 'Service Desk Analyst',
    track: 'ITSM & Service Mgmt',
    tagClass: TAG_GREEN,
    location: 'Remote (U.S.)',
    employment: 'contract',
    description:
      'Provide tiered support and triage across managed-services engagements, with a path into full-time delivery roles.',
  },
  {
    id: 'technical-recruiter',
    title: 'Technical Recruiter, Workforce Solutions',
    track: 'Workforce & Corporate',
    tagClass: TAG_GREY,
    location: 'San Francisco, CA',
    employment: 'full-time',
    description:
      'Source and place Atlassian-certified consultants across our staff-augmentation and workforce engagements.',
  },
  {
    id: 'bd-manager-public-sector',
    title: 'Business Development Manager, Public Sector',
    track: 'Workforce & Corporate',
    tagClass: TAG_GREY,
    location: 'Washington, D.C. (Hybrid)',
    employment: 'full-time',
    description:
      'Grow our federal and state agency pipeline, working alongside delivery leadership on proposals and contract vehicles.',
  },
];

export const CAREERS_JOBS_FALLBACK: JobOpening[] = FALLBACK_ROLE_SEEDS.map(
  (seed) => ({
    id: seed.id,
    slug: seed.id,
    title: seed.title,
    track: seed.track,
    trackLabel: seed.track,
    trackTagClass: seed.tagClass,
    location: seed.location,
    employmentType: EMPLOYMENT[seed.employment],
    description: seed.description,
    applyHref: fallbackApplyHref(seed.title, seed.track),
  }),
);

/* ── FAQ ────────────────────────────────────────────────────────────────── */

export const CAREERS_FAQ_CONTENT = {
  label: 'Questions',
  headingLead: 'Frequently Asked ',
  headingHighlight: 'Questions',
} as const;

export const CAREERS_FAQ: FaqItem[] = [
  {
    id: 'remote',
    question: 'Are Clovity roles remote, or is relocation required?',
    answer:
      'Most delivery roles are remote-friendly within the U.S., with a handful of hybrid roles tied to client or office locations. The location listed on each role reflects that requirement.',
  },
  {
    id: 'process',
    question: 'What does the interview process look like?',
    answer:
      "A recruiter screen, followed by a technical or panel interview with the delivery team you'd join, then a final offer conversation. Most roles move through this in two to three weeks.",
  },
  {
    id: 'visas',
    question: 'Do you sponsor U.S. work visas?',
    answer:
      "Sponsorship depends on the specific role and client engagement. Your recruiter will confirm what's available for the position during your initial screen.",
  },
  {
    id: 'certification',
    question: "Can I apply if I don't hold an Atlassian certification yet?",
    answer:
      "Yes. We hire for aptitude and hands-on experience, then support certification through structured, on-the-job enablement once you're on a delivery team.",
  },
  {
    id: 'unlisted',
    question: "How do I apply for a role that isn't listed?",
    answer:
      'Use the "Send General Application" option above with the position you\'re interested in in the subject line, and our team will reach out if a matching engagement opens up.',
  },
];

/* ── Final CTA ──────────────────────────────────────────────────────────── */

export const CAREERS_FINAL_CTA = {
  headingLead: 'Ready to build',
  headingTail: "what's next?",
  description:
    "Explore our open roles, or send us your resume for general consideration — we'll follow up when the right engagement opens.",
} as const;

export const CAREERS_FINAL_CTA_LINKS: CtaLink[] = [
  {
    id: 'view-open-positions',
    label: 'View Open Positions',
    href: '#open-roles',
    variant: 'white-pill',
    icon: 'arrow-up-right',
  },
];
