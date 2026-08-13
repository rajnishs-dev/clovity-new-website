import type { Metadata, Viewport } from 'next';

/**
 * One stylesheet, and that's the whole CSS surface: Tailwind's three layers
 * plus the few things that genuinely can't be utility classes (see the file
 * header in `globals.css`).
 */
import '@/styles/globals.css';

import { spaceGrotesk } from '@/constants/fonts';
import { siteConfig } from '@/constants/site';
import { env } from '@/constants/env';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import { JsonLd } from '@/components/common/JsonLd';
import { StoreProvider } from '@/store/provider';

/**
 * Root metadata. `title.template` gives every child page the ` | Clovity`
 * suffix without repeating it, and `default` covers routes that set no title.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  referrer: 'strict-origin-when-cross-origin',
  robots: env.allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false },
  /**
   * No `icons` block - `src/app/favicon.ico` uses Next's file-convention icon,
   * which wires itself into every page's <head> with no config.
   *
   * TO COMPLETE: only a 16x16/32x32 `.ico` exists, no `apple-touch-icon.png`,
   * `icon-192.png` or `icon-512.png`. Add them here and in manifest.ts once
   * those exist.
   */
  manifest: '/manifest.webmanifest',
  ...(env.googleSiteVerification
    ? { verification: { google: env.googleSiteVerification } }
    : {}),
};

/**
 * `themeColor` and `viewport` belong in the viewport export, not metadata.
 * `maximumScale` is deliberately left unset - capping zoom is an accessibility
 * failure, and the legacy `<meta viewport>` did not cap it either.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#2563eb',
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // `scroll-smooth` and the body utilities below are utilities on the
    // elements they apply to, rather than element selectors in a stylesheet.
    <html
      lang={siteConfig.language}
      className={`${spaceGrotesk.variable} scroll-smooth`}
    >
      <head>
        {/*
          Preconnect to the CDNs the legacy pages still pull images from, so the
          TLS handshake overlaps with HTML parsing instead of blocking the first
          image request.
        */}
        <link
          rel="preconnect"
          href="https://clovity-website.s3.ap-south-1.amazonaws.com"
        />
        <link rel="preconnect" href="https://www.clovity.com" />
      </head>
      <body className="bg-white text-[16px] font-normal text-title antialiased">
        {/* Keyboard users can jump the header's ~20 nav links. */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        {/*
          Organization + WebSite graphs are site-wide, so they belong here rather
          than being repeated on every page. Emitted server-side, where crawlers
          actually read them.
        */}
        <JsonLd id="ld-site" schema={[organizationSchema(), websiteSchema()]} />

        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
