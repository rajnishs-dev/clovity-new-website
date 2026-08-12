import type { ContactFormConfig } from '@/types/content';
import { getInTouch, withCmsFallback } from '@/api/cms';
import { CONTACT_FORM_FALLBACK, CONTACT_FORM_SLUG } from '@/constants/contact';

/**
 * The Contact page's data layer.
 *
 * One loader: the form's field configuration, from the Strapi `get-in-touch` row whose
 * `website_slug` is `'contact'`. It decides whether the name, company and phone fields
 * appear and whether each is mandatory, so a change to what the form asks for is an
 * edit in `clovity-admin` rather than a deploy.
 *
 * `getInTouch()` resolves to `null` - a success, not a failure - when no
 * row exists for the slug, which is the ordinary state before anyone has created one.
 * The `??` below turns that into the published field set, so the form always has rules
 * to validate against.
 */
export async function getContactFormConfig(): Promise<ContactFormConfig> {
  const config = await withCmsFallback(
    () => getInTouch(CONTACT_FORM_SLUG),
    CONTACT_FORM_FALLBACK,
  );

  return config ?? CONTACT_FORM_FALLBACK;
}
