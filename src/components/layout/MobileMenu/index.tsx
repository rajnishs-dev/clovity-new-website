'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { HEADER_CTA, PRIMARY_NAV } from '@/config/navigation';
import { ROUTES } from '@/config/routes';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useAppSelector } from '@/store/hooks';
import { isNavLinkActive } from '@/store/slices/navigationSlice';
import type { NavGroupId, NavLink } from '@/types/navigation';
import { ArrowIcon, ExternalIcon, Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';
import { Logo } from '@/components/common/Logo';
import { createFocusTrap, getFocusableElements } from '@/utils/a11y';

/**
 * Mobile navigation drawer, as Tailwind utilities.
 *
 * The slide is `translate-x-full → translate-x-0` over 350ms on
 * `cubic-bezier(.4,0,.2,1)` — the legacy `#mobile-menu` transition, and the same
 * curve as Tailwind's `ease-in-out`, so no custom token is needed. The panel stays
 * mounted so the slide-out is actually visible; unmounting would cut it off.
 *
 * Accessibility, all of it new: `role="dialog"`, focus trap, focus return to the
 * toggle, Escape to close, `aria-expanded`/`aria-controls` on the accordion
 * triggers, and `inert` when closed — the legacy version sat permanently in the
 * DOM at `translateX(100%)`, so every link in it stayed tabbable while hidden.
 */

/** Flat link lists per group. */
function mobileLinksFor(group: NavGroupId): NavLink[] {
  const item = PRIMARY_NAV.find((entry) => entry.id === group);
  if (!item) return [];
  if (item.kind === 'mega-full') {
    return item.columns.flatMap((column) => column.links);
  }
  if (item.kind === 'dropdown') return item.links;
  return [];
}

/** Order the legacy mobile Expertise accordion used. */
const EXPERTISE_ORDER = [
  'atlassian',
  'ai',
  'itsm',
  'devsecops',
  'cloud-migration',
  'managed-services',
  'workforce',
  'marketplace-apps',
] as const;

function orderedExpertiseLinks(): NavLink[] {
  const links = mobileLinksFor('expertise');
  return EXPERTISE_ORDER.map((id) =>
    links.find((link) => link.id === id),
  ).filter((link): link is NavLink => link !== undefined);
}

interface AccordionSection {
  group: NavGroupId;
  label: string;
  links: NavLink[];
}

export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  /** The hamburger, so focus can be returned to it on close. */
  toggleRef: React.RefObject<HTMLButtonElement | null>;
}

export function MobileMenu({ open, onClose, toggleRef }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<NavGroupId | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const baseId = useId();
  const navigation = useAppSelector((state) => state.navigation);

  useLockBodyScroll(open);

  /**
   * A closed drawer shows no expanded section. Derived rather than reset through
   * an effect — resetting state in an effect causes a cascading render and is
   * what `react-hooks/set-state-in-effect` exists to prevent.
   */
  const activeSection = open ? expanded : null;

  const sections: AccordionSection[] = [
    { group: 'expertise', label: 'Expertise', links: orderedExpertiseLinks() },
    {
      group: 'resources',
      label: 'Resources',
      links: mobileLinksFor('resources'),
    },
    { group: 'discover', label: 'Discover', links: mobileLinksFor('discover') },
  ];

  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (panel) {
      const focusable = getFocusableElements(panel);
      (focusable[0] ?? panel).focus();
    }

    const trap = panel ? createFocusTrap(panel) : null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        toggleRef.current?.focus();
        return;
      }
      trap?.(event);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose, toggleRef]);

  const toggleSection = (group: NavGroupId) => {
    setExpanded((current) => (current === group ? null : group));
  };

  /**
   * Tapping any link closes the drawer, so it never covers the page it just
   * navigated to. Handled on the click — a user event — rather than by watching
   * `usePathname` in an effect, which would also fire for navigations that have
   * nothing to do with this menu.
   */
  const handleNavigate = () => {
    setExpanded(null);
    onClose();
  };

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal={open || undefined}
      aria-label="Site navigation"
      aria-hidden={!open || undefined}
      inert={!open}
      tabIndex={-1}
      className={cn(
        'fixed inset-0 z-[999] flex flex-col overflow-y-auto bg-white lg:hidden',
        'transition-transform duration-[350ms] ease-in-out',
        open ? 'translate-x-0' : 'translate-x-full',
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
        <Logo imageClassName="h-10 w-auto" />
        <button
          type="button"
          onClick={() => {
            onClose();
            toggleRef.current?.focus();
          }}
          aria-label="Close menu"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-0 bg-slate-100 text-slate-600"
        >
          <Icon name="close" className="text-lg" />
        </button>
      </div>

      <nav
        className="flex flex-1 flex-col gap-2 px-6 py-8"
        aria-label="Mobile primary"
      >
        <SmartLink
          href={ROUTES.home}
          onClick={handleNavigate}
          className={cn(
            'border-b border-slate-100 py-3 text-base font-700 text-slate-800',
            isNavLinkActive(navigation, 'home') && 'text-brand-700',
          )}
        >
          Home
        </SmartLink>

        {sections.map((section) => {
          const isExpanded = activeSection === section.group;
          const triggerId = `${baseId}-${section.group}-trigger`;
          const panelId = `${baseId}-${section.group}-panel`;

          return (
            <div key={section.group}>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => toggleSection(section.group)}
                className="flex w-full cursor-pointer items-center justify-between border-0 border-b border-slate-100 bg-transparent py-3 text-base font-700 text-slate-800"
              >
                {section.label}
                <Icon name="chevron-down"
                  className={cn(
                    'text-xs text-slate-400 transition-transform ease-in-out',
                    isExpanded && 'rotate-180',
                  )}
                />
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className={cn(
                  'flex-col gap-1 py-2 pl-4',
                  isExpanded ? 'flex' : 'hidden',
                )}
              >
                {section.links.map((link) => (
                  <SmartLink
                    key={link.id}
                    href={link.href}
                    className={cn(
                      'py-2 text-sm font-600',
                      link.external
                        ? 'text-orange hover:text-[#d9501c]'
                        : 'text-slate-600 hover:text-blue-700',
                      isNavLinkActive(navigation, section.group, link.id) &&
                        'text-brand-700',
                    )}
                    data-nav-group={section.group}
                    data-nav-id={link.id}
                    onClick={handleNavigate}
                    {...(link.external ? { forceExternal: true } : {})}
                  >
                    {link.label}
                    {link.external ? <ExternalIcon /> : null}
                  </SmartLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="px-6 pb-8">
        <SmartLink
          href={HEADER_CTA.href}
          onClick={handleNavigate}
          className={buttonClass('primary', 'md', 'w-full justify-center')}
        >
          {HEADER_CTA.label} <ArrowIcon />
        </SmartLink>
      </div>
    </div>
  );
}
