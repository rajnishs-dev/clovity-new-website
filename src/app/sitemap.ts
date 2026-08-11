import type { MetadataRoute } from 'next';
import { SITEMAP_ROUTES } from '@/constants/routes';
import { siteConfig } from '@/constants/site';
import type { ContentBase } from '@/types/content';
import { getBlogPosts } from '@/data/blog';
import { getCaseStudyItems } from '@/data/case-study';
import { getEventItems } from '@/data/events';
import { getNewsItems } from '@/data/news';
import { getWebinarItems } from '@/data/webinars';

/**
 * XML sitemap.
 *
 * Static routes come from `SITEMAP_ROUTES`, so adding a page means adding one
 * entry there instead of remembering to touch a separate file. That list already
 * carries the five resource LISTING routes; what follows adds their detail pages.
 *
 * DETAIL ROUTES ARE LISTED FROM THE CMS, each with its own `lastModified` from the row's
 * `updatedAt`. Until the CMS was wired up these pages were absent entirely, leaving
 * several hundred articles discoverable only by crawling links.
 *
 * Static routes still use build time for `lastModified`, which is honest for prerendered
 * marketing pages - they genuinely change when the site is rebuilt.
 *
 * A CMS OUTAGE DOES NOT EMPTY THIS: every loader falls back to bundled content, so the
 * worst case is a short sitemap, never a broken one.
 */
export const revalidate = 3600;

/** Detail pages change when an editor republishes; the listing pages, more often. */
const DETAIL_CHANGE_FREQUENCY = 'monthly' as const;
const DETAIL_PRIORITY = 0.6;

/**
 * `lastModified` for one item.
 *
 * Guarded because `new Date('')` is an Invalid Date, which serialises to an empty
 * attribute and makes the whole document invalid - and an empty date is reachable, since
 * `publishedAt` is only as good as the CMS row behind it.
 */
function lastModifiedOf(item: ContentBase, fallback: Date): Date {
  const stamp = new Date(item.updatedAt ?? item.publishedAt ?? '');
  return Number.isNaN(stamp.getTime()) ? fallback : stamp;
}

function toEntries(
  items: ContentBase[],
  fallback: Date,
): MetadataRoute.Sitemap {
  return items
    // An item whose canonical URL leaves this site does not belong in this sitemap.
    .filter((item) => !item.external && item.href.startsWith('/'))
    .map((item) => ({
      // `encodeURI`, because a sitemap must carry ASCII URLs and CMS slugs do not
      // guarantee it - one live news slug contains typographic quotation marks, which
      // would make the whole XML document invalid if emitted raw.
      url: encodeURI(`${siteConfig.url}${item.href}`),
      lastModified: lastModifiedOf(item, fallback),
      changeFrequency: DETAIL_CHANGE_FREQUENCY,
      priority: DETAIL_PRIORITY,
    }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();

  const collections = await Promise.all([
    getBlogPosts(),
    getNewsItems(),
    getEventItems(),
    getWebinarItems(),
    getCaseStudyItems(),
  ]);

  return [
    ...SITEMAP_ROUTES.map((route) => ({
      url: `${siteConfig.url}${route.path === '/' ? '' : route.path}`,
      lastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...collections.flatMap((items) => toEntries(items, lastModified)),
  ];
}
