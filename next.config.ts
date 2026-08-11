import type { NextConfig } from 'next';

/**
 * Remote image hosts used by the current site. Every one of these is a host the
 * legacy static site already loads <img> from, so next/image needs them
 * allow-listed to optimize them instead of failing the request.
 */
const REMOTE_IMAGE_HOSTS = [
  'clovity-website.s3.ap-south-1.amazonaws.com',
  'www.clovity.com',
  'clovity.com',
  'images.unsplash.com',
  'marketplace.atlassian.com',
  // Country flags on the Contact page's office cards.
  'flagcdn.com',
] as const;

/**
 * Hosts that serve Strapi uploads, derived from the environment.
 *
 * next/image refuses any host that is not allow-listed, and Strapi media can come
 * from three different origins depending on how `clovity-admin` is deployed: the
 * S3 provider (already listed above), the Strapi instance itself, or a CDN in front
 * of it. Reading them out of the env means changing the CMS host is a deploy
 * variable, not a code change — and a missing variable degrades to "no extra host"
 * rather than breaking the build.
 *
 * Note this runs at config-eval time, so the variables must be present in the
 * BUILD environment, not just at runtime.
 */
function cmsImageHosts(): string[] {
  const candidates = [
    process.env.NEXT_PUBLIC_CMS_MEDIA_URL,
    process.env.NEXT_PUBLIC_CMS_API_URL,
  ];

  const hosts = new Set<string>();
  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      hosts.add(new URL(candidate).hostname);
    } catch {
      // A malformed value must not take the build down — the allow-list simply
      // does not gain that host, and the image request fails visibly instead.
    }
  }
  return [...hosts];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Fail the production build on type errors instead of shipping them.
  // Linting is a separate `npm run lint` step: Next 16 removed `next lint`, so
  // ESLint is invoked directly from the `verify` script and in CI.
  typescript: { ignoreBuildErrors: false },

  images: {
    // AVIF first, then WebP — both fall back to the original for old clients.
    formats: ['image/avif', 'image/webp'],

    /**
     * Kept deliberately short. Every entry in `deviceSizes` + `imageSizes`
     * becomes a `srcset` candidate on any image that passes `sizes`, and the
     * home page renders 46 marquee logos plus 11 credential badges — an
     * over-long list is pure HTML weight for candidates no browser will pick.
     * These are Next's defaults plus only the widths this design actually uses
     * (44 app logo, 55 stat icon, 92 mega thumb, 148 logo pill, 210 badge).
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 44, 48, 55, 64, 92, 148, 210, 256, 384],

    /**
     * Next 16 rejects any `q` not listed here with a 400 — a silent failure mode
     * if a component passes an unlisted value. 75 is the default; 90 exists for
     * large hero and case-study art where the extra bytes are justified.
     */
    qualities: [75, 90],

    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      ...REMOTE_IMAGE_HOSTS.map((hostname) => ({
        protocol: 'https' as const,
        hostname,
      })),
      /**
       * Strapi hosts get both protocols: a local `clovity-admin` runs on
       * `http://localhost:1337`, and pinning to https would block every image on
       * the About and Careers pages during development.
       */
      ...cmsImageHosts().flatMap((hostname) => [
        { protocol: 'https' as const, hostname },
        { protocol: 'http' as const, hostname },
      ]),
    ],
  },

  experimental: {
    // Pull only the icon modules actually referenced instead of the barrel.
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  async headers() {
    return [
      {
        // Long-lived immutable caching for the media we fingerprint ourselves.
        source: '/assets/videos/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  /**
   * Legacy `.html` URLs from the static site keep working, so inbound links and
   * search-engine results do not 404 after the migration.
   */
  async redirects() {
    const legacy: Array<[string, string]> = [
      ['/index.html', '/'],
      ['/about-us.html', '/about-us'],
      ['/blog.html', '/blog'],
      ['/blog-detail.html', '/blog'],
      ['/careers.html', '/careers'],
      ['/case-study.html', '/case-study'],
      ['/contact.html', '/contact'],
      ['/events.html', '/events'],
      ['/news.html', '/news'],
      ['/news-detail.html', '/news'],
      ['/webinars.html', '/webinars'],
      ['/webinar-detail.html', '/webinars'],
    ];
    return legacy.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
