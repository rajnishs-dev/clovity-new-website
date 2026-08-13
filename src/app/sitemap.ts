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
 * Static routes come from `SITEMAP_ROUTES`; detail pages are listed from the
 * CMS, each with its own `lastModified` from the row's `updatedAt`. Static
 * routes use build time for `lastModified`, which is honest for prerendered
 * marketing pages.
 *
 * A CMS outage doesn't empty this: every loader falls back to bundled
 * content, so the worst case is a short sitemap, never a broken one.
 */
export const revalidate = 3600;

/** Detail pages change when an editor republishes; the listing pages, more often. */
const DETAIL_CHANGE_FREQUENCY = 'monthly' as const;
const DETAIL_PRIORITY = 0.6;

/**
 * Guarded because `new Date('')` is an Invalid Date, which serializes to an
 * empty attribute and invalidates the whole document - reachable since
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
