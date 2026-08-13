import { timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { serverEnv } from '@/constants/env';
import { ROUTES } from '@/constants/routes';

/**
 * On-demand revalidation webhook for `clovity-admin` (Strapi): lets an editor's publish
 * appear immediately instead of waiting out a page's time-based `revalidate` window (5
 * min for About/Careers, 1 hour elsewhere). Those windows stay as a safety net in case
 * the webhook is misconfigured or fails silently.
 *
 * Strapi setup: Settings → Webhooks → new webhook, POST to `/api/revalidate` with header
 * `x-revalidate-secret: <REVALIDATE_SECRET>`, on Entry publish/unpublish/update/delete
 * and Media create/update/delete.
 *
 * Security: POST only; a shared secret is required (an unset `REVALIDATE_SECRET` refuses
 * every request rather than degrading to no auth); the comparison is timing-safe; the
 * response only lists revalidated paths, never payload content.
 */

/**
 * Strapi content-type name → the pages that render it. Only the listing page is listed
 * for resource entries; detail pages are dynamic segments and `revalidatePath` needs a
 * concrete path, so they're left to their own hourly window instead of being guessed at.
 */
const MODEL_ROUTES: Record<string, readonly string[]> = {
  // About: the "Certifications & Diversity" badge row.
  award: [ROUTES.discover.about],
  // Careers: open positions, and the culture block's photograph.
  job: [ROUTES.discover.careers],
  'life-at-clovity': [ROUTES.discover.careers],
  // Contact: which form fields show and whether each is required.
  'get-in-touch': [ROUTES.discover.contact],

  // The resource collections. `news`'s route is `/api/newses`; case studies come from
  // `jsm-resource` - see `CMS_ENDPOINTS` in `src/api/cms.ts`. Each also revalidates
  // HOME, since its "field notes" module shows the four latest of every one of these.
  blog: [ROUTES.resources.blog, ROUTES.home],
  news: [ROUTES.resources.news, ROUTES.home],
  event: [ROUTES.resources.events, ROUTES.home],
  webinar: [ROUTES.resources.webinars, ROUTES.home],
  'jsm-resource': [ROUTES.resources.caseStudy, ROUTES.home],
};

/**
 * Every CMS-backed page - used for media events, which carry no model (a replaced
 * upload could be an award badge, culture photo, or blog hero, and Strapi doesn't say
 * which). Revalidating everything is cheaper than guessing wrong.
 */
const ALL_CMS_ROUTES = [
  ROUTES.home,
  ROUTES.discover.about,
  ROUTES.discover.careers,
  ROUTES.discover.contact,
  ROUTES.resources.blog,
  ROUTES.resources.news,
  ROUTES.resources.events,
  ROUTES.resources.webinars,
  ROUTES.resources.caseStudy,
] as const;

/** Constant-time string compare that tolerates differing lengths. */
function secretMatches(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  // `timingSafeEqual` throws on a length mismatch, which would itself leak the
  // length. Compare against a padded copy and fold the length check into the result.
  const length = Math.max(a.length, b.length);
  const padded = (buffer: Buffer) => {
    const out = Buffer.alloc(length);
    buffer.copy(out);
    return out;
  };
  return timingSafeEqual(padded(a), padded(b)) && a.length === b.length;
}

interface StrapiWebhookBody {
  /** e.g. `entry.publish`, `entry.update`, `media.create`. */
  event?: string;
  /** Singular content-type name, e.g. `job`. Absent on media events. */
  model?: string;
  /** e.g. `api::job.job`. Present alongside `model` on entry events. */
  uid?: string;
}

export async function POST(request: Request) {
  const { revalidateSecret } = serverEnv();

  if (!revalidateSecret) {
    return NextResponse.json(
      { revalidated: [], message: 'Revalidation is not configured.' },
      { status: 503 },
    );
  }

  const provided =
    request.headers.get('x-revalidate-secret') ??
    // Strapi's webhook UI only allows custom headers, but a bearer token is what a
    // proxy in front of it may rewrite the header into, so both are accepted.
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    '';

  if (!secretMatches(provided, revalidateSecret)) {
    return NextResponse.json(
      { revalidated: [], message: 'Invalid secret.' },
      { status: 401 },
    );
  }

  let body: StrapiWebhookBody = {};
  try {
    body = (await request.json()) as StrapiWebhookBody;
  } catch {
    // Strapi always sends JSON; a malformed body is treated as "something changed,
    // but I cannot tell what", which the fall-through below handles.
  }

  const event = body.event ?? '';
  const model = body.model ?? body.uid?.split('.').pop() ?? '';

  const paths = event.startsWith('media.')
    ? [...ALL_CMS_ROUTES]
    : [...(MODEL_ROUTES[model] ?? [])];

  if (paths.length === 0) {
    // A content type this site does not render - `dynamic-page`, `news-ticker`,
    // `recording`, the lead collections. Not an error: Strapi fires one webhook for
    // everything, and answering 200 keeps it from marking the endpoint as failing
    // and retrying.
    return NextResponse.json({
      revalidated: [],
      message: `No page renders "${model || event || 'unknown'}".`,
    });
  }

  for (const path of paths) revalidatePath(path);

  return NextResponse.json({ revalidated: paths, model, event });
}

/**
 * A GET returns 405 rather than 404: opening the URL in a browser is the first thing
 * anyone does when a webhook isn't firing, and 405 says the route exists and the
 * problem is elsewhere, while a 404 sends them looking for a deploy issue that isn't there.
 */
export function GET() {
  return NextResponse.json(
    { message: 'POST only. See the Strapi webhook setup in this route file.' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}
