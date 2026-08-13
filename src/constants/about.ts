import type {
  BadgeGroup,
  BentoTile,
  CredentialBadge,
  CtaLink,
  MilestoneStep,
  PillarCard,
  PressLogo,
  StatBandItem,
} from '@/types/content';
import { ROUTES } from '@/constants/routes';
import { siteConfig } from '@/constants/site';
import {
  aboutWhoWeArePhoto,
  aboutWorkWithUsPhoto,
  badgeCloudSpecialization,
  badgeItsmSpecialization,
  badgeMarketplacePartner,
  badgePlatinumPartner,
  CDN,
} from './media';

/**
 * About page content.
 *
 * Every string here is copied verbatim from the published `about-us.html` - no
 * claim was reworded, softened or added. Where the page states a credential
 * ("Platinum", "four consecutive years", the named agencies), it is reproduced
 * exactly as published, because those are factual claims the company has already
 * made and this migration is not the place to restate them.
 *
 * The one section backed by the CMS is the "Certifications & Diversity" badge
 * group, which reads the Strapi `award` collection. What is below is its FALLBACK:
 * the eight badges the page publishes today, so the section renders identically
 * when Strapi is unreachable or has not been populated. See
 * `data/about.ts`.
 */

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const ABOUT_HERO = {
  crumbs: [
    { name: 'Home', href: ROUTES.home },
    { name: 'About Us', href: ROUTES.discover.about },
  ],
  titleLead: 'Built By Atlassian Experts.',
  titleAccent: 'Trusted By Public-Sector Teams.',
  lead: 'A San Francisco based Atlassian Platinum Solution Partner, helping enterprise and public-sector teams modernize Jira, Confluence, and Bitbucket - securely, and at speed.',
} as const;

/* ── Why Clovity ────────────────────────────────────────────────────────── */

export const ABOUT_WHY_CONTENT = {
  label: 'Why Clovity',
  headingLead: 'Three Things That Set Us ',
  headingHighlight: 'Apart',
} as const;

export const ABOUT_WHY_CARDS: PillarCard[] = [
  {
    id: 'platinum-depth',
    icon: 'atlassian',
    iconChipClass: 'text-brand-600',
    title: 'Atlassian Platinum Depth',
    description:
      'The highest Atlassian partner tier, earned through delivery - Jira, Confluence, JSM, and Government Cloud migrations handled end to end, not just licensed.',
  },
  {
    id: 'ai-in-delivery',
    icon: 'robot',
    iconChipClass: 'text-[#7c3aed]',
    title: 'AI Built Into Delivery',
    description:
      'We ship Pulse AI, our own AI copilot for Jira, on the Atlassian Marketplace - so the AI shaping your instance is the same AI we use to run engagements.',
  },
  {
    id: 'public-sector',
    icon: 'landmark',
    iconChipClass: 'text-accent-500',
    title: 'Public Sector, By Design',
    description:
      'Secure, audit-ready delivery for federal and state agencies - including the IRS, U.S. Coast Guard, NASA, and California EDD - not a side practice bolted onto commercial work.',
  },
];

/* ── Trusted By ─────────────────────────────────────────────────────────── */

export const ABOUT_TRUSTED_CONTENT = {
  label: 'Trusted By',
  headingLead: 'Enterprise & Public-Sector Teams ',
  headingHighlight: 'Building on Clovity',
  /**
   * The marquee's edge-fade colour.
   *
   * `#f5f9ff`, the top of this section's own gradient - not the home page's
   * `#f7f9fc`. The fade exists to hide the loop seam by matching the background
   * behind it, so a mismatched value shows as a pale band at each edge.
   */
  fadeColor: '#f5f9ff',
} as const;

/* ── Who We Are ─────────────────────────────────────────────────────────── */

export const ABOUT_WHO_CONTENT = {
  label: 'Who We Are',
  headingLead: 'A Delivery Partner Built for ',
  headingHighlight: 'Regulated, High-Stakes Teams',
  paragraphs: [
    'We specialize in secure, audit-ready implementations for public-sector and enterprise clients spanning Jira, Confluence, Bitbucket, and beyond.',
    'Our U.S.-led teams combine technical depth with compliance expertise to power modernization at speed - without asking regulated clients to compromise on either.',
    'From licensing and migrations to full-stack automation, we help clients unlock long-term value from their Atlassian ecosystem, backed by a Great Place to Work®-certified culture and four consecutive years on the Inc. 5000 list.',
  ],
  image: {
    src: aboutWhoWeArePhoto,
    alt: 'Clovity team reviewing an Atlassian implementation',
  },
} as const;

