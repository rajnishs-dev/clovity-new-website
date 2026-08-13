import { cn } from '@/lib/cn';
import type { IconName } from '@/types/icon';
import { Icon } from '@/components/ui/Icon';

/** Shared mega-menu utilities, so the full-width panel and the narrow dropdown cannot drift apart. */

/** `.mega-wrap` - the white panel itself (shared by both panel shapes). */
export const MEGA_PANEL_BASE = 'rounded-mega bg-white z-[200]';

/**
 * `.mega-item` - a leaf link row. `group` drives the chip and arrow hover states.
 *
 * Deliberate deviation from the legacy CSS: `.mega-icon` there is
 * `display: none`, hiding every icon; this renders as a flex row instead so
 * the chips are visible - the one place the port isn't pixel-identical.
 */
export function megaItemClass(options?: {
  /** Items inside a `.mega-col` use tighter padding than the dropdown's. */
  inColumn?: boolean;
  active?: boolean;
  highlight?: boolean;
}): string {
  return cn(
    // Named group (not bare `group`): the nav-item wrapper is also a group
    // (chevron rotation), and bare `group` on both put every chip/arrow into
    // hover state at once when the trigger was hovered.
    'group/mega flex items-start gap-3 rounded-xl no-underline transition-[background] duration-150',
    options?.inColumn ? 'px-1 py-[11px]' : 'px-3.5 py-3',
    'hover:bg-[#f0f6ff]',
    options?.active && 'bg-[#f0f6ff]',
    options?.highlight && 'border border-dashed border-[#cbd5e1] bg-soft',
  );
}

/**
 * The icon chip beside a mega-menu link title. `active` pins the inverted
 * (hover) state on the current page's row so it reads as selected without needing a hover.
 */
export function MegaIconChip({
  icon,
  active,
}: {
  icon: IconName;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]',
        '[transition:background_.15s,color_.15s]',
        active
          ? 'bg-brand-600 text-white'
          : 'bg-brand-50 text-brand-600 group-hover/mega:bg-brand-600 group-hover/mega:text-white',
      )}
    >
      <Icon name={icon} size={18} />
    </span>
  );
}

/** `.mega-title` */
export const MEGA_TITLE_CLASS =
  'flex items-center gap-[7px] text-[15.5px] font-600 leading-[1.3] text-title';

/** `.mega-desc` */
export const MEGA_DESC_CLASS =
  'mt-[3px] text-[13px] leading-[1.55] text-[#64748b]';

/** `.mega-col-title` */
export const MEGA_COL_TITLE_CLASS =
  'mb-[18px] px-1 text-[21px] font-600 tracking-[-0.01em] text-ink';

/** `.mega-col` - a titled column with a divider on its left edge, applied by index rather than an nth-child selector. */
export function megaColumnClass(index: number): string {
  return cn(
    'border-l border-line-faint pl-7',
    index === 0 && 'border-l-0 pl-0',
    // Below 1100px the grid collapses to two columns, so what was the second
    // column becomes the row leader and loses its divider.
    index === 1 && 'to-1100:border-l-0 to-1100:pl-1',
  );
}

/**
 * `.mega-col-cta` / `.mega-col-whatsnew` - the right-hand rail.
 * Below 1100px it spans the full two-column grid and gains a top divider.
 */
export const MEGA_RAIL_CLASS =
  'border-l border-line-faint pl-7 to-1100:col-span-2 to-1100:mt-2.5 to-1100:border-l-0 to-1100:border-t to-1100:border-line-faint to-1100:pl-1 to-1100:pt-6';

/**
 * The diagonal "opens this" arrow beside every mega-menu title.
 *
 * A real DOM change (the only one in this conversion): the legacy version
 * was a `::after` mask-image pseudo-element, which can't be expressed as a
 * readable Tailwind arbitrary value. An inline SVG with `stroke="currentColor"`
 * keeps the same colour inheritance and hover behaviour.
 */
export function MegaArrow() {
  return (
    <svg
      width="10"
      height="11"
      viewBox="0 0 18 19"
      fill="none"
      aria-hidden
      className="shrink-0 [transition:transform_.2s,color_.2s] group-hover/mega:-translate-y-[2px] group-hover/mega:translate-x-[2px] group-hover/mega:text-brand-600"
    >
      <path d="M1 17.5L17 1.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M2.6001 1.5H17.0001V15.9"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
