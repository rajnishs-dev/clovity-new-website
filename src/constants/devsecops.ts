import type {
  CtaLink,
  FactItem,
  FaqItem,
  OrbitStage,
  ProductBadge,
  ServiceOffering,
  StatBandItem,
  ToolchainLayer,
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
 * `/expertise/devsecops` - DevSecOps.
 *
 * ── WHERE THE COPY COMES FROM ──
 * Two Clovity-published sources, so this page makes no claim the company is not
 * already making in public:
 *
 *   1. `clovity.com/atlassian/devsecops-toolchain` - the hero framing ("integrate
 *      security into every phase of your software delivery lifecycle"), the six
 *      capability areas, and the tool stack named in its interactive grid
 *      (Bitbucket, Bamboo, Jenkins, SonarQube, Snyk, JFrog Artifactory, AWS
 *      CodeBuild, Docker, Kubernetes, GitLab).
 *   2. "DevSecOps with Atlassian: Building Secure Software Delivery at Scale" -
 *      our own blog post, bundled in `data/blog.ts`. It is still the source behind
 *      the delivery and toolchain framing here; the six-point Atlassian mapping it
 *      also supplied was dropped along with the "Six Jobs the Atlassian Stack
 *      Actually Does Here" section.
 *
 * Everything else is written for this page.
 *
 * ── WHERE THE NUMBERS COME FROM ──
 *   • "45%"      - clovity.com/atlassian/devsecops-toolchain resource strip:
 *                  "Cyber Firm Cuts Lead Time 45 %". The stat cell names the
 *                  sector so the claim is attributed, not floating.
 *   • "Zero"     - the same strip: "Zero-downtime Bitbucket Cloud migration
 *                  success".
 *   • "Platinum" - the Atlassian partner tier stated across the site.
 *   • "24×7"     - the same page's "24 × 7 U.S. support".
 * No third-party market statistics and no engagement-duration figures: nothing
 * published states a DevSecOps delivery timeline, so the FAQ answers that
 * question with process instead of inventing a number. A new figure here needs a
 * source in this comment or it does not belong on the page.
 */

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const DEVSECOPS_HERO = {
  crumbs: [
    { name: 'Home', href: ROUTES.home },
    { name: 'Expertise', href: ROUTES.expertise.atlassian },
    { name: 'DevSecOps', href: ROUTES.expertise.devsecops },
  ],
  titleLead: 'Secure Delivery, Built',
  titleAccent: 'Into the Pipeline.',
  lead: 'CI/CD designed around how your teams actually ship, with security controls running at every stage instead of one review before release. Built by an Atlassian Platinum Solution Partner whose day job is regulated delivery.',
  /**
   * No `imagePosition` here on purpose. It used to carry `center 50%` because the
   * hero reused a PORTRAIT photograph and the shared top-anchored crop showed only
   * the out-of-focus top of the frame. The banner is now a purpose-shaped 3:1
   * landscape, so the default crop is correct and the override is gone - which is
   * exactly what the old comment here said to do once such an image existed.
   */
} as const;

/* ── Stat band ──────────────────────────────────────────────────────────── */

export const DEVSECOPS_STATS: StatBandItem[] = [
  {
    id: 'lead-time',
    value: '45%',
    accent: true,
    label: 'Lead-Time Cut, Cyber-Sector Client',
  },
  {
    id: 'downtime',
    value: 'Zero',
    label: 'Downtime on Bitbucket Cloud Cutover',
  },
  {
    id: 'tier',
    value: 'Platinum',
    label: 'Atlassian Solution Partner Tier',
  },
  {
    id: 'support',
    value: '24×7',
    label: 'U.S.-Led Toolchain Support',
  },
];

/* ── The Atlassian product family strip ─────────────────────────────────── */

export const DEVSECOPS_PRODUCTS_CONTENT = {
  heading: 'Every product in the Atlassian delivery stack',
  /**
   * The strip is now nine official lockups, so the earlier caveat about composed
   * badges no longer applies and has been dropped rather than left to go stale.
   */
  note: 'Product names and marks are trademarks of Atlassian, shown to describe the platforms we implement.',
} as const;

/**
 * The nine products, in the order the strip renders them (five, then four).
 *
 * All nine now carry `logo` - the official icon-plus-wordmark SVG - so the strip is
 * entirely real marks and the `icon`/`tintClass` fallback never renders. Both fields
 * stay on every entry anyway: they are what makes a deleted or renamed logo file
 * degrade to a composed badge rather than a blank gap. See `ProductBadge`.
 *
 * ── THE ORDER IS THE REFERENCE'S, AND IT FITS ──
 * Jira / Confluence / Jira Align / Jira Service Management / Rovo, then Jira Product
 * Discovery / Bitbucket / Compass / Trello. That is the arrangement in the supplied
 * reference, and it also happens to balance: the widths sum to 905px on row one and
 * 768px on row two, both inside the 1232px content track once the 36px gaps are
 * counted. Reordering these entries changes the row widths, so check the fit rather
 * than assuming any order works.
 */
export const DEVSECOPS_PRODUCTS: ProductBadge[] = [
  {
    id: 'jira',
    name: 'Jira',
    logo: { src: logoJira, alt: 'Jira', width: 83, height: 32 },
    icon: 'jira',
    tintClass: 'bg-[#1868db] text-white',
  },
  {
    id: 'confluence',
    name: 'Confluence',
    logo: { src: logoConfluence, alt: 'Confluence', width: 188, height: 32 },
    icon: 'confluence',
    tintClass: 'bg-[#1868db] text-white',
  },
  {
    id: 'jira-align',
    name: 'Jira Align',
    logo: { src: logoJiraAlign, alt: 'Jira Align', width: 156, height: 32 },
    icon: 'chart-line',
    tintClass: 'bg-[#fb9700] text-[#101214]',
  },
  {
    id: 'jsm',
    name: 'Jira Service Management',
    logo: {
      src: logoJiraServiceManagement,
      alt: 'Jira Service Management',
      width: 372,
      height: 32,
    },
    icon: 'headset',
    tintClass: 'bg-[#ffc716] text-[#101214]',
  },
  {
    id: 'rovo',
    name: 'Rovo',
    logo: { src: logoRovo, alt: 'Rovo', width: 106, height: 32 },
    icon: 'robot',
    tintClass: 'bg-[#1868db] text-white',
  },
  {
    id: 'jpd',
    name: 'Jira Product Discovery',
    logo: {
      src: logoJiraProductDiscovery,
      alt: 'Jira Product Discovery',
      width: 327,
      height: 32,
    },
    icon: 'compass',
    tintClass: 'bg-[#c97cf4] text-[#101214]',
  },
  {
    id: 'bitbucket',
    name: 'Bitbucket',
    logo: { src: logoBitbucket, alt: 'Bitbucket', width: 166, height: 32 },
    icon: 'git-branch',
    tintClass: 'bg-[#1868db] text-white',
  },
  {
    id: 'compass',
    name: 'Compass',
    logo: { src: logoCompass, alt: 'Compass', width: 162, height: 32 },
    icon: 'grip',
    tintClass: 'bg-[#94c748] text-[#101214]',
  },
  {
    id: 'trello',
    name: 'Trello',
    logo: { src: logoTrello, alt: 'Trello', width: 113, height: 32 },
    icon: 'clipboard-list',
    tintClass: 'bg-[#1558bc] text-white',
  },
];


/* ── Scaling secure delivery: the orbit diagram ──────────────────────────── */

export const DEVSECOPS_ORBIT_CONTENT = {
  headingLead: 'Scaling Secure Delivery ',
  headingHighlight: 'Across the Organization',
  paragraphs: [
    'Wherever you are in the journey, the shape of the work is the same: Jira in the middle holding the record of what changed and why, with the rest of the toolchain hanging off it.',
    'We start from the stage that hurts, not from the diagram. One team gets a hardened pipeline first, then the pattern spreads - same controls, same evidence, same place to look when something breaks.',
  ],
} as const;

/**
 * The five lifecycle stages, as TEXT.
 *
 * These mirror the clusters drawn inside `devsecopsOrbitDiagram`, and they are the
 * accessible and small-screen version of that artwork - the diagram is one image, so
 * nothing inside it is reachable by a screen reader or legible on a phone. Exactly
 * one of the two renders at any width; see `ScalingSection`.
 */
export const DEVSECOPS_ORBIT_STAGES: OrbitStage[] = [
  {
    id: 'plan',
    label: 'Plan',
    tools: ['Jira', 'Confluence', 'Jira Product Discovery'],
    icon: 'clipboard-list',
    tintClass: 'bg-[#e9f2ff] text-[#1868db]',
  },
  {
    id: 'code',
    label: 'Code',
    tools: ['Bitbucket', 'GitHub', 'GitLab'],
    icon: 'git-branch',
    tintClass: 'bg-[#f3f0ff] text-[#6e5dc6]',
  },
  {
    id: 'secure',
    label: 'Secure',
    tools: ['SonarQube', 'Snyk', 'Prisma Cloud'],
    icon: 'shield-half',
    tintClass: 'bg-[#fff1ea] text-[#c2410c]',
  },
  {
    id: 'deploy',
    label: 'Deploy',
    tools: ['Bamboo', 'Jenkins', 'Kubernetes'],
    icon: 'cloud-upload',
    tintClass: 'bg-[#e3fcef] text-[#177d52]',
  },
  {
    id: 'operate',
    label: 'Operate',
    tools: ['Jira Service Management', 'Compass', 'Opsgenie'],
    icon: 'heart-pulse',
    tintClass: 'bg-[#e9f2ff] text-[#1868db]',
  },
];

/* ── What we deliver ────────────────────────────────────────────────────── */

export const DEVSECOPS_DELIVER_CONTENT = {
  headingLead: 'Six Pieces of a ',
  headingHighlight: 'Secure Delivery Practice',
  subheading:
    'Scoped individually or run as one programme. We start from how your teams ship today, not from a reference architecture.',
} as const;

export const DEVSECOPS_OFFERINGS: ServiceOffering[] = [
  {
    id: 'cicd-design',
    icon: 'git-branch',
    iconChipClass: 'text-brand-600',
    title: 'CI/CD Pipeline Design & Automation',
    description:
      'Pipelines built around your branching model and release cadence, so the pipeline stops being the thing engineers work around.',
    points: [
      'Branching & environment strategy',
      'Reproducible build stages',
      'Pipeline-as-code, version controlled',
    ],
  },
  {
    id: 'shift-left-security',
    icon: 'shield-half',
    iconChipClass: 'text-accent-500',
    title: 'Security Across the SDLC',
    description:
      'SAST, DAST, dependency and secrets scanning wired into the stages where a developer can still act on the finding cheaply.',
    points: [
      'SAST & DAST in the pipeline',
      'Dependency and secrets scanning',
      'Findings routed as Jira issues',
    ],
  },
  {
    id: 'toolchains',
    icon: 'server',
    iconChipClass: 'text-[#7c3aed]',
    title: 'Bitbucket, GitLab, GitHub & Azure DevOps',
    description:
      'We work in the SCM and CI you already run. Where a move makes sense we do it as a migration, not a rebuild from zero.',
    points: [
      'Repo, permission & policy migration',
      'Runner and agent architecture',
      'Parallel-run validation before cutover',
    ],
  },
  {
    id: 'release-automation',
    icon: 'cloud-upload',
    iconChipClass: 'text-brand-green',
    title: 'Release & Deployment Automation',
    description:
      'Deployments that are boring: repeatable, observable, and reversible without a call to the one person who remembers how.',
    points: [
      'Progressive and staged rollouts',
      'Automated rollback paths',
      'Deployment records tied to changes',
    ],
  },
  {
    id: 'compliance-pipelines',
    icon: 'file-signature',
    iconChipClass: 'text-brand-600',
    title: 'Compliance & Audit-Ready Pipelines',
    description:
      'Controls that emit their own evidence, so an audit is a query against what the pipeline already recorded rather than a project.',
    points: [
      'Approval gates and change control',
      'SBOM and scan results per build',
      'Evidence mapped to your control set',
    ],
  },
  {
    id: 'orchestration',
    icon: 'link',
    iconChipClass: 'text-[#7c3aed]',
    title: 'Toolchain Integration & Orchestration',
    description:
      'The connective work that decides whether a toolchain is a system or eight tools with a shared login page.',
    points: [
      'Scanner findings into Jira workflows',
      'Enterprise system integrations',
      'One source of truth for status',
    ],
  },
];

/* ── The toolchain stack ────────────────────────────────────────────────── */

export const DEVSECOPS_TOOLCHAIN_CONTENT = {
  headingLead: 'We Build Around Your Stack, ',
  headingHighlight: 'Not Ours',
  subheading:
    'The layers below are the shape of a working toolchain. Which product sits in each one is a decision about your team, your constraints and your existing licences - not our preference.',
  footnote:
    'Named because these are the tools our engagements actually run in. We are not reselling any of them.',
} as const;

export const DEVSECOPS_TOOLCHAIN_LAYERS: ToolchainLayer[] = [
  {
    id: 'plan-track',
    name: 'Plan & Track',
    purpose: 'Where security work and business work share one backlog',
    tools: ['Jira', 'Confluence', 'Jira Service Management', 'Compass'],
    icon: 'clipboard-list',
    iconChipClass: 'text-brand-600',
  },
  {
    id: 'source',
    name: 'Source & Review',
    purpose: 'Branch protection, review gates, and the first scan',
    tools: ['Bitbucket', 'GitHub', 'GitLab', 'Azure Repos'],
    icon: 'git-branch',
    iconChipClass: 'text-[#7c3aed]',
  },
  {
    id: 'build',
    name: 'Build & CI',
    purpose: 'Reproducible builds, defined as code',
    tools: [
      'Bamboo',
      'Jenkins',
      'GitHub Actions',
      'GitLab CI',
      'AWS CodeBuild',
      'Azure Pipelines',
    ],
    icon: 'cogs',
    iconChipClass: 'text-accent-500',
  },
  {
    id: 'scan',
    name: 'Security Scanning',
    purpose: 'SAST, DAST, SCA and cloud posture, in the pipeline',
    tools: ['SonarQube', 'Snyk', 'Checkmarx', 'Veracode', 'Prisma Cloud'],
    icon: 'shield-half',
    iconChipClass: 'text-brand-green',
  },
  {
    id: 'artifacts',
    name: 'Artifacts & Runtime',
    purpose: 'What gets promoted, and what it runs on',
    tools: ['JFrog Artifactory', 'Docker', 'Kubernetes'],
    icon: 'server',
    iconChipClass: 'text-brand-600',
  },
];

export const DEVSECOPS_INTEGRATIONS_CONTENT = {
  title: 'Wired into the systems around it',
  description:
    'A toolchain that cannot see the rest of the business produces status nobody trusts. These are the integration targets we are asked for most often.',
} as const;

export const DEVSECOPS_INTEGRATIONS: string[] = [
  'ServiceNow',
  'Salesforce',
  'SAP',
  'GitHub',
  'Slack',
  'Microsoft Teams',
  'Snowflake',
  'AWS',
  'Azure',
];

/* ── Public-sector security posture ─────────────────────────────────────── */

export const DEVSECOPS_SECURITY_CONTENT = {
  headingLead: 'The Reason to Take the ',
  // Curly quotes, not ASCII `"`. Space Grotesk renders the straight quote with a
  // slant that reads as a typo at 46px, and the rest of the site's copy already
  // uses typographic punctuation.
  headingHighlight: '“Sec” Seriously',
  subheading:
    'Our federal and state work sets the baseline for every pipeline we build. These are not options we quote separately - they are how the first sprint is configured.',
  ctaLabel: 'Talk to a security lead',
  ctaHref: ROUTES.discover.contact,
} as const;

export const DEVSECOPS_SECURITY_FACTS: FactItem[] = [
  {
    id: 'least-privilege',
    title: 'Least-privilege access',
    description:
      'Repository, branch and environment permissions scoped so an engineer can reach exactly what their work requires, and nothing beside it.',
  },
  {
    id: 'audit-trails',
    title: 'Complete audit trails',
    description:
      'Every approval, merge and deployment recorded against the change that caused it - so the question “who shipped this, and who signed it off” has one answer.',
  },
  {
    id: 'federal-standards',
    title: 'Federal-standard configuration',
    description:
      'Pipelines designed to sit on Atlassian Government Cloud where the mission requires it, with configuration baselines to match.',
  },
  {
    id: 'us-led',
    title: 'U.S.-led delivery',
    description:
      'Security-cleared U.S. architects lead the engagement, backed by compliant teams that keep progress moving around the clock.',
  },
];

/* ── Proof ──────────────────────────────────────────────────────────────── */

export const DEVSECOPS_PROOF_CONTENT = {
  headingLead: 'Our Own Thinking, ',
  headingHighlight: 'Written Down',
  subheading:
    'The long-form version of this page - how the Atlassian ecosystem embeds security into each stage of delivery, and what that looks like in practice.',
  /** Slug of the bundled DevSecOps blog post this section features. */
  featuredSlug:
    'devsecops-with-atlassian-building-secure-software-delivery-at-scale',
  ribbon: 'Playbook',
  ctaLabel: 'Read the playbook',
} as const;

/* ── FAQ ────────────────────────────────────────────────────────────────── */

export const DEVSECOPS_FAQ_CONTENT = {
  headingLead: 'The Ones We ',
  headingHighlight: 'Always Get Asked',
} as const;

export const DEVSECOPS_FAQ: FaqItem[] = [
  {
    id: 'devops-vs-devsecops',
    question: 'What is the difference between DevOps and DevSecOps?',
    answer:
      'DevOps joins development and operations so software ships continuously. DevSecOps extends that by making security a shared responsibility instead of a separate activity performed before production - automated testing, compliance checks and monitoring run throughout the lifecycle rather than at the end. In practice the difference shows up in one place: whether a developer finds out about a vulnerability on their pull request or three weeks later.',
  },
  {
    id: 'replace-ci',
    question: 'Do we have to replace our CI tool?',
    answer:
      'Usually not. We work in the SCM and CI you already run - Bitbucket, GitHub, GitLab or Azure DevOps - because a toolchain rebuild is the most expensive way to solve a problem that is normally about configuration and integration. Where a move genuinely is the right answer, we scope it as a migration with parallel running and validation against real builds, not a rebuild from zero.',
  },
  {
    id: 'existing-scanners',
    question: 'We already run SonarQube and Snyk. What do you add?',
    answer:
      'Wiring, placement and evidence. Most teams we meet own good scanners that run in the wrong stage, at the wrong severity threshold, with findings landing somewhere nobody triages. We put the scan where a developer can still act on it cheaply, route the finding into a Jira workflow with an owner, and make the result an artefact you can hand an auditor.',
  },
  {
    id: 'audit-ready',
    question: 'What actually makes a pipeline audit-ready?',
    answer:
      'Evidence that the pipeline produces on its own. A control with no artefact cannot be audited, which is where most pipelines fail their first review - the control exists, but proving it ran means reconstructing history by hand. We design each stage to emit its own record: SBOMs per build, scan results per candidate, approval trails per release, deployment records with a rollback point.',
  },
  {
    id: 'non-atlassian',
    question: 'Can you work with GitHub or GitLab instead of Bitbucket?',
    answer:
      'Yes, and we frequently do. Atlassian is where our depth is, and it is a strong workflow and collaboration foundation - but it is not a requirement. Bitbucket, GitHub, GitLab and Azure DevOps all appear in our engagements, often more than one inside the same organisation, and the integration work is what makes that survivable.',
  },
  {
    id: 'timeline',
    question: 'How long does an engagement take?',
    answer:
      'It depends on how much of the toolchain is in scope, and we scope and price before build starts so the timeline is fixed at kickoff rather than discovered halfway through. A single pipeline hardened is a much shorter engagement than a multi-team toolchain consolidation. We will tell you which one you are asking for after the assessment, not before it.',
  },
  {
    id: 'government-cloud',
    question: 'Can this run on Atlassian Government Cloud?',
    answer:
      'Yes. Public-sector delivery is a core practice for us, not a side line - our federal and state work is where the least-privilege, audit-trail and configuration-baseline defaults on this page come from. Pipelines can be designed to sit on Atlassian Government Cloud where the mission requires it.',
  },
];

/* ── Final CTA ──────────────────────────────────────────────────────────── */

export const DEVSECOPS_FINAL_CTA = {
  headingLead: 'Show us your',
  headingTail: 'pipeline as it is.',
  description:
    'Not the diagram - the real one, with the manual step everyone works around. We come back with where the controls should go and what it takes to get there.',
} as const;

export const DEVSECOPS_FINAL_CTA_LINKS: CtaLink[] = [
  {
    id: 'talk-to-an-expert',
    label: 'Talk to an expert',
    href: ROUTES.discover.contact,
    variant: 'white-pill',
    icon: 'arrow-up-right',
  },
];
