import type { Metadata, Viewport } from 'next';

/**
 * One stylesheet, and that is the whole CSS surface of the app: Tailwind's three
 * layers plus the four things that genuinely cannot be utility classes (see the
 * file header in `globals.css`).
 *
 * There used to be a second one - a self-hosted Font Awesome 6.5.1 - and a long
 * comment here about how its load order had to be the reverse of the legacy site's
 * so that `.fa-solid`'s single-class rules would not outrank the Tailwind utilities
 * sitting on the same element. All of that is gone: icons are SVG components now
 * (`components/ui/Icon`), so an icon's geometry no longer depends on a webfont
 * arriving, a `content` declaration surviving minification, or a cascade race
 * between two stylesheets.
 */
import '@/styles/globals.css';

import { spaceGrotesk } from '@/config/fonts';
import { siteConfig } from '@/config/site';
import { env } from '@/config/env';
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
   * No `icons` block on purpose. The legacy site shipped no favicon, and the
   * only brand marks available are two animated GIFs - not usable as an icon
   * source without design input. Declaring `/favicon.ico` here would put a
   * guaranteed 404 in every page's <head>.
   *
   * TO COMPLETE: drop `favicon.ico`, `apple-touch-icon.png`, `icon-192.png` and
   * `icon-512.png` into /public, then add them here and in manifest.ts. Next.js
   * also supports the `src/app/favicon.ico` file convention, which wires itself
   * up with no config.
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
    /*
     * `scroll-smooth` was `html { scroll-behavior: smooth }` in the legacy theme;
     * the body utilities were its `body { color; background; font-size;
     * font-weight; -webkit-font-smoothing }` block. Both are now utilities on the
     * elements they apply to rather than element selectors in a stylesheet.
     */
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
