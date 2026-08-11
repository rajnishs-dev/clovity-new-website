'use server';

import { buildEnquirySchema, type EnquiryFormValues } from '@/lib/validation';
import { isCmsConfigured, postEnquiry } from '@/api/cms';
import { CONTACT_FORM_CONTENT } from '@/constants/contact';
import { getContactFormConfig } from './data';

/**
 * Contact form submission, as a Server Action.
 *
 * WHY A SERVER ACTION AND NOT A CLIENT POST — the legacy frontend posted to Strapi
 * straight from the browser with `NEXT_PUBLIC_CMS_API_TOKEN` in an `Authorization`
 * header, which puts a write-capable token in every visitor's dev tools. Running the
 * write here keeps the token in the server bundle: `api/cms` is only ever reached
 * from server code, so the value is never inlined into a client chunk even though its
 * name carries the `NEXT_PUBLIC_` prefix.
 *
 * IT RE-VALIDATES, and re-fetches the rules to do it. The client validates for
 * feedback; this validates for trust. Crucially it fetches the `get-in-touch`
 * configuration itself rather than accepting the field rules from the request — a
 * caller who sends `requireCompany: false` must not be able to relax the server's
 * rules by asking.
 *
 * IT NEVER THROWS. A thrown Server Action surfaces to the client as an opaque error
 * with no message, so every outcome is returned as data the form can render.
 */

export type EnquiryActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

export async function submitEnquiryAction(
  values: EnquiryFormValues,
): Promise<EnquiryActionResult> {
  const config = await getContactFormConfig();

  const parsed = buildEnquirySchema(config).safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      (fieldErrors[key] ??= []).push(issue.message);
    }
    return {
      ok: false,
      message: 'Please correct the highlighted fields.',
      fieldErrors,
    };
  }

  const data = parsed.data;

  /**
   * No CMS configured — behave exactly as the published page did.
   *
   * The static site's handler called `preventDefault()` and revealed the thank-you
   * panel; nothing was ever sent. Reporting success here keeps that UX identical
   * rather than showing a visitor an error caused by our own deployment state. The
   * difference from the original is that validation has already run, so a
   * malformed address gets a message instead of a silent "sent".
   */
  if (!isCmsConfigured()) return { ok: true };

  try {
    await postEnquiry({
      email: data.email,
      message: data.message,
      ...(data.fullName ? { fullName: data.fullName } : {}),
      ...(data.company ? { company: data.company } : {}),
      ...(data.phone ? { phone: data.phone } : {}),
      ...(data.topic ? { topic: data.topic } : {}),
      emailSubject: config.emailSubject,
      ...(config.sourceId ? { sourceId: config.sourceId } : {}),
    });
  } catch {
    // The CMS layer throws rather than returning an envelope. The reason is never
    // shown to the visitor — a Strapi validation message is not useful to them, and
    // echoing it back would leak the collection's shape.
    return { ok: false, message: CONTACT_FORM_CONTENT.errorFallback };
  }

  return { ok: true };
}
