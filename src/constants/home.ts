import { EXTERNAL_LINKS, ROUTES } from '@/constants/routes';
import type {
  CapabilityChip,
  CredentialRow,
  CtaLink,
  CustomerStory,
  FactItem,
  FeatureCard,
  MarketplaceApp,
  MigrationBenefit,
  MigrationSource,
  ProcessStep,
  StatItem,
} from '@/types/content';
import { IRS_LOGO_URL } from './clients';
import {
  aiPoweredSummary,
  appContentFormatting,
  appDashboardTemplates,
  appPulseAi,
  appTimeTracking,
  badgeCloudSpecialization,
  badgeItsmSpecialization,
  badgeMarketplacePartner,
  badgePlatinumPartner,
  CDN,
  customerCoastGuard,
  customerEdd,
  deliverAutomation,
  deliverExperts,
  deliverSecure,
  deliverTailored,
  deliverVisibility,
  statAccreditations,
  statCertifiedExperts,
  statEngagements,
  statOffices,
  statYears,
} from './media';

/**
 * Home page content, lifted out of index.html verbatim.
 *
 * This is the static fallback half of the backend-ready seam: each section reads
 * its data from here today, and from `contentApi` / `marketingApi` once the
 * Express + PostgreSQL CMS is live. Same types, same components, no markup
 * change - which is the whole reason the copy is data and not JSX.
 *
 * Every string below is the legacy site's own wording, punctuation included. No
 * claim, metric or certification was added, rounded or reworded.
 */

/* ── Section 1: Hero ────────────────────────────────────────────────────── */

export const HERO_CONTENT = {
  eyebrow: 'Atlassian  ·  AI  ·  Cloud',
  heading: 'We Don’t Talk Transformation. We Ship It.',
  subheading:
    'Modernize teamwork, service delivery, software development, and enterprise operations with Atlassian, AI, automation, and cloud expertise.',
  scrollCueHref: '#pulse-ai-spotlight',
  scrollCueLabel: 'Scroll down',
} as const;

/* ── Section 1.5: Pulse AI spotlight ────────────────────────────────────── */

export const PULSE_AI_CONTENT = {
  headingLead: 'The AI that ',
  headingHighlight: 'finds problems',
  headingTail: '. Agents that fix them.',
  productName: 'Pulse AI',
  description:
    ' is an AI copilot for Jira with chat, dashboards, org health, anomaly detection, and smart alerts. One real-time Pulse Score - findings that are filterable, actionable, and export-ready.',
} as const;

export const PULSE_AI_CAPABILITIES: CapabilityChip[] = [
  { id: 'chat', label: 'Chat', icon: 'comments' },
  {
    id: 'sprint-analytics',
    label: 'Sprint Analytics',
    icon: 'trending-up',
  },
  {
    id: 'backlog-analysis',
    label: 'Backlog Analysis',
    icon: 'list-check',
  },
  {
    id: 'team-performance',
    label: 'Team Performance',
    icon: 'users-cog',
  },
  {
    id: 'project-health',
    label: 'Project Health',
    icon: 'chart-line',
  },
  {
    id: 'anomaly-detection',
    label: 'Anomaly Detection',
    icon: 'alert-triangle',
  },
  {
    id: 'email-reports',
    label: 'Email Reports',
    icon: 'mail',
  },
];

export const PULSE_AI_CTAS: CtaLink[] = [
  {
    id: 'marketplace',
    label: 'Try it free on the Marketplace',
    href: EXTERNAL_LINKS.pulseAiListing,
    external: true,
    variant: 'primary',
  },
  {
    id: 'in-action',
    label: 'See Pulse AI in Action',
    href: EXTERNAL_LINKS.pulseAiCollateral,
    external: true,
    variant: 'secondary',
  },
];

/* ── Section 2: Trusted By ──────────────────────────────────────────────── */

export const TRUSTED_BY_CONTENT = {
  headingLead: 'Trusted by Teams Building the ',
  headingHighlight: 'Future of Work',
  subheading:
    'Clovity partners with enterprise, public sector, and fast-growing teams to simplify complex workflows and deliver measurable outcomes.',
} as const;

