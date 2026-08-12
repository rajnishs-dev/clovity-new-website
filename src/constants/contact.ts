import type {
  ContactChannel,
  ContactFormConfig,
  CtaLink,
  OfficeLocation,
} from '@/types/content';
import { ROUTES } from '@/constants/routes';
import { siteConfig } from '@/constants/site';

/**
 * Contact page content.
 *
 * Copied verbatim from the published `contact.html`. Two notes on what is and is not
 * CMS-managed:
 *
 *  • THE FORM'S FIELD RULES come from Strapi's `get-in-touch` row for
 *    `CONTACT_FORM_SLUG`, which decides whether name / company / phone show and
 *    whether each is required. `CONTACT_FORM_FALLBACK` is the published field set.
 *  • THE OFFICES ARE STATIC. `clovity-admin` has no office or location content type,
 *    and the legacy site hard-coded the same eight addresses. Postal addresses for a
 *    federal contractor are also the kind of claim that should change through review,
 *    not through a CMS field.
 */

/* ── Hero ───────────────────────────────────────────────────────────────── */

export const CONTACT_HERO = {
  image: {
    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1800&q=80',
    alt: '',
  },
  objectPosition: 'center 40%',
  /** Same graphite scrim as the About page. */
  overlay:
    'linear-gradient(92deg,rgba(8,9,14,.97) 0%,rgba(10,11,18,.73) 30%,rgba(12,13,22,.32) 52%,rgba(12,13,22,.22) 72%,rgba(12,13,22,0) 100%)',
  crumbs: [
    { name: 'Home', href: ROUTES.home },
    { name: 'Contact', href: ROUTES.discover.contact },
  ],
  titleLead: "Let's Talk.",
  titleAccent: "We'll Bring the Right Team.",
  lead: "Whether it's a Jira migration, an AI rollout, or a public-sector modernization project - share the details and we'll get back to you within one business day.",
} as const;

/* ── Form ───────────────────────────────────────────────────────────────── */

/**
 * The `website_slug` this page's Strapi `get-in-touch` row is keyed by.
 *
 * `website_slug` is unique in that content type, so this is the identifier an editor
 * uses to attach a configuration to this page - and what distinguishes leads from
 * here in the admin panel.
 */
export const CONTACT_FORM_SLUG = 'contact';

export const CONTACT_FORM_CONTENT = {
  heading: 'Send Us a Message',
  description:
    'Fill this out and the right specialist will follow up - no ticket queue, no auto-responder loop.',
  submitLabel: 'Send Message',
  submittingLabel: 'Sending…',
  successTitle: 'Message Sent',
  successBody:
    'Thanks for reaching out - a specialist will get back to you within one business day.',
  /** Shown when the submission itself fails, which the static page could not do. */
  errorFallback:
    'We could not send your message. Please try again, or email us directly.',
  fields: {
    fullName: { label: 'Full Name', placeholder: 'Jordan Smith' },
    email: { label: 'Work Email', placeholder: 'jordan@company.com' },
    company: { label: 'Company', placeholder: 'Company name' },
    phone: { label: 'Phone', optionalNote: '(optional)', placeholder: '+1 (555) 000-0000' },
    topic: { label: "I'm Interested In", placeholder: 'Select a topic…' },
    message: {
      label: 'Message',
      placeholder: "Tell us a bit about what you're trying to solve…",
    },
  },
} as const;

/** The eight topics the published `<select>` offers, in order. */
export const CONTACT_TOPICS = [
  'Atlassian Solutions (Jira, Confluence, JSM)',
  'Cloud & Government Cloud Migration',
  'AI Solutions & Pulse AI',
  'ITSM & Managed Services',
  'DevSecOps',
  'Marketplace Apps',
  'Partnership / Reseller',
  'Something Else',
] as const;

/**
 * Field rules when Strapi has no row for this page.
 *
 * Matches the published form exactly: name, email and company required, phone
 * optional. Topic and message are always required and are not configurable - they are
 * the enquiry itself.
 */
export const CONTACT_FORM_FALLBACK: ContactFormConfig = {
  emailSubject: 'Contact enquiry - clovity.com',
  showFullName: true,
  requireFullName: true,
  showCompany: true,
  requireCompany: true,
  showPhone: true,
  requirePhone: false,
};

/* ── Side card ──────────────────────────────────────────────────────────── */

export const CONTACT_SIDE_CONTENT = {
  directHeading: 'Prefer To Reach Out Directly?',
  nextHeading: 'What Happens Next',
  steps: [
    'We review your message within one business day.',
    'A specialist reaches out to scope your goals.',
    'We schedule a call with the right delivery team.',
  ],
} as const;

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: 'email',
    label: 'Email',
    value: siteConfig.contact.globalEmail,
    href: `mailto:${siteConfig.contact.globalEmail}`,
    icon: 'mail',
  },
  {
    id: 'phone',
    label: 'Phone',
    value: siteConfig.contact.phone,
    href: siteConfig.contact.phoneHref,
    icon: 'phone',
  },
  {
    id: 'hq',
    label: 'Global HQ',
    // No href - a city name is not actionable, and the published markup renders it as
    // plain text for exactly that reason.
    value: siteConfig.contact.headquarters,
    icon: 'map-pin',
  },
];

