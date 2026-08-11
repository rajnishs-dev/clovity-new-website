import { cache } from 'react';
import { ROUTES } from '@/constants/routes';
import type { BlogPost } from '@/types/content';
import { getBlogBySlug, getBlogs, withCmsFallback } from '@/api/cms';
import { prerenderableSlugs } from '@/lib/slug';
import { cardPartnerAward, cardTeam26, CDN } from '@/constants/media';

/**
 * The `/blog` data layer: Strapi first, bundled content as the fallback.
 *
 * `BLOG_POSTS` below is the FALLBACK, not the content. It renders when the CMS is
 * unreachable or unconfigured, which is also what keeps `npm run build` working with no
 * `.env.local`. Live, the page shows the `blog` collection - 504 published posts.
 *
 * The bundled posts were ported from the legacy `blog.html` / `blog-detail.html`
 * markup; only the DevSecOps post carried a full body on the old site, so the rest are
 * placeholder copy in the same brand voice.
 */

const AUTHOR = {
  name: 'Clovity Editorial Team',
  role: 'Atlassian & AI Delivery',
} as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    kind: 'blog',
    id: 'devsecops-with-atlassian',
    slug: 'devsecops-with-atlassian-building-secure-software-delivery-at-scale',
    title: 'DevSecOps with Atlassian: Building Secure Software Delivery at Scale',
    excerpt:
      "Security can no longer be a final checkpoint before deployment. Here's how the Atlassian ecosystem embeds it into every stage of delivery.",
    publishedAt: '2026-07-15',
    readingMinutes: 8,
    category: 'DevSecOps',
    author: AUTHOR,
    image: {
      src: `${CDN.s3}Dev_Sec_Ops_Blog_1_8c8966ee8a.jpg`,
      alt: 'DevSecOps with Atlassian: Building Secure Software Delivery at Scale',
      width: 1100,
      height: 619,
    },
    href: `${ROUTES.resources.blog}/devsecops-with-atlassian-building-secure-software-delivery-at-scale`,
    tags: ['DevSecOps', 'Atlassian', 'Security'],
    content: [
      {
        type: 'paragraph',
        text: "In today's rapidly evolving digital landscape, software teams are expected to deliver innovative applications faster than ever while maintaining the highest standards of security and compliance. As organizations accelerate digital transformation, cyber threats continue to grow in both volume and sophistication. Security can no longer be treated as a final checkpoint before deployment - it must be integrated into every stage of software development.",
      },
      { type: 'paragraph', text: 'This is where DevSecOps becomes essential.' },
      {
        type: 'paragraph',
        text: 'DevSecOps combines development, security, and operations into a unified approach that embeds security throughout the software development lifecycle. Instead of identifying vulnerabilities at the end of a project, security is incorporated from planning and coding through testing, deployment, and ongoing operations. The result is faster releases, reduced security risks, and improved collaboration across teams.',
      },
      {
        type: 'paragraph',
        text: 'At Clovity, an Atlassian Platinum Solution Partner, we help organizations adopt modern DevSecOps practices by leveraging the Atlassian ecosystem to streamline workflows, automate governance, and improve visibility across development, security, and operations.',
      },
      { type: 'heading', text: 'What Is DevSecOps?' },
      {
        type: 'paragraph',
        text: 'DevSecOps stands for Development, Security, and Operations. It extends the principles of DevOps by making security a shared responsibility instead of a separate activity performed only before production.',
      },
      {
        type: 'paragraph',
        text: 'Rather than waiting for security teams to review applications after development is complete, DevSecOps integrates automated security testing, compliance checks, and continuous monitoring throughout the development lifecycle. Developers receive earlier feedback, security teams gain greater visibility, and operations teams can deploy software with greater confidence.',
      },
      { type: 'paragraph', text: 'The primary goals of DevSecOps are to:' },
      {
        type: 'list',
        items: [
          'Detect vulnerabilities early',
          'Automate security and compliance processes',
          'Reduce manual effort',
          'Improve collaboration between teams',
          'Accelerate secure software delivery',
          'Build security into every release',
        ],
      },
      { type: 'heading', text: 'Why Organizations Are Adopting DevSecOps' },
      {
        type: 'paragraph',
        text: 'Traditional software delivery often creates barriers between development, security, and operations teams. These disconnected processes can lead to delayed releases, duplicated work, inconsistent governance, and increased operational risk.',
      },
      {
        type: 'list',
        items: [
          'Security reviews delaying releases',
          'Limited visibility across teams',
          'Manual approval processes',
          'Disconnected security and development tools',
          'Slow incident response',
          'Difficulty maintaining audit readiness',
        ],
      },
      {
        type: 'paragraph',
        text: 'DevSecOps addresses these challenges by creating a collaborative and automated approach where security becomes part of everyday development rather than a final approval step.',
      },
      { type: 'heading', text: 'How Atlassian Supports DevSecOps' },
      {
        type: 'paragraph',
        text: "While Atlassian isn't a replacement for dedicated security platforms, it serves as the collaboration and workflow foundation that connects people, processes, and tools throughout the software development lifecycle.",
      },
      { type: 'heading', text: '1. Plan Secure Development with Jira', level: 3 },
      {
        type: 'paragraph',
        text: 'Jira enables organizations to capture security requirements alongside business requirements by creating security epics, user stories, and vulnerability tasks within the same backlog - giving teams better visibility, accountability, and traceability across projects.',
      },
      { type: 'heading', text: '2. Centralize Security Knowledge with Confluence', level: 3 },
      {
        type: 'paragraph',
        text: 'Confluence provides a centralized workspace for secure coding standards, architecture documentation, security policies, incident response playbooks, and compliance evidence - connected directly to the implementation work in Jira.',
      },
      { type: 'heading', text: '3. Shift Security Left with Bitbucket', level: 3 },
      {
        type: 'paragraph',
        text: 'With Bitbucket and integrations with GitHub or GitLab, organizations can enforce pull request approvals, branch protection policies, automated build validation, and security reviews directly within the development workflow.',
      },
      { type: 'heading', text: '4. Integrate with Your Existing Security Toolchain', level: 3 },
      {
        type: 'paragraph',
        text: 'The Atlassian ecosystem integrates with tools such as SonarQube, Snyk, Checkmarx, Veracode, Jenkins, GitHub Actions, Azure DevOps, and Prisma Cloud - so findings automatically create Jira issues and trigger the right workflows.',
      },
      { type: 'heading', text: '5. Strengthen Security Operations with Jira Service Management', level: 3 },
      {
        type: 'paragraph',
        text: 'JSM enables organizations to manage security incidents, vulnerability requests, access requests, and change approvals through a centralized platform, with Assets providing visibility into affected applications and infrastructure.',
      },
      { type: 'heading', text: '6. Automate Governance and Compliance', level: 3 },
      {
        type: 'paragraph',
        text: 'Jira Automation routes high-risk changes for approval, assigns security reviews, escalates critical vulnerabilities, and enforces organizational policies - improving consistency without slowing delivery.',
      },
      { type: 'heading', text: 'Why Choose Clovity?' },
      {
        type: 'paragraph',
        text: 'As an Atlassian Platinum Solution Partner, Clovity helps organizations design, implement, and optimize secure software delivery using the Atlassian platform - across Cloud and Data Center implementations, workflow automation, CI/CD integrations, ITSM, governance, and cloud migration.',
      },
      { type: 'heading', text: 'Conclusion' },
      {
        type: 'paragraph',
        text: "DevSecOps is no longer just a best practice - it's a critical capability for organizations that want to innovate securely and efficiently. Connect with Clovity at sales@clovity.com to discuss modernizing your software development lifecycle with the Atlassian ecosystem.",
      },
    ],
  },
  {
    kind: 'blog',
    id: 'team-26-takeaways',
    slug: 'team-26-key-takeaways-from-clovity',
    title: "Team '26 Key Takeaways from Clovity",
    excerpt:
      "Atlassian Team '26 was more than a product event. It felt like a major shift in how teams collaborate at scale - here's what stood out to our delivery team.",
    publishedAt: '2026-05-29',
    readingMinutes: 5,
    category: 'Events & Community',
    author: AUTHOR,
    image: { src: cardTeam26, alt: "Team '26 Key Takeaways from Clovity" },
    href: `${ROUTES.resources.blog}/team-26-key-takeaways-from-clovity`,
    tags: ['Atlassian', 'Team Events'],
    content: [
      {
        type: 'paragraph',
        text: "Atlassian Team '26 brought thousands of practitioners together to talk about where enterprise collaboration is headed, and our delivery team came away with a clear read: the roadmap is converging around AI-assisted workflows, tighter cloud governance, and simpler cross-product administration.",
      },
      { type: 'heading', text: 'AI is moving from feature to foundation' },
      {
        type: 'paragraph',
        text: 'Rather than bolt-on assistants, the sessions we sat in on treated AI as infrastructure - summarizing tickets, drafting requirements, and surfacing risk before a human ever opens the issue. For teams already standardized on Jira and Confluence, that shift compounds fast.',
      },
      { type: 'heading', text: 'Cloud governance is catching up to enterprise needs' },
      {
        type: 'paragraph',
        text: 'Admin controls, data residency options, and audit tooling all matured noticeably this cycle - closing gaps that had kept some regulated and public-sector teams cautious about a full cloud move.',
      },
      { type: 'heading', text: 'What this means for our clients' },
      {
        type: 'paragraph',
        text: "We're already folding these capabilities into active migration and modernization engagements. If you're evaluating what's next for your Atlassian estate, this is a good moment to revisit the roadmap together.",
      },
    ],
  },
  {
    kind: 'blog',
    id: 'atlassian-partner-of-the-year',
    slug: 'clovity-named-atlassian-partner-of-the-year',
    title: 'Clovity Named Atlassian Partner of the Year',
    excerpt:
      'We are excited to announce that Clovity has been named Atlassian Partner of the Year for Government Americas.',
    publishedAt: '2026-05-13',
    readingMinutes: 3,
    category: 'Company News',
    author: AUTHOR,
    image: { src: cardPartnerAward, alt: 'Clovity Named Atlassian Partner of the Year' },
    href: `${ROUTES.resources.blog}/clovity-named-atlassian-partner-of-the-year`,
    tags: ['Awards', 'Atlassian'],
    content: [
      {
        type: 'paragraph',
        text: 'We are excited to announce that Clovity has been named Atlassian Partner of the Year for Government Americas, recognizing our work helping federal, state, and local agencies modernize service delivery on the Atlassian platform.',
      },
      {
        type: 'paragraph',
        text: "The award reflects a portfolio of public-sector engagements spanning Jira Service Management rollouts, Data Center-to-Cloud migrations, and workforce enablement for agencies balancing modernization with strict compliance requirements.",
      },
      {
        type: 'paragraph',
        text: "It's a recognition for the delivery teams doing the work every day, and a signal to the agencies we serve that Atlassian-certified, security-cleared expertise is available at the scale government programs need.",
      },
    ],
  },
  {
    kind: 'blog',
    id: 'cloud-migration-challenges',
    slug: 'common-atlassian-cloud-migration-challenges',
    title: 'Common Atlassian Cloud Migration Challenges',
    excerpt:
      "Atlassian Cloud migration is a strategic move for organizations looking to modernize - here's what trips teams up.",
    publishedAt: '2026-02-25',
    readingMinutes: 6,
    category: 'Cloud Migration',
    author: AUTHOR,
    image: {
      src: `${CDN.s3}Artboard_1_copy_Calender_2_2e8e6307af.jpg`,
      alt: 'Common Atlassian Cloud Migration Challenges',
      width: 1100,
      height: 619,
    },
    href: `${ROUTES.resources.blog}/common-atlassian-cloud-migration-challenges`,
    tags: ['Cloud Migration', 'Atlassian'],
    content: [
      {
        type: 'paragraph',
        text: 'Atlassian Cloud migration is a strategic move for organizations looking to modernize - but the projects that stall almost always trip over the same handful of issues.',
      },
      { type: 'heading', text: 'Underestimating app and integration dependencies' },
      {
        type: 'paragraph',
        text: 'A Data Center instance accumulates years of Marketplace apps, custom scripts, and integrations. Cloud equivalents do not always exist, and the ones that do rarely behave identically - that gap needs an audit before a cutover date is ever set.',
      },
      { type: 'heading', text: 'Treating permissions as a lift-and-shift' },
      {
        type: 'paragraph',
        text: "Cloud's permission model is different enough from Data Center that copying schemes over verbatim usually produces either over-permissioned projects or broken workflows. Rebuilding the model deliberately, rather than migrating it as-is, avoids both.",
      },
      { type: 'heading', text: 'No rollback plan' },
      {
        type: 'paragraph',
        text: "Migrations that assume a clean cutover rarely get one. A tested rollback path - and a communication plan for the teams affected while it runs - is what keeps a rough migration window from becoming an outage.",
      },
      {
        type: 'paragraph',
        text: "Clovity's migration engagements start with the dependency and permissions audit precisely because it's where most timelines go wrong. Getting it right up front is what keeps a cloud move on schedule.",
      },
    ],
  },
  {
    kind: 'blog',
    id: 'modern-itsm-for-government',
    slug: 'modern-itsm-for-government-using-jira-service-management',
    title: 'Modern ITSM for Government: Using Jira Service Management',
    excerpt:
      'Public-sector IT teams face increasing expectations - faster service delivery, stronger compliance, and tighter budgets - all while managing aging systems.',
    publishedAt: '2026-02-16',
    readingMinutes: 6,
    category: 'ITSM',
    author: AUTHOR,
    image: {
      src: `${CDN.s3}Modern_ITSM_for_Government_Using_Jira_Service_Management_1_325a75c053.jpg`,
      alt: 'Modern ITSM for Government: Using Jira Service Management',
      width: 1100,
      height: 619,
    },
    href: `${ROUTES.resources.blog}/modern-itsm-for-government-using-jira-service-management`,
    tags: ['ITSM', 'Public Sector'],
    content: [
      {
        type: 'paragraph',
        text: 'Public-sector IT teams face increasing expectations - faster service delivery, stronger compliance, and tighter budgets - all while managing aging systems and rising ticket volumes.',
      },
      { type: 'heading', text: 'Why Jira Service Management fits government workflows' },
      {
        type: 'paragraph',
        text: 'JSM gives agencies a single intake point for IT, HR, and facilities requests, with approval chains and SLAs that map to how government organizations actually operate - rather than a generic private-sector template.',
      },
      { type: 'heading', text: 'Standardizing intake across departments' },
      {
        type: 'paragraph',
        text: 'A consistent request process, shared across departments, cuts response time and closes the visibility gaps citizens and staff notice most - instead of every division running its own inbox and spreadsheet.',
      },
      {
        type: 'paragraph',
        text: 'Agencies that centralize on JSM typically start with a single high-volume service (IT support or facilities) and expand once the workflow is proven, rather than migrating everything at once.',
      },
    ],
  },
  {
    kind: 'blog',
    id: 'why-early-migration-reduces-risk',
    slug: 'why-early-atlassian-cloud-migration-reduces-risk',
    title: 'Why Early Atlassian Cloud Migration Reduces Risk',
    excerpt:
      "Atlassian's long-term strategy is clear: Cloud is the future. While Data Center continues to serve many organizations today, the runway is shortening.",
    publishedAt: '2026-02-04',
    readingMinutes: 5,
    category: 'Cloud Migration',
    author: AUTHOR,
    image: {
      src: `${CDN.s3}Whats_App_Image_2026_02_04_at_4_31_43_PM_60da1832b2.jpeg`,
      alt: 'Why Early Atlassian Cloud Migration Reduces Risk',
      width: 1100,
      height: 619,
    },
    href: `${ROUTES.resources.blog}/why-early-atlassian-cloud-migration-reduces-risk`,
    tags: ['Cloud Migration', 'Atlassian'],
    content: [
      {
        type: 'paragraph',
        text: "Atlassian's long-term strategy is clear: Cloud is the future. While Data Center continues to serve many organizations today, the runway to plan a migration on your own terms - rather than under deadline pressure - keeps getting shorter.",
      },
      { type: 'heading', text: 'Migrating early is a risk-reduction decision, not just a timing one' },
      {
        type: 'paragraph',
        text: 'Teams that migrate ahead of end-of-support deadlines get to test, phase, and roll back on their own schedule. Teams that wait inherit whatever timeline is left, with far less room to fix what breaks.',
      },
      { type: 'heading', text: 'Early movers also get first access to new capability' },
      {
        type: 'paragraph',
        text: 'Atlassian ships new AI and automation features to Cloud first. Organizations already there start compounding those gains while Data Center teams wait for a migration to even begin.',
      },
      {
        type: 'paragraph',
        text: "If Data Center end-of-life is on your roadmap in the next two years, the highest-leverage move is starting the assessment now - not when the deadline forces it.",
      },
    ],
  },
  {
    kind: 'blog',
    id: 'standardising-it-service-requests',
    slug: 'standardising-it-service-requests-in-government',
    title: 'Standardising IT Service Requests in Government',
    excerpt:
      'A consistent intake process across agencies cuts response time and closes the gaps citizens notice most.',
    publishedAt: '2026-01-10',
    readingMinutes: 5,
    category: 'ITSM',
    author: AUTHOR,
    image: {
      src: `${CDN.s3}Standardising_IT_Service_Requests_in_Government_1_07f02e287d.jpg`,
      alt: 'Standardising IT Service Requests in Government',
      width: 1100,
      height: 619,
    },
    href: `${ROUTES.resources.blog}/standardising-it-service-requests-in-government`,
    tags: ['ITSM', 'Public Sector'],
    content: [
      {
        type: 'paragraph',
        text: 'A consistent intake process across agencies cuts response time and closes the gaps citizens notice most - the delayed reply, the request that fell through the cracks between departments.',
      },
      { type: 'heading', text: 'One intake, many departments' },
      {
        type: 'paragraph',
        text: 'Standardizing on a shared service management platform lets IT, facilities, and HR requests flow through the same triage and SLA structure, even when each team owns its own queue.',
      },
      { type: 'heading', text: 'What agencies gain' },
      {
        type: 'list',
        items: [
          'A single reporting view across every department queue',
          'Consistent SLAs citizens and staff can rely on',
          'Fewer requests lost in email or spreadsheet handoffs',
        ],
      },
      {
        type: 'paragraph',
        text: 'Standardization is as much a process change as a tooling one - the platform only pays off once every department agrees to route through it.',
      },
    ],
  },
  {
    kind: 'blog',
    id: 'atlassian-data-center-timeline',
    slug: 'atlassian-data-center-timeline-why-cloud-migration-needs-to-start-now',
    title: 'Atlassian Data Center Is on a Timeline - Why Cloud Migration Needs to Start Now',
    excerpt:
      'Every government agency or enterprise still running on Atlassian Data Center faces the same question: when is the right time to migrate to Atlassian Cloud?',
    publishedAt: '2026-02-02',
    readingMinutes: 6,
    category: 'Cloud Migration',
    author: AUTHOR,
    image: {
      src: `${CDN.s3}Atlassian_Data_centre_without_cap_100_6bfd165987.jpg`,
      alt: 'Atlassian Data Center Is on a Timeline - Why Cloud Migration Needs to Start Now',
      width: 1100,
      height: 619,
    },
    href: `${ROUTES.resources.blog}/atlassian-data-center-timeline-why-cloud-migration-needs-to-start-now`,
    tags: ['Cloud Migration', 'Data Center'],
    content: [
      {
        type: 'paragraph',
        text: 'Every government agency or enterprise still running Atlassian Data Center faces the same question: when is the right time to migrate to Atlassian Cloud? The countdown has already begun, and the answer is almost always "sooner than planned."',
      },
      { type: 'heading', text: 'The end-of-life clock does not wait for budget cycles' },
      {
        type: 'paragraph',
        text: "Support timelines are fixed regardless of an agency's procurement calendar. Starting the assessment a year ahead of a deadline gives budget and security review the room they actually need - starting six months out does not.",
      },
      { type: 'heading', text: 'What an early assessment covers' },
      {
        type: 'list',
        items: [
          'App and integration compatibility on Cloud',
          'Data residency and compliance requirements',
          'A phased migration and rollback plan',
        ],
      },
      {
        type: 'paragraph',
        text: "Agencies that start this work now are the ones who get to migrate on their own schedule instead of the vendor's.",
      },
    ],
  },
];

