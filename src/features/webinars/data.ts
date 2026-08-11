import { cache } from 'react';
import { ROUTES } from '@/config/routes';
import type { WebinarItem } from '@/types/content';
import { getWebinarBySlug, getWebinars, withCmsFallback } from '@/api/cms';
import { prerenderableSlugs } from '@/utils/slug';
import { CDN } from '@/constants/media';

/**
 * The `/webinars` data layer: Strapi first, bundled content as the fallback.
 *
 * The `webinar` collection has exactly three published rows, and they are the same
 * three sessions bundled below - so unlike blog or news, going live changes the copy
 * rather than the number of cards. The CMS wins on freshness (an editor can publish a
 * fourth) and on the presenter list, which it stores per session.
 *
 * The bundled entries were ported from the legacy `webinars.html` cards; only "Ascend to
 * Cloud" carried a real recap, so the other two bodies are placeholder copy.
 */

export const WEBINARS: WebinarItem[] = [
  {
    kind: 'webinars',
    id: 'ascend-to-cloud',
    slug: 'ascend-to-cloud-from-data-center-eol-to-ai-ready-modernization',
    title: 'Ascend to Cloud: From Data Center EOL to AI-Ready Modernization',
    excerpt:
      'How SLED and Federal agencies modernize mission-critical systems without disrupting operations.',
    publishedAt: '2026-01-28',
    onDemand: true,
    presenters: [
      { name: 'Matthew Graviss', role: 'Public Sector CTO at Atlassian' },
      { name: 'Michael Allen', role: 'Deputy Commissioner for Technology, NYS DOL' },
      { name: 'Anuj Sachdeva', role: 'CEO at Clovity' },
    ],
    videoUrl: 'https://www.youtube.com/embed/-Dxg6hl-YWg',
    image: {
      src: `${CDN.s3}small_22_8_d4630bb124.png`,
      alt: 'Ascend to Cloud: From Data Center EOL to AI-Ready Modernization',
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.webinars}/ascend-to-cloud-from-data-center-eol-to-ai-ready-modernization`,
    content: [
      { type: 'heading', text: 'The Who' },
      {
        type: 'list',
        items: [
          'Matthew Graviss - Public Sector CTO at Atlassian',
          'Michael Allen - Deputy Commissioner for Technology, NYS DOL',
          'Anuj Sachdeva - CEO at Clovity',
        ],
      },
      { type: 'heading', text: 'The Why' },
      {
        type: 'paragraph',
        text: 'Public sector agencies are at a critical inflection point. Aging platforms, rising security risks, and increasing service demands have made Data Center end-of-life an immediate priority - not a future concern.',
      },
      {
        type: 'paragraph',
        text: 'In this exclusive session, Clovity, GovExec and Atlassian explored how SLED and Federal agencies can modernize mission-critical systems without disrupting operations, enabling a smooth transition toward secure, AI-ready and resilient platforms.',
      },
      {
        type: 'paragraph',
        text: 'Leaders shared practical strategies, real-world experiences, and lessons learned from modernization journeys across government organizations.',
      },
      { type: 'heading', text: 'During this session, attendees discovered how to:', level: 3 },
      {
        type: 'list',
        items: [
          'Navigate Data Center EOL with a structured, low-risk approach',
          'Protect data integrity while maintaining operational continuity',
          'Strengthen security and compliance in the move to cloud',
          'Build a clear path toward AI-ready modernization',
        ],
      },
      {
        type: 'paragraph',
        text: 'Clovity is proud to be a Platinum Solution Partner with Atlassian.',
      },
    ],
  },
  {
    kind: 'webinars',
    id: 'agencies-saving-big',
    slug: 'how-agencies-are-saving-big-and-serving-better',
    title: 'How Agencies Are Saving Big and Serving Better',
    excerpt:
      'How public sector teams use Jira Service Management to cut costs and speed up service delivery.',
    publishedAt: '2025-10-14',
    onDemand: true,
    image: {
      src: `${CDN.s3}small_Clovity_Carahsoft_Webinartr_4x_100_3f4d228c3e.jpg`,
      alt: 'How Agencies Are Saving Big and Serving Better',
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.webinars}/how-agencies-are-saving-big-and-serving-better`,
    content: [
      {
        type: 'paragraph',
        text: 'Budgets are tighter and service expectations keep climbing, which leaves public sector IT and operations teams looking for the same thing: fewer manual steps between a request coming in and it getting resolved.',
      },
      { type: 'heading', text: 'What this session covered' },
      {
        type: 'list',
        items: [
          'Consolidating intake across departments into a single Jira Service Management queue',
          'Building SLA-backed service catalogs that set clear expectations for requesters',
          'Automating manual triage to cut resolution time and reduce backlogs',
          'Giving leadership shared dashboards for cost and service-level visibility',
        ],
      },
      {
        type: 'paragraph',
        text: "This session's recording is available on request - reach out and we'll send it over.",
      },
    ],
  },
  {
    kind: 'webinars',
    id: 'streamline-campus-operations',
    slug: 'streamline-campus-operations-with-smarter-tools',
    title: 'Streamline Campus Operations with Smarter Tools',
    excerpt:
      'How Atlassian and Carahsoft help higher-ed teams simplify workflows and IT requests.',
    publishedAt: '2025-02-06',
    onDemand: true,
    image: {
      src: `${CDN.s3}small_r779qcrt4y6jntvb7w0sxtxi_350f729e8a.png`,
      alt: 'Streamline Campus Operations with Smarter Tools',
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.webinars}/streamline-campus-operations-with-smarter-tools`,
    content: [
      {
        type: 'paragraph',
        text: 'Campus IT and facilities requests rarely arrive through one channel - email, phone calls, and walk-ins all land on different teams, and students and staff feel the gap every time a request goes quiet.',
      },
      { type: 'heading', text: 'What this session covered' },
      {
        type: 'list',
        items: [
          'Unifying IT, facilities, and HR requests behind a single intake',
          'Self-service portals that let students and staff track requests without a help desk call',
          'Connecting Jira Service Management to the campus systems that already run day-to-day operations',
          'Reporting that gives campus leadership one view of service performance',
        ],
      },
      {
        type: 'paragraph',
        text: "This session's recording is available on request - reach out and we'll send it over.",
      },
    ],
  },
];

/** The bundled webinars, most recent first. */
export function getAllWebinars(): WebinarItem[] {
  return [...WEBINARS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/** Every webinar for the `/webinars` index. */
export const getWebinarItems = cache(async (): Promise<WebinarItem[]> => {
  return withCmsFallback(() => getWebinars(), getAllWebinars());
});

export async function getWebinarItemBySlug(
  slug: string,
): Promise<WebinarItem | undefined> {
  const listed = (await getWebinarItems()).find(
    (webinar) => webinar.slug === slug,
  );
  if (listed) return listed;

  const fallback = WEBINARS.find((webinar) => webinar.slug === slug);
  return withCmsFallback(
    async () => (await getWebinarBySlug(slug)) ?? undefined,
    fallback,
  );
}

/** Sibling sessions for the related rail. */
export async function getOtherWebinars(
  slug: string,
  count: number,
): Promise<WebinarItem[]> {
  const webinars = await getWebinarItems();
  return webinars.filter((webinar) => webinar.slug !== slug).slice(0, count);
}

export async function getWebinarSlugs(): Promise<string[]> {
  const webinars = await getWebinarItems();
  return prerenderableSlugs('webinars', webinars.map((webinar) => webinar.slug));
}
