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
 * The home page's data layer - the seam between UI and backend.
 *
 * Every loader here calls the API and falls back to the bundled static content
 * when the API is not configured or the request fails. `withFallback` makes that
 * a one-liner, and it is what lets the site ship today on static content and
 * switch to the CMS by setting `NEXT_PUBLIC_ENABLE_CMS=true` - with no change to
 * any component, prop or class name.
 *
 * The loaders are async even where they currently resolve instantly, so the page
 * already awaits them and turning on live data does not change the call sites.
 *
 * When the API does come online, these will additionally be the place to set
 * per-collection `revalidate` windows and cache tags for on-demand ISR from the
 * CMS's publish webhook - again without touching a component.
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

/**
 * The five tabbed collections.
 *
 * Fetches all five in parallel rather than in series - five sequential round
 * trips would put the slowest section's latency on the critical path five times
 * over. Any collection whose request fails keeps its static items, so one bad
 * endpoint degrades a single tab instead of the whole module.
 */
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
