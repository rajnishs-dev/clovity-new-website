import type {
  AiTouchpoint,
  BentoTile,
  CapabilityDetail,
  CtaLink,
  FaqItem,
  ProcessStep,
  StatBandItem,
} from '@/types/content';
import { ROUTES } from './routes';


export const AI_HERO = {
  crumbs: [
    { name: 'Home', href: ROUTES.home },
    { name: 'Expertise', href: ROUTES.expertise.atlassian },
    { name: 'AI Solutions', href: ROUTES.expertise.ai },
  ],
  titleLead: 'AI Is Not a Feature.',
  titleAccent: 'It’s How We Deliver.',
  lead: 'We ship our own AI product on the Atlassian Marketplace and run AI inside the engagements we already deliver - triage, knowledge, reporting, migration. Every one starts from a real queue or a real report, and proves itself there before it scales.',
} as const;

/* ── Stat band ──────────────────────────────────────────────────────────── */

export const AI_STATS: StatBandItem[] = [
  {
    id: 'apps',
    value: '6',
    accent: true,
    label: 'Apps Published on the Atlassian Marketplace',
  },
  {
    id: 'pulse-free',
    value: 'Free',
    label: 'Pulse AI, Our Own Jira Copilot',
  },
  {
    id: 'partner',
    value: 'Platinum',
    label: 'Atlassian Solution Partner',
  },
  {
    id: 'experts',
    value: '100+',
    label: 'Atlassian-Certified Experts',
  },
];


export const AI_PULSE_CONTENT = {
  headingLead: 'Most AI Consultancies Have Not ',
  headingHighlight: 'Shipped One',
  subheading:
    'Pulse AI is a Jira copilot we build, publish and support on the Atlassian Marketplace. It is the difference between advising on AI and being accountable for it in production - including the support ticket when it misbehaves.',
  /** What the product being ours changes for a buyer. Not features - features are chips. */
  proofPoints: [
    'Built on Atlassian’s own platform, reviewed by Atlassian to list',
    'Free to install, so it can be evaluated before a conversation',
    'Supported by the team that runs Atlassian instances for a living',
  ],
  footnote:
    'Pulse AI reads and reports. It surfaces findings and raises alerts; changes to your configuration are made by people through your change process.',
} as const;

/* ── What we deliver ────────────────────────────────────────────────────── */

export const AI_DELIVER_CONTENT = {
  headingLead: 'Six Places AI Earns Its Keep in an ',
  headingHighlight: 'Atlassian Estate',
  subheading:
    'Not a model selection exercise. Each of these attaches to work your teams already do every day, which is why they can be measured.',
} as const;


export const AI_OFFERINGS: BentoTile[] = [
  {
    id: 'pulse-ai',
    title: 'Pulse AI for Jira',
    description:
      'Chat, dashboards, org health, anomaly detection and smart alerts, against one real-time Pulse Score.',
    icon: 'brain',
    iconChipClass: 'bg-brand-50 text-brand-600',
  },
  {
    id: 'triage',
    title: 'AI-Assisted Triage & Classification',
    description:
      'Incoming issues read, categorised and routed on arrival, so the queue is sorted before anyone opens it.',
    icon: 'list-check',
    iconChipClass: 'bg-[#f3e8ff] text-[#7c3aed]',
  },
  {
    id: 'knowledge',
    title: 'Confluence Knowledge Synthesis',
    description:
      'Long pages and longer threads condensed into summaries people actually read, and answers found across spaces.',
    icon: 'confluence',
    iconChipClass: 'bg-brand-50 text-brand-600',
  },
  {
    id: 'rovo',
    title: 'Rovo Enablement & Adoption',
    description:
      'Atlassian’s own AI turned on properly: permissions scoped, agents configured, and teams shown what to ask it.',
    icon: 'robot',
    iconChipClass: 'bg-[#fff1e8] text-accent-500',
  },
  {
    id: 'agents',
    title: 'Custom Agents & Workflow Automation',
    description:
      'Task-specific agents built into the tools your teams already have open, doing the work nobody should do twice.',
    icon: 'cogs',
    iconChipClass: 'bg-[#dcfce7] text-[#16a34a]',
  },
  {
    id: 'readiness',
    title: 'AI Readiness & Governance',
    description:
      'What your data, permissions and processes can support today, and the controls to add before rollout rather than after.',
    icon: 'shield-half',
    iconChipClass: 'bg-brand-50 text-brand-600',
  },
];

/* ── AI is not a silo ───────────────────────────────────────────────────── */

export const AI_TOUCHPOINTS_CONTENT = {
  headingLead: 'There Is No Standalone ',
  headingHighlight: 'AI Engagement Here',
  subheading:
    'AI is not something we sell beside the other work - it runs inside it. Every item below is delivered by the practice it belongs to, on its own page. This one exists to say what AI changes there.',
} as const;

