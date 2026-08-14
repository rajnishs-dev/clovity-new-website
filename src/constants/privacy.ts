import { ROUTES } from '@/constants/routes';

export const PRIVACY_HERO = {
  crumbs: [
    { name: 'Home', href: ROUTES.home },
    { name: 'Privacy Policy', href: ROUTES.legal.privacy },
  ],
  title: 'Privacy Policy',
  lead: 'How Clovity collects, uses, and protects the information you share with us.',
} as const;