/* ── Stat band ──────────────────────────────────────────────────────────── */

export const ABOUT_STATS: StatBandItem[] = [
  {
    id: 'inc-5000',
    value: '4×',
    // Only the first value is wrapped in a <span> in the markup, which is what the
    // `.n span` rule tints orange.
    accent: true,
    label: 'Inc. 5000 Honoree, Consecutive Years',
  },
  {
    id: 'platinum',
    value: 'Platinum',
    label: 'Highest Atlassian Solution Partner Tier',
  },
  {
    id: 'coverage',
    value: '24×7',
    label: 'U.S.-Led Global Delivery Coverage',
  },
  {
    id: 'headquarters',
    value: 'SF',
    label: 'Headquartered in San Francisco',
  },
];

/* ── Our values ─────────────────────────────────────────────────────────── */

export const ABOUT_VALUES_CONTENT = {
  label: 'What Drives Us',
  headingLead: 'The Principles Behind Every ',
  headingHighlight: 'Engagement',
  subheading:
    'Not a poster on a wall - the standard every delivery team is held to.',
} as const;

export const ABOUT_VALUES: BentoTile[] = [
  {
    id: 'security-first',
    icon: 'shield-half',
    iconChipClass: 'text-brand-600',
    title: 'Security & Compliance First',
    description:
      'Every implementation is built audit-ready from day one - the standard our public-sector and enterprise clients require, not an afterthought we bolt on later.',
  },
  {
    id: 'us-led',
    icon: 'flag',
    iconChipClass: 'text-[#7c3aed]',
    title: 'U.S.-Led, Globally Delivered',
    description:
      'Security-cleared U.S. architects lead every engagement, backed by compliant delivery teams that keep progress moving around the clock.',
  },
  {
    id: 'atlassian-depth',
    icon: 'atlassian',
    iconChipClass: 'text-accent-500',
    title: 'Atlassian Depth, Not Just Access',
    description:
      'Platinum-tier certified expertise across Jira, Confluence, JSM, and Government Cloud - earned through delivery, not just a partner badge.',
  },
  {
    id: 'people-first',
    icon: 'people-group',
    iconChipClass: 'text-brand-green',
    title: 'A People-First Culture',
    description:
      'Great Place to Work® certified because how we treat our own team shows up directly in how we treat clients.',
  },
];

/* ── Milestones ─────────────────────────────────────────────────────────── */

export const ABOUT_MILESTONES_CONTENT = {
  label: 'Our Journey',
  headingLead: 'Milestones That ',
  headingHighlight: 'Mark Our Progress',
  subheading:
    'Recognition earned along the way - a signal of consistent delivery, not the goal itself.',
} as const;

export const ABOUT_MILESTONES: MilestoneStep[] = [
  {
    id: 'platinum-tier',
    eyebrow: 'Partner Tier',
    title: 'Atlassian Platinum Solution Partner',
    description:
      'Achieved the highest partner tier with Atlassian, validating our deep expertise across Jira, Confluence, and Government Cloud migrations.',
  },
  {
    id: 'specializations',
    eyebrow: 'Specialization',
    title: 'Cloud Migration & Service Management Specialized',
    description:
      'Atlassian-verified specializations in Cloud Migration and Service Management, on top of our Platinum tier.',
  },
  {
    id: 'inc-5000',
    eyebrow: '4 Years Running',
    title: 'Featured on the Inc. 5000 List',
    description:
      "Recognized as one of America's fastest-growing private companies, four years in a row - driven by customer success and consistent delivery.",
  },
  {
    id: 'great-place-to-work',
    eyebrow: 'Certification',
    title: 'Great Place to Work® Certified',
    description:
      'Certified for a culture of innovation, inclusivity, and people-first values - the same standard we hold ourselves to with clients.',
  },
  {
    id: 'uspaacc',
    eyebrow: 'Supplier Diversity',
    title: 'USPAACC Certified',
    description:
      'Certified by the U.S. Pan Asian American Chamber of Commerce, reflecting our commitment to supplier diversity and delivery excellence.',
  },
];