export const AI_TOUCHPOINTS: AiTouchpoint[] = [
  {
    id: 'itsm',
    practice: 'ITSM & Service Management',
    effect:
      'Requests classified and routed on arrival, responses drafted for an agent to approve, and repeat requests answered from the knowledge base.',
    href: ROUTES.expertise.itsm,
    icon: 'headset',
    iconChipClass: 'text-brand-600',
  },
  {
    id: 'cloud-migration',
    practice: 'Cloud Migration',
    effect:
      'AI-accelerated migration - the assessment, mapping and cleanup that used to be read by hand across thousands of issues and spaces.',
    href: ROUTES.expertise.cloudMigration,
    icon: 'cloud-upload',
    iconChipClass: 'text-[#7c3aed]',
  },
  {
    id: 'devsecops',
    practice: 'DevSecOps',
    effect:
      'Release notes and change records generated from the pipeline, and review findings summarised instead of pasted.',
    href: ROUTES.expertise.devsecops,
    icon: 'shield-half',
    iconChipClass: 'text-accent-500',
  },
  {
    id: 'managed-services',
    practice: 'Managed Services',
    effect:
      'Pulse AI watching org health between reviews, so drift and anomalies reach an engineer before they reach your users.',
    href: ROUTES.expertise.managedServices,
    icon: 'settings',
    iconChipClass: 'text-[#16a34a]',
  },
  {
    id: 'workforce',
    practice: 'Workforce Solutions',
    effect:
      'Enablement for the teams inheriting all of it, because an AI workflow nobody trusts is an AI workflow nobody uses.',
    href: ROUTES.expertise.workforce,
    icon: 'users',
    iconChipClass: 'text-brand-600',
  },
];

/* ── AI in the Atlassian products ───────────────────────────────────────── */

export const AI_PRODUCTS_CONTENT = {
  headingLead: 'Smarter Jira, JSM and ',
  headingHighlight: 'Confluence',
  subheading:
    'Connected to your instance, working on your data, under your permission model. Rovo is Atlassian’s own AI and part of the same picture - we enable it rather than compete with it.',
  ctaLabel: 'See the full Atlassian toolset',
  ctaHref: ROUTES.expertise.atlassian,
} as const;

/** What AI actually does in each product. `CapabilityDetail` - title, prose, icon. */
export const AI_PRODUCTS: CapabilityDetail[] = [
  {
    id: 'jira',
    title: 'Jira',
    description:
      'Issue triage and classification, sprint and backlog analysis, anomaly detection, and reporting that writes itself.',
    icon: 'jira',
    iconChipClass: 'bg-brand-50 text-brand-600',
  },
  {
    id: 'jsm',
    title: 'Jira Service Management',
    description:
      'Request classification, response drafting, routing, and deflection through the portal before a ticket is raised.',
    icon: 'headset',
    iconChipClass: 'bg-[#e0f2fe] text-[#0284c7]',
  },
  {
    id: 'confluence',
    title: 'Confluence',
    description:
      'Auto-summaries, knowledge synthesis across spaces, and search that answers a question instead of listing pages.',
    icon: 'confluence',
    iconChipClass: 'bg-[#f3e8ff] text-[#7c3aed]',
  },
  {
    id: 'rovo',
    title: 'Rovo',
    description:
      'Atlassian’s own AI, enabled with scoped permissions and configured agents - plus the training that gets it used.',
    icon: 'robot',
    iconChipClass: 'bg-[#fff1e8] text-accent-500',
  },
];

/* ── Delivery approach ──────────────────────────────────────────────────── */

export const AI_APPROACH_CONTENT = {
  headingLead: 'From Readiness to ',
  headingHighlight: 'Adoption',
  subheading:
    'Five steps, and the first two exist to kill bad ideas cheaply. Most AI disappointment is a use case that should never have been started.',
} as const;

/**
 * The comp's five delivery steps, reworded.
 *
 * Rendered through the shared `ProcessTimeline`, which numbers them from `order` and prints
 * the ordinal when a step carries no icon - so no icons here. The sequence is the content.
 */
export const AI_APPROACH_STEPS: ProcessStep[] = [
  {
    id: 'readiness',
    order: 1,
    title: 'Assess readiness',
    description:
      'Data quality, permissions and process fit, judged before anything is promised.',
  },
  {
    id: 'use-cases',
    order: 2,
    title: 'Pick the use cases',
    description:
      'Ranked by impact against effort, and the weak ones dropped here rather than after a build.',
  },
  {
    id: 'design',
    order: 3,
    title: 'Design the controls with it',
    description:
      'Access, audit and human approval decided alongside the workflow, not bolted on before launch.',
  },
  {
    id: 'build',
    order: 4,
    title: 'Build into the tools in use',
    description:
      'Shipped inside Jira, JSM and Confluence, so adoption does not depend on a new habit.',
  },
  {
    id: 'scale',
    order: 5,
    title: 'Measure, govern, scale',
    description:
      'Reviewed against the outcome it was justified by, then extended - or switched off.',
  },
];

