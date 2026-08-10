import type { MetadataRoute } from 'next';
import { SITEMAP_ROUTES } from '@/config/routes';
import { siteConfig } from '@/config/site';

/**
 * XML sitemap.
 *
 * Static routes come from `SITEMAP_ROUTES`, so adding a page means adding one
 * entry there instead of remembering to touch a separate file.
 *
 * `lastModified` uses build time. That is honest for statically prerendered
 * marketing pages - they genuinely change when the site is rebuilt. Once the CMS
 * is live, the per-item `updatedAt` should be appended here for blog, news,
 * events and case-study detail routes; the per-feature data loaders already
 * return that field.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return SITEMAP_ROUTES.map((route) => ({
    url: `${siteConfig.url}${route.path === '/' ? '' : route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
