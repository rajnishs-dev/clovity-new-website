import { env } from '@/config/env';
import { siteConfig } from '@/config/site';
import type {
  BadgeGroup,
  ContactFormConfig,
  ContentImage,
  CultureHighlight,
  JobOpening,
  JobTrackFilter,
} from '@/types/content';
import type {
  StrapiAward,
  StrapiGetInTouch,
  StrapiJob,
  StrapiLifeAtClovity,
  StrapiMedia,
} from './cms.types';

/**
 * Strapi rows → the app's content models.
 *
 * The ONLY place that knows Strapi's field names. Everything downstream — the data
 * layer, the sections, the pages — speaks `@/types/content`, so the design cannot be
 * affected by a CMS field rename, and swapping Strapi out later is a change to this
 * file plus `cms.types.ts`.
 *
 * Two rules every mapper here follows:
 *  • A row that cannot produce a renderable item is DROPPED, not rendered half
 *    empty. A badge with no logo is a blank card in a grid the design expects to be
 *    full; skipping it keeps the layout honest.
 *  • No editorial defaults are invented. Where the CMS has nothing to say, the
 *    field is omitted and the component decides — it is the component that knows
 *    what the published design shows.
 */

/* ── Media ──────────────────────────────────────────────────────────────── */

/**
 * Strapi media → `ContentImage`. Two things this has to get right, both silent
 * failures otherwise:
 *
 * 1. RELATIVE URLS. Strapi's local upload provider returns `/uploads/file.png`,
 *    while the S3 provider configured in `clovity-admin` returns an absolute
 *    `https://…amazonaws.com/…`. Handing the relative form to next/image makes it
 *    resolve against *this* site's origin, which 404s.
 * 2. INTRINSIC SIZE. `next/image` needs `width`/`height` for a remote source or it
 *    throws at render. Strapi always sends both for raster uploads; SVG uploads can
 *    have `null`, so a caller-supplied fallback pair keeps the image rendering
 *    instead of taking the page down.
 */
function isAbsolute(url: string): boolean {
  return /^(https?:)?\/\//i.test(url) || url.startsWith('data:');
}

/** Resolve a Strapi media path to something next/image can actually fetch. */
export function cmsMediaUrl(url: string): string {
  if (!url) return '';
  if (isAbsolute(url)) return url;
  const base = env.strapi.mediaUrl;
  if (!base) return url;
  return `${base}${url.startsWith('/') ? url : `/${url}`}`;
}

interface MediaOptions {
  /** Used when the upload carries no `alternativeText` (SVGs often do not). */
  fallbackAlt: string;
  fallbackWidth?: number;
  fallbackHeight?: number;
  /**
   * Prefer a derived size over the original. Strapi only generates formats for
   * raster images, so this falls through to the original for SVG — desired, not a
   * bug to guard against.
   */
  format?: 'thumbnail' | 'small' | 'medium' | 'large';
}

/**
 * Returns `null` for a missing relation so a caller can drop the item rather than
 * render a broken frame — several of these collections mark `logo`/`image` as
 * required in the schema, but a row created before that constraint existed can still
 * come back with `null`.
 */
export function toContentImage(
  media: StrapiMedia | null | undefined,
  options: MediaOptions,
): ContentImage | null {
  if (!media?.url) return null;

  const derived = options.format ? media.formats?.[options.format] : undefined;
  const source = derived ?? media;

  const width = source.width ?? options.fallbackWidth;
  const height = source.height ?? options.fallbackHeight;

  return {
    src: cmsMediaUrl(source.url),
    alt: media.alternativeText?.trim() || options.fallbackAlt,
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
  };
}

/* ── Awards → the About page's badge row ────────────────────────────────── */

/**
 * Reserved box for a badge image.
 *
 * The design paints these at `height: 90px; width: auto`, so only the RATIO matters —
 * next/image uses it to reserve space and the CSS drives the painted size. 210×90 is
 * the pair the home page's credential badges already use, kept identical so a badge
 * shared between the two pages reserves the same space.
 */
const AWARD_BOX = { fallbackWidth: 210, fallbackHeight: 90 } as const;

/**
 * The `award` collection has no group column — just `title`, `logo` and `order` — so
 * it maps to one flat, order-sorted list. The About page's first badge group (the
 * Atlassian partner badges) is bundled brand artwork, not editorial content, and
 * stays in `constants/about.ts`.
 */
export function toAwardBadges(awards: StrapiAward[]): BadgeGroup['badges'] {
  return awards
    .map((award) => {
      const image = toContentImage(award.logo, {
        fallbackAlt: award.title,
        ...AWARD_BOX,
      });
      if (!image) return null;
      return {
        id: award.documentId || String(award.id),
        name: award.title,
        image,
      };
    })
    .filter((badge): badge is NonNullable<typeof badge> => badge !== null);
}

/* ── Jobs → the Careers page's open positions ───────────────────────────── */

/**
 * Track → pill tint.
 *
 * Keys are the `track` enumeration values in the Strapi schema. The five tints are
 * the ones the published design uses on its role pills, assigned in the order they
 * appear there. An unrecognised value — an editor adding a sixth track — gets the
 * neutral grey pill rather than no pill, which is why this is a lookup with a default
 * and not an exhaustive `Record` over a union.
 */