/* ── Proof ──────────────────────────────────────────────────────────────── */

export const AI_PROOF_CONTENT = {
  headingLead: 'Where We Have Already ',
  headingHighlight: 'Shipped It',
  subheading:
    'Engagements where automation and AI did the work, in the clients’ own words.',
  moreLabel: 'See all case studies',
  moreHref: ROUTES.resources.caseStudy,
} as const;

/* ── FAQ ────────────────────────────────────────────────────────────────── */

export const AI_FAQ_CONTENT = {
  headingLead: 'What a Security Reviewer ',
  headingHighlight: 'Will Ask',
} as const;

export const AI_FAQ: FaqItem[] = [
  {
    id: 'data',
    question: 'Where does our data go, and is it used to train a model?',
    answer:
      'It depends on which component you are asking about, and we would rather answer it in writing for your architecture than generally here. Pulse AI runs against your Jira instance and reports on it. Rovo is Atlassian’s own AI, so its data handling is Atlassian’s to state and we will point you at their current documentation rather than paraphrase it. For anything we build custom, data flow and retention are written into the design and reviewed with your security team before a line of it ships. Ask us for that in writing - a vendor who answers this question casually is the wrong vendor.',
  },
  {
    id: 'pulse-changes',
    question: 'Does Pulse AI make changes to our instance on its own?',
    answer:
      'No. It reads and reports - org health, anomaly detection, alerting and the Pulse Score. Every change to your configuration is made by a person through your change process. An anomaly is a prompt for an engineer to look, not an instruction for software to act.',
  },
  {
    id: 'rovo',
    question: 'We are already buying Rovo. Where do you fit?',
    answer:
      'Turning it on and getting value from it are different projects, and the gap is usually permissions and habit rather than the technology. We scope what Rovo can reach, configure agents against your actual workflows, and train the teams who are supposed to use it. Where Rovo covers a need, we say so and stop - we would rather enable what you have bought than sell around it. Pulse AI and custom agents are for the things it does not do.',
  },
  {
    id: 'accuracy',
    question: 'What happens when the AI gets it wrong?',
    answer:
      'It will, sometimes, which is why the design question is never "is it accurate" but "what does a wrong answer cost here". Anything with a real cost of error keeps a human approval step, and anything automated end-to-end is chosen because being wrong is cheap and reversible. That decision is made per use case, in step three, and written down.',
  },
  {
    id: 'model',
    question: 'Which model do you use?',
    answer:
      'We do not commit to one on a web page, because the honest answer varies by component and changes faster than this page will. Rovo uses whatever Atlassian runs. For work we build, model choice is part of the design and gets decided against your data-handling requirements, your latency needs and your budget - and it is written into the architecture document you sign off, where it belongs.',
  },
  {
    id: 'start',
    question: 'What is the smallest sensible way to start?',
    answer:
      'Install Pulse AI. It is free on the Atlassian Marketplace, it runs against your own instance, and it will tell you something about your Jira estate within a day - with no procurement and no conversation with us. If what it surfaces is worth acting on, the readiness assessment is the next step. If it is not, you have lost an afternoon.',
  },
  {
    id: 'readiness-cost',
    question: 'Do we need our data cleaned up before any of this works?',
    answer:
      'Partly, and finding out how much is exactly what the readiness assessment is for. AI is unforgiving about inconsistent fields, stale spaces and permission sprawl - it surfaces that mess rather than absorbing it. The assessment tells you which use cases your estate can support as it stands, and which need cleanup first, so you can decide whether that cleanup is worth doing.',
  },
];

/* ── Final CTA ──────────────────────────────────────────────────────────── */

/**
 * Same closing content and single button as every other `/expertise/*` page - see
 * `ATLASSIAN_FINAL_CTA_LINKS` for the shared rationale.
 */
export const AI_FINAL_CTA = {
  headingLead: 'Ready to talk to',
  headingTail: 'an expert?',
  description:
    'Tell us what you’re working on and a Clovity specialist will get back to you with next steps.',
} as const;

export const AI_FINAL_CTA_LINKS: CtaLink[] = [
  {
    id: 'talk-to-an-expert',
    label: 'Talk to an expert',
    href: ROUTES.discover.contact,
    variant: 'white-pill',
    icon: 'arrow-up-right',
  },
];
