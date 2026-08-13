/**
 * Slug safety for prerendered dynamic routes.
 *
 * `generateStaticParams` turns each slug into a DIRECTORY under
 * `.next/server/app`, so one slug the filesystem rejects fails the whole
 * build. Of 630 published CMS rows, twenty have slugs outside `[a-z0-9-]`, and
 * two contain a colon, e.g.:
 *
 *   Your-Cloud,-Your-Rules:-Making-the-Smart-Choice-After-Atlassian-Data-Center-EOL
 *
 * - which Windows rejects in a path; the build died on `mkdir` before this.
 *
 * This does NOT rewrite the slug - it's how the row is addressed in Strapi
 * (`filters[slug][$eq]`), so a sanitised copy couldn't find its own content.
 * Affected pages are excluded from PRERENDERING only; `dynamicParams` still
 * renders them on request, and they stay in the sitemap.
 */

/**
 * Characters that cannot appear in a path segment.
 *
 * The Windows reserved set plus `/`, which would split the route in two.
 *
 * Deliberately NOT a whitelist: uppercase letters, underscores, parentheses, commas and
 * apostrophes all appear in live slugs, all work in a URL, and all are legal filenames -
 * rejecting those would drop eighteen pages from the build for no reason.
 */
const PATH_UNSAFE = /[<>:"|?*\\/]/;

function isPrerenderableSlug(slug: string): boolean {
  if (!slug || PATH_UNSAFE.test(slug)) return false;

  // Control codes and DEL, checked numerically rather than as a regex range so this
  // file contains no literal control characters of its own.
  for (const char of slug) {
    const code = char.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) return false;
  }

  return true;
}

/**
 * Filter a collection's slugs for `generateStaticParams`, saying what was left out.
 *
 * The warning is as much the point as the filter. A silently shortened list looks
 * identical to a collection that is genuinely that small, and the next person wondering
 * why an article is missing from the build output would have nothing to go on.
 */
export function prerenderableSlugs(label: string, slugs: string[]): string[] {
  const safe = slugs.filter(isPrerenderableSlug);

  if (safe.length !== slugs.length) {
    const skipped = slugs.filter((slug) => !isPrerenderableSlug(slug));
    console.warn(
      `[${label}] Not prerendering ${skipped.length} of ${slugs.length} slug(s) - ` +
        'characters a filesystem path cannot hold. Rendered on demand instead: ' +
        skipped.map((slug) => JSON.stringify(slug)).join(', '),
    );
  }

  return safe;
}
