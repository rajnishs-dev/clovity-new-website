/**
 * Every REST path the frontend will call, in one map.
 *
 * Paths mirror the resources the phase-2 admin panel will expose (CMS, blogs,
 * services, industries, events, careers, testimonials, contact, media, SEO,
 * settings). Nothing here is called until `NEXT_PUBLIC_ENABLE_CMS=true`; until
 * then the data layer serves the bundled static content instead.
 *
 * Keeping these as functions (not template strings scattered in components)
 * means a backend route rename is a one-line change.
 */
export const ENDPOINTS = {
  /* ── Content ────────────────────────────────────────────────────────── */
  blogs: {
    list: () => '/content/blogs',
    detail: (slug: string) => `/content/blogs/${encodeURIComponent(slug)}`,
    related: (slug: string) =>
      `/content/blogs/${encodeURIComponent(slug)}/related`,
  },
  caseStudies: {
    list: () => '/content/case-studies',
    detail: (slug: string) =>
      `/content/case-studies/${encodeURIComponent(slug)}`,
  },
  events: {
    list: () => '/content/events',
    detail: (slug: string) => `/content/events/${encodeURIComponent(slug)}`,
  },
  webinars: {
    list: () => '/content/webinars',
    detail: (slug: string) => `/content/webinars/${encodeURIComponent(slug)}`,
  },
  news: {
    list: () => '/content/news',
    detail: (slug: string) => `/content/news/${encodeURIComponent(slug)}`,
  },

  /* ── Marketing structure ────────────────────────────────────────────── */
  pages: {
    bySlug: (slug: string) => `/pages/${encodeURIComponent(slug)}`,
    sections: (slug: string) => `/pages/${encodeURIComponent(slug)}/sections`,
  },
  services: {
    list: () => '/services',
    detail: (slug: string) => `/services/${encodeURIComponent(slug)}`,
  },
  industries: {
    list: () => '/industries',
    detail: (slug: string) => `/industries/${encodeURIComponent(slug)}`,
  },
  solutions: {
    list: () => '/solutions',
    detail: (slug: string) => `/solutions/${encodeURIComponent(slug)}`,
  },
  marketplaceApps: {
    list: () => '/marketplace-apps',
  },
  testimonials: {
    list: () => '/testimonials',
  },
  clients: {
    logos: () => '/clients/logos',
    stories: () => '/clients/stories',
  },
  credentials: {
    list: () => '/credentials',
  },
  statistics: {
    list: () => '/statistics',
  },

  /* ── Careers ────────────────────────────────────────────────────────── */
  careers: {
    list: () => '/careers/openings',
    detail: (slug: string) => `/careers/openings/${encodeURIComponent(slug)}`,
    apply: (slug: string) =>
      `/careers/openings/${encodeURIComponent(slug)}/applications`,
  },

  /* ── Forms ──────────────────────────────────────────────────────────── */
  contact: {
    submit: () => '/contact/submissions',
  },
  newsletter: {
    subscribe: () => '/newsletter/subscriptions',
  },

  /* ── Site-wide ──────────────────────────────────────────────────────── */
  navigation: {
    tree: () => '/navigation',
  },
  settings: {
    site: () => '/settings/site',
  },
  seo: {
    byPath: (path: string) => `/seo?path=${encodeURIComponent(path)}`,
  },
  search: {
    query: () => '/search',
  },
} as const;

export type Endpoints = typeof ENDPOINTS;
