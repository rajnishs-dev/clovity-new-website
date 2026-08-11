import type {
  ClientLogo,
  ContentCollection,
  CredentialRow,
  CustomerStory,
  MarketplaceApp,
  StatItem,
} from '@/types/content';
import { CLIENT_LOGOS } from '@/constants/clients';
import { CONTENT_COLLECTIONS } from '@/constants/content';
import {
  CREDENTIAL_ROWS,
  CUSTOMER_STORIES,
  MARKETPLACE_APPS,
  RESULT_STATS,
} from '@/constants/home';

/**
 * The home page's data layer.
 *
 * ALL BUNDLED CONTENT TODAY, and honestly so. This used to route every loader
 * through an API-with-fallback seam pointed at a Node/Express admin panel that was
 * never built: `NEXT_PUBLIC_API_BASE_URL` has never been set, so `isApiConfigured()`
 * was always false and every one of these calls short-circuited straight to the
 * constant below without a request. Seven files of transport code that only ever
 * returned "not configured".
 *
 * That layer is gone. What is left says what actually happens.
 *
 * NONE OF THIS IS IN STRAPI EITHER — `clovity-admin` has no collection for customer
 * stories, client logos, marketplace apps, result statistics or credential badges, so
 * there is nothing to fetch even now. The three CMS-backed pages read
 * `@/api/cms`; when a collection appears for one of these, the change is to swap the
 * body of the matching function here, and no component moves.
 *
 * The loaders stay async so the page keeps awaiting them and turning on a real
 * source does not touch a single call site.
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

/** The five tabbed collections of the "What We Learn in the Field" module. */
export async function getContentCollections(): Promise<ContentCollection[]> {
  return CONTENT_COLLECTIONS;
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
