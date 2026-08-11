/**
 * Strapi 5 wire shapes for the `clovity-admin` instance.
 *
 * These are the RAW responses, not the app's content models. Everything here is
 * shaped by Strapi's REST conventions — flattened attributes, a `documentId`
 * alongside the numeric `id`, media as a nested object with `formats` — and none
 * of it leaks past `cms.mappers.ts`. Sections consume `@/types/content`, so if
 * Strapi is ever swapped for another CMS only this file and the mappers change.
 *
 * Field names mirror the `schema.json` content-type definitions under
 * `clovity-admin/src/api` exactly. Optional markers
 * follow those schemas' `required` flags, plus one extra rule: anything that is
 * only present when the request asked to `populate` it is optional here, because
 * a caller that forgets `populate` gets `undefined` rather than a throw.
 */

/* ── Envelopes ──────────────────────────────────────────────────────────── */

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiListResponse<TEntity> {
  data: TEntity[];
  meta: { pagination?: StrapiPagination };
}

export interface StrapiSingleResponse<TEntity> {
  data: TEntity | null;
  meta: Record<string, unknown>;
}

/** Every collection entry carries these, regardless of content type. */
export interface StrapiEntityBase {
  id: number;
  documentId: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/* ── Media ──────────────────────────────────────────────────────────────── */

/**
 * A single derived size. Strapi generates `thumbnail` / `small` / `medium` /
 * `large` for raster uploads and none of them for SVG, so every key is optional.
 */
export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiMedia extends StrapiEntityBase {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  ext: string | null;
  mime: string | null;
  url: string;
  formats: Partial<
    Record<'thumbnail' | 'small' | 'medium' | 'large', StrapiImageFormat>
  > | null;
}

/* ── Collections this site reads ────────────────────────────────────────── */

/** `award` — the certification / recognition badges. */
export interface StrapiAward extends StrapiEntityBase {
  title: string;
  logo: StrapiMedia | null;
  order: number;
}

/**
 * `job` — a career opening.
 *
 * `track` is a Strapi enumeration, but it is typed as a plain string here on
 * purpose: an editor adding a value in the admin panel must not make the frontend
 * throw, and the careers page derives its filter tabs from whatever values the
 * response actually contains.
 */
export interface StrapiJob extends StrapiEntityBase {
  title: string;
  location: string;
  experience: string | null;
  job_description: string;
  order: number | null;
  track: string | null;
  practice: string | null;
  slug: string;
}

/** `life-at-clovity` — culture highlight cards. */
export interface StrapiLifeAtClovity extends StrapiEntityBase {
  header_normal: string;
  header_highlighted: string | null;
  image: StrapiMedia | null;
  info: string;
  link: string | null;
  order: number | null;
  sectionOrder: number | null;
}

/**
 * `get-in-touch` — per-page contact form configuration.
 *
 * One row per `website_slug`, so the contact page can ask for its own row and let
 * an editor decide which fields show and which are mandatory without a deploy.
 */
export interface StrapiGetInTouch extends StrapiEntityBase {
  email_subject: string;
  website_slug: string;
  banner: StrapiMedia | null;
  info: string | null;
  belowInfo: string | null;
  showFullname: boolean;
  isFullnameRequired: boolean;
  showCompany: boolean;
  isCompanyRequired: boolean;
  showEmail: boolean;
  isEmailRequired: boolean;
  showPhoneNumber: boolean;
  isPhoneNumberRequired: boolean;
}

/* ── Collections this site writes ───────────────────────────────────────── */

/**
 * `contact-us` POST body.
 *
 * The content type has exactly two columns (`email`, `goal`), which is why the
 * contact form's other answers are folded into `goal` as a labelled block rather
 * than dropped — see `mappers.composeEnquiryGoal`.
 */
export interface StrapiContactUsInput {
  email: string;
  goal: string;
}

/** `get-in-touch-lead` POST body — the structured half of an enquiry. */
export interface StrapiGetInTouchLeadInput {
  name?: string;
  company_name?: string;
  email: string;
  phone_number?: string;
  get_in_touch_id?: string;
  email_subject?: string;
}

/** Strapi wraps every write body in `{ data: … }`. */
export interface StrapiWriteBody<TInput> {
  data: TInput;
}
