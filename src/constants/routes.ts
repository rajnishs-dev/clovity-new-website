/**
 * Every internal route in one place. Components import from here instead of
 * hard-coding strings, so a URL change is a one-line edit and `next/link`
 * always receives a path that actually exists.
 */
export const ROUTES = {
  home: '/',

  expertise: {
    atlassian: '/expertise/atlassian',
    ai: '/expertise/ai',
    itsm: '/expertise/itsm',
    devsecops: '/expertise/devsecops',
    cloudMigration: '/expertise/cloud-migration',
    managedServices: '/expertise/managed-services',
    workforce: '/expertise/workforce',
    marketplaceApps: '/expertise/marketplace-apps',
  },

  resources: {
    blog: '/blog',
    caseStudy: '/case-study',
    events: '/events',
    webinars: '/webinars',
    news: '/news',
  },

  discover: {
    about: '/about-us',
    careers: '/careers',
    contact: '/contact',
  },
} as const;

/** Off-site destinations the legacy markup links to. */
export const EXTERNAL_LINKS = {
  appSupport: 'https://clovity-help-center.vercel.app/',
  marketplaceSearch:
    'https://marketplace.atlassian.com/search?query=by%20clovity',
  pulseAiListing:
    'https://marketplace.atlassian.com/apps/3640865514/pulse-ai-the-ai-that-finds-problems-agents-that-fix-them',
  pulseAiCollateral:
    'https://clovity-apps-collateral.vercel.app/apps/pulse-ai-jira/what-is-pulse-ai',
  timeTrackingListing:
    'https://marketplace.atlassian.com/apps/877949909/time-tracking-resource-planning-project-management',
  contentFormattingListing:
    'https://marketplace.atlassian.com/apps/3890258352/content-formatting-macros-tabs-navigation-visibility-css',
  dashboardTemplatesListing:
    'https://marketplace.atlassian.com/apps/359777765/dashboard-templates-charts-graphs-reports-for-jira',
  aiAppsStudio: 'https://clovity.com/clovity-ai-apps-studio',
  /**
   * Pages that exist on the production site but not yet in this app.
   *
   * `/case-study` and `/life-at-clovity` are linked from the careers cards' "About
   * Us" and "Our Benefits" copy. Routing them internally would 404 - `/case-study`
   * is declared in ROUTES but has no page yet, and `/life-at-clovity` has no route
   * at all - so they point at the live pages until those are migrated.
   */
  legacyCaseStudy: 'https://www.clovity.com/case-study',
  legacyLifeAtClovity: 'https://www.clovity.com/life-at-clovity',
  /** Third-party coverage cited in the careers "About Us" copy. */
  cioReviewProfile:
    'https://internet-of-things.cioreview.com/vendor/2019/clovity',
  yahooFinanceFeature:
    'https://www.yahoo.com/lifestyle/clovity-named-global-iot-innovation-141500302.html',
  legacyBlog: 'https://www.clovity.com/blog',
  legacyEvents: 'https://www.clovity.com/events',
  legacyWebinars: 'https://www.clovity.com/webinars',
  legacyNews: 'https://www.clovity.com/news',
} as const;

/**
 * Every path this application actually serves.
 *
 * Used to decide whether an absolute `https://clovity.com/...` URL from the legacy
 * markup can be handed to `next/link` or has to stay a real navigation. Several
 * legacy CTAs point at pages that live on the production site but are not part of
 * this app at all (`/clovity-ai-apps-studio`), and routing those client-side turns
 * a working link into a 404.
 */
const APP_ROUTE_PATHS: ReadonlySet<string> = new Set<string>([
  ROUTES.home,
  ...Object.values(ROUTES.expertise),
  ...Object.values(ROUTES.resources),
  ...Object.values(ROUTES.discover),
]);

/** True when `path` is a route this app defines. Ignores query and hash. */
export function isAppRoute(path: string): boolean {
  const clean = path.split('?')[0]?.split('#')[0] ?? '';
  if (clean === '' || clean === '/') return true;
  // Tolerate a trailing slash.
  const normalized = clean.length > 1 ? clean.replace(/\/$/, '') : clean;
  return APP_ROUTE_PATHS.has(normalized);
}

/** Routes that belong in the XML sitemap, with their crawl priorities. */
export const SITEMAP_ROUTES: ReadonlyArray<{
  path: string;
  priority: number;
  changeFrequency:
    'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}> = [
  { path: ROUTES.home, priority: 1.0, changeFrequency: 'weekly' },
  {
    path: ROUTES.expertise.atlassian,
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  { path: ROUTES.expertise.ai, priority: 0.9, changeFrequency: 'monthly' },
  { path: ROUTES.expertise.itsm, priority: 0.8, changeFrequency: 'monthly' },
  {
    path: ROUTES.expertise.devsecops,
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  {
    path: ROUTES.expertise.cloudMigration,
    priority: 0.9,
    changeFrequency: 'monthly',
  },
  {
    path: ROUTES.expertise.managedServices,
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  {
    path: ROUTES.expertise.workforce,
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  {
    path: ROUTES.expertise.marketplaceApps,
    priority: 0.8,
    changeFrequency: 'monthly',
  },
  { path: ROUTES.resources.blog, priority: 0.8, changeFrequency: 'daily' },
  {
    path: ROUTES.resources.caseStudy,
    priority: 0.8,
    changeFrequency: 'weekly',
  },
  { path: ROUTES.resources.events, priority: 0.7, changeFrequency: 'weekly' },
  { path: ROUTES.resources.webinars, priority: 0.7, changeFrequency: 'weekly' },
  { path: ROUTES.resources.news, priority: 0.7, changeFrequency: 'weekly' },
  { path: ROUTES.discover.about, priority: 0.7, changeFrequency: 'monthly' },
  { path: ROUTES.discover.careers, priority: 0.7, changeFrequency: 'weekly' },
  { path: ROUTES.discover.contact, priority: 0.6, changeFrequency: 'yearly' },
];
