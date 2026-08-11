import { cn } from '@/lib/cn';
import type { ContentItem } from '@/types/content';
import { formatContentDate } from '@/utils/format';
import { CoverImage } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';
import { Search } from '@/components/common/Search';

/**
 * The sticky sidebar shared by every resource listing and detail page - the
 * legacy `.blog-aside` / `.cs-aside` / `.post-aside`: a search box above a
 * "Top N" list of the same content type's most recent items.
 *
 * `self-start` is load-bearing, not decorative. The parent grid's default
 * `align-items: stretch` stretches this item to match the main column's full
 * (very tall) height - and a `position: sticky` element with no free space
 * inside its own box has nowhere to "stick" to, so a caller that forgot this
 * would see the sidebar scroll away like ordinary content despite a correct
 * `sticky`/`top-*` className. `self-start` keeps the box at its natural
 * content height while its *containing block* (the grid area) stays the full
 * row height, which is what actually gives sticky room to move.
 */
export interface ResourceSidebarProps {
  searchPlaceholder: string;
  topLabel: string;
  items: ContentItem[];
  className?: string;
}

export function ResourceSidebar({
  searchPlaceholder,
  topLabel,
  items,
  className,
}: ResourceSidebarProps) {
  return (
    <aside className={cn('self-start', className)}>
      <div className="mb-5 rounded-[8px] border border-line-soft bg-white p-4 shadow-xs">
        <h3 className="mb-2 text-[19px] font-500 text-title">Search</h3>
        <Search placeholder={searchPlaceholder} label={searchPlaceholder} />
      </div>

      {items.length > 0 ? (
        <div className="rounded-[8px] border border-line-soft bg-white p-4 shadow-xs">
          <h3 className="mb-2 text-[19px] font-500 text-title">{topLabel}</h3>
          <ul className="list-none p-0">
            {items.map((item, index) => (
              <li key={item.id}>
                <SmartLink
                  href={item.href}
                  forceExternal={item.external}
                  className={`group flex items-center gap-3.5 py-3 text-inherit no-underline ${
                    index === items.length - 1
                      ? ''
                      : 'border-b border-[#f1f5f9]'
                  } ${index === 0 ? 'pt-0' : ''}`}
                >
                  <span className="relative h-[58px] w-[76px] shrink-0 overflow-hidden rounded-[8px] bg-slate-100">
                    <CoverImage src={item.image.src} alt="" sizes="76px" />
                  </span>
                  <span className="min-w-0">
                    <span className="mb-1 line-clamp-2 text-[15px] font-500 leading-[1.4] text-title transition-colors group-hover:text-brand-700">
                      {item.title}
                    </span>
                    <time
                      dateTime={item.publishedAt}
                      className="block text-[11px] font-700 text-black"
                    >
                      {formatContentDate(item.publishedAt)}
                    </time>
                  </span>
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  );
}
