import type { BadgeGroup, ClientLogo } from '@/types/content';
import { getAwards, withCmsFallback } from '@/api/cms';
import { CLIENT_LOGOS } from '@/constants/clients';
import {
  ABOUT_AWARD_BADGES_FALLBACK,
  ABOUT_AWARDS_GROUP,
} from '@/constants/about';

/**
 * The About page's data layer.
 *
 * One CMS read and one bundled list:
 *
 *  • AWARD BADGES come from Strapi's `award` collection. This is the page's one
 *    genuinely CMS-managed section, and wiring it closed a gap in the legacy site:
 *    that frontend read `/api/awards` on its HOME page but hard-coded the same
 *    badges on its About page, so adding an award showed up in one place and not the
 *    other.
 *
 *  • CLIENT LOGOS are bundled. `clovity-admin` has no collection for them; the 23
 *    CDN paths are generated in `constants/clients.ts`, the same source the home
 *    page's marquee uses.
 *
 * `withCmsFallback` means a CMS failure - or an empty collection - renders the
 * published badges instead of a heading over an empty grid, so the layout is the
 * designed one whatever Strapi does.
 */

/**
 * The Strapi-backed "Certifications & Diversity" badge group.
 *
 * The group's id and label are the page's, not the CMS's - the `award` content type
 * stores `title`, `logo` and `order` and has no notion of grouping, so what Strapi
 * supplies is the badge list and what this file supplies is where it goes.
 */
export async function getAwardBadgeGroup(): Promise<BadgeGroup> {
  const badges = await withCmsFallback(
    () => getAwards(),
    ABOUT_AWARD_BADGES_FALLBACK,
  );

  return {
    id: ABOUT_AWARDS_GROUP.id,
    label: ABOUT_AWARDS_GROUP.label,
    badges,
  };
}

/** The client-logo marquee. Same bundled source as the home page. */
export async function getClientLogos(): Promise<ClientLogo[]> {
  return CLIENT_LOGOS;
}

/** Everything the About page needs, resolved in parallel. */
export async function getAboutPageData() {
  const [awardBadges, logos] = await Promise.all([
    getAwardBadgeGroup(),
    getClientLogos(),
  ]);

  return { awardBadges, logos };
}
