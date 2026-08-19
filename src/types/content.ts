import type { StaticImageData } from 'next/image';

import type { IconName } from './icon';

/**
 * Content models. These are deliberately shaped like the CMS tables the admin
 * panel will own (blogs, events, webinars, case studies, news, services,
 * testimonials, careers), so the static fallbacks in src/constants and the
 * future API responses are the *same* type. Sections consume the type, never
 * the source.
 */

/**
 * Anything next/image accepts as `src`.
 *
 * A `StaticImageData` (from `import img from '@/assets/images/…'`) carries the
 * file's intrinsic width, height and blur placeholder, which is what removes
 * layout shift. A plain string covers remote CMS and CDN URLs. Keeping both in
 * one union means a section renders bundled art today and CMS art tomorrow
 * through the same prop.
 */
export type ImageSource = StaticImageData | string;

/** An image that may be a bundled static import or a remote CMS URL. */
export interface ContentImage {
  /** Static import, absolute URL, or a `/`-rooted path served from /public. */
  src: ImageSource;
  alt: string;
  /** Required only for remote string sources - static imports infer these. */
  width?: number;
  height?: number;
  /** Low-quality base64 placeholder, when the CMS provides one. */
  blurDataURL?: string;
}

/**
 * One block of an article body. Kept as a small closed union - not raw HTML or
 * markdown - so a detail page can render it with the site's own typography
 * components no matter which resource kind it belongs to, and so the eventual
 * CMS only has to emit this same shape (a rich-text field mapped block-by-block)
 * rather than a bag of sanitized HTML.
 */
export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string; level?: 2 | 3 }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  /**
   * An illustration inside an article body.
   *
   * Exists because the CMS bodies contain them: 160 `<img>` tags across 51 of the 504
   * published blog posts, plus the press-release screenshots in `news`. Without this
   * block those posts would render as text with their diagrams silently missing.
   *
   * `src` is a plain URL string rather than `ImageSource`, and `ArticleBody` renders it
   * with a raw `<img>` rather than `next/image`, ON PURPOSE - see the note there. These
   * are editor-pasted URLs from arbitrary hosts, which is a different problem from the
   * curated art every other `ContentImage` in the app describes.
   */
  | {
      type: 'image';
      src: string;
      alt: string;
      width?: number;
      height?: number;
    };

/** Fields every publishable CMS record shares. */
export interface ContentBase {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** ISO-8601. Formatted at render time - never pre-formatted in the model. */
  publishedAt: string;
  updatedAt?: string;
  image: ContentImage;
  /** Canonical detail-page href. Absolute for links that leave the site. */
  href: string;
  external?: boolean;
  tags?: string[];
  /** Full article body, rendered on the detail page only. */
  content?: ContentBlock[];
}

export type ContentKind =
  'blog' | 'events' | 'webinars' | 'case-study' | 'news';

export interface BlogPost extends ContentBase {
  kind: 'blog';
  author?: { name: string; role?: string; avatar?: ContentImage };
  readingMinutes?: number;
  category?: string;
}

export type EventCategory = 'government' | 'conference' | 'industry';

export interface EventItem extends ContentBase {
  kind: 'events';
  category?: EventCategory;
  location?: string;
  startsAt?: string;
  endsAt?: string;
  registrationUrl?: string;
}

/**
 * One person on a webinar's panel.
 *
 * `role` is `''` when the CMS packed no role into the name; `link` is the person's
 * LinkedIn profile, which every live row supplies.
 */
export interface WebinarPerson {
  name: string;
  role: string;
  link?: string;
}

export interface WebinarItem extends ContentBase {
  kind: 'webinars';
  /**
   * The panel and the moderator, kept SEPARATE because the detail page labels them
   * separately ("The Who" / "Moderator"). They come from two different Strapi columns
   * and one of them is empty on half the live rows.
   */
  presenters?: WebinarPerson[];
  moderators?: WebinarPerson[];
  /** Headshots, in the CMS's own order - which does NOT match `presenters`. */
  presenterImages?: ContentImage[];
  /** Co-hosting organisations, e.g. "Exalate, Clovity and Carahsoft". */
  coHostedBy?: string;
  /**
   * The session date as the CMS spells it, e.g. "August 5, 2026" or "6th February
   * 2025". Rendered verbatim rather than parsed: it is a display string, and one live
   * value ("6th February 2025") is not a date any parser accepts.
   */
  whenLabel?: string;
  onDemand?: boolean;
  durationMinutes?: number;
  registrationUrl?: string;
  /** Embeddable player URL (e.g. a YouTube `/embed/...` URL). */
  videoUrl?: string;
}

