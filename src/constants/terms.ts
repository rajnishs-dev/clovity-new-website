import { ROUTES } from '@/constants/routes';

export const TERMS_HERO = {
  crumbs: [
    { name: 'Home', href: ROUTES.home },
    { name: 'Terms of Service', href: ROUTES.legal.terms },
  ],
  title: 'Terms of Service',
  lead: 'The rules that govern your use of the Clovity website.',
} as const;
