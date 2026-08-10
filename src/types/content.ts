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
  | { type: 'quote'; text: string; cite?: string };

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

export interface WebinarItem extends ContentBase {
  kind: 'webinars';
  presenters?: { name: string; role: string }[];
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
  variant: 'primary' | 'secondary' | 'white' | 'ghost-dark';
}
