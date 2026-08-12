import type {
  FooterColumn,
  NavFeatureCard,
  NavItem,
  NavLink,
  SocialLink,
} from '@/types/navigation';
import { formatContentDate } from '@/lib/format';
import { resolveImageSrc } from '@/lib/image';
import { getAllBlogPosts } from '@/data/blog';
import { getAllEvents } from '@/data/events';
import { EXTERNAL_LINKS, ROUTES } from './routes';
import { siteConfig } from './site';

/**
 * The whole navigation tree, extracted verbatim from the legacy markup.
 *
 * Labels, descriptions, ordering and icon classes match index.html exactly.
 * The header, mega menus, mobile drawer and footer all render from this one
 * structure - so the desktop and mobile menus can no longer drift apart, and
 * swapping in a CMS-served tree later touches this file only.
 */

/* ── Expertise ──────────────────────────────────────────────────────────── */

const EXPERTISE_PLATFORM: NavLink[] = [
  {
    id: 'atlassian',
    label: 'Atlassian Solutions',
    href: ROUTES.expertise.atlassian,
    description: 'Jira, Confluence & JSM deployment and optimization',
    icon: 'atlassian',
  },
  {
    id: 'cloud-migration',
    label: 'Cloud Migration',
    href: ROUTES.expertise.cloudMigration,
    description: 'Atlassian Cloud and enterprise cloud modernization',
    icon: 'cloud-upload',
  },
  {
    id: 'marketplace-apps',
    label: 'Marketplace Apps',
    href: ROUTES.expertise.marketplaceApps,
    description: 'AI-powered apps built for the Atlassian ecosystem',
    icon: 'store',
  },
];

const EXPERTISE_DELIVERY: NavLink[] = [
  {
    id: 'itsm',
    label: 'ITSM & Service Management',
    href: ROUTES.expertise.itsm,
    description: 'Enterprise service desk and ITIL-aligned operations',
    icon: 'headset',
  },
  {
    id: 'managed-services',
    label: 'Managed Services',
    href: ROUTES.expertise.managedServices,
    description: '24/7 support, administration, and platform health',
    icon: 'settings',
  },
  {
    id: 'devsecops',
    label: 'DevSecOps',
    href: ROUTES.expertise.devsecops,
    description: 'Secure CI/CD pipelines and software delivery lifecycle',
    icon: 'shield-half',
  },
];

const EXPERTISE_PEOPLE: NavLink[] = [
  {
    id: 'ai',
    label: 'AI Solutions',
    href: ROUTES.expertise.ai,
    description: 'Intelligent automation and AI-powered workflows',
    icon: 'brain',
  },
  {
    id: 'workforce',
    label: 'Workforce Solutions',
    href: ROUTES.expertise.workforce,
    description: 'Atlassian-certified staff augmentation and talent',
    icon: 'users',
  },
];

/** Flat list in the exact order the mobile accordion renders it. */
export const EXPERTISE_MOBILE_ORDER: NavLink[] = [
  EXPERTISE_PLATFORM[0]!,
  EXPERTISE_PEOPLE[0]!,
  EXPERTISE_DELIVERY[0]!,
  EXPERTISE_DELIVERY[2]!,
  EXPERTISE_PLATFORM[1]!,
  EXPERTISE_DELIVERY[1]!,
  EXPERTISE_PEOPLE[1]!,
  EXPERTISE_PLATFORM[2]!,
];

/* ── Resources ──────────────────────────────────────────────────────────── */

const RESOURCES_LEARN: NavLink[] = [
  {
    id: 'blog',
    label: 'Blogs',
    href: ROUTES.resources.blog,
    description: 'Expert insights on Atlassian, AI, and enterprise tech',
    icon: 'pen-nib',
  },
  {
    id: 'case-studies',
    label: 'Case Studies',
    href: ROUTES.resources.caseStudy,
    description: 'Real transformation stories from our enterprise clients',
    icon: 'chart-line',
  },
  {
    id: 'events',
    label: 'Events',
    href: ROUTES.resources.events,
    description: 'Live events, summits, and community gatherings',
    icon: 'calendar-days',
  },
];

const RESOURCES_CONNECTED: NavLink[] = [
  {
    id: 'webinars',
    label: 'Webinars',
    href: ROUTES.resources.webinars,
    description: 'On-demand and live sessions with our product experts',
    icon: 'video',
  },
  {
    id: 'news',
    label: 'News',
    href: ROUTES.resources.news,
    description: 'Latest updates, announcements, and press releases',
    icon: 'newspaper',
  },
  {
    id: 'app-support',
    label: 'App Support',
    href: EXTERNAL_LINKS.appSupport,
    description: "Get help with Clovity's Atlassian Marketplace apps",
    icon: 'life-ring',
    external: true,
    highlight: true,
  },
];

