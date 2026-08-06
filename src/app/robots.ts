import type { MetadataRoute } from 'next';
import { env } from '@/config/env';
import { siteConfig } from '@/config/site';

/**
 * robots.txt, generated rather than hand-maintained so the sitemap URL can never
 * drift from the actual origin.
 *
 * Preview and staging deployments set `NEXT_PUBLIC_ALLOW_INDEXING=false` and are
 * fully disallowed — a preview URL competing with production in search results is
 * a real and surprisingly common SEO problem.
 */
export default function robots(): MetadataRoute.Robots {
  if (!env.allowIndexing) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Nothing user-facing lives under these; keep them out of the index.
        disallow: ['/api/', '/_next/', '/search?'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
