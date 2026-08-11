'use client';

import { useEffect } from 'react';
import { ButtonLink, Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { ROUTES } from '@/constants/routes';

/**
 * Route error boundary.
 *
 * Must be a client component - Next.js needs to catch a render error and hand it
 * the `reset` callback.
 *
 * `error.digest` is shown rather than `error.message`: in production Next
 * replaces the message with a generic string and the digest is the only value
 * that correlates to the real server-side stack in the logs. Printing a raw
 * message here would risk leaking internals to a visitor and would still not help
 * anyone debug.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hook for the real error reporter (Sentry et al.) in phase 2.
    console.error('[route-error]', error.digest ?? error.message);
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex min-h-[70svh] items-center justify-center py-20"
    >
      <Container width="prose" className="text-center">
        <span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fef2f2] text-[22px] text-[#dc2626]">
          <Icon name="alert-triangle" />
        </span>

        <h1 className="s-heading mb-4">Something went wrong.</h1>
        <p className="s-sub mb-8">
          We hit an unexpected error loading this page. Try again, or head back
          to the home page - our team has been notified.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Button onClick={reset}>Try again</Button>
          <ButtonLink href={ROUTES.home} variant="secondary">
            Back to home
          </ButtonLink>
        </div>

        {error.digest ? (
          <p className="mt-8 text-[12.5px] text-[#94a3b8]">
            Reference: {error.digest}
          </p>
        ) : null}
      </Container>
    </main>
  );
}