/* ── Global offices ─────────────────────────────────────────────────────── */

export const CONTACT_OFFICES_CONTENT = {
  label: 'Global Offices',
  headingLead: "Wherever You're Delivering, ",
  headingHighlight: "We're Close By",
  subheading:
    'Hover or tap a card to flip it and see the full address and contact for that office.',
  /** Front-face affordance, shown under the city name. */
  flipHint: 'Tap for address',
} as const;

/**
 * Flag image box.
 *
 * The flag is painted into a fixed 64px circle with `object-cover`, so the declared
 * pair only satisfies next/image's requirement for a remote source - it does not drive
 * layout. `w160` is the CDN size the published markup requests.
 */
const FLAG_BOX = { width: 160, height: 120 } as const;

const flag = (code: string, country: string) => ({
  src: `https://flagcdn.com/w160/${code}.png`,
  alt: `${country} flag`,
  ...FLAG_BOX,
});

export const CONTACT_OFFICES: OfficeLocation[] = [
  {
    id: 'dublin-ca',
    tag: 'Global HQ',
    city: 'Dublin, California',
    flag: flag('us', 'United States'),
    icon: 'building',
    accent: 'blue',
    title: 'Global HQ & US Delivery Center',
    addressLines: ['11501 Dublin Blvd, #200', 'Dublin, California 94568'],
    email: 'info-global@clovity.com',
  },
  {
    id: 'noida-in',
    tag: 'Delivery Center',
    city: 'Noida, India',
    flag: flag('in', 'India'),
    icon: 'code',
    accent: 'orange',
    title: 'India Delivery Center',
    addressLines: [
      'Candor Techspace, Block B',
      'Sector 62, Noida 201309, India',
    ],
    email: 'info-asiapacific@clovity.com',
  },
  {
    id: 'los-angeles-ca',
    tag: 'Sales Office',
    city: 'Los Angeles, CA',
    flag: flag('us', 'United States'),
    icon: 'briefcase',
    accent: 'violet',
    title: 'Southern California Sales',
    addressLines: ['633 West Fifth Street', 'Los Angeles, California 90071'],
    email: 'info-west@clovity.com',
  },
  {
    id: 'chicago-il',
    tag: 'Sales Office',
    city: 'Chicago, IL',
    flag: flag('us', 'United States'),
    icon: 'briefcase',
    accent: 'green',
    title: 'Mid-West & East Coast Sales',
    addressLines: ['111 W. Jackson, Suite 1700', 'Chicago, Illinois 60604'],
    email: 'info-east@clovity.com',
  },
  {
    id: 'boulder-co',
    tag: 'Sales Office',
    city: 'Boulder, CO',
    flag: flag('us', 'United States'),
    icon: 'briefcase',
    accent: 'blue',
    title: 'Western Sales',
    addressLines: ['1942 Broadway St, STE 314C', 'Boulder, Colorado 80302'],
    email: 'info-western@clovity.com',
  },
  {
    id: 'okemos-mi',
    tag: 'Sales Office',
    city: 'Okemos, MI',
    flag: flag('us', 'United States'),
    icon: 'briefcase',
    accent: 'orange',
    title: 'Eastern Sales',
    addressLines: ['2222 W. Grand River Ave, STE A', 'Okemos, Michigan 48864'],
    email: 'info-eastern@clovity.com',
  },
  {
    id: 'london-uk',
    tag: 'EMEA & UK',
    city: 'London, UK',
    flag: flag('gb', 'United Kingdom'),
    icon: 'globe',
    accent: 'violet',
    title: 'EMEA & UK Sales',
    addressLines: ['One Canada Square', 'Canary Wharf, London E14 5DY'],
    email: 'info-uk@clovity.com',
  },
  {
    id: 'tokyo-jp',
    tag: 'APAC',
    city: 'Tokyo, Japan',
    flag: flag('jp', 'Japan'),
    icon: 'earth-asia',
    accent: 'green',
    title: 'Japan Office',
    addressLines: [
      'T&G Hamamatsucho Building, 6F',
      '2-12-10 Shiba-Daimon, Minato-Ku',
      'Tokyo 105-0012',
    ],
    noEmailNote: 'Reach us via Global HQ',
  },
];

/* ── Final CTA ──────────────────────────────────────────────────────────── */

export const CONTACT_FINAL_CTA = {
  headingLead: 'Ready to take',
  headingTail: 'the next step?',
  description:
    'Talk to our specialists today and gain practical guidance customized to your goals.',
} as const;

export const CONTACT_FINAL_CTA_LINKS: CtaLink[] = [
  {
    id: 'schedule-consultation',
    label: 'Schedule a consultation',
    href: `mailto:${siteConfig.contact.globalEmail}`,
    variant: 'white-pill',
    icon: 'arrow-up-right',
  },
];