/* ── Certifications & awards ────────────────────────────────────────────── */

export const ABOUT_CREDENTIALS_CONTENT = {
  label: 'Verified Credentials',
  headingLead: 'Certifications & ',
  headingHighlight: 'Awards',
  subheading:
    'Independently verified Atlassian recognition, compliance, and supplier-diversity credentials our clients rely on.',
} as const;

/**
 * Group one: the four Atlassian partner badges.
 *
 * STATIC ON PURPOSE, unlike group two. These are Atlassian's own brand assets,
 * bundled in `src/assets/images` and shared with the home page's credentials
 * collage - they are governed by Atlassian's partner-badge rules, not by editorial
 * choice, so putting them behind a CMS would let them be replaced with something
 * the programme does not permit. They also carry `tall` on the two specialization
 * SVGs, which the design renders 6px taller and pulled 16px down.
 */
export const ABOUT_ATLASSIAN_BADGES: BadgeGroup = {
  id: 'atlassian-recognition',
  label: 'Atlassian Recognition',
  badges: [
    {
      id: 'platinum-partner',
      name: 'Atlassian Platinum Solution Partner',
      image: {
        src: badgePlatinumPartner,
        alt: 'Atlassian Platinum Solution Partner',
      },
    },
    {
      id: 'cloud-specialization',
      name: 'Atlassian Cloud Migration Specialization',
      image: {
        src: badgeCloudSpecialization,
        alt: 'Atlassian Cloud Migration Specialization',
      },
      tall: true,
    },
    {
      id: 'itsm-specialization',
      name: 'Atlassian Service Management Specialization',
      image: {
        src: badgeItsmSpecialization,
        alt: 'Atlassian Service Management Specialization',
      },
      tall: true,
    },
    {
      id: 'marketplace-partner',
      name: 'Atlassian Marketplace Partner',
      image: {
        src: badgeMarketplacePartner,
        alt: 'Atlassian Marketplace Partner',
      },
    },
  ],
};

/** Group two's label and id - the Strapi-backed group. */
export const ABOUT_AWARDS_GROUP = {
  id: 'certifications-diversity',
  label: 'Certifications & Diversity',
} as const;

/**
 * Reserved box for a badge image, in the ratio the design paints them.
 *
 * next/image needs a width/height pair for every remote source. These badges are
 * laid out at `height: 90px; width: auto`, so only the RATIO matters - 210×90 is
 * the pair the home page's credential badges already use, kept identical so a badge
 * that appears on both pages reserves the same space.
 */
const BADGE_BOX = { width: 210, height: 90 } as const;

/**
 * Fallback badges for the Strapi-backed group.
 *
 * The eight the page publishes today, in published order. Shown when Strapi is not
 * configured, unreachable, or returns nothing - so a CMS problem can never leave
 * this section as a heading over an empty grid.
 */
export const ABOUT_AWARD_BADGES_FALLBACK: CredentialBadge[] = [
  {
    id: 'inc-5000',
    name: 'Inc. 5000',
    image: {
      src: `${CDN.clovityWww}images/about/png/inc-5000.png`,
      alt: 'Inc. 5000',
      ...BADGE_BOX,
    },
  },
  {
    id: 'great-place-to-work',
    name: 'Great Place to Work Certified',
    image: {
      src: `${CDN.clovityWww}images/about/png/greateplace.png`,
      alt: 'Great Place to Work Certified',
      ...BADGE_BOX,
    },
  },
  {
    id: 'uspaacc',
    name: 'USPAACC Certified',
    image: {
      src: `${CDN.clovityWww}images/about/png/uspaacc.png`,
      alt: 'USPAACC Certified',
      ...BADGE_BOX,
    },
  },
  {
    id: 'government-americas',
    name: 'Atlassian Government Americas',
    image: {
      src: `${CDN.clovityWww}email-signature/government-americas.png`,
      alt: 'government americas',
      ...BADGE_BOX,
    },
  },
  {
    id: 'sam-verified',
    name: 'SAM Verified Vendor',
    image: {
      src: `${CDN.clovityWww}images/about/png/sma.png`,
      alt: 'SAM Verified Vendor',
      ...BADGE_BOX,
    },
  },
  {
    id: 'e-verify',
    name: 'E-Verify',
    image: {
      src: `${CDN.clovityWww}images/about/png/verify.png`,
      alt: 'E-Verify',
      ...BADGE_BOX,
    },
  },
  {
    id: 'mbe',
    name: 'MBE Certified',
    image: {
      src: `${CDN.clovityWww}images/about/png/mbe.png`,
      alt: 'MBE Certified',
      ...BADGE_BOX,
    },
  },
  {
    id: 'nmsdc',
    name: 'NMSDC Certified',
    image: {
      src: `${CDN.clovityWww}images/about/png/nmsdc.png`,
      alt: 'NMSDC Certified',
      ...BADGE_BOX,
    },
  },
];

