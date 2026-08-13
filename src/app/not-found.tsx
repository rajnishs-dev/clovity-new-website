import type { Metadata } from 'next';
import {
  AppImage,
  ButtonLink,
  chipClass,
  Container,
  HEADING_CLASS,
  LABEL_CLASS,
  SmartLink,
} from '@/components/ui';
import { notFoundIllustration } from '@/constants/media';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/cn';
import { buildMetadata } from '@/lib/seo';

/**
 * 404 page.
 *
 * `noIndex` matters: a soft-404 that search engines index is worse than the
 * missing page itself, because it competes with the real content.
 *
 * Offers concrete routes onward rather than a dead end - most 404s on a marketing
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
      className="relative flex min-h-[85svh] flex-col items-center bg-grad-tint pb-20"
    >
      <Container className="flex flex-col items-center pt-0 text-center">
        <div className="mb-6 w-full max-w-[540px]">
          <AppImage
            src={notFoundIllustration}
            alt=""
            preload
            className="h-auto w-full"
          />
        </div>

        <div className="mx-auto max-w-[760px]">
          <p className={cn(LABEL_CLASS, 'mb-3')}>Error 404</p>
          <h1 className={cn(HEADING_CLASS, 'mb-4')}>
            We couldn’t find that page.
          </h1>
          <p className="mb-6 text-[16px] leading-[1.65] text-body">
            The link may be out of date, or the page may have moved during
            our site update. Here are a few places worth trying.
          </p>

          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
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
        </div>
      </Container>
    </main>
  );
}
