import { siteConfig } from '@/constants/site';
import type { BreadcrumbItem, FaqEntry } from '@/types/seo';
import { absoluteUrl } from './seo';

/**
 * schema.org JSON-LD builders.
 *
 * Returned as plain objects and rendered by <JsonLd /> so a page can compose
 * several graphs (Organization + WebSite + Breadcrumb) without duplicating
 * boilerplate. Keeping these typed as `Record<string, unknown>` is deliberate:
 * schema.org is open-ended and over-typing it fights the spec.
 */
export type JsonLdObject = Record<string, unknown>;

const SCHEMA_CONTEXT = 'https://schema.org' as const;

/** Stable @id values so nodes can reference each other across graphs. */
export const SCHEMA_IDS = {
  organization: `${siteConfig.url}/#organization`,
  website: `${siteConfig.url}/#website`,
} as const;

export function organizationSchema(): JsonLdObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Organization',
    '@id': SCHEMA_IDS.organization,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/assets/og/clovity-logo.png'),
    },
    description: siteConfig.description,
    foundingDate: String(siteConfig.foundingYear),
    sameAs: siteConfig.social.map((s) => s.href),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: siteConfig.contact.salesEmail,
        availableLanguage: ['English'],
      },
    ],
  };
}

export function websiteSchema(): JsonLdObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite',
    '@id': SCHEMA_IDS.website,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: { '@id': SCHEMA_IDS.organization },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function faqSchema(entries: FaqEntry[]): JsonLdObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

export interface ArticleSchemaInput {
  headline: string;
  description: string;
  path: string;
  image: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
  section?: string;
  tags?: string[];
}

export function articleSchema(input: ArticleSchemaInput): JsonLdObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    image: [absoluteUrl(input.image)],
    datePublished: input.publishedAt,
    dateModified: input.updatedAt ?? input.publishedAt,
    author: {
      '@type': input.authorName ? 'Person' : 'Organization',
      name: input.authorName ?? siteConfig.legalName,
    },
    publisher: { '@id': SCHEMA_IDS.organization },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(input.path),
    },
    ...(input.section ? { articleSection: input.section } : {}),
    ...(input.tags?.length ? { keywords: input.tags.join(', ') } : {}),
  };
}

export interface ServiceSchemaInput {
  name: string;
  description: string;
  path: string;
  serviceType: string;
}

export function serviceSchema(input: ServiceSchemaInput): JsonLdObject {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Service',
    name: input.name,
    description: input.description,
    serviceType: input.serviceType,
    provider: { '@id': SCHEMA_IDS.organization },
    url: absoluteUrl(input.path),
    areaServed: { '@type': 'Country', name: 'United States' },
  };
}