export const CUSTOMER_STORIES: CustomerStory[] = [
  {
    id: 'california-edd',
    logo: { src: customerEdd, alt: 'California EDD' },
    tag: 'State · Case Study',
    title: 'The Atlassian backbone serving millions of Californians.',
    description:
      "One of the nation's largest state agencies - built for compliance and continuity.",
    href: ROUTES.resources.caseStudy,
    ctaLabel: 'Learn More',
  },
  {
    id: 'irs',
    logo: { src: IRS_LOGO_URL, alt: 'IRS', width: 160, height: 70 },
    tag: 'Federal · Case Study',
    title: 'Audit-ready Atlassian for federal tax administration.',
    description:
      'Compliance-first workflows, least-privilege access, complete audit trails.',
    href: ROUTES.resources.caseStudy,
    ctaLabel: 'Learn More',
  },
  {
    id: 'us-coast-guard',
    logo: { src: customerCoastGuard, alt: 'U.S. Coast Guard' },
    tag: 'Federal · Case Study',
    title: 'Mission workflows at homeland-security depth.',
    description:
      'Structured workflows and permissioning that hold up to federal security standards.',
    href: ROUTES.resources.caseStudy,
    ctaLabel: 'Learn More',
  },
];

/* ── Section 2.5: Public Sector + AGC ───────────────────────────────────── */

export const PUBLIC_SECTOR_CONTENT = {
  // The legacy heading is: We Don't Visit the <span class="grad">Public
  // Sector</span>.<br> We Work Here. - split into parts so the gradient span and
  // the hard line break stay exactly where they were.
  headingLead: "We Don't Visit the ",
  headingHighlight: 'Public Sector',
  headingAfterHighlight: '.',
  headingSecondLine: 'We Work Here.',
  subheading:
    'Long-term partnerships. Real-world experience. Mission-driven outcomes.',
  ctaLabel: 'View Public Sector Services',
  ctaHref: '#',
} as const;

export const PUBLIC_SECTOR_FACTS: FactItem[] = [
  {
    id: 'every-level',
    title: 'Government at every level',
    description:
      'Federal, state, county, and city agencies - from tax to homeland security.',
  },
  {
    id: 'procurement-ready',
    title: 'Procurement-ready',
    description:
      'SAM Verified, E-Verify registered. Available via Carahsoft, SEWP V, and GSA MAS.',
  },
  {
    id: 'certified-delivery',
    title: 'Certified delivery',
    description:
      'MBE and NMSDC certified, USPAACC-recognized supplier diversity.',
  },
  {
    id: 'ai-accelerated',
    title: 'AI-accelerated migration',
    description:
      'Assessment and migration accelerated by the same AI tooling behind Pulse.',
  },
];

export const AGC_CONTENT = {
  heading: 'Atlassian Government Cloud. We Get You There.',
  ctaLabel: 'Start an AGC Readiness Assessment',
  ctaHref: '#',
} as const;

export const AGC_STEPS: ProcessStep[] = [
  {
    id: 'readiness',
    order: 1,
    title: 'AGC Readiness Assessment',
    description:
      'Instance audit, app compatibility, compliance mapping, total-cost view.',
  },
  {
    id: 'architecture',
    order: 2,
    title: 'Architecture & Security Design',
    description:
      'Permission schemes, data flows, FedRAMP-aligned configuration baselines.',
  },
  {
    id: 'execution',
    order: 3,
    title: 'Migration Execution',
    description:
      'Data Center → AGC in controlled waves, with validation gates.',
  },
  {
    id: 'run',
    order: 4,
    title: 'Run with Pulse AI',
    description:
      'Post-migration health scoring, anomaly detection, managed support.',
  },
];

/* ── Section 3: AI Delivery carousel ────────────────────────────────────── */

export const AI_DELIVERY_CONTENT = {
  headingLead: 'AI Is Not a Feature We Add.',
  headingHighlight: 'How We Deliver',
  subheading:
    'From predictive insights to expert care, every engagement runs on the same operating model.',
} as const;