/** The bundled posts, most recent first - the order the fallback list renders in. */
export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/**
 * Every post for the `/blog` index - revealed in batches by `<LoadMoreGrid>`.
 *
 * `cache()` DEDUPES THE FETCH WITHIN ONE REQUEST. A detail page asks for this list
 * three times over - `generateMetadata`, the article itself, and the "Top Blogs"
 * sidebar - and without this each of those is its own HTTP round trip, multiplied by
 * every page prerendered at build time. React's cache is per-request, so it costs
 * nothing in freshness: the next request re-fetches.
 */
export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  return withCmsFallback(() => getBlogs(), getAllBlogPosts());
});

/**
 * One post by slug.
 *
 * Checks the list first because the caller almost always has already loaded it (see
 * `cache()` above), which makes the common case free. The by-slug request is the path
 * for a post outside the list's first page - with 504 published rows and a 100-row cap,
 * that is most of the archive, and those pages still render in full on demand.
 */
export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const listed = (await getBlogPosts()).find((post) => post.slug === slug);
  if (listed) return listed;

  const fallback = BLOG_POSTS.find((post) => post.slug === slug);
  return withCmsFallback(
    async () => (await getBlogBySlug(slug)) ?? undefined,
    fallback,
  );
}

/** Sibling posts for the "Related Insights" rail and the sidebar. */
export async function getOtherBlogPosts(
  slug: string,
  count: number,
): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter((post) => post.slug !== slug).slice(0, count);
}

/** Slugs to prerender. `dynamicParams` covers the rest of the archive on demand. */
export async function getBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts();
  return prerenderableSlugs('blog', posts.map((post) => post.slug));
}