export interface CaseStudyItem extends ContentBase {
  kind: 'case-study';
  client?: string;
  clientLogo?: ContentImage;
  industry?: string;
  category?: string;
  /** Headline outcomes, e.g. "50% lower infrastructure cost". */
  outcomes?: string[];
}

export interface NewsItem extends ContentBase {
  kind: 'news';
  source?: string;
}

export type ContentItem =
  BlogPost | EventItem | WebinarItem | CaseStudyItem | NewsItem;

/** One tab of the home page's "What We Learn in the Field" module. */
export interface ContentCollection {
  kind: ContentKind;
  /** Tab label, e.g. "Blog". */
  label: string;
  icon: IconName;
  /** Heading over the card rail. */
  columnTitle: string;
  columnSubtitle: string;
  /** "View More" destination. */
  moreHref: string;
  moreExternal: boolean;
  items: ContentItem[];
}

/* ── Marketing primitives used by home + interior pages ────────────────── */

/** A capability / feature card. */
export interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  /** Background photo for the AI-delivery carousel cards. */
  backgroundImage?: CardPhoto;
}

/** A background photo for the AI-delivery carousel cards. */
export type CardPhoto = ImageSource;

/** An Atlassian Marketplace app tile. */
export interface MarketplaceApp {
  id: string;
  name: string;
  description: string;
  href: string;
  logo: ContentImage;
  badge: string;
  rating?: number;
  reviewCount?: number;
  installs?: number;
  /** Renders the green FREE pill instead of stars. */
  free?: boolean;
  /** Text shown next to the rating, e.g. "New · 62 installs". */
  metaLabel: string;
}

/** A single animated metric in the results band. */
export interface StatItem {
  id: string;
  value: number;
  suffix?: string;
  label: string;
  icon: ContentImage;
  /** Scroll-reveal stagger, in seconds. */
  delay?: number;
}

/** A partner / certification badge. */
export interface CredentialBadge {
  id: string;
  name: string;
  image: ContentImage;
  /** Per-badge overrides the legacy markup applied inline. */
  imageStyle?: { height?: string; marginBottom?: string; maxWidth?: string };
}

/**
 * One row of the credentials collage.
 *
 * Rows are explicit data rather than letting one long flex row wrap, because the
 * 4 / 4 / 3 split is a design decision, not an accident of width. A single wrapping
 * row happens to break 4+3 at the desktop column width, but once the layout
 * collapses to one column below 1100px the right side gets wide enough to fit all
 * seven cards on one line - which is not the intended arrangement.
 *
 * `variant` distinguishes the top row of Atlassian partner badges, which sit bare on
 * the background, from the certification badges, which sit in white cards.
 */
export interface CredentialRow {
  id: string;
  variant: 'plain' | 'card';
  badges: CredentialBadge[];
}

/** A client logo in the marquee. */
export interface ClientLogo {
  id: string;
  name: string;
  url: string;
}

/** A "trusted by" case-study teaser card. */
export interface CustomerStory {
  id: string;
  logo: ContentImage;
  tag: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
}

/** One step in a numbered process (migration flow, AGC readiness). */
export interface ProcessStep {
  id: string;
  order: number;
  title: string;
  description: string;
  icon?: IconName;
}

/** A labelled fact in the public-sector panel. */
export interface FactItem {
  id: string;
  title: string;
  description: string;
}

/** A source system in the migration flow card. */
export interface MigrationSource {
  id: string;
  label: string;
  icon: IconName;
  /**
   * Brand tint for the glyph. Colour only - these icons sit directly on the card,
   * with no chip behind them, so there is deliberately no `background` here.
   */
  iconStyle: { color: string };
}

/** A destination benefit in the migration flow card. */
export interface MigrationBenefit {
  id: string;
  label: string;
  icon: IconName;
  toneClass: string;
}

/** A capability pill, e.g. the Pulse AI feature chips. */
export interface CapabilityChip {
  id: string;
  label: string;
  icon: IconName;
}

/** A CTA button rendered from data. */
export interface CtaLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  variant: 'primary' | 'secondary' | 'white' | 'ghost-dark' | 'white-pill';
  /**
   * Trailing glyph override. Omitted means the right-arrow every CTA on the home
   * page carries; the interior pages' CTAs use `arrow-up-right` instead, and that
   * is a per-button decision in the published markup rather than a property of the
   * variant.
   */
  icon?: IconName;
}

/* ── Interior pages: About / Careers / Contact ──────────────────────────── */