export const AI_DELIVERY_CAPABILITIES: FeatureCard[] = [
  {
    id: 'ai-insights',
    title: 'AI-Powered Insights',
    description: 'Predictive insights and recommendations, right inside Jira.',
    icon: 'brain',
    // Previously baked into a dedicated CSS class rather than passed as data,
    // which meant this one card could not be reordered or CMS-managed. It is
    // now an ordinary background like the other five.
    backgroundImage: aiPoweredSummary,
  },
  {
    id: 'tailored',
    title: 'Tailored for You',
    description: 'Configurable apps built for every team, workflow, and goal.',
    icon: 'sliders',
    backgroundImage: deliverTailored,
  },
  {
    id: 'secure',
    title: 'Secure by Design',
    description: 'Enterprise-grade security, privacy, and compliance built in.',
    icon: 'shield-half',
    backgroundImage: deliverSecure,
  },
  {
    id: 'visibility',
    title: 'Real-Time Visibility',
    description: 'See what matters, when it matters.',
    icon: 'chart-line',
    backgroundImage: deliverVisibility,
  },
  {
    id: 'automation',
    title: 'Workflow Automation',
    description:
      'Automate repetitive tasks and focus on what moves the needle.',
    icon: 'cogs',
    backgroundImage: deliverAutomation,
  },
  {
    id: 'human-support',
    title: 'Expert & Human Support',
    description: 'Real people. Real help. Whenever you need it.',
    icon: 'headset',
    backgroundImage: deliverExperts,
  },
];

/* ── Section 4.5: Forward-Deployed Engineers ────────────────────────────── */

export const FDE_CONTENT = {
  headingLead: 'Forward-Deployed Engineers.',
  headingHighlight: 'Embedded, Not On-Call.',
  subheading:
    "We embed with your team, align with your mission, and build what matters. Not just ship code - we solve problems, share ownership, and stay until it's done.",
  ctaLabel: 'Talk to Our Delivery Team',
  ctaHref: ROUTES.discover.contact,
  photo: {
    src: 'https://images.unsplash.com/photo-1758873268745-dd2cf0d677b5?auto=format&fit=crop&w=1200&q=80',
    alt: 'Clovity engineers embedded with a client team, collaborating around a laptop',
    width: 1200,
    height: 400,
  },
} as const;

export const FDE_PROOF_CARDS = [
  {
    id: 'team',
    modifier: 'fde-float--team',
    icon: 'people-group',
    iconStyle: { background: '#f3e8ff', color: '#8b5cf6' },
    title: 'Embedded with Your Team',
    description: 'We become part of your team, not just a vendor.',
  },
  {
    id: 'collab',
    modifier: 'fde-float--collab',
    icon: 'check',
    iconStyle: { background: '#dcfce7', color: '#16a34a' },
    title: 'Real Collaboration',
    description: 'Work together daily in Jira, Slack, and beyond.',
    brands: [
      {
        id: 'jira',
        icon: 'jira',
        style: { background: '#e6effe', color: '#0052cc' },
      },
      {
        id: 'slack',
        icon: 'slack',
        style: { background: '#f3e8fb', color: '#4a154b' },
      },
      {
        id: 'confluence',
        icon: 'confluence',
        style: { background: '#e6f7fb', color: '#026aa7' },
      },
    ],
  },
  {
    id: 'results',
    modifier: 'fde-float--results',
    icon: 'trending-up',
    iconStyle: { background: '#f3e8ff', color: '#8b5cf6' },
    title: 'Results That Last',
    description:
      'We deliver, document, transfer knowledge, and stay to make it better.',
    sparkline: true,
  },
] as const;

/* ── Section 5: Cloud migration ─────────────────────────────────────────── */

