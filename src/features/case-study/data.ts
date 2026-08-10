import { ROUTES } from '@/config/routes';
import { withFallback } from '@/services/api/request';
import { contentApi } from '@/services/api/api';
import type { CaseStudyItem } from '@/types/content';
import { cardDsh, cardForcepoint, cardHashgraph } from '@/constants/media';

/**
 * Static fallback content for `/case-study` and `/case-study/[slug]`.
 *
 * Ported from the legacy `case-study.html` cards. The outcomes lists are the
 * only real figures carried over from the legacy site - the Challenge /
 * Solution / Results bodies below are original placeholder copy written to
 * the same brand voice, pending the CMS.
 */

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    kind: 'case-study',
    id: 'forcepoint-cloud-transformation',
    slug: 'forcepoint-s-cloud-transformation-a-seamless-migration-with-clovity',
    title: "Forcepoint's Cloud Transformation: A Seamless Migration with Clovity",
    excerpt:
      'Forcepoint moved its on-prem Jira Data Center to Atlassian Cloud, cutting infrastructure costs by 50% with zero downtime.',
    publishedAt: '2026-06-04',
    client: 'Forcepoint',
    industry: 'Cybersecurity',
    category: 'Cloud Migration',
    image: {
      src: cardForcepoint,
      alt: "Forcepoint's Cloud Transformation: A Seamless Migration with Clovity",
    },
    outcomes: [
      '50% lower infrastructure cost',
      'Zero-downtime cutover',
      'Modernized Data Center to Cloud',
    ],
    href: `${ROUTES.resources.caseStudy}/forcepoint-s-cloud-transformation-a-seamless-migration-with-clovity`,
    tags: ['Cloud Migration', 'Cybersecurity'],
    content: [
      {
        type: 'paragraph',
        text: 'Forcepoint, a global cybersecurity company, needed to move its on-premises Jira Data Center environment to Atlassian Cloud without disrupting the delivery teams who depend on it every day. Clovity led the migration end to end, from the initial technical audit through the final cutover.',
      },
      { type: 'heading', text: 'The Challenge' },
      {
        type: 'paragraph',
        text: "As a cybersecurity vendor, Forcepoint holds its own tooling to the same standard it asks of its customers. Its Jira Data Center instance had grown over years of use, carrying app dependencies, custom workflows, and a permissions model that had never been re-examined end to end. A move to Cloud had to happen without downtime that would interrupt delivery teams, and without introducing the kind of access or configuration drift a security-conscious organization can't accept.",
      },
      { type: 'heading', text: 'The Solution' },
      {
        type: 'paragraph',
        text: "Clovity approached the migration in phases rather than as a single cutover event. The engagement began with a full dependency audit - every Marketplace app, integration, and custom script running on the Data Center instance - to identify what would carry over to Cloud cleanly and what needed to be rebuilt. From there, Clovity rebuilt Forcepoint's permissions model deliberately for Cloud's access model rather than copying the Data Center scheme over as-is. The cutover itself ran in stages, with a tested rollback path in place at every step, so the migration window stayed a controlled event rather than a risk to production.",
      },
      { type: 'heading', text: 'The Results' },
      {
        type: 'list',
        items: [
          '50% lower infrastructure cost',
          'Zero-downtime cutover',
          'Modernized Data Center to Cloud',
        ],
      },
    ],
  },
  {
    kind: 'case-study',
    id: 'hashgraph-it-ecosystem',
    slug: 'leveraging-atlassian-solutions-to-transform-hashgraph-s',
    title: "Leveraging Atlassian Solutions to Transform Hashgraph's IT Ecosystem",
    excerpt:
      "Clovity unified Hashgraph's service desk, asset management, and project workflows on Jira Service Management, cutting ticket resolution time by 50%.",
    publishedAt: '2026-06-08',
    client: 'Hashgraph',
    industry: 'Blockchain',
    category: 'ITSM & Service Management',
    image: {
      src: cardHashgraph,
      alt: "Leveraging Atlassian Solutions to Transform Hashgraph's IT Ecosystem",
    },
    outcomes: [
      '50% faster ticket resolution',
      'Unified service desk & asset management',
      'Single platform for project + IT workflows',
    ],
    href: `${ROUTES.resources.caseStudy}/leveraging-atlassian-solutions-to-transform-hashgraph-s`,
    tags: ['ITSM', 'Jira Service Management'],
    content: [
      {
        type: 'paragraph',
        text: "Hashgraph, a fast-growing blockchain company, had scaled its engineering and operations teams faster than its IT tooling could keep up with. Clovity was brought in to unify a fragmented set of systems onto a single Atlassian platform.",
      },
      { type: 'heading', text: 'The Challenge' },
      {
        type: 'paragraph',
        text: "Hashgraph's IT support, asset tracking, and project management ran on separate tools that never shared data with each other. Requests came in through a mix of inboxes and spreadsheets, infrastructure assets were tracked manually, and project teams had no shared visibility into the IT work blocking their own delivery. As headcount grew, the gaps between those systems grew with it.",
      },
      { type: 'heading', text: 'The Solution' },
      {
        type: 'paragraph',
        text: "Clovity rolled out Jira Service Management as the single intake point for IT requests, replacing the inbox-and-spreadsheet approach with structured queues and consistent SLAs. Jira Service Management's Assets module gave the team real-time visibility into the infrastructure behind every ticket, and automation rules routed common request types without manual triage. Because the rollout sat on the same Atlassian platform as engineering's project work, service and delivery teams finally worked from a shared source of truth instead of two disconnected systems.",
      },
      { type: 'heading', text: 'The Results' },
      {
        type: 'list',
        items: [
          '50% faster ticket resolution',
          'Unified service desk & asset management',
          'Single platform for project + IT workflows',
        ],
      },
    ],
  },
  {
    kind: 'case-study',
    id: 'dsh-service-solution',
    slug: 'customer-success-story-empowering-dsh-with-an-efficient-service-solution',
    title: 'Customer Success Story: Empowering DSH with an Efficient Service Solution',
    excerpt:
      'A tailored Jira Core rollout gave the Department of State Hospitals customizable workflows, real-time dashboards, and fewer missed deadlines.',
    publishedAt: '2026-06-08',
    client: 'Department of State Hospitals',
    industry: 'Government',
    category: 'Public Sector',
    image: {
      src: cardDsh,
      alt: 'Customer Success Story: Empowering DSH with an Efficient Service Solution',
    },
    outcomes: [
      'Customizable workflows',
      'Real-time dashboards',
      'Fewer missed deadlines',
    ],
    href: `${ROUTES.resources.caseStudy}/customer-success-story-empowering-dsh-with-an-efficient-service-solution`,
    tags: ['Public Sector', 'Jira Core'],
    content: [
      {
        type: 'paragraph',
        text: "The Department of State Hospitals manages complex casework across multiple facilities, each with its own process and reporting needs. Clovity worked with the agency to replace a generic project tool with a Jira Core deployment built around how its teams actually work.",
      },
      { type: 'heading', text: 'The Challenge' },
      {
        type: 'paragraph',
        text: "DSH's existing system offered generic, out-of-the-box workflows that did not match the agency's actual casework process, so staff worked around the tool rather than through it. There was no shared view into upcoming deadlines across teams, which meant case milestones could slip without anyone noticing until it was too late.",
      },
      { type: 'heading', text: 'The Solution' },
      {
        type: 'paragraph',
        text: "Clovity deployed Jira Core with workflows modeled directly on DSH's case process, rather than a generic template staff had to adapt to. Real-time dashboards gave supervisors and staff a shared view of case status and upcoming deadlines across the agency, replacing the manual status checks the old process required.",
      },
      { type: 'heading', text: 'The Results' },
      {
        type: 'list',
        items: [
          'Customizable workflows',
          'Real-time dashboards',
          'Fewer missed deadlines',
        ],
      },
    ],
  },
];

/** All case studies, most recent first - the ordering every list/sidebar uses. */
export function getAllCaseStudies(): CaseStudyItem[] {
  return [...CASE_STUDIES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/** Every case study for the `/case-study` index - revealed via `<LoadMoreGrid>`. */
export async function getCaseStudies(): Promise<CaseStudyItem[]> {
  return withFallback(async () => {
    const result = await contentApi.caseStudies({ pageSize: 100 });
    return result.success
      ? { success: true as const, data: result.data.items }
      : result;
  }, getAllCaseStudies());
}

export async function getCaseStudyBySlug(
  slug: string,
): Promise<CaseStudyItem | undefined> {
  const fallback = CASE_STUDIES.find((item) => item.slug === slug);
  return withFallback(async () => {
    const result = await contentApi.caseStudy(slug);
    return result.success ? { success: true as const, data: result.data } : result;
  }, fallback);
}

export function getCaseStudySlugs(): string[] {
  return CASE_STUDIES.map((item) => item.slug);
}
