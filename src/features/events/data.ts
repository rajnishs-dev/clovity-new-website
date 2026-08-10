import { ROUTES } from '@/config/routes';
import { withFallback } from '@/services/api/request';
import { contentApi } from '@/services/api/api';
import type { EventItem } from '@/types/content';
import { cardGovMeetUsAt, CDN } from '@/constants/media';

/**
 * Static fallback content for `/events` and `/events/[slug]`.
 *
 * Ported from the legacy `events.html` cards, which all linked out to
 * `clovity.com/events/...` with no local recap page. The recap bodies below
 * are original placeholder copy pending the CMS.
 */

export const EVENTS: EventItem[] = [
  {
    kind: 'events',
    id: 'team-on-tour-government',
    slug: 'atlassian-team-on-tour-government',
    title: 'Atlassian Team on Tour - Government',
    excerpt:
      "Meet the Clovity team in Washington, D.C. for a government-focused look at Atlassian's latest tools for modernizing public sector IT.",
    publishedAt: '2026-02-10',
    startsAt: '2026-02-10',
    category: 'government',
    location: 'Washington, D.C.',
    image: {
      src: `${CDN.s3}small_Building_bdd27730bf.png`,
      alt: 'Atlassian Team on Tour - Government',
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.events}/atlassian-team-on-tour-government`,
    tags: ['Government', 'Atlassian'],
    content: [
      {
        type: 'paragraph',
        text: 'Clovity joined Atlassian Team on Tour in Washington, D.C. for a government-focused look at how agencies are modernizing IT service delivery on the Atlassian platform.',
      },
      { type: 'heading', text: 'Highlights from the day' },
      {
        type: 'list',
        items: [
          'Atlassian Government Cloud readiness and migration paths for federal and SLED agencies',
          'Jira Service Management patterns for standardizing intake across departments',
          'Early looks at AI-assisted workflows built for regulated environments',
        ],
      },
      {
        type: 'paragraph',
        text: "Conversations throughout the day centered on a familiar theme for public-sector attendees: aging Data Center deployments, tightening compliance requirements, and the case for planning a cloud migration on the agency's own timeline rather than a forced one.",
      },
      {
        type: 'paragraph',
        text: "If your agency is evaluating an Atlassian Cloud move or a service management overhaul, Clovity's public-sector delivery team is available to walk through what a phased plan looks like.",
      },
    ],
  },
  {
    kind: 'events',
    id: 'atlassian-team-26',
    slug: 'team-26',
    title: "Atlassian Team '26",
    excerpt:
      "Clovity joins Atlassian Team '26 in Anaheim to share what's next for enterprise collaboration.",
    publishedAt: '2025-05-04',
    startsAt: '2025-05-04',
    category: 'conference',
    location: 'Anaheim, CA',
    image: {
      src: `${CDN.s3}small_tour_25_europe_0fe8d621a6.png`,
      alt: "Atlassian Team '26",
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.events}/team-26`,
    tags: ['Conference', 'Atlassian'],
    content: [
      {
        type: 'paragraph',
        text: "Clovity joined thousands of Atlassian practitioners at Team '26 in Anaheim to hear where the platform is headed next - and to share what enterprise and public-sector teams are already building with it.",
      },
      { type: 'heading', text: 'What stood out' },
      {
        type: 'list',
        items: [
          'AI moving from a bolt-on feature to core platform infrastructure',
          'Deeper cloud administration and governance controls for regulated organizations',
          'A more connected story across Jira, Confluence, and JSM for cross-team workflows',
        ],
      },
      {
        type: 'paragraph',
        text: "Our delivery team is already evaluating how these updates fit into active client engagements - reach out if you'd like to talk through what's relevant for your environment.",
      },
    ],
  },
  {
    kind: 'events',
    id: 'team-on-tour-government-2025',
    slug: 'atlassian-team-on-tour-government-2025',
    title: 'Atlassian Team on Tour - Government: 2025',
    excerpt:
      'Clovity met government IT leaders in Arlington, VA to talk Atlassian modernization.',
    publishedAt: '2025-03-11',
    startsAt: '2025-03-11',
    category: 'government',
    location: 'Arlington, VA',
    image: { src: cardGovMeetUsAt, alt: 'Atlassian Team on Tour - Government: 2025' },
    href: `${ROUTES.resources.events}/atlassian-team-on-tour-government-2025`,
    tags: ['Government', 'Atlassian'],
    content: [
      {
        type: 'paragraph',
        text: 'Clovity met government IT leaders in Arlington, VA for a day focused on Atlassian modernization across federal and state agencies.',
      },
      { type: 'heading', text: 'Highlights from the day' },
      {
        type: 'list',
        items: [
          'Roadmaps for moving off Data Center ahead of end-of-support deadlines',
          'Service management standardization across departments on Jira Service Management',
          'Security and compliance considerations specific to government cloud adoption',
        ],
      },
      {
        type: 'paragraph',
        text: "The conversations reinforced what we see across our public-sector engagements: the agencies furthest along are the ones who started their cloud assessment well before a deadline forced the decision.",
      },
    ],
  },
  {
    kind: 'events',
    id: 'procurecon-contingent-staffing',
    slug: 'procurecon-contingent-staffing',
    title: 'ProcureCon Contingent Staffing',
    excerpt:
      'Clovity connected with workforce and staffing leaders at JW Marriott LA LIVE, Los Angeles.',
    publishedAt: '2024-04-03',
    startsAt: '2024-04-03',
    category: 'industry',
    location: 'Los Angeles, CA',
    image: {
      src: `${CDN.s3}small_17103328922_4_0e6d949e9a.png`,
      alt: 'ProcureCon Contingent Staffing',
      width: 620,
      height: 255,
    },
    href: `${ROUTES.resources.events}/procurecon-contingent-staffing`,
    tags: ['Industry Event', 'Workforce'],
    content: [
      {
        type: 'paragraph',
        text: "Clovity connected with workforce and staffing leaders at ProcureCon Contingent Staffing, hosted at the JW Marriott LA LIVE in Los Angeles.",
      },
      { type: 'heading', text: 'Why we were there' },
      {
        type: 'paragraph',
        text: "Our workforce solutions team works with procurement and staffing leaders who need Atlassian-certified talent on short timelines. ProcureCon is where those conversations happen - with the people directly responsible for contingent staffing strategy.",
      },
      {
        type: 'paragraph',
        text: 'If your organization is scaling a certified Atlassian team and evaluating staff augmentation options, our workforce solutions group can walk through how engagements are typically structured.',
      },
    ],
  },
];

export function getAllEvents(): EventItem[] {
  return [...EVENTS].sort(
    (a, b) => new Date(b.startsAt ?? b.publishedAt).getTime() -
      new Date(a.startsAt ?? a.publishedAt).getTime(),
  );
}

export async function getEventItems(): Promise<EventItem[]> {
  return withFallback(async () => {
    const result = await contentApi.events({ pageSize: 100 });
    return result.success
      ? { success: true as const, data: result.data.items }
      : result;
  }, getAllEvents());
}

export async function getEventBySlug(slug: string): Promise<EventItem | undefined> {
  const fallback = EVENTS.find((event) => event.slug === slug);
  return withFallback(async () => {
    const result = await contentApi.event(slug);
    return result.success ? { success: true as const, data: result.data } : result;
  }, fallback);
}

export function getEventSlugs(): string[] {
  return EVENTS.map((event) => event.slug);
}