export const MIGRATION_CONTENT = {
  headingLead: 'Data Center Is Ending. ',
  headingHighlight: 'Your Momentum Isn’t.',
  subheading:
    "Data Center's clock is running. We move your Atlassian stack to Cloud - or Atlassian Government Cloud - in staged, validated waves, and stay behind with Pulse AI watching the result.",
  sourceCardTitle: 'Your instance today',
  sourceCardSubtitle: 'Migrating from',
  destinationTitle: 'Atlassian Cloud / AGC',
  destinationSubtitle: 'Secure, scalable, AI-ready',
  ctaLabel: 'Start a Migration Assessment',
  ctaHref: EXTERNAL_LINKS.aiAppsStudio,
} as const;

export const MIGRATION_SOURCES: MigrationSource[] = [
  {
    id: 'data-center',
    label: 'Data Center / Server',
    icon: 'database',
    iconStyle: { color: '#2563eb' },
  },
  {
    id: 'cherwell',
    label: 'Cherwell',
    icon: 'cherwell',
    iconStyle: { color: '#f2642a' },
  },
  {
    id: 'bmc-remedy',
    label: 'BMC Remedy',
    icon: 'flame',
    iconStyle: { color: '#dc2626' },
  },
  {
    id: 'servicenow',
    label: 'ServiceNow',
    icon: 'zap',
    iconStyle: { color: '#16a34a' },
  },
  {
    id: 'youtrack',
    label: 'YouTrack',
    icon: 'git-branch',
    iconStyle: { color: '#64748b' },
  },
];

export const MIGRATION_STEPS: ProcessStep[] = [
  {
    id: 'assess',
    order: 1,
    title: 'Assess',
    description: 'We assess your current environment',
    icon: 'clipboard-list',
  },
  {
    id: 'plan',
    order: 2,
    title: 'Plan',
    description: 'Create a secure migration roadmap',
    icon: 'shield-half',
  },
  {
    id: 'migrate',
    order: 3,
    title: 'Migrate',
    description: 'Execute in phased, zero-downtime waves',
    icon: 'cloud-upload',
  },
  {
    id: 'validate',
    order: 4,
    title: 'Validate',
    description: 'Validate, test and ensure quality',
    icon: 'circle-check',
  },
];

export const MIGRATION_BENEFITS: MigrationBenefit[] = [
  {
    id: 'ha',
    label: 'High Availability',
    icon: 'shield',
    toneClass: 'ic-blue',
  },
  {
    id: 'security',
    label: 'Enterprise Security',
    icon: 'lock',
    toneClass: 'ic-vio',
  },
  {
    id: 'future',
    label: 'Built for the Future',
    icon: 'trending-up',
    toneClass: 'ic-org',
  },
];

/* ── Section 6: Marketplace apps ────────────────────────────────────────── */

export const MARKETPLACE_CONTENT = {
  headingHighlight: 'AI-Powered',
  headingTail: ' Apps Built for Atlassian Teams',
  subheading:
    'From an AI copilot for Jira to time tracking, dashboards, and Confluence formatting - our Marketplace apps are built and supported by Clovity, an official Atlassian Solution Partner.',
  trustTitle: 'Official Atlassian Marketplace Partner',
  trustSubtitle: 'All apps verified and published by Atlassian',
  exploreLabel: 'Explore All Apps',
  exploreHref: EXTERNAL_LINKS.marketplaceSearch,
} as const;

