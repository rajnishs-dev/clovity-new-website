import { env } from '@/config/env';
import { ROUTES } from '@/config/routes';
import { siteConfig } from '@/config/site';
import type {
  BadgeGroup,
  BlogPost,
  CaseStudyItem,
  ContactFormConfig,
  ContentImage,
  CultureHighlight,
  EventItem,
  JobOpening,
  JobTrackFilter,
  NewsItem,
  WebinarItem,
} from '@/types/content';
import {
  excerptFromBlocks,
  readingMinutesFromBlocks,
  richTextToBlocks,
} from './cms.richtext';
import type {
  StrapiAward,
  StrapiBlog,
  StrapiEvent,
  StrapiGetInTouch,
  StrapiJob,
  StrapiJsmResource,
  StrapiLifeAtClovity,
  StrapiMedia,
  StrapiNews,
  StrapiWebinar,
  StrapiWebinarPerson,
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

/* ── Resource collections → the /blog, /news, /events, /webinars and
      /case-study pages ──────────────────────────────────────────────────── */

/**
 * Reserved box for a resource card's artwork.
 *
 * Only a fallback: every live row in these collections has real `width`/`height` on its
 * upload. 1100×619 is the 16:9 pair the bundled fallback content already declares, so a
 * CMS image with no dimensions reserves the same space as the static one it replaces.
 */
const RESOURCE_BOX = { fallbackWidth: 1100, fallbackHeight: 619 } as const;

/**
 * First non-empty date wins.
 *
 * Every one of these collections dates its rows differently — `blog_date`, an event's
 * `startDateTime`, a webinar's hand-typed `createdAtText`, and `news`, which has no
 * date column at all and only has `createdAt`. Each mapper passes its own preference
 * order, and `publishedAt`/`createdAt` backstop them all because `ContentBase.publishedAt`
 * is required and the cards render a `<time>` from it.
 */
function firstDate(...candidates: Array<string | null | undefined>): string {
  for (const candidate of candidates) {
    if (candidate?.trim()) return candidate;
  }
  return '';
}

/**
 * A human-typed date string → ISO, or `null` when it is not parseable.
 *
 * `webinar.createdAtText` is free text. "January 28, 2026" and "October 14, 2025"
 * parse; "6th February 2025" does NOT — `Date` chokes on the ordinal suffix — and it is
 * a live value, so a mapper that trusted this would emit `Invalid Date` on that row.
 */
function parseTypedDate(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const parsed = new Date(value.trim());
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function toBlogPost(row: StrapiBlog): BlogPost | null {
  const image = toContentImage(row.image, {
    fallbackAlt: row.title,
    ...RESOURCE_BOX,
  });
  if (!image) return null;

  const content = richTextToBlocks(row.content);

  return {
    kind: 'blog',
    id: row.documentId || String(row.id),
    slug: row.slug,
    title: row.title,
    excerpt: excerptFromBlocks(content),
    publishedAt: firstDate(row.blog_date, row.publishedAt, row.createdAt),
    ...(row.updatedAt ? { updatedAt: row.updatedAt } : {}),
    image,
    href: `${ROUTES.resources.blog}/${row.slug}`,
    // `author` and `category` have no columns in the `blog` content type, so a
    // CMS-sourced post renders without a byline or a category — both are already
    // conditional in the detail page's meta row.
    ...(content.length
      ? { content, readingMinutes: readingMinutesFromBlocks(content) }
      : {}),
  };
}

export function toNewsItem(row: StrapiNews): NewsItem | null {
  const image = toContentImage(row.featuredImage, {
    fallbackAlt: row.title,
    ...RESOURCE_BOX,
  });
  if (!image) return null;

  const content = richTextToBlocks(row.content);

  return {
    kind: 'news',
    id: row.documentId || String(row.id),
    slug: row.slug,
    title: row.title,
    // The one collection with an editorial summary of its own.
    excerpt: row.subtitle?.trim() || excerptFromBlocks(content),
    publishedAt: firstDate(row.publishedAt, row.createdAt),
    ...(row.updatedAt ? { updatedAt: row.updatedAt } : {}),
    image,
    href: `${ROUTES.resources.news}/${row.slug}`,
    ...(content.length ? { content } : {}),
  };
}

export function toEventItem(row: StrapiEvent): EventItem | null {
  const image = toContentImage(row.featureImage, {
    fallbackAlt: row.name,
    ...RESOURCE_BOX,
  });
  if (!image) return null;

  const startsAt = firstDate(row.startDateTime, row.publishedAt, row.createdAt);

  return {
    kind: 'events',
    id: row.documentId || String(row.id),
    slug: row.slug,
    title: row.name,
    // No description column exists on `event`, so there is nothing to excerpt and no
    // body to render. The cards keep their layout with an empty teaser; adding a
    // `description` richtext field in `clovity-admin` is what fills both.
    excerpt: '',
    publishedAt: startsAt,
    image,
    href: `${ROUTES.resources.events}/${row.slug}`,
    startsAt,
    ...(row.endDateTime ? { endsAt: row.endDateTime } : {}),
    ...(row.location?.trim() ? { location: row.location.trim() } : {}),
    // The published site's cards link straight out to `eventLink`; this site has its own
    // detail route, so the outbound link is preserved here rather than in `href`.
    ...(row.eventLink?.trim() ? { registrationUrl: row.eventLink.trim() } : {}),
    // `category` has no column — the explorer hides its filter and its pill when no
    // event carries one, rather than labelling everything "Government".
  };
}

/**
 * `theWho` / `moderator` → `presenters`.
 *
 * Both are `json` columns holding an array of `{ name, link }` on some rows and the
 * EMPTY STRING on others, so the shape is checked before it is trusted.
 *
 * Each `name` packs the person AND their role into one string, with whichever separator
 * the editor happened to type — "Matthew Graviss — Public Sector CTO at Atlassian" (em
 * dash), "Cameron Starman – Senior Director…" (en dash), "McKenzie Nieman, Marketing
 * Coordinator @ Carahsoft" (comma). The dash split requires surrounding whitespace so a
 * hyphenated name survives it.
 */
function toWebinarPresenters(
  ...columns: unknown[]
): NonNullable<WebinarItem['presenters']> {
  const people: StrapiWebinarPerson[] = columns
    .filter((column): column is StrapiWebinarPerson[] => Array.isArray(column))
    .flat()
    .filter(
      (person): person is StrapiWebinarPerson =>
        typeof person === 'object' && person !== null,
    );

  return people
    .map((person) => {
      const raw = person.name?.trim();
      if (!raw) return null;

      const dash = raw.split(/\s+[—–-]\s+/);
      const parts = dash.length > 1 ? dash : raw.split(/,\s+/);
      const [name, ...rest] = parts;
      if (!name?.trim()) return null;

      return { name: name.trim(), role: rest.join(', ').trim() };
    })
    .filter((person): person is { name: string; role: string } => person !== null);
}

/**
 * A YouTube link → an embeddable one.
 *
 * The CMS stores the watch URL an editor copied from the address bar
 * (`youtube.com/watch?v=ID`); `WebinarSidebar` puts the value straight into an
 * `<iframe src>`, and a watch URL in an iframe is refused by YouTube with
 * "Video unavailable". Already-embed and `youtu.be` forms pass through.
 */
function toEmbedUrl(link: string | null | undefined): string | null {
  const value = link?.trim();
  if (!value) return null;
  if (/youtube\.com\/embed\//i.test(value)) return value;

  const id =
    /[?&]v=([\w-]{6,})/.exec(value)?.[1] ??
    /youtu\.be\/([\w-]{6,})/i.exec(value)?.[1];

  return id ? `https://www.youtube.com/embed/${id}` : value;
}

export function toWebinarItem(row: StrapiWebinar): WebinarItem | null {
  const title = row.title?.trim();
  if (!title) return null;

  const image = toContentImage(row.banner, {
    fallbackAlt: title,
    ...RESOURCE_BOX,
  });
  if (!image) return null;

  const content = richTextToBlocks(row.eventDescription);
  const presenters = toWebinarPresenters(row.theWho, row.moderator);
  const videoUrl = row.showVideoPlayer ? toEmbedUrl(row.youtubeVideoLink) : null;
  const recording = row.recordingLink?.trim();

  return {
    kind: 'webinars',
    id: row.documentId || String(row.id),
    slug: row.slug,
    title,
    excerpt: excerptFromBlocks(content),
    // `createdAtText` is what the published page shows as the session date, so it is
    // preferred over the row's own timestamps — when it parses.
    publishedAt: firstDate(
      parseTypedDate(row.createdAtText),
      row.publishedAt,
      row.createdAt,
    ),
    image,
    href: `${ROUTES.resources.webinars}/${row.slug}`,
    // A session with a recording is watchable on demand; one without is not.
    onDemand: Boolean(recording || videoUrl),
    ...(presenters.length ? { presenters } : {}),
    ...(videoUrl ? { videoUrl } : {}),
    ...(content.length ? { content } : {}),
  };
}

export function toCaseStudyItem(row: StrapiJsmResource): CaseStudyItem | null {
  const image = toContentImage(row.featuredImage, {
    fallbackAlt: row.title,
    ...RESOURCE_BOX,
  });
  if (!image) return null;

  const content = richTextToBlocks(row.content);

  return {
    kind: 'case-study',
    id: row.documentId || String(row.id),
    slug: row.slug,
    title: row.title,
    excerpt: excerptFromBlocks(content),
    publishedAt: firstDate(row.publishedAt, row.createdAt),
    ...(row.updatedAt ? { updatedAt: row.updatedAt } : {}),
    image,
    href: `${ROUTES.resources.caseStudy}/${row.slug}`,
    // `jsm-resource` has no client / industry / category / outcome columns, so those
    // meta chips do not render for CMS rows. The category pill falls back to the
    // literal "Case Study" label the list page already supplies.
    ...(content.length ? { content } : {}),
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
