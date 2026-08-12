'use server';

import {
  webinarRegistrationSchema,
  type WebinarRegistrationValues,
} from '@/lib/validation';
import { isCmsConfigured, postRecordingRequest } from '@/api/cms';
import { getWebinarItemBySlug } from '@/data/webinars';

/**
 * "Get the Recording" submission, as a Server Action.
 *
 * WHY A SERVER ACTION AND NOT A CLIENT POST — `website-t` posts to Strapi straight from
 * the browser with `NEXT_PUBLIC_CMS_API_TOKEN` in an `Authorization` header, which puts a
 * write-capable token in every visitor's dev tools. Running the write here keeps the
 * token in the server bundle. Same collection, same field names, same resulting rows;
 * only the hop changes. This matches how the contact form and the newsletter already
 * work in this app.
 *
 * IT NEVER THROWS. A thrown Server Action reaches the client as an opaque error with no
 * message, so every outcome comes back as data the form can render.
 */

export type RecordingActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> };

const GENERIC_ERROR =
  'Something went wrong sending your request. Please try again, or email sales@clovity.com.';

export async function registerRecordingAction(
  /**
   * The session, as a SLUG and as a separate argument - not a field inside `values`.
   * Keeping it out of the form schema is what stops a value nobody types from failing
   * client-side validation where no error can be shown. It is still re-resolved below,
   * so a caller cannot tag a row with a webinar that does not exist.
   */
  slug: string,
  values: WebinarRegistrationValues,
): Promise<RecordingActionResult> {
  const parsed = webinarRegistrationSchema.safeParse(values);
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
   * The session is looked up SERVER-SIDE from the id the form carries, never trusted
   * from the request beyond that id. `recordingMonth` is derived here rather than posted
   * by the client, so a caller cannot write arbitrary text into the column that the
   * admin panel uses to group requests by session.
   */
  const webinar = await getWebinarItemBySlug(slug.trim());
  if (!webinar) return { ok: false, message: GENERIC_ERROR };

  /**
   * `recordingMonth` IS REQUIRED BY THE CONTENT TYPE, and `website-t` fills it from the
   * webinar's `eventHeader` — a field that is null on three of the four published
   * sessions. Sending the body without it means a 400, so on those three every
   * submission there fails. Falling back to the session date (`whenLabel`, which every
   * row has) and finally to the title keeps the row valid and still identifies which
   * webinar it belongs to.
   */
  const recordingMonth =
    webinar.whenLabel?.trim() || webinar.title.trim() || webinar.slug;

  // Titlecase the way the published form does, so "jane" and "Jane" do not become two
  // people in the admin panel's list.
  const capitalize = (value: string): string =>
    value.charAt(0).toUpperCase() + value.slice(1);

  /**
   * No CMS configured — report success rather than showing a visitor an error caused by
   * our own deployment state. Validation has already run, so a malformed address still
   * gets a message instead of a silent "sent". Same choice the contact form makes.
   */
  if (!isCmsConfigured()) return { ok: true };

  try {
    await postRecordingRequest({
      firstName: capitalize(data.firstName),
      lastName: capitalize(data.lastName),
      email: data.email,
      country: data.country,
      recordingDocId: webinar.id,
      recordingMonth,
    });
  } catch {
    // The reason is never shown to the visitor: a Strapi validation message is not
    // useful to them, and echoing it back would leak the collection's shape.
    return { ok: false, message: GENERIC_ERROR };
  }

  return { ok: true };
}