export const MARKETPLACE_APPS: MarketplaceApp[] = [
  {
    id: 'time-tracking',
    name: 'Time Tracking & Resource Planning',
    description:
      '#1 Time Tracking & PPM solution - plan resources, track timesheets, and prioritize portfolios in Jira.',
    href: EXTERNAL_LINKS.timeTrackingListing,
    logo: {
      src: appTimeTracking,
      alt: 'Time Tracking, Resource Planning & Project Management logo',
    },
    badge: 'Marketplace',
    rating: 5,
    reviewCount: 8,
    installs: 193,
    metaLabel: '5.0 (8) · 193 installs',
  },
  {
    id: 'content-formatting',
    name: 'Content Formatting Macros',
    description:
      'Create tabbed hubs, tailor sections by audience, and bulk-manage attachments in Confluence Cloud.',
    href: EXTERNAL_LINKS.contentFormattingListing,
    logo: {
      src: appContentFormatting,
      alt: 'Content Formatting Macros: Tabs, Navigation, Visibility & CSS logo',
    },
    badge: 'Marketplace',
    rating: 5,
    reviewCount: 8,
    installs: 193,
    metaLabel: '5.0 (8) · 193 installs',
  },
  {
    id: 'dashboard-templates',
    name: 'Dashboard Templates & Reports',
    description:
      'The #1 Jira dashboard app - build charts and issue lists from projects, filters, or JQL with live preview.',
    href: EXTERNAL_LINKS.dashboardTemplatesListing,
    logo: {
      src: appDashboardTemplates,
      alt: 'Dashboard Templates, Charts, Graphs & Reports for Jira logo',
    },
    badge: 'Marketplace',
    rating: 5,
    reviewCount: 8,
    installs: 219,
    metaLabel: '5.0 (8) · 219 installs',
  },
  {
    id: 'pulse-ai',
    name: 'Pulse AI',
    description:
      'AI copilot for Jira with chat, dashboards, org health, anomaly detection, and smart alerts.',
    href: EXTERNAL_LINKS.pulseAiListing,
    logo: { src: appPulseAi, alt: 'Pulse AI logo' },
    badge: 'Marketplace',
    free: true,
    installs: 62,
    metaLabel: 'New · 62 installs',
  },
];

/* ── Section 7: Results ─────────────────────────────────────────────────── */

export const RESULTS_CONTENT = {
  headingLead: 'Seventeen Years. ',
  headingHighlight: 'Numbers We Can Defend.',
  subheading:
    "Numbers that represent the real impact we've delivered for enterprise organizations worldwide.",
} as const;

export const RESULT_STATS: StatItem[] = [
  {
    id: 'engagements',
    value: 300,
    suffix: '+',
    label: 'Enterprise Engagements',
    icon: { src: statEngagements, alt: 'Enterprise Engagements' },
    delay: 0,
  },
  {
    id: 'certified-experts',
    value: 100,
    suffix: '+',
    label: 'Atlassian-Certified Experts',
    icon: { src: statCertifiedExperts, alt: 'Atlassian-Certified Experts' },
    delay: 0.05,
  },
  {
    id: 'accreditations',
    value: 235,
    suffix: '+',
    label: 'Delivery Accreditations',
    icon: { src: statAccreditations, alt: 'Delivery Accreditations' },
    delay: 0.1,
  },
  {
    id: 'years',
    value: 17,
    label: 'Years - Since 2009',
    icon: { src: statYears, alt: 'Years of Experience' },
    delay: 0.15,
  },
  {
    id: 'offices',
    value: 8,
    label: 'Global Offices',
    icon: { src: statOffices, alt: 'Global Offices' },
    delay: 0.25,
  },
];

/* ── Section 7.5: Field notes (tabs) ───────────────────────────────────── */

export const HIGHLIGHTS_CONTENT = {
  headingLead: 'What We Learn in the Field, ',
  headingHighlight: 'We Publish.',
  subheading: 'Field notes, events, and case studies from our delivery teams.',
  tabsColumnTitle: 'Explore Our Content',
  tabsColumnSubtitle: 'Browse everything we publish, by type.',
  moreLabel: 'View More',
} as const;

/* ── Section 4.5b: Credentials ─────────────────────────────────────────── */

export const CREDENTIALS_CONTENT = {
  headingLead: 'Credentials ',
  headingHighlight: 'Earned',
  headingTail: ', Not Claimed.',
  subheading:
    'Validated by Atlassian, Inc. 5000, and leading industry bodies - not marketing copy.',
  ctaLabel: 'Talk to an Expert',
  ctaHref: ROUTES.discover.contact,
} as const;

/**
 * The credentials collage, as three explicit rows.
 *
 * Row 1 is the four Atlassian partner badges, shown bare on the background. Rows 2
 * and 3 are the certification badges in white cards, split 4 / 3. See
 * `CredentialRow` for why the split is data rather than flex-wrap.
 *
 * The plain badges keep the per-image inline sizing the original applies: 100px
 * tall, capped at 150px wide - 160px for the Marketplace Partner lockup, which is
 * wider than the rest.
 */
