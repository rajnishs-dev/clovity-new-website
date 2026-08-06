import { env } from './env';

/**
 * Single source of truth for brand-level facts. Referenced by metadata,
 * JSON-LD, the footer and the contact page — change it once, everywhere follows.
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
    'Clovity2 is your Atlassian and AI transformation partner. Modernize teamwork, service delivery, and enterprise operations with Atlassian, AI, automation, and cloud expertise.',
  tagline: 'We Don’t Talk Transformation. We Ship It.',
  footerBlurb:
    'Your Atlassian + AI transformation partner. We modernize enterprise teams with Atlassian expertise, intelligent automation, and cloud-native delivery.',
  locale: 'en_US',
  language: 'en',
  foundingYear: 2009,
  copyrightYear: 2025,

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
    alt: 'Clovity — Atlassian + AI Transformation Partner',
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
  },

  /**
   * Href values are `#` wherever the legacy markup had `#`. They are kept as
   * data so the CMS can fill them in without a component change.
   */
  social: [
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: '#',
      icon: 'linkedin',
    },
    {
      id: 'x',
      label: 'X (Twitter)',
      href: '#',
      icon: 'x',
    },
    {
      id: 'youtube',
      label: 'YouTube',
      href: '#',
      icon: 'youtube',
    },
    {
      id: 'github',
      label: 'GitHub',
      href: '#',
      icon: 'github',
    },
  ],

  legalLinks: [
    { id: 'privacy', label: 'Privacy Policy', href: '#' },
    { id: 'terms', label: 'Terms of Service', href: '#' },
    { id: 'cookies', label: 'Cookie Policy', href: '#' },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
