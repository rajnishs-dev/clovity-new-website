import { ROUTES } from '@/config/routes';
import { withFallback } from '@/services/api/request';
import { contentApi } from '@/services/api/api';
import type { WebinarItem } from '@/types/content';
import { CDN } from '@/constants/media';

/**
 * Static fallback content for `/webinars` and `/webinars/[slug]`.
 *
 * Ported from the legacy `webinars.html` cards. Only the "Ascend to Cloud"
 * session carried a real recap on the old site - the other two bodies are
 * original placeholder copy written to the same brand voice, pending the CMS.
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

/** All webinars, most recent first - the ordering every list/sidebar uses. */
export function getAllWebinars(): WebinarItem[] {
  return [...WEBINARS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/** Every webinar for the `/webinars` index. */
export async function getWebinars(): Promise<WebinarItem[]> {
  return withFallback(async () => {
    const result = await contentApi.webinars({ pageSize: 100 });
    return result.success
      ? { success: true as const, data: result.data.items }
      : result;
  }, getAllWebinars());
}

export async function getWebinarBySlug(slug: string): Promise<WebinarItem | undefined> {
  const fallback = WEBINARS.find((webinar) => webinar.slug === slug);
  return withFallback(async () => {
    const result = await contentApi.webinar(slug);
    return result.success ? { success: true as const, data: result.data } : result;
  }, fallback);
}

export function getWebinarSlugs(): string[] {
  return WEBINARS.map((webinar) => webinar.slug);
}