/**
 * A three-across value-prop card ("Why Clovity", "Why build your career here").
 *
 * `iconChipClass` carries the chip's background/foreground pair as Tailwind
 * classes rather than a hex pair, because the four tints in this design are a
 * fixed palette (blue / violet / orange / green) and naming them as classes keeps
 * the colour decision reviewable in the constants file instead of buried in a
 * style object.
 */
export interface PillarCard {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  iconChipClass: string;
}

/** One metric in the dark stat band. */
export interface StatBandItem {
  id: string;
  /** Rendered as-is. Not a number: the design's values are "Platinum", "24×7". */
  value: string;
  /** True for the values the design tints orange (the first cell). */
  accent?: boolean;
  label: string;
}

/** A tile in the four-up bento grid (values, benefits). */
export interface BentoTile {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  iconChipClass: string;
}

/** A step in the vertical numbered timeline (About → milestones). */
export interface MilestoneStep {
  id: string;
  /** Small uppercase kicker above the title, e.g. "Partner Tier". */
  eyebrow: string;
  title: string;
  description: string;
}

/** A numbered card in the horizontal hiring-process strip. */
export interface HiringStep {
  id: string;
  /** Watermark ordinal, e.g. "01". Two digits, so it is data not a computed index. */
  ordinal: string;
  title: string;
  description: string;
  icon: IconName;
  iconChipClass: string;
}

/**
 * A labelled group of credential badges.
 *
 * The About page shows two groups under their own uppercase labels. `variant`
 * distinguishes badges that need the tall treatment (the two Atlassian
 * specialization SVGs, which the design pulls 16px below the card) from the rest.
 */
export interface BadgeGroup {
  id: string;
  label: string;
  badges: Array<CredentialBadge & { tall?: boolean }>;
}

/** A press logo in the "Featured In" strip. */
export interface PressLogo {
  id: string;
  name: string;
  image: ContentImage;
}

/**
 * A disclosure entry in the careers FAQ.
 *
 * Named `FaqItem`, not `FaqEntry`: `types/seo.ts` already exports a `FaqEntry` that
 * feeds `faqSchema()`, and both are re-exported from `types/index.ts`. This one
 * carries an `id` for React keys; the SEO one is question/answer only.
 */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/* ── Expertise pages: ITSM & Service Management ─────────────────────────── */

/**
 * One "What we deliver" sub-service.
 *
 * Carries `points` because a service-delivery page has to say what is actually
 * inside each engagement - a title and a sentence reads as a brochure, and the
 * three concrete deliverables underneath are what a buyer scans for. Same card
 * shape as `PillarCard` otherwise, so the two share their chrome.
 */
export interface ServiceOffering {
  id: string;
  title: string;
  description: string;
  /** Three concrete deliverables, rendered as a checked list. */
  points: string[];
  icon: IconName;
  iconChipClass: string;
}

/**
 * A plain-language definition (ITSM / ITIL / ESM).
 *
 * `term` and `expansion` are separate fields, not one pre-joined string, because
 * the design sets the acronym at display size and the expansion as a small caption
 * beneath it - joining them would force the component to split them apart again.
 */
export interface GlossaryEntry {
  id: string;
  term: string;
  expansion: string;
  definition: string;
  /** What this term covers, e.g. "IT Ops · Service Desk · Engineering". */
  scope: string;
  /**
   * Nesting depth in the scope diagram - `0` is the innermost band.
   *
   * Explicit data rather than the array's index, because the reading order of the
   * definitions (ITSM first, since it is what most visitors arrive looking for) is
   * not the containment order of the diagram (ITIL innermost).
   */
  nest: number;
  icon: IconName;
  iconChipClass: string;
}

/** A non-IT department an ESM rollout extends service management to. */
export interface ServiceDepartment {
  id: string;
  name: string;
  /** The requests that department actually fields, e.g. "Onboarding". */
  examples: string[];
  icon: IconName;
  iconChipClass: string;
}

/** A product capability explained at length (the four JSM pillars). */
export interface CapabilityDetail {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  iconChipClass: string;
}

/**
 * A numbered phase in a delivery methodology.
 *
 * Structurally identical to `HiringStep` but kept separate: the two are unrelated
 * content that happens to render in the same numbered strip, and merging them would
 * couple a careers change to an expertise page.
 */
export interface DeliveryPhase {
  id: string;
  /** Watermark ordinal, e.g. "01". Data, not a computed index. */
  ordinal: string;
  title: string;
  description: string;
  icon: IconName;
  iconChipClass: string;
}

/* ── Expertise pages: DevSecOps ─────────────────────────────────────────── */

