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
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .default('')
    .transform((v) => v.replace(/\/$/, '')),
  NEXT_PUBLIC_API_TIMEOUT: z.coerce.number().int().positive().default(15_000),
  NEXT_PUBLIC_ENABLE_CMS: booleanish.default(false),
  NEXT_PUBLIC_ALLOW_INDEXING: booleanish.default(true),
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().default(''),
});

const parsedPublic = publicSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_API_TIMEOUT: process.env.NEXT_PUBLIC_API_TIMEOUT,
  NEXT_PUBLIC_ENABLE_CMS: process.env.NEXT_PUBLIC_ENABLE_CMS,
  NEXT_PUBLIC_ALLOW_INDEXING: process.env.NEXT_PUBLIC_ALLOW_INDEXING,
  NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION:
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
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
  apiBaseUrl: parsedPublic.data.NEXT_PUBLIC_API_BASE_URL,
  apiTimeout: parsedPublic.data.NEXT_PUBLIC_API_TIMEOUT,
  /** True once the admin API + CMS is live and should be the data source. */
  cmsEnabled:
    parsedPublic.data.NEXT_PUBLIC_ENABLE_CMS &&
    parsedPublic.data.NEXT_PUBLIC_API_BASE_URL.length > 0,
  allowIndexing: parsedPublic.data.NEXT_PUBLIC_ALLOW_INDEXING,
  googleSiteVerification:
    parsedPublic.data.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
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
    apiServerToken: process.env.API_SERVER_TOKEN ?? '',
    revalidateSecret: process.env.REVALIDATE_SECRET ?? '',
  } as const;
}
