/**
 * Strapi 5 wire shapes for the `clovity-admin` instance.
 *
 * These are the RAW responses, not the app's content models. Everything here is
 * shaped by Strapi's REST conventions - flattened attributes, a `documentId`
 * alongside the numeric `id`, media as a nested object with `formats` - and none
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

/** `award` - the certification / recognition badges. */
export interface StrapiAward extends StrapiEntityBase {
  title: string;
  logo: StrapiMedia | null;
  order: number;
}

/**
 * `job` - a career opening.
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

/** `life-at-clovity` - culture highlight cards. */
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
 * `get-in-touch` - per-page contact form configuration.
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

/* ── Resource collections ───────────────────────────────────────────────── */

/**
 * `blog` - a blog post. 504 published rows.
 *
 * `content` is WYSIWYG HTML despite the `richtext` type; `cms.richtext.ts` documents
 * the tag census. Every live row has both an `image` and a `blog_date`, but both stay
 * nullable here: the schema marks only `image` required, and a row created before that
 * constraint existed can still come back null.
 */
export interface StrapiBlog extends StrapiEntityBase {
  title: string;
  content: string;
  blog_date: string | null;
  image: StrapiMedia | null;
  slug: string;
}

/**
 * `news` - a press release or announcement. 56 published rows.
 *
 * PLURAL ROUTE IS `newses`, which is why `CMS_ENDPOINTS` writes it down.
 *
 * `subtitle` is the ONLY editorial summary column in any of these five collections,
 * so it is the one excerpt that is not derived from the body.
 *
 * `isFeatured` is NOT used to order the list: three of the live rows are flagged, and
 * all three are 2018-2019 press releases, so honouring the flag would pin a
 * seven-year-old story to the top of the page. The list is date-ordered, matching
 * `website-t`.
 *
 * `content` has NO date field of its own - `createdAt` is the only chronology.
 */
export interface StrapiNews extends StrapiEntityBase {
  title: string;
  subtitle: string | null;
  content: string;
  featuredImage: StrapiMedia | null;
  secondaryImage: StrapiMedia | null;
  isFeatured: boolean;
  publishedLink: string | null;
  slug: string;
}

/**
 * `event` - a conference, tour stop or summit. 64 published rows.
 *
 * `featureImage`, not `featuredImage` - the two sibling collections spell it the other
 * way, and getting it wrong yields `undefined` and a dropped card rather than an error.
 *
 * There is NO description column, so an event has no body and no editorial teaser. The
 * mapper leaves both empty rather than inventing copy; adding a `description` richtext
 * field to the content type in `clovity-admin` is what fills them.
 */
export interface StrapiEvent extends StrapiEntityBase {
  name: string;
  startDateTime: string | null;
  endDateTime: string | null;
  location: string;
  isSponsors: boolean;
  eventLink: string;
  order: number | null;
  featureImage: StrapiMedia | null;
  slug: string;
}

/**
 * One person in a webinar's `theWho` / `moderator` JSON column.
 *
 * `name` holds BOTH the person and their role in one string, separated by an em dash,
 * an en dash or a comma depending on who typed the row - see `toWebinarPresenters`.
 */
export interface StrapiWebinarPerson {
  name?: string;
  link?: string;
}

/**
 * `webinar` - a live or recorded session. 3 published rows.
 *
 * `theWho` and `moderator` are `json` columns typed `unknown` on purpose: they hold an
 * ARRAY of `StrapiWebinarPerson` on some rows and the EMPTY STRING on others (verified
 * live), so anything that assumes an array crashes on the first such row.
 *
 * `eventDescription` is plain text with markdown emphasis, not HTML.
 *
 * `createdAtText` is a human-typed date - "January 28, 2026" parses, "6th February
 * 2025" does not, hence the fallback chain in the mapper.
 */
export interface StrapiWebinar extends StrapiEntityBase {
  title: string | null;
  coHostedBy: string | null;
  eventDescription: string | null;
  eventDateTime: string | null;
  eventHeader: string | null;
  createdAtText: string;
  floatingButtonText: string | null;
  recordingLink: string | null;
  youtubeVideoLink: string | null;
  showVideoPlayer: boolean;
  isActive: boolean;
  banner: StrapiMedia | null;
  peopleImages: StrapiMedia[] | null;
  theWho: unknown;
  moderator: unknown;
  slug: string;
}

/**
 * `jsm-resource` - what the published site renders as a CASE STUDY. 3 published rows.
 *
 * NOT the `case-study` collection, which also exists and holds 25 older rows ("JIRA
 * Service Management", "DevOps as a Service") that no page shows. `website-t` reads
 * `jsm-resources` for `/case-study`, and its three rows are exactly the three case
 * studies the design was built around - Forcepoint, Hashgraph and DSH.
 *
 * No client / industry / outcome columns exist, so those fields on `CaseStudyItem` stay
 * unset for CMS rows and their meta chips do not render.
 */
export interface StrapiJsmResource extends StrapiEntityBase {
  title: string;
  content: string;
  featuredImage: StrapiMedia | null;
  secondaryImage: StrapiMedia | null;
  slug: string;
}

/* ── Collections this site writes ───────────────────────────────────────── */

/**
 * `contact-us` POST body.
 *
 * The content type has exactly two columns (`email`, `goal`), which is why the
 * contact form's other answers are folded into `goal` as a labelled block rather
 * than dropped - see `mappers.composeEnquiryGoal`.
 */
export interface StrapiContactUsInput {
  email: string;
  goal: string;
}

/**
 * `recording` POST body - a webinar recording request.
 *
 * The collection is called `recordings`; `website-t` posts the same shape to it from its
 * webinar page, and matching it is deliberate so both sites' submissions land as one
 * comparable set of rows.
 *
 * `recordingMonth` and `recordingDocId` are BOTH `required` in the content type, so a
 * body missing either is rejected with a 400 - see the note in `RegisterForm` about where
 * `recordingMonth` comes from, because the field `website-t` fills it from is empty on
 * three of the four published webinars.
 */
export interface StrapiRecordingInput {
  firstName: string;
  lastName?: string;
  email: string;
  country?: string;
  /** The webinar's Strapi `documentId`, so a request can be traced to its session. */
  recordingDocId: string;
  recordingMonth: string;
}

/** `get-in-touch-lead` POST body - the structured half of an enquiry. */
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
