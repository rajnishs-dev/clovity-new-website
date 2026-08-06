import { Space_Grotesk } from 'next/font/google';

/**
 * The legacy site loaded Space Grotesk 300–700 from the Google Fonts CDN.
 * next/font self-hosts the exact same weights at build time, which removes two
 * cross-origin round trips and the render-blocking <link>, and eliminates the
 * layout shift the CDN swap used to cause.
 *
 * `display: 'swap'` matches the `&display=swap` the original URL requested, so
 * the first-paint behaviour is unchanged.
 */
export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-space-grotesk',
  // Metric-compatible fallback so the pre-swap frame occupies the same box.
  adjustFontFallback: true,
  fallback: ['DM Sans', 'system-ui', 'sans-serif'],
});

export const fontVariables = spaceGrotesk.variable;
