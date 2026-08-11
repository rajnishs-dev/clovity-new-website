'use client';

import { cn } from '@/lib/cn';
import { PRIMARY_NAV } from '@/constants/navigation';
import { useHoverIntent } from '@/hooks/useHoverIntent';
import { useAppSelector } from '@/store/hooks';
import { isNavLinkActive } from '@/store/slices/navigationSlice';
import type { NavGroupId } from '@/types/navigation';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/Link';
import { DropdownPanel } from './DropdownPanel';
import { MegaPanel } from './MegaPanel';

/**
 * Desktop navigation.
 *
 * Reproduces the legacy hover behaviour exactly - including the 250ms close delay
 * that lets the cursor cross the gap between a nav link and its fixed-position
 * panel (see `useHoverIntent`) - and adds the keyboard support the original never
 * had: a real `<button>` trigger with `aria-expanded`/`aria-controls`, click,
 * Enter, Space, Escape, and close-on-focus-out.
 *
 * MIGRATION NOTE - the nav link's colour was previously decided by two competing
 * stylesheets: `theme.css` set the dark default, and `home.css` overrode it with
 * `#navbar:not(.scrolled) .nav-link { color: rgba(255,255,255,.88) }` so the links
 * read white over the dark hero. That override only worked because of import
 * order, which made the header impossible to reason about in isolation.
 *
 * Now `onDark` is a prop. The home page passes it; interior pages do not. The
 * rendered colours are the same, but the reason is local and explicit.
 */
export interface NavbarProps {
  className?: string;
  /** True while the header is a transparent pill over dark artwork. */
  onDark: boolean;
  /** True once the page has scrolled past the header threshold. */
  scrolled: boolean;
}

/**
 * `.nav-link` - 16px/400 with the brand underline that grows in on hover.
 *
 * The current page is marked by the underline ONLY; its label keeps the same
 * colour as every other link. The legacy `.nav-link.active` rule also recoloured
 * the text to #1d4ed8, which read as a permanently hovered item over the dark
 * hero - so that part is deliberately dropped. `aria-current="page"` carries the
 * same information for anyone who cannot see the underline.
 */
function navLinkClass(onDark: boolean, active: boolean): string {
  return cn(
    'relative text-[16px] font-normal transition-color duration-200',
    // The underline: `.nav-link::after`, 2px, animating width over 250ms.
    'after:absolute after:-bottom-[3px] after:left-0 after:h-0.5 after:w-0 after:bg-brand-600 after:transition-[width] after:duration-[250ms] after:ease-native after:content-[""]',
    'hover:after:w-full',
    onDark
      ? 'text-white/[.88] hover:text-white'
      : 'text-ink hover:text-brand-700',
    // Underline only - no colour change. Listed last so it beats `after:w-0`.
    active && 'after:w-full',
  );
}

export function Navbar({ className, onDark, scrolled }: NavbarProps) {
  const { openId, open, scheduleClose, closeNow } =
    useHoverIntent<NavGroupId>();
  const navigation = useAppSelector((state) => state.navigation);

  return (
    <div className={cn('hidden items-center gap-1 lg:flex', className)}>
      {PRIMARY_NAV.map((item) => {
        if (item.kind === 'link') {
          const isActive = isNavLinkActive(navigation, item.id);
          return (
            <SmartLink
              key={item.id}
              href={item.href}
              className={cn(navLinkClass(onDark, isActive), 'px-4 py-2')}
              data-nav-group={item.id}
              // The underline is now the only visual cue for the current page,
              // so the state has to be exposed to assistive tech as well.
              aria-current={isActive ? 'page' : undefined}
            >
              {item.label}
            </SmartLink>
          );
        }

        const panelId = `mega-panel-${item.id}`;
        const isOpen = openId === item.id;
        // The group trigger lights up whenever any of its children is current.
        const isGroupActive = navigation.group === item.id;

        return (
          <div
            key={item.id}
            // `group/nav` drives the chevron rotation that `.nav-item:hover
            // .nav-chevron` used to handle. `self-stretch` keeps every item the
            // full row height so both panel shapes open at the same offset.
            //
            // The group is NAMED because the mega items inside the panel are groups
            // too; an unnamed `group-hover:` on either would match both. See
            // `megaItemClass`.
            className="group/nav relative flex items-center self-stretch px-1"
            onMouseEnter={() => open(item.id)}
            onMouseLeave={() => scheduleClose(item.id)}
            onBlur={(event) => {
              // Only close when focus actually leaves the whole nav item.
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                closeNow();
              }
            }}
          >
            <button
              type="button"
              className={cn(
                navLinkClass(onDark, isGroupActive),
                'flex cursor-pointer items-center gap-1.5 border-0 bg-transparent px-3 py-2',
              )}
              data-nav-group={item.id}
              aria-expanded={isOpen}
              aria-controls={panelId}
              aria-haspopup="true"
              onClick={() => (isOpen ? closeNow() : open(item.id))}
              onFocus={() => open(item.id)}
            >
              {item.label}
              <Icon name="chevron-down"
                className={cn(
                  'text-[14px] transition-transform duration-200 group-hover/nav:rotate-180',
                  onDark ? 'text-white' : 'text-black',
                )}
              />
            </button>

            {item.kind === 'mega-full' ? (
              <MegaPanel
                group={item.id}
                columns={item.columns}
                rail={item.rail}
                panelId={panelId}
                open={isOpen}
                scrolled={scrolled}
                activeItem={navigation.item}
                onMouseEnter={() => open(item.id)}
                onMouseLeave={() => scheduleClose(item.id)}
                {...(item.variant ? { variant: item.variant } : {})}
              />
            ) : (
              <DropdownPanel
                group={item.id}
                eyebrow={item.eyebrow}
                width={item.width}
                links={item.links}
                panelId={panelId}
                open={isOpen}
                scrolled={scrolled}
                activeItem={navigation.item}
                onMouseEnter={() => open(item.id)}
                onMouseLeave={() => scheduleClose(item.id)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
