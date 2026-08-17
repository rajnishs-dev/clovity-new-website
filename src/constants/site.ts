import { env } from './env';
import { ROUTES } from './routes';

/**
 * Single source of truth for brand-level facts. Referenced by metadata,
 * JSON-LD, the footer and the contact page - change it once, everywhere follows.
 *
 * Every value here mirrors the copy already published on the legacy site. No
 * claim was added, embellished or invented during the migration.
 */
export const siteConfig = {
  name: 'Clovity',
  legalName: 'Clovity, Inc.',
  url: env.siteUrl,
  title: 'Clovity - Atlassian + AI Transformation Partner',
  shortTitle: 'Clovity',
  titleTemplate: '%s | Clovity',
  description:
    'Clovity is your Atlassian and AI transformation partner. Modernize teamwork, service delivery, and enterprise operations with Atlassian, AI, automation, and cloud expertise.',
  tagline: 'We Don’t Talk Transformation. We Ship It.',
  footerBlurb:
    'Your Atlassian + AI transformation partner. We modernize enterprise teams with Atlassian expertise, intelligent automation, and cloud-native delivery.',
  locale: 'en_US',
  language: 'en',
  foundingYear: 2009,
  copyrightYear: 2026,

  keywords: [
    'Atlassian Solution Partner',
    'Atlassian Platinum Partner',
    'Jira consulting',
    'Confluence consulting',
    'Jira Service Management',
    'Atlassian Cloud migration',
    'Atlassian Government Cloud',
    'AGC migration',
    'ITSM',
    'DevSecOps',
    'AI automation',
    'Pulse AI for Jira',
    'Atlassian Marketplace apps',
    'public sector Atlassian',
  ],

  /** Default Open Graph / Twitter card image. */
  ogImage: {
    url: '/assets/og/clovity-og.png',
    width: 1200,
    height: 630,
    alt: 'Clovity - Atlassian + AI Transformation Partner',
  },

  twitter: {
    card: 'summary_large_image',
    site: '@clovity',
    creator: '@clovity',
  },

  contact: {
    salesEmail: 'sales@clovity.com',
    supportUrl: 'https://clovity-help-center.vercel.app/',
    responseSla: 'Our team responds within one business day.',
    /**
     * The address every interior-page CTA and the careers "Apply Now" mailto
     * points at, taken from the published markup. One constant, because it
     * appears in ~12 prefilled mailto links across About, Careers and Contact.
     */
    globalEmail: 'info-global@clovity.com',
    /** The address the Privacy Policy and Terms of Service pages point questions to. */
    supportEmail: 'support@clovity.com',
    phone: '(925) 264-6360',
    /** `tel:` form of `phone` - digits only, so the dialler cannot misparse it. */
    phoneHref: 'tel:+19252646360',
    headquarters: 'Dublin, California',
  },

  /**
   * Href values are `#` wherever the legacy markup had `#`. They are kept as
   * data so the CMS can fill them in without a component change.
   */
  social: [
    {
      id: 'facebook',
      label: 'Facebook',
      href: 'https://www.facebook.com/clovity/',
      icon: 'facebook',
    },
    {
      id: 'x',
      label: 'X (Twitter)',
      href: 'https://x.com/ClovityInc',
      icon: 'x',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/clovity/',
      icon: 'linkedin',
    },
    {
      id: 'youtube',
      label: 'YouTube',
      href: 'https://www.youtube.com/@clovityinc',
      icon: 'youtube',
    },
  ],

  legalLinks: [
    { id: 'privacy', label: 'Privacy Policy', href: ROUTES.legal.privacy },
    { id: 'terms', label: 'Terms of Service', href: ROUTES.legal.terms },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