export const CREDENTIAL_ROWS: CredentialRow[] = [
  {
    id: 'atlassian-partner',
    variant: 'plain',
    badges: [
      {
        id: 'platinum-partner',
        name: 'Atlassian Platinum Solution Partner',
        image: {
          src: badgePlatinumPartner,
          alt: 'Atlassian Platinum Solution Partner',
        },
        imageStyle: { height: '100px' },
      },
      {
        id: 'marketplace-partner',
        name: 'Atlassian Marketplace Partner',
        image: {
          src: badgeMarketplacePartner,
          alt: 'Atlassian Marketplace Partner',
        },
        imageStyle: { height: '100px', maxWidth: '160px' },
      },
      {
        id: 'cloud-specialization',
        name: 'Atlassian Cloud Migration Specialization - AMER',
        image: {
          src: badgeCloudSpecialization,
          alt: 'Atlassian Cloud Migration Specialization - AMER',
        },
        imageStyle: { height: '100px' },
      },
      {
        id: 'itsm-specialization',
        name: 'Atlassian Service Management Specialization - AMER',
        image: {
          src: badgeItsmSpecialization,
          alt: 'Atlassian Service Management Specialization - AMER',
        },
        imageStyle: { height: '100px' },
      },
    ],
  },
  {
    id: 'certifications',
    variant: 'card',
    badges: [
      {
        id: 'inc-5000',
        name: 'Inc. 5000',
        image: {
          src: `${CDN.s3}INC_5000_8c73b3872e.png`,
          alt: 'Inc. 5000',
          width: 210,
          height: 90,
        },
      },
      {
        id: 'great-place-to-work',
        name: 'Great Place to Work Certified',
        image: {
          src: `${CDN.s3}greateplace_91357bb8de.png`,
          alt: 'Great Place to Work Certified',
          width: 210,
          height: 90,
        },
      },
      {
        id: 'uspaacc',
        name: 'USPAACC',
        image: {
          src: `${CDN.s3}uspaacc_451802d846.png`,
          alt: 'USPAACC',
          width: 210,
          height: 90,
        },
      },
      {
        id: 'sam-verified',
        name: 'SAM Verified Vendor',
        image: {
          src: `${CDN.clovityApex}images/about/png/sma.png`,
          alt: 'SAM Verified Vendor',
          width: 210,
          height: 90,
        },
      },
    ],
  },
  {
    id: 'diversity',
    variant: 'card',
    badges: [
      {
        id: 'e-verify',
        name: 'E-Verify',
        image: {
          src: `${CDN.clovityApex}images/about/png/verify.png`,
          alt: 'E-Verify',
          width: 210,
          height: 90,
        },
      },
      {
        id: 'mbe',
        name: 'MBE Certified',
        image: {
          src: `${CDN.clovityApex}images/about/png/mbe.png`,
          alt: 'MBE Certified',
          width: 210,
          height: 90,
        },
      },
      {
        id: 'nmsdc',
        name: 'NMSDC Certified',
        image: {
          src: `${CDN.clovityApex}images/about/png/nmsdc.png`,
          alt: 'NMSDC Certified',
          width: 210,
          height: 90,
        },
      },
    ],
  },
];

/* ── Section 8: Final CTA ───────────────────────────────────────────────── */

export const FINAL_CTA_CONTENT = {
  headingLead: 'Ready for the ',
  headingNoWrap: 'AI-fication',
  headingTail: 'of Your Jira?',
  description:
    'Install Pulse AI from the Atlassian Marketplace, or bring us your public sector Atlassian challenge - our team responds within one business day.',
} as const;

export const FINAL_CTA_LINKS: CtaLink[] = [
  {
    id: 'try-pulse',
    label: 'Try Pulse AI Free',
    href: EXTERNAL_LINKS.pulseAiListing,
    external: true,
    variant: 'white',
  },
  {
    id: 'talk-expert',
    label: 'Talk to an Expert',
    href: ROUTES.discover.contact,
    variant: 'ghost-dark',
  },
];
