import { ROUTES } from '@/constants/routes';
import type { ContentCollection } from '@/types/content';

/**
 * The five tabs of the home page's "What We Learn in the Field" module - their
 * chrome only. The CARDS come from the CMS; see `getContentCollections()` in
 * `data/home.ts`.
 *
 * WHAT USED TO BE HERE: all five tabs' cards, hard-coded - roughly 360 lines of
 * titles, excerpts, image imports and hrefs, lifted from the legacy page's inline
 * `HI_DATA` script. That went the moment the resource collections came out of Strapi:
 * the same posts, events, webinars, case studies and news items now load from the CMS,
 * so keeping a second hand-maintained copy on the home page meant it started drifting
 * from `/blog` the first time an editor published anything. Four of the tabs' cards
 * also still pointed at `clovity.com`, and the blog tab's four pointed at `#`.
 *
 * WHAT STAYS HERE, and why it is not CMS content: the tab label, its icon, the column
 * heading and its one-line subtitle are page furniture - they describe the SECTION, not
 * any item in it, and no Strapi collection has a column for them. `moreHref` is a route
 * this app owns.
 */
export type ContentCollectionTab = Omit<ContentCollection, 'items'>;

export const CONTENT_COLLECTION_TABS: ContentCollectionTab[] = [
  {
    kind: 'blog',
    label: 'Blog',
    icon: 'pen-nib',
    columnTitle: 'Expert Insights',
    columnSubtitle: 'Field notes from our Atlassian and AI delivery teams.',
    moreHref: ROUTES.resources.blog,
    moreExternal: false,
  },
  {
    kind: 'events',
    label: 'Events',
    icon: 'calendar-days',
    columnTitle: 'Event Highlights',
    columnSubtitle:
      "Conferences, summits, and gov-focused tours we've taken part in.",
    moreHref: ROUTES.resources.events,
    moreExternal: false,
  },
  {
    kind: 'webinars',
    label: 'Webinars',
    icon: 'video',
    columnTitle: 'Webinars',
    columnSubtitle:
      'Live sessions with Atlassian and Clovity experts on public sector modernization.',
    moreHref: ROUTES.resources.webinars,
    moreExternal: false,
  },
  {
    kind: 'case-study',
    label: 'Case Study',
    icon: 'chart-line',
    columnTitle: 'Case Studies',
    columnSubtitle:
      'Real client challenges, the solutions we built, and the results that followed.',
    moreHref: ROUTES.resources.caseStudy,
    moreExternal: false,
  },
  {
    kind: 'news',
    label: 'News',
    icon: 'newspaper',
    columnTitle: 'News',
    columnSubtitle:
      'Announcements, recognitions, and press coverage from our team.',
    moreHref: ROUTES.resources.news,
    moreExternal: false,
  },
];
