'use server';

import { newsletterSchema } from '@/lib/validation';
import { isCmsConfigured, postSubscribe } from '@/api/cms';

/**
 * Newsletter signup, as a Server Action.
 *
 * WHAT CHANGED — this form previously called an API layer that was never configured,
 * so `isApiConfigured()` was always false and the handler just showed the thank-you
 * line. Nothing was ever stored. It now writes to Strapi's `subscribe` collection,
 * which has existed all along.
 *
 * A SERVER ACTION, not a browser call, for the same reason as the contact form: the
 * write needs a token with `create` permission, and that token must not be in a
 * public bundle. The browser's `NEXT_PUBLIC_CMS_API_TOKEN` should be read-only.
 *
 * IT NEVER THROWS. A thrown Server Action reaches the client as an opaque error with
 * no message, so every outcome comes back as data.
 */
export type NewsletterResult =
  | { ok: true }
  | { ok: false; message: string };

export async function subscribeAction(
  email: string,
): Promise<NewsletterResult> {
  const parsed = newsletterSchema.safeParse({ email });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? 'Enter a valid email address.',
    };
  }

  /**
   * No CMS configured — behave as the page always has.
   *
   * Reporting success keeps the UX identical rather than showing a visitor an error
   * caused by our own deployment state. The difference from before is that the
   * address has at least been validated.
   */
  if (!isCmsConfigured()) return { ok: true };

  try {
    await postSubscribe(parsed.data.email);
  } catch {
    return {
      ok: false,
      message: 'We could not sign you up just now. Please try again.',
    };
  }

  return { ok: true };
}
