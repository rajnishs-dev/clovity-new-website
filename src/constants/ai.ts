import type {
  AiTouchpoint,
  BentoTile,
  CapabilityDetail,
  CtaLink,
  FaqItem,
  ProcessStep,
  StatBandItem,
} from '@/types/content';
import { EXTERNAL_LINKS, ROUTES } from './routes';

/**
 * `/expertise/ai` - AI Solutions.
 *
 * ── WHERE THE STRUCTURE COMES FROM ──
 * The section order follows this page's own comp in `clovity-website-updated/expertise/ai/
 * index.html`: overview, capability grid, use cases, AI for Atlassian workflows, delivery
 * approach, responsible AI, outcomes, CTA. Two departures are recorded at the bottom.
 *
 * ── WHERE THE COPY COMES FROM ──
 * This page has more genuine Clovity material behind it than any other expertise page,
 * because Pulse AI is a shipped product rather than a service description. Almost nothing
 * here is written from scratch:
 *   • the hero is our HOME PAGE's own line, not a rewrite of it. `AI_DELIVERY_CONTENT` in
 *     `constants/home.ts` reads "AI Is Not a Feature We Add." / "How We Deliver", and this
 *     page opens on exactly that. The brief asked for "AI Is How We Deliver, Not a Feature
 *     We Bolt On"; the published line says the same thing in fewer words, so the published
 *     line wins.
 *   • `AI_PULSE_*` restates nothing - it IMPORTS. The spotlight section renders
 *     `PULSE_AI_CONTENT`, `PULSE_AI_CAPABILITIES` and `PULSE_AI_CTAS` straight from
 *     `constants/home.ts`, the same way `expertise/atlassian`'s `AiAutomationSection`
 *     already does. Pulse AI's description exists in one place and this page is not a
 *     second copy of it that can go stale.
 *   • `AI_TOUCHPOINTS`' cloud-migration entry is our home page's own public-sector fact
 *     "AI-accelerated migration" (`PUBLIC_SECTOR_FACTS` in `constants/home.ts`).
 *   • the closing CTA is the home page's "Ready for the AI-fication of Your Jira?".
 *   • the delivery steps and the use-case list are the comp's own, reworded.
 * The FAQ answers and the Rovo copy are written for this page.
 *
 * NOT used, despite being an obvious candidate: the home page's six-tile operating-model grid
 * (`AI_DELIVERY_CAPABILITIES` - AI-Powered Insights, Tailored for You, Secure by Design,
 * Real-Time Visibility, Workflow Automation, Expert & Human Support). It describes how Clovity
 * delivers everything, not what this practice sells, and `AI_OFFERINGS` below needed to be the
 * six concrete sub-services instead. The hero already carries that grid's argument in its
 * heading, which is where it belongs on this page.
 *
 * ── WHERE THE NUMBERS COME FROM ──
 *   • "6"        - `MARKETPLACE_APPS_SHOWCASE_CONTENT` in `constants/expertise/
 *                  marketplace-apps.ts` publishes "Six Apps, One Support Team", and
 *                  `MARKETPLACE_APPS_CATALOG` lists exactly six.
 *   • "Free"     - `free: true` on the Pulse AI record in `MARKETPLACE_APPS`
 *                  (`constants/home.ts`), matching its Atlassian Marketplace listing.
 *   • "Platinum" - the Atlassian Platinum Solution Partner badge in
 *                  `assets/badges/platinum-solution-partner.png`.
 *   • "100+"     - our own published stat bands on `expertise/atlassian` and
 *                  `expertise/cloud-migration`, and `HOME_STATS`.
 * No third-party market statistics are used. If a new figure is added here it needs a source
 * in this comment or it does not belong on the page.
 *
 * ── FOUR NUMBERS FROM THE COMP ARE DELIBERATELY ABSENT ──
 * The comp's outcomes band states "55% faster decision-making", "30% reduced manual effort",
 * "4x faster knowledge discovery" and "92% better reporting visibility". None has a source
 * anywhere in Clovity's published material, and AI efficiency percentages are the single
 * easiest claim for a buyer to test and disprove after go-live. `AI_STATS` therefore carries
 * four sourced values in that band's place. Same decision, same reasoning, as the comp
 * numbers dropped on `/expertise/workforce` and `/expertise/managed-services`.
 *
 * Pulse AI's install count is also NOT used here. It is real and published (62 installs), but
 * it is a live counter: correct on the Marketplace, stale the moment this file is built. It
 * belongs on the marketplace-apps page, which frames it as "New · 62 installs", not in a stat
 * band that reads as a durable credential.
 *
 * ── ONE THING DELIBERATELY NOT CLAIMED ──
 * NO MODEL NAMES, NO HOSTING CLAIMS. Nothing here says which foundation model anything runs
 * on, or that data never leaves your tenancy. Those are architecture commitments that vary by
 * engagement and by what Atlassian's own platform does underneath Rovo, and getting one wrong
 * in front of a security reviewer costs the deal. The FAQ sends the data-residency question to
 * a written answer instead of guessing at one here.
 *
 * ── THE RESPONSIBLE-AI SECTION WAS REMOVED, AND THE FAQ IS NOW CARRYING IT ──
 * A "The Risk Is Not the Model. It's the Access." section used to sit between the delivery
 * approach and the proof rail, pairing four ungoverned-adoption risks against four controls.
 * It was cut on request. Its `AI_GOVERNANCE_CONTENT` and `AI_GOVERNANCE_SHIFTS` exports went
 * with it rather than being left orphaned.
 *
 * What that means for this page: governance now appears in exactly two places - the
 * "AI Readiness & Governance" tile in `AI_OFFERINGS`, and the FAQ. The FAQ answers on data
 * handling, model choice and what happens when the AI is wrong are therefore load-bearing
 * rather than supplementary, and should not be trimmed without putting the argument back
 * somewhere visible. A security reviewer arriving on this page has nowhere else to look.
 */