/* ── Discover ───────────────────────────────────────────────────────────── */

const DISCOVER_LINKS: NavLink[] = [
  {
    id: 'about-us',
    label: 'About Us',
    href: ROUTES.discover.about,
    description: 'Our story, mission, values, and leadership team',
    icon: 'building',
  },
  {
    id: 'careers',
    label: 'Careers',
    href: ROUTES.discover.careers,
    description: 'Join our team of Atlassian and AI experts',
    icon: 'briefcase',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: ROUTES.discover.contact,
    description: 'Get in touch with our team for any inquiry',
    icon: 'mail',
  },
];

/* ── Resources mega panel: "What's New" rail ───────────────────────────── */

/**
 * The two "What's New" feature cards in the Resources mega panel — always the
 * single most recent event and the single most recent blog post, read
 * straight from the same static data the `/events` and `/blog` pages render,
 * rather than a hand-maintained pair of URLs that drift out of date (the
 * legacy markup linked to `clovity.com` — the old production site — instead
 * of this app's own pages).
 */
const [latestEvent] = getAllEvents();
const [latestBlog] = getAllBlogPosts();

const WHATS_NEW_CARDS: NavFeatureCard[] = [
  ...(latestEvent
    ? [
        {
          id: latestEvent.id,
          tag: `Event · ${formatContentDate(latestEvent.publishedAt)}`,
          title: latestEvent.title,
          href: latestEvent.href,
          imageUrl: resolveImageSrc(latestEvent.image.src),
          imageAlt: latestEvent.image.alt,
          ctaLabel: 'Read the full story',
          ...(latestEvent.external ? { external: true } : {}),
        },
      ]
    : []),
  ...(latestBlog
    ? [
        {
          id: latestBlog.id,
          tag: `Blog · ${formatContentDate(latestBlog.publishedAt)}`,
          title: latestBlog.title,
          href: latestBlog.href,
          imageUrl: resolveImageSrc(latestBlog.image.src),
          imageAlt: latestBlog.image.alt,
          ctaLabel: 'Read the full story',
          ...(latestBlog.external ? { external: true } : {}),
        },
      ]
    : []),
];

/* ── Assembled primary nav ──────────────────────────────────────────────── */

export const PRIMARY_NAV: NavItem[] = [
  { kind: 'link', id: 'home', label: 'Home', href: ROUTES.home },
  {
    kind: 'mega-full',
    id: 'expertise',
    label: 'Expertise',
    columns: [
      { id: 'platform', title: 'Platform & Cloud', links: EXPERTISE_PLATFORM },
      { id: 'delivery', title: 'Service Delivery', links: EXPERTISE_DELIVERY },
      { id: 'people', title: 'People & Innovation', links: EXPERTISE_PEOPLE },
    ],
    rail: {
      kind: 'cta',
      card: {
        icon: 'comments',
        title: 'Not sure where to start?',
        description:
          'Talk to an Atlassian-certified expert about your challenge.',
        ctaLabel: 'Talk to an Expert',
        href: ROUTES.discover.contact,
      },
    },
  },
  {
    kind: 'mega-full',
    id: 'resources',
    label: 'Resources',
    variant: 'resources',
    columns: [
      { id: 'learn', title: 'Learn & Discover', links: RESOURCES_LEARN },
      { id: 'connected', title: 'Stay Connected', links: RESOURCES_CONNECTED },
    ],
    rail: {
      kind: 'feature',
      title: "What's New",
      cards: WHATS_NEW_CARDS,
    },
  },
  {
    kind: 'dropdown',
    id: 'discover',
    label: 'Discover',
    eyebrow: 'Our Company',
    width: 400,
    links: DISCOVER_LINKS,
  },
];

/** The header/mobile-drawer primary CTA. `#` matches the legacy markup. */
export const HEADER_CTA = {
  label: 'Talk to an Expert',
  href: ROUTES.discover.contact,
} as const;

/* ── Footer ─────────────────────────────────────────────────────────────── */

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: 'expertise',
    title: 'Expertise',
    links: EXPERTISE_MOBILE_ORDER.map((link) => ({
      ...link,
      group: 'expertise' as const,
    })),
  },
  {
    id: 'resources',
    title: 'Resources',
    links: [
      ...RESOURCES_LEARN.map((l) => ({ ...l, group: 'resources' as const })),
      { ...RESOURCES_CONNECTED[0]!, group: 'resources' as const },
      { ...RESOURCES_CONNECTED[1]!, group: 'resources' as const },
    ],
  },
  {
    id: 'discover',
    title: 'Discover',
    links: [
      ...DISCOVER_LINKS.map((l) => ({ ...l, group: 'discover' as const })),
      { id: 'partner-program', label: 'Partner Program', href: '#' },
    ],
  },
];

export const FOOTER_SOCIALS: SocialLink[] = [...siteConfig.social];