/* ── Featured in ────────────────────────────────────────────────────────── */

/** Painted at `max-height: 50px; max-width: 130px`, so this is the reserved box. */
const PRESS_BOX = { width: 130, height: 50 } as const;

export const ABOUT_PRESS_LABEL = 'Featured In';

export const ABOUT_PRESS_LOGOS: PressLogo[] = [
  {
    id: 'yahoo-news',
    name: 'Yahoo! News',
    image: {
      src: `${CDN.clovityWww}images/about/png/yahoo.png`,
      alt: 'Yahoo! News',
      ...PRESS_BOX,
    },
  },
  {
    id: 'ai-thority',
    name: 'AI Thority',
    image: {
      src: `${CDN.clovityWww}images/about/png/thority.png`,
      alt: 'AI Thority',
      ...PRESS_BOX,
    },
  },
  {
    id: 'wfmj',
    name: '21 WFMJ',
    image: {
      src: `${CDN.clovityWww}images/about/png/wfmj.png`,
      alt: '21 WFMJ',
      ...PRESS_BOX,
    },
  },
  {
    id: 'boston-herald',
    name: 'Boston Herald',
    image: {
      src: `${CDN.clovityWww}images/about/png/herald.png`,
      alt: 'Boston Herald',
      ...PRESS_BOX,
    },
  },
  {
    id: 'kvor',
    name: '740 KVOR',
    image: {
      src: `${CDN.clovityWww}images/about/png/kvor.png`,
      alt: '740 KVOR',
      ...PRESS_BOX,
    },
  },
  {
    id: 'buffalo-news',
    name: 'BN Buffalo News',
    image: {
      src: `${CDN.clovityWww}images/about/png/bn.png`,
      alt: 'BN Buffalo News',
      ...PRESS_BOX,
    },
  },
];

/* ── Mission ────────────────────────────────────────────────────────────── */

export const ABOUT_MISSION_QUOTE =
  'Our mission is to make Atlassian a genuine advantage for the teams that can least afford to get it wrong - secure, modernized, and powered by AI, without the risk of doing it alone.';

/* ── Work with us ───────────────────────────────────────────────────────── */

export const ABOUT_WORK_WITH_US = {
  label: 'Work With Us',
  headingLead: "Let's Build What's Next, ",
  headingHighlight: 'Together',
  subheading:
    "Whether you're modernizing legacy Jira infrastructure, migrating to Atlassian Government Cloud, or rolling out AI-powered workflows, our delivery team can help you get there.",
  ctaLabel: 'Talk to an Expert',
  ctaHref: `mailto:${siteConfig.contact.globalEmail}`,
  image: {
    src: aboutWorkWithUsPhoto,
    alt: 'Clovity architects planning an Atlassian migration',
  },
} as const;

/* ── Final CTA ──────────────────────────────────────────────────────────── */

export const ABOUT_FINAL_CTA = {
  headingLead: 'Ready to take',
  headingTail: 'the next step?',
  description:
    'Talk to our specialists today and gain practical guidance customized to your goals.',
} as const;

export const ABOUT_FINAL_CTA_LINKS: CtaLink[] = [
  {
    id: 'schedule-consultation',
    label: 'Schedule a consultation',
    // The published markup points at `/discover/contact`; this app serves the same
    // page at `/contact`, and ROUTES is the single place that mapping lives.
    href: ROUTES.discover.contact,
    variant: 'white-pill',
    icon: 'arrow-up-right',
  },
];
