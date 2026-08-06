import type { Metadata } from 'next';

/** Input accepted by `buildMetadata()` in src/lib/seo.ts. */
export interface SeoInput {
  title: string;
  description: string;
  /** Route path, `/`-rooted. Used for the canonical and OG URL. */
  path: string;
  keywords?: string[];
  /** Absolute or `/`-rooted OG image. Falls back to the site default. */
  image?: string;
  imageAlt?: string;
  /** `website` for landing pages, `article` for blog/news/case-study detail. */
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  /** Set true for thank-you pages, previews and paginated duplicates. */
  noIndex?: boolean;
}

export type PageMetadata = Metadata;

/** A single crumb in a breadcrumb trail (and its JSON-LD counterpart). */
export interface BreadcrumbItem {
  name: string;
  href: string;
}

/** Question/answer pair used by both the FAQ UI and FAQPage JSON-LD. */
export interface FaqEntry {
  question: string;
  answer: string;
}
