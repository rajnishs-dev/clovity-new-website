import { ROUTES } from '@/config/routes';
import type { CtaLink } from '@/types/content';

/** The "Schedule a consultation" CTA shared by every resource listing/detail page. */
export const RESOURCE_CTA_LINKS: CtaLink[] = [
  {
    id: 'schedule-consultation',
    label: 'Schedule a consultation',
    href: ROUTES.discover.contact,
    variant: 'white',
  },
];
