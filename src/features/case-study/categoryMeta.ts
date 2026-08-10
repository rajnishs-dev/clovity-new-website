import type { CategoryTone } from '@/components/common/Resources';
import type { IconName } from '@/components/ui/Icon';

/**
 * Category pill styling for case studies.
 *
 * `CaseStudyItem.category` is a plain `string` (the eventual CMS field is
 * free text), not a closed union like `EventCategory` - so this is a lookup
 * with a defensive fallback rather than an exhaustive `Record`, the same
 * spirit as `resolveIcon` in `components/ui/Icon/registry.ts`.
 */
export const CATEGORY_META: Record<string, { tone: CategoryTone; icon: IconName }> = {
  'Cloud Migration': { tone: 'blue', icon: 'cloud-upload' },
  'ITSM & Service Management': { tone: 'violet', icon: 'headset' },
  'Public Sector': { tone: 'cyan', icon: 'landmark' },
};

const FALLBACK_CATEGORY_META = { tone: 'blue', icon: 'chart-line' } as const;

/** Resolve a case study's category to its pill styling, with a sane fallback. */
export function resolveCategoryMeta(category?: string): {
  tone: CategoryTone;
  icon: IconName;
} {
  if (!category) return FALLBACK_CATEGORY_META;
  return CATEGORY_META[category] ?? FALLBACK_CATEGORY_META;
}
