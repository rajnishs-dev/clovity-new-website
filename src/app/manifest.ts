import type { MetadataRoute } from 'next';
import { siteConfig } from '@/constants/site';

/**
 * Web app manifest.
 *
 * `display: 'browser'` on purpose: this is a marketing site, not an app. A
 * standalone display mode would strip the URL bar and the back button from an
 * installed shortcut, which makes a content site harder to navigate, not easier.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.shortTitle,
    description: siteConfig.description,
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    lang: siteConfig.language,
    categories: ['business', 'productivity', 'developer'],
    /**
     * `icons` is deliberately empty. The legacy site had no favicon or app icon,
     * and the only brand marks on hand are two animated GIFs - not an icon
     * source. Listing files that do not exist would put 404s in the manifest,
     * which is worse than omitting them.
     *
     * TO COMPLETE: add /public/icon-192.png and /public/icon-512.png, then list
     * them here (192 as `maskable`, 512 as `any`) and add the matching `icons`
     * block in app/layout.tsx.
     */
    icons: [],
  };
}
