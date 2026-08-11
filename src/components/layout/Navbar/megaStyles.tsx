import { cn } from '@/lib/cn';
import type { IconName } from '@/types/icon';
import { Icon } from '@/components/ui/Icon';

/**
 * Shared mega-menu utilities, so the full-width panel and the narrow dropdown
 * cannot drift apart. Replaces the legacy `.mega-item` / `.mega-title` /
 * `.mega-desc` / `.mega-col*` rules.
 */

/** `.mega-wrap` - the white panel itself (shared by both panel shapes). */
export const MEGA_PANEL_BASE = 'rounded-mega bg-white z-[200]';

/**
 * `.mega-item` - a leaf link row. `group` drives the chip and arrow hover states.
 *
 * DELIBERATE DEVIATION FROM THE LEGACY CSS. `theme.css` sets `.mega-item` to
 * `display: block` and `.mega-icon` to `display: none`, so the original renders no
 * icon beside a mega-menu link even though every one of them is in the markup. This
 * is a flex row instead, so the chips are visible - requested explicitly, and the
 * one place in the header where the port is not pixel-identical to the original.
 *
 * The chip design is not invented: an earlier revision of `theme.css` styled
 * `.mega-icon` as a 42px rounded square, `#eff6ff` on `#2563eb`, inverting to
 * `#2563eb` on white on hover. That is reproduced below at 36px, which is what the
 * current tighter row padding (11px in columns, down from 14px) has room for.
 */
export function megaItemClass(options?: {
  /** Items inside a `.mega-col` use tighter padding than the dropdown's. */
  inColumn?: boolean;
  active?: boolean;
  highlight?: boolean;
}): string {
  return cn(
    // NAMED group, and that matters. `group-hover:` compiles to `.group:hover &`,
    // so it fires for ANY hovered ancestor carrying the class - and every mega item
    // sits inside the nav-item wrapper, which is also a group (it drives the chevron
    // rotation). With bare `group` on both, hovering the "Expertise" trigger put
    // every chip and arrow in the open panel into its hover state at once. Naming
    // the groups scopes each one to its own row.
    'group/mega flex items-start gap-3 rounded-xl no-underline transition-[background] duration-150',
    options?.inColumn ? 'px-1 py-[11px]' : 'px-3.5 py-3',
    'hover:bg-[#f0f6ff]',
    options?.active && 'bg-[#f0f6ff]',
    options?.highlight && 'border border-dashed border-[#cbd5e1] bg-soft',
  );
}

/**
 * The icon chip beside a mega-menu link title.
 *
 * `group-hover:` inverts it in step with the row background, which is what the
 * legacy `.mega-item:hover .mega-icon` rule did. `active` pins that inverted state
 * on the current page's row so it reads as selected without needing a hover.
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

/**
 * `.mega-col` - a titled column with a divider on its left edge.
 *
 * The legacy CSS reached the first and second columns with `:first-child` and
 * `:nth-child(2)`. Columns are mapped from data here, so the index is already in
 * hand and the classes are applied directly - clearer than an nth-child selector
 * and immune to a stray wrapper element shifting the count.
 */
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
 * MIGRATION NOTE - this is a real DOM change, and the only one in the conversion.
 * The original drew it as a `::after` pseudo-element using `mask-image` with an
 * inline `data:image/svg+xml` URI plus `background-color: currentColor`, so the
 * glyph inherited the text colour.
 *
 * That cannot be expressed as a Tailwind arbitrary value in any readable way: the
 * data URI contains spaces, quotes and angle brackets, all of which have to be
 * escaped inside a class name, and Tailwind ships no `mask-image` scale to put it
 * in instead. Rendering the same two paths as an inline SVG with
 * `stroke="currentColor"` keeps the colour inheritance, the hover tint and the
 * 2px/-2px hover nudge identical, and is legible.
 *
 * Geometry matches: the original masked an 18×19 viewBox into a 10×11 box with
 * `mask-size: contain`, which is what `preserveAspectRatio="xMidYMid meet"` - the
 * SVG default - does here.
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