/* ── Hero ───────────────────────────────────────────────────────────────── */

/**
 * Breadcrumb, heading and supporting paragraph - rendered through the shared `BannerHero`,
 * like ITSM, DevSecOps, Managed Services and Workforce.
 *
 * ── THE HOME PAGE'S LINE, SHORTENED TO FIT THE COLUMN ──
 * `AI_DELIVERY_CONTENT` in `constants/home.ts` reads "AI Is Not a Feature We Add." / "How We
 * Deliver", and the home page has room for it. This 480px column at 46px does not: measured
 * against the real font, "AI Is Not a Feature We Add." needs 551px and would wrap, orphaning
 * its tail - the failure `/expertise/workforce` documents at length. Measured:
 *
 *     "AI Is Not a Feature We Add."   551px   wraps
 *     "AI Is Not a Feature."         *382px*  fits
 *     "It's How We Deliver."         *395px*  fits
 *
 * So "We Add" goes, which costs nothing - "Not a Feature" already carries it - and the pair
 * below sets as two balanced lines. "AI" stays first in the H1 deliberately: this is
 * `/expertise/ai`, and dropping the term from the heading to save width would be a poor trade.
 * Re-measure before editing either clause; do not assume character count predicts this.
 */
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

/* ── Pulse AI spotlight ─────────────────────────────────────────────────── */

/**
 * The flagship section's own framing only.
 *
 * The product's NAME, DESCRIPTION, CAPABILITY CHIPS and CTAs are not here - the section
 * imports `PULSE_AI_CONTENT`, `PULSE_AI_CAPABILITIES` and `PULSE_AI_CTAS` from
 * `constants/home.ts` so there is exactly one description of Pulse AI in the codebase. This
 * object holds only what is specific to arguing for it on an expertise page.
 */
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

/**
 * The six sub-services, as bento tiles.
 *
 * `BentoTile` rather than `ServiceOffering` on purpose: the comp specifies its `.bento-grid`
 * here, and the ported `BentoGrid` renders title-plus-sentence tiles. Adding `points` to each
 * would turn a scannable grid into six stacked lists and duplicate the detail that the Pulse
 * spotlight and the Atlassian panel below already carry.
 *
 * Pulse AI leads the grid but stays one tile among six, because it has its own section
 * directly above - repeating its full capability list here would be the third time on one
 * page.
 */
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
 * The home page's own closing line, reused verbatim - `HOME_FINAL_CTA` sets "Ready for the
 * AI-fication of Your Jira?" with `AI-fication` held on one line by a nowrap span. The same
 * split is kept here so the two pages close on the same sentence.
 */
export const AI_FINAL_CTA = {
  headingLead: 'Ready for the AI-fication',
  headingTail: 'of your Jira?',
  description:
    'Install Pulse AI free and see what it finds, or book a readiness assessment and we will tell you which use cases your estate can actually support today.',
} as const;

/**
 * Two buttons, `white-pill` then `ghost-dark`.
 *
 * That pairing is already the convention on half the expertise pages - `atlassian`,
 * `cloud-migration` and `marketplace-apps` all carry it, as does the home page; ITSM,
 * DevSecOps, Managed Services and Workforce carry a single `white-pill`. So this is the
 * established two-CTA form, not an exception being made for this page.
 *
 * What is specific here is WHICH two. The primary route is a free Marketplace install that
 * needs no contact with us at all, and burying that behind "book a consultation" would waste
 * the one thing this page has that a competitor's page cannot copy. So the low-friction option
 * takes the primary slot and the high-intent one takes the secondary - the reverse of the usual
 * ordering, where the contact form is primary.
 */
export const AI_FINAL_CTA_LINKS: CtaLink[] = [
  {
    id: 'install',
    label: 'Install Pulse AI free',
    href: EXTERNAL_LINKS.pulseAiListing,
    external: true,
    variant: 'white-pill',
    icon: 'arrow-up-right',
  },
  {
    id: 'assessment',
    label: 'Book an AI readiness assessment',
    href: ROUTES.discover.contact,
    variant: 'ghost-dark',
  },
];
