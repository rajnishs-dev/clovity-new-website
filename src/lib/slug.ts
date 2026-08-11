/**
 * Slug safety for prerendered dynamic routes.
 *
 * WHY THIS EXISTS - `generateStaticParams` turns each slug into a DIRECTORY under
 * `.next/server/app`, so a slug the filesystem rejects fails the whole build, not just
 * its own page. The live CMS has such slugs: of 630 published rows across the five
 * resource collections, twenty have slugs outside `[a-z0-9-]`, and two contain a COLON -
 *
 *   Your-Cloud,-Your-Rules:-Making-the-Smart-Choice-After-Atlassian-Data-Center-EOL
 *   clovity-unveils-the-most-powerful-iot-solution-"csensornet":-a-fully-end-to-end-...
 *
 * - which Windows will not accept in a path. The build died on `mkdir` before this.
 *
 * WHAT IT DOES NOT DO: rewrite the slug. The slug is how the row is addressed in Strapi
 * (`filters[slug][$eq]`), so a sanitised copy would no longer find its own content. These
 * pages are excluded from PRERENDERING only; `dynamicParams` still renders them on
 * request, and they are still listed in the sitemap.
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
