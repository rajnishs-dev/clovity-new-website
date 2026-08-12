import { timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { serverEnv } from '@/constants/env';
import { ROUTES } from '@/constants/routes';

/**
 * On-demand revalidation webhook for `clovity-admin` (Strapi).
 *
 * ── WHAT IT SOLVES ──
 * The CMS-backed pages are statically generated and carry a time-based
 * `revalidate` window (5 minutes for About and Careers, 1 hour for Contact and every
 * resource page). That window is a floor on how long a publish takes to appear. This
 * endpoint lets Strapi say "this changed, rebuild that page now", so an editor sees
 * their change on the next request instead of waiting out the timer.
 *
 * The time-based windows STAY as a safety net. If the webhook is misconfigured,
 * blocked by a firewall, or fails silently, the site still refreshes on its own -
 * just more slowly. Removing them would make one fragile HTTP call the only thing
 * standing between an edit and a stale site.
 *
 * ── HOW TO WIRE IT UP IN STRAPI ──
 * Settings → Webhooks → Create new webhook
 *   URL      POST https://<site>/api/revalidate
 *   Header   x-revalidate-secret: <the REVALIDATE_SECRET value from .env.local>
 *   Events   Entry: publish, unpublish, update, delete
 *            Media: create, update, delete   (a replaced logo or photo)
 *
 * ── SECURITY ──
 * Revalidation is cheap but not free, and an open endpoint is a way to make a site
 * regenerate on demand. So:
 *   • POST only.
 *   • A shared secret is REQUIRED. If `REVALIDATE_SECRET` is unset the endpoint
 *     refuses every request - an unset secret must never degrade to "no auth", which
 *     is the classic way these endpoints end up public.
 *   • The comparison is timing-safe, so the secret cannot be recovered a byte at a
 *     time by measuring response latency.
 *   • The response says which paths were revalidated and nothing about the payload,
 *     so it cannot be used to probe what is in the CMS.
 */

/**
 * Strapi content-type name → the pages that render it.
 *
 * The resource entries list the LISTING page only. Their detail pages are dynamic
 * segments, and `revalidatePath` needs a concrete path - the webhook payload does carry
 * the entry, but Strapi's shape for it differs by event, so the detail page is left to
 * its own hourly `revalidate` window instead of being guessed at here. Publishing
 * therefore updates a listing immediately and the article within the hour.
 */
const MODEL_ROUTES: Record<string, readonly string[]> = {
  // About: the "Certifications & Diversity" badge row.
  award: [ROUTES.discover.about],
  // Careers: open positions, and the culture block's photograph.
  job: [ROUTES.discover.careers],
  'life-at-clovity': [ROUTES.discover.careers],
  // Contact: which form fields show and whether each is required.
  'get-in-touch': [ROUTES.discover.contact],

  // The resource collections. `news` is the singular model name even though the route
  // is `/api/newses`, and the case studies come from `jsm-resource` - see
  // `CMS_ENDPOINTS` in `src/api/cms.ts` for why that is the right collection.
  //
  // Each also revalidates HOME, because the "What We Learn in the Field" module there
  // renders the four latest of every one of these collections. Miss that and a publish
  // updates the listing page while the home page keeps showing the previous four.
  blog: [ROUTES.resources.blog, ROUTES.home],
  news: [ROUTES.resources.news, ROUTES.home],
  event: [ROUTES.resources.events, ROUTES.home],
  webinar: [ROUTES.resources.webinars, ROUTES.home],
  'jsm-resource': [ROUTES.resources.caseStudy, ROUTES.home],
};

/**
 * Every CMS-backed page.
 *
 * Used for media events, which carry no model: a replaced upload could be an award
 * badge, a culture photo or a blog post's hero, and Strapi does not say which entry
 * references it. Revalidating all of them is cheaper than getting it wrong.
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
 * A GET returns 405 rather than 404.
 *
 * Opening the URL in a browser is the first thing anyone does when a webhook is not
 * firing, and "405 Method Not Allowed" tells them the route exists and their problem
 * is elsewhere. A 404 sends them looking for a deploy issue that is not there.
 */
export function GET() {
  return NextResponse.json(
    { message: 'POST only. See the Strapi webhook setup in this route file.' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}