/**
 * One horizontal band of the toolchain stack.
 *
 * `tools` is plain strings, not `IconName`s: the registry has brand glyphs for a
 * handful of Atlassian products and nothing for SonarQube, Snyk or Artifactory, and
 * inventing marks for third-party products would misrepresent them. Names set as
 * chips read honestly and never go stale against a rebrand.
 */
export interface ToolchainLayer {
  id: string;
  name: string;
  purpose: string;
  tools: string[];
  icon: IconName;
  iconChipClass: string;
}

/**
 * A product in the Atlassian family strip.
 *
 * ── TWO WAYS A PRODUCT CAN RENDER ──
 * `logo` is the official lockup (icon plus wordmark in one SVG) where we have been
 * given one. Where we have not, `icon` plus `tintClass` compose an equivalent from
 * the site's own icon registry - a real glyph if one exists, a functional one
 * otherwise. That fallback exists because hand-drawing approximations of other
 * companies' trademarks misrepresents them, and a gap in the asset set should not
 * become a fake logo.
 *
 * `icon` and `tintClass` stay REQUIRED even on products that have a `logo`, so the
 * fallback is always available - and so removing a logo file can never leave a
 * product with nothing to render.
 *
 * When `logo` is present the strip must NOT also print `name` as text: the lockup
 * already contains the wordmark, and the name travels as the image's alt instead.
 */
export interface ProductBadge {
  id: string;
  name: string;
  /** Official lockup, icon + wordmark. Preferred over `icon` when present. */
  logo?: ContentImage;
  icon: IconName;
  /** Tailwind classes for the fallback tile: background and foreground together. */
  tintClass: string;
}

/**
 * One cluster on the "scaling" orbit diagram - a lifecycle stage and the tools that
 * sit in it.
 *
 * `tools` is plain strings for the same reason as `ToolchainLayer.tools`: the names
 * are honest and never go stale against a rebrand, where invented marks would be
 * neither.
 */
export interface OrbitStage {
  id: string;
  /** Uppercase stage label, e.g. "SECURE". */
  label: string;
  tools: string[];
  icon: IconName;
  tintClass: string;
}

/* ── Expertise pages: Managed Services ──────────────────────────────────── */

/**
 * One before/after pair on the managed-services page - the operating-model shift
 * (`Reactive` → `Proactive`).
 *
 * The two halves are ONE record rather than two parallel arrays because the pairing
 * is the entire point - each "after" answers its own "before". Two arrays could fall
 * out of order and the section would still render, just saying the wrong thing.
 */
export interface ShiftPair {
  id: string;
  /** Row label, e.g. "Platform reviews". */
  aspect?: string;
  /** The state without anyone owning the platform. */
  before: string;
  /** What replaces it. */
  after: string;
}

/**
 * One discipline on the embedded pod's bench.
 *
 * `depth` is prose, not a seniority enum: what a buyer needs to know is what the
 * person actually does, and a "Senior"/"Lead" label communicates payroll rather than
 * capability.
 */
export interface BenchRole {
  id: string;
  role: string;
  /** What this discipline covers on your instance. */
  depth: string;
  icon: IconName;
  iconChipClass: string;
}

/* ── Expertise pages: AI Solutions ──────────────────────────────────────── */

/**
 * One place AI shows up inside another Clovity practice, on the AI page's
 * "not a silo" section.
 *
 * `href` is REQUIRED, and that is the whole point of the type: the claim is that AI runs
 * through the other engagements rather than being sold beside them, and a claim like that is
 * only credible if each item is a live link to the page that actually delivers it. A version
 * of this with no destinations would be a list of adjectives.
 *
 * `practice` is the other page's own name, so the two never drift into describing the same
 * service differently; `effect` is what AI specifically changes there, which is the part this
 * page is responsible for saying.
 */
export interface AiTouchpoint {
  id: string;
  /** The other practice's name, matching its own page. */
  practice: string;
  /** What AI specifically changes in that practice. */
  effect: string;
  href: string;
  icon: IconName;
  iconChipClass: string;
}

/* ── Expertise pages: Workforce Solutions ───────────────────────────────── */

/**
 * One way of closing a skill gap, on the workforce page's three-way comparison.
 *
 * ── WHY `tradeoff` IS A REQUIRED FIELD ──
 * A comparison where only the recommended column has a downside is an advert, not a
 * comparison, and a reader who has actually hired before spots that instantly. Making
 * the cost of each route mandatory means the option this page is selling has to state
 * its own limitation in the same breath as the other two - so the type enforces the
 * argument's honesty rather than leaving it to whoever edits the copy.
 *
 * `emphasis` marks the column the page recommends. It drives the tint only; it must
 * never suppress `tradeoff`.
 */
