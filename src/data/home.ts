import type {
  ClientLogo,
  ContentCollection,
  ContentItem,
  ContentKind,
  CredentialRow,
  CustomerStory,
  MarketplaceApp,
  StatItem,
} from '@/types/content';
import { CLIENT_LOGOS } from '@/constants/clients';
import { CONTENT_COLLECTION_TABS } from '@/constants/content';
import {
  CREDENTIAL_ROWS,
  CUSTOMER_STORIES,
  MARKETPLACE_APPS,
  RESULT_STATS,
} from '@/constants/home';
import { getBlogPosts } from './blog';
import { getCaseStudyItems } from './case-study';
import { getEventItems } from './events';
import { getNewsItems } from './news';
import { getWebinarItems } from './webinars';

/**
 * The home page's data layer.
 *
 * The "What We Learn in the Field" module reads the CMS (see
 * `getContentCollections`). Everything else on this page - the customer stories, the
 * client logos, the Marketplace tiles, the result counters, the credential badges - is
 * bundled content, because no Strapi collection holds it.
 */

export async function getCustomerStories(): Promise<CustomerStory[]> {
  return CUSTOMER_STORIES;
}

export async function getClientLogos(): Promise<ClientLogo[]> {
  return CLIENT_LOGOS;
}

export async function getMarketplaceApps(): Promise<MarketplaceApp[]> {
  return MARKETPLACE_APPS;
}

export async function getResultStats(): Promise<StatItem[]> {
  return RESULT_STATS;
}

export async function getCredentialRows(): Promise<CredentialRow[]> {
  return CREDENTIAL_ROWS;
}

/** Cards per tab in the Field Notes rail. The rail shows two at a time and scrolls. */
const FIELD_NOTES_PER_TAB = 4;

/**
 * The five tabbed collections, newest first, from the CMS.
 *
 * REUSES THE LISTING PAGES' LOADERS rather than querying Strapi again. Three things
 * follow from that, and all three are the reason it is written this way:
 *
 *  • Each loader is wrapped in `cache()`, so a request that renders both this module
 *    and anything else needing the same collection pays for one fetch, not two.
 *  • Each loader already falls back to its bundled content, so a CMS outage degrades
 *    this module to the same seeded items `/blog` and `/news` show - never to an empty
 *    tab, and never inconsistently with the page the "View More" button leads to.
 *  • The cards' `href`s are the ones the mappers built, so every card links to this
 *    site's own detail page. They used to point at `clovity.com` or at `#`.
 *
 * All five load in parallel: in series, the slowest collection's latency would land on
 * the critical path five times over.
 *
 * Ordering is whatever each loader returns, which is newest-first in every case
 * (`blog_date:desc`, `startDateTime:desc`, `createdAt:desc`), so the four latest is a
 * `slice` and not a re-sort.
 */
export async function getContentCollections(): Promise<ContentCollection[]> {
  const [posts, events, webinars, caseStudies, news] = await Promise.all([
    getBlogPosts(),
    getEventItems(),
    getWebinarItems(),
    getCaseStudyItems(),
    getNewsItems(),
  ]);

  const itemsByKind: Record<ContentKind, ContentItem[]> = {
    blog: posts,
    events,
    webinars,
    'case-study': caseStudies,
    news,
  };

  return CONTENT_COLLECTION_TABS.map((tab) => ({
    ...tab,
    items: itemsByKind[tab.kind].slice(0, FIELD_NOTES_PER_TAB),
  }));
}

/** Everything the home page needs, resolved in parallel. */
export async function getHomePageData() {
  const [stories, logos, apps, stats, credentialRows, collections] =
    await Promise.all([
      getCustomerStories(),
      getClientLogos(),
      getMarketplaceApps(),
      getResultStats(),
      getCredentialRows(),
      getContentCollections(),
    ]);

  return { stories, logos, apps, stats, credentialRows, collections };
}
