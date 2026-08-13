'use client';

import { cn } from '@/lib/cn';
import { useWhatsNewCards } from '@/api/cms.hooks';
import { PRIMARY_NAV } from '@/constants/navigation';
import { useHoverIntent } from '@/hooks/useHoverIntent';
import { useAppSelector } from '@/store/hooks';
import { isNavLinkActive } from '@/store/slices/navigationSlice';
import type { NavGroupId, NavPanelRail } from '@/types/navigation';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/Link';
import { DropdownPanel } from './DropdownPanel';
import { MegaPanel } from './MegaPanel';

/**
 * Desktop navigation. Reproduces the legacy hover behaviour (the 250ms close
 * delay letting the cursor cross the gap to a panel, see `useHoverIntent`)
 * and adds keyboard support the original never had. `onDark` replaces what
 * used to be a stylesheet-import-order dependency for nav-link colour.
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
 * The current page is marked by the underline only, not a text colour change
 * (dropped from the legacy rule, which read as a permanently hovered item over the dark hero).
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

/** The Resources item's rail as authored - its "What's New" cards are the build-time fallback. */
const RESOURCES_ITEM = PRIMARY_NAV.find(
  (item): item is Extract<typeof item, { kind: 'mega-full' }> =>
    item.id === 'resources',
);
const RESOURCES_FALLBACK_CARDS =
  RESOURCES_ITEM?.rail.kind === 'feature' ? RESOURCES_ITEM.rail.cards : [];

export function Navbar({ className, onDark, scrolled }: NavbarProps) {
  const { openId, open, scheduleClose, closeNow } =
    useHoverIntent<NavGroupId>();
  const navigation = useAppSelector((state) => state.navigation);
  // Replaces the bundled fallback pair with whichever event/post is actually
  // newest in the CMS - see `useWhatsNewCards`.
  const whatsNew = useWhatsNewCards(RESOURCES_FALLBACK_CARDS);

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
            // Named group/nav (not bare `group`): mega items inside the panel
            // are groups too, and an unnamed `group-hover:` would match both.
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
                rail={
                  item.id === 'resources' && item.rail.kind === 'feature'
                    ? ({ ...item.rail, cards: whatsNew.data } as NavPanelRail)
                    : item.rail
                }
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
