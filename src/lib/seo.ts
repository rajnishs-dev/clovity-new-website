import type { Metadata } from 'next';
import { env } from '@/constants/env';
import { siteConfig } from '@/constants/site';
import type { SeoInput } from '@/types/seo';

/** Turn a `/`-rooted path into an absolute URL on the canonical origin. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${suffix === '/' ? '' : suffix}`;
}

/**
 * Build a complete Next.js `Metadata` object: canonical URL, Open Graph,
 * Twitter card and robots directives, all derived from one small input.
 *
 * Every page exports `metadata` (static) or `generateMetadata` (dynamic) built
 * through this helper, so no page can ship a missing canonical or OG image.
 */
export function buildMetadata(input: SeoInput): Metadata {
  const {
    title,
    description,
    path,
    keywords,
    image,
    imageAlt,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
    noIndex = false,
  } = input;

  const url = absoluteUrl(path);
  const ogImageUrl = absoluteUrl(image ?? siteConfig.ogImage.url);
  const indexable = env.allowIndexing && !noIndex;

  return {
    title,
    description,
    keywords: [...(keywords ?? []), ...siteConfig.keywords],
    applicationName: siteConfig.name,
    authors: (authors ?? [siteConfig.legalName]).map((name) => ({ name })),
    creator: siteConfig.legalName,
    publisher: siteConfig.legalName,
    metadataBase: new URL(siteConfig.url),

    alternates: {
      canonical: url,
    },

    openGraph: {
      type,
      url,
      siteName: siteConfig.name,
      title,
      description,
      locale: siteConfig.locale,
      images: [
        {
          url: ogImageUrl,
          width: siteConfig.ogImage.width,
          height: siteConfig.ogImage.height,
          alt: imageAlt ?? siteConfig.ogImage.alt,
        },
      ],
      ...(type === 'article'
        ? {
            publishedTime,
            modifiedTime,
            authors: authors ?? [siteConfig.legalName],
          }
        : {}),
    },

    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitter.site,
      creator: siteConfig.twitter.creator,
      title,
      description,
      images: [ogImageUrl],
    },

    robots: indexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        }
      : { index: false, follow: false, nocache: true },

    ...(siteConfig.name && env.googleSiteVerification
      ? { verification: { google: env.googleSiteVerification } }
      : {}),

    formatDetection: { email: false, address: false, telephone: false },
  };
}
