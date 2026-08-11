import { z } from 'zod';

/**
 * Environment access is centralised and validated here so a typo in a deploy
 * variable fails loudly at boot instead of silently rendering a broken page.
 *
 * Only `NEXT_PUBLIC_*` values may be read from client components. The server
 * block is guarded so importing it in the browser cannot leak a secret.
 */

const booleanish = z
  .enum(['true', 'false', '1', '0', ''])
  .transform((v) => v === 'true' || v === '1');

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url()
    .default('https://www.clovity.com')
    // Strip a trailing slash so URL joins never double up.
    .transform((v) => v.replace(/\/$/, '')),
  /** Milliseconds before a CMS request is aborted. */
  NEXT_PUBLIC_API_TIMEOUT: z.coerce.number().int().positive().default(15_000),
  NEXT_PUBLIC_ALLOW_INDEXING: booleanish.default(true),
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().default(''),

  /**
   * ── Strapi (clovity-admin) ──
   *
   * The site's only backend. `NEXT_PUBLIC_API_BASE_URL` and
   * `NEXT_PUBLIC_ENABLE_CMS` used to sit here for a second one — a Node/Express
   * admin panel — that was never built; neither was ever set, so every call through
   * it short-circuited. Both are gone along with that layer.
   *
   * Not `.url()` — an empty string is the valid "CMS off" state, and a URL
   * refinement on a default of `''` would fail the whole boot for every
   * environment that has not wired Strapi up yet.
   */
  NEXT_PUBLIC_CMS_API_URL: z
    .string()
    .default('')
    .transform((v) => v.trim().replace(/\/$/, '')),
  /**
   * ⚠ THE STRAPI TOKEN IS DELIBERATELY NOT READ HERE.
   *
   * Anything this file touches gets inlined into the CLIENT bundle, because
   * `config/site.ts` and `store/index.ts` import it and both reach client
   * components. Reading `process.env.NEXT_PUBLIC_CMS_API_TOKEN` here put a
   * write-capable Strapi token into a public JS chunk — verified by grepping the
   * built chunks for it. Next inlines `NEXT_PUBLIC_*` as a build-time text
   * substitution, so it happens even inside a function that never runs in the
   * browser.
   *
   * Both tokens now live in `api/cms.ts` — the private one is only reachable
   * there on the server. See the note on `authToken()`.
   */
  /**
   * Origin that serves Strapi's uploaded media, when it differs from the API
   * origin — the S3 upload provider in `clovity-admin` returns absolute URLs, but
   * the local provider returns `/uploads/…` paths that need a base.
   */
  NEXT_PUBLIC_CMS_MEDIA_URL: z
    .string()
    .default('')
    .transform((v) => v.trim().replace(/\/$/, '')),
});

const parsedPublic = publicSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
  NEXT_PUBLIC_ALLOW_INDEXING: process.env.NEXT_PUBLIC_ALLOW_INDEXING,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  NEXT_PUBLIC_CMS_API_URL: process.env.NEXT_PUBLIC_CMS_API_URL,
  NEXT_PUBLIC_CMS_MEDIA_URL: process.env.NEXT_PUBLIC_CMS_MEDIA_URL,
});

if (!parsedPublic.success) {
  throw new Error(
    `Invalid public environment configuration:\n${parsedPublic.error.issues
      .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
      .join('\n')}`,
  );
}

export const env = {
  siteUrl: parsedPublic.data.NEXT_PUBLIC_SITE_URL,
  apiTimeout: parsedPublic.data.NEXT_PUBLIC_API_TIMEOUT,
  allowIndexing: parsedPublic.data.NEXT_PUBLIC_ALLOW_INDEXING,
  googleSiteVerification:
    parsedPublic.data.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,

  /**
   * Strapi settings, grouped so a caller reads `env.strapi.enabled` rather than
   * re-deriving "is a base URL present" at each call site.
   *
   */
  strapi: {
    url: parsedPublic.data.NEXT_PUBLIC_CMS_API_URL,
    // No `token` — see the note in the schema above. Both are read in `api/cms.ts`.
    /** Falls back to the API origin, which is where Strapi serves /uploads. */
    mediaUrl:
      parsedPublic.data.NEXT_PUBLIC_CMS_MEDIA_URL ||
      parsedPublic.data.NEXT_PUBLIC_CMS_API_URL,
    /** A configured URL IS the switch — the same rule the legacy frontend used. */
    enabled: parsedPublic.data.NEXT_PUBLIC_CMS_API_URL.length > 0,
  },

  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
} as const;

/**
 * Server-only secrets. Throws if reached from the browser bundle, which turns a
 * dangerous mistake into an immediate, obvious failure.
 */
export function serverEnv() {
  if (typeof window !== 'undefined') {
    throw new Error('serverEnv() must not be called from client code.');
  }
  return {
    /** Shared secret for the Strapi publish webhook — see app/api/revalidate. */
    revalidateSecret: process.env.REVALIDATE_SECRET ?? '',
  } as const;
}
