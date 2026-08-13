import { cn } from '@/lib/cn';
import { breadcrumbSchema } from '@/lib/schema';
import type { BreadcrumbItem } from '@/types/seo';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/Link';
import { JsonLd } from '../JsonLd';

/**
 * Breadcrumb trail plus its BreadcrumbList JSON-LD - emitted from one
 * component so the two can't drift apart. The last crumb is the current
 * page: plain text with `aria-current="page"`, not a link to itself.
 */
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  /** Skip the JSON-LD (when the page already emits a fuller graph). */
  omitSchema?: boolean;
}

export function Breadcrumb({
  items,
  className,
  omitSchema = false,
}: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <>
      {omitSchema ? null : <JsonLd schema={breadcrumbSchema(items)} />}
      <nav aria-label="Breadcrumb" className={cn('w-full', className)}>
        <ol className="flex flex-wrap items-center gap-2 text-[13px] font-500">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {isLast ? (
                  <span aria-current="page" className="text-[#0f172a]">
                    {item.name}
                  </span>
                ) : (
                  <SmartLink
                    href={item.href}
                    className="text-[#64748b] transition-colors hover:text-brand-500"
                  >
                    {item.name}
                  </SmartLink>
                )}
                {isLast ? null : (
                  <Icon name="chevron-right"
                    className="text-[9px] text-[#cbd5e1]"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
