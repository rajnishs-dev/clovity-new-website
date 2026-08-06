import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { chipClass } from '@/components/ui/Chip';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/Link';
import { ROUTES } from '@/config/routes';
import { buildMetadata } from '@/lib/seo';

/**
 * 404 page.
 *
 * `noIndex` matters: a soft-404 that search engines index is worse than the
 * missing page itself, because it competes with the real content.
 *
 * Offers concrete routes onward rather than a dead end — most 404s on a marketing
 * site are stale inbound links, and the visitor was looking for something
 * specific.
 */
export const metadata: Metadata = buildMetadata({
  title: 'Page not found',
  description:
    'The page you were looking for does not exist or has moved. Explore our Atlassian and AI expertise, resources, or get in touch.',
  path: '/404',
  noIndex: true,
});

const SUGGESTIONS = [
  { label: 'Atlassian Solutions', href: ROUTES.expertise.atlassian },
  { label: 'Cloud Migration', href: ROUTES.expertise.cloudMigration },
  { label: 'AI Solutions', href: ROUTES.expertise.ai },
  { label: 'Case Studies', href: ROUTES.resources.caseStudy },
  { label: 'Blog', href: ROUTES.resources.blog },
  { label: 'Contact', href: ROUTES.discover.contact },
];

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-[70svh] items-center justify-center py-20"
    >
      <Container width="prose" className="text-center">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-[22px] text-brand-600">
          <Icon name="compass" />
        </span>

        <p className="s-label mb-3">Error 404</p>
        <h1 className="s-heading mb-4">We couldn’t find that page.</h1>
        <p className="s-sub mb-8">
          The link may be out of date, or the page may have moved during our
          site update. Here are a few places worth trying.
        </p>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          {SUGGESTIONS.map((suggestion) => (
            <SmartLink
              key={suggestion.href}
              href={suggestion.href}
              className={chipClass('cloud')}
            >
              {suggestion.label}
            </SmartLink>
          ))}
        </div>

        <ButtonLink href={ROUTES.home}>Back to home</ButtonLink>
      </Container>
    </main>
  );
}
