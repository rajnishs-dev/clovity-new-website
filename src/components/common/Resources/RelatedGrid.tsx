import type { ContentItem } from '@/types/content';
import { SectionHeader } from '@/components/ui/Section';
import { ResourceCard } from './ResourceCard';

/**
 * "Related Insights" / "Related News" - the 3-card rail at the bottom of a
 * detail page (the legacy `.related-grid`).
 */
export function RelatedGrid({
  label,
  heading,
  items,
}: {
  label: string;
  heading: string;
  items: ContentItem[];
}) {
  if (items.length === 0) return null;

  return (
    <div>
      <SectionHeader
        label={label}
        heading={heading}
        align="left"
        className="mb-8"
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ResourceCard
            key={item.id}
            href={item.href}
            external={item.external}
            image={item.image}
            title={item.title}
            publishedAt={item.publishedAt}
            compact
          />
        ))}
      </div>
    </div>
  );
}
