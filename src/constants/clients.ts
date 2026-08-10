import type { ClientLogo } from '@/types/content';
import { CDN } from './media';

/**
 * The client-logo marquee.
 *
 * The legacy page built these with a `for` loop that injected 23 `<img>` tags
 * into two duplicated tracks via `innerHTML` - so the logos did not exist until
 * JavaScript ran, and were invisible to crawlers and to anyone with JS blocked.
 * Generating the list here means the same 23 logos are in the server-rendered
 * HTML, from the same CDN paths.
 *
 * `client-N.png` is the CDN's own naming scheme, so the URLs are unchanged.
 * Alt text stays generic because the legacy markup never named the brands, and
 * inventing client names would be a factual claim we cannot source.
 */
const CLIENT_LOGO_COUNT = 23;

export const CLIENT_LOGOS: ClientLogo[] = Array.from(
  { length: CLIENT_LOGO_COUNT },
  (_, index) => {
    const n = index + 1;
    return {
      id: `client-${n}`,
      name: `Clovity client logo ${n}`,
      url: `${CDN.clovityWww}images/homePage/png/client-logos/client-${n}.png`,
    };
  },
);

/** Logo used by the IRS customer-story card (same CDN set as the marquee). */
export const IRS_LOGO_URL = `${CDN.clovityWww}images/homePage/png/client-logos/client-9.png`;