export interface SourcingOption {
  id: string;
  /** Route name, e.g. "Hire a full-time specialist". */
  route: string;
  /** What this route is good for, in one sentence. */
  strength: string;
  /** What it costs you - time, capability breadth, or continuity. */
  tradeoff: string;
  /** True for the column this page recommends. Tint only. */
  emphasis?: boolean;
  icon: IconName;
  iconChipClass: string;
}

/**
 * One side of the Workforce / Managed Services contrast panel.
 *
 * The two offers overlap - both put Clovity engineers inside a client's Atlassian
 * estate - so the page that sells one has to say plainly where the other one starts.
 * `owns` is the discriminator that actually separates them (who holds the platform),
 * and it is a required field for that reason: a contrast panel whose two halves do not
 * name their difference is decoration.
 */
export interface EngagementContrast {
  id: string;
  /** Offer name, e.g. "Workforce Solutions". */
  title: string;
  /** Who owns the platform under this model, in a few words. */
  owns: string;
  description: string;
  /** What the client gets, three or four concrete items. */
  points: string[];
  /** The one-line test for choosing this side. */
  chooseWhen: string;
  /** Set on the offer that is NOT this page, so it can link out to it. */
  href?: string;
  icon: IconName;
  iconChipClass: string;
  /** True for the offer this page is about - drives the accented treatment. */
  current?: boolean;
}

/**
 * A career opening.
 *
 * Maps 1:1 onto the Strapi `job` content type, plus two derived fields the design
 * needs and the CMS does not store:
 *  • `trackTagClass` - the pill tint for the track, resolved from a fixed palette.
 *  • `applyHref` - the prefilled mailto the design's "Apply Now" button uses.
 */
export interface JobOpening {
  id: string;
  slug: string;
  title: string;
  /** Strapi `track`. Empty string when an editor left it unset. */
  track: string;
  /** Display label for the track pill; falls back to a generic label. */
  trackLabel: string;
  trackTagClass: string;
  location: string;
  /**
   * Employment type chip, e.g. Full-time / Contract.
   *
   * NOT a Strapi field - the `job` content type has no column for it. It exists so
   * the bundled fallback roles can render the second meta chip the published page
   * shows; CMS-sourced roles fill that slot with `experience` instead.
   */
  employmentType?: { label: string; icon: IconName };
  /** Strapi `experience`, e.g. "5-8". Rendered as "N Years" by the card. */
  experience?: string;
  practice?: string;
  /** Strapi `job_description` (markdown). Clamped to three lines by the card. */
  description: string;
  applyHref: string;
}

/** A filter tab over `JobOpening.track`. `id` of `'all'` clears the filter. */
export interface JobTrackFilter {
  id: string;
  label: string;
}

/** A culture highlight from the Strapi `life-at-clovity` collection. */
export interface CultureHighlight {
  id: string;
  headingLead: string;
  headingHighlight?: string;
  info: string;
  image: ContentImage | null;
  href?: string;
}

/**
 * A flip-card office on the Contact page.
 *
 * `accent` tints the back face's text/border colour; it is not a free-form
 * colour. Both faces render the same `image` - the front plain, the back
 * under a dark scrim with the address on top - matching `website-t`'s
 * `FlipCard`.
 */
export interface OfficeLocation {
  id: string;
  /** Front face: the uppercase kicker, e.g. "Global HQ". */
  tag: string;
  /** Front face: the city line. */
  city: string;
  /** The office/city photo shown on both faces. */
  image: ContentImage;
  accent: 'blue' | 'violet' | 'orange' | 'green';
  /** Back face heading. */
  title: string;
  /** Back face address, one entry per rendered line. */
  addressLines: string[];
  email?: string;
  /** Shown in place of the email link for offices without a direct address. */
  noEmailNote?: string;
}

/** A direct-contact row in the Contact page's side card. */
export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  /** Absent for rows that are not actionable (a city name). */
  href?: string;
  icon: IconName;
}

/**
 * Contact form configuration, from the Strapi `get-in-touch` row whose
 * `website_slug` matches the page.
 *
 * Lets an editor hide a field or make it optional without a deploy. `emailSubject`
 * is what the lead record is tagged with, so enquiries from different pages stay
 * distinguishable in the admin panel.
 */
export interface ContactFormConfig {
  /** Strapi `documentId`, recorded on the lead so it can be traced back. */
  sourceId?: string;
  emailSubject: string;
  showFullName: boolean;
  requireFullName: boolean;
  showCompany: boolean;
  requireCompany: boolean;
  showPhone: boolean;
  requirePhone: boolean;
}