const TRACK_TAG_CLASS: Record<string, string> = {
  Consulting: 'bg-brand-50 text-brand-600',
  Engineering: 'bg-[#f5f3ff] text-[#7c3aed]',
  'Sales & Marketing': 'bg-[#fff7ed] text-[#c2410c]',
  Corporate: 'bg-[#f1f5f9] text-[#334155]',
  SAP: 'bg-[#f0fdf4] text-brand-green',
};

const TRACK_TAG_FALLBACK = 'bg-[#f1f5f9] text-[#334155]';
const UNTRACKED_LABEL = 'Open Role';

/**
 * The prefilled application mailto, matching the published markup's format.
 *
 * `encodeURIComponent` on both parts because a job title containing `&` — which the
 * "Sales & Marketing" track guarantees — silently truncates the subject otherwise:
 * the browser reads everything after the ampersand as a new mailto parameter.
 */
function applyMailto(title: string, trackLabel: string): string {
  const subject = encodeURIComponent(`Application: ${title} – ${trackLabel}`);
  const body = encodeURIComponent(
    `Hi Clovity Team,\n\nI'd like to apply for the ${title} role. Please find my resume attached.\n\nThanks,\n`,
  );
  return `mailto:${siteConfig.contact.globalEmail}?subject=${subject}&body=${body}`;
}

export function toJobOpening(job: StrapiJob): JobOpening {
  const track = job.track?.trim() ?? '';
  const trackLabel = track || UNTRACKED_LABEL;

  return {
    id: job.documentId || String(job.id),
    slug: job.slug,
    title: job.title,
    track,
    trackLabel,
    trackTagClass: TRACK_TAG_CLASS[track] ?? TRACK_TAG_FALLBACK,
    location: job.location,
    ...(job.experience?.trim() ? { experience: job.experience.trim() } : {}),
    ...(job.practice?.trim() ? { practice: job.practice.trim() } : {}),
    description: job.job_description ?? '',
    applyHref: applyMailto(job.title, trackLabel),
  };
}

/**
 * Build the filter tabs from the openings themselves.
 *
 * Derived rather than hard-coded because a fixed tab list goes wrong in both
 * directions: a tab for a track with no current openings filters to an empty list,
 * and a track an editor adds later gets no tab at all. Order follows first appearance
 * in the (already order-sorted) list, so an editor controls tab order through the
 * same `order` field that controls card order.
 */
export function toJobTrackFilters(jobs: JobOpening[]): JobTrackFilter[] {
  const seen = new Map<string, string>();
  for (const job of jobs) {
    if (job.track && !seen.has(job.track)) seen.set(job.track, job.trackLabel);
  }
  return [
    { id: 'all', label: 'All Roles' },
    ...[...seen].map(([id, label]) => ({ id, label })),
  ];
}

/* ── Life at Clovity → the Careers page's culture photo ─────────────────── */

const CULTURE_BOX = { fallbackWidth: 1200, fallbackHeight: 800 } as const;

export function toCultureHighlight(row: StrapiLifeAtClovity): CultureHighlight {
  return {
    id: row.documentId || String(row.id),
    headingLead: row.header_normal,
    ...(row.header_highlighted?.trim()
      ? { headingHighlight: row.header_highlighted.trim() }
      : {}),
    info: row.info,
    image: toContentImage(row.image, {
      // `info` IS the photo's caption in this collection — "Clovity Team Unites for
      // Team Week Celebrations at Noida HQ, India" — so it is a far better alt text
      // than the gallery title in `header_*`, which is shared by three rows.
      fallbackAlt: row.info?.trim() || row.header_normal,
      ...CULTURE_BOX,
      // `large` rather than the original: these are photographs uploaded at full
      // camera resolution, and the frame never exceeds 620 CSS pixels.
      format: 'large',
    }),
    ...(row.link?.trim() ? { href: row.link.trim() } : {}),
  };
}

/* ── Get In Touch → the Contact page's form configuration ───────────────── */

export function toContactFormConfig(row: StrapiGetInTouch): ContactFormConfig {
  return {
    sourceId: row.documentId || String(row.id),
    emailSubject: row.email_subject,
    showFullName: row.showFullname,
    requireFullName: row.isFullnameRequired,
    showCompany: row.showCompany,
    requireCompany: row.isCompanyRequired,
    showPhone: row.showPhoneNumber,
    requirePhone: row.isPhoneNumberRequired,
  };
}

/* ── Contact form → the Strapi `contact-us` row ─────────────────────────── */

export interface EnquiryInput {
  fullName?: string;
  company?: string;
  phone?: string;
  topic?: string;
  message: string;
}

/**
 * Fold the enquiry into the single `goal` text column.
 *
 * The `contact-us` content type has exactly two columns, `email` and `goal`. The
 * published form asks six questions. Rather than silently discard four of the
 * answers, they are written into `goal` as a labelled block so the whole submission
 * survives in the admin panel. The structured half is ALSO posted to
 * `get-in-touch-lead`, which does have columns for name / company / phone — between
 * the two rows nothing an enquirer typed is lost.
 *
 * If structured columns on `contact-us` are wanted instead, adding them to the
 * content type in `clovity-admin` and extending `StrapiContactUsInput` replaces this
 * function; no page or component changes.
 */
export function composeEnquiryGoal(input: EnquiryInput): string {
  const lines: string[] = [];
  if (input.topic) lines.push(`Interested in: ${input.topic}`);
  if (input.fullName) lines.push(`Name: ${input.fullName}`);
  if (input.company) lines.push(`Company: ${input.company}`);
  if (input.phone) lines.push(`Phone: ${input.phone}`);
  lines.push('', input.message);
  return lines.join('\n');
}
