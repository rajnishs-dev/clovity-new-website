import { cn } from '@/lib/cn';
import type { NavGroupId, NavLink } from '@/types/navigation';
import { SmartLink } from '@/components/ui/Link';
import {
  MEGA_DESC_CLASS,
  MEGA_PANEL_BASE,
  MEGA_TITLE_CLASS,
  MegaArrow,
  MegaIconChip,
  megaItemClass,
} from './megaStyles';

/**
 * The narrow single-column dropdown (Discover), as Tailwind utilities.
 *
 * `before:` reproduces the legacy `.mega-wrap::before` — a 12px invisible strip
 * above the panel that bridges the gap to the trigger, so the cursor does not
 * leave the hover target on its way down. `useHoverIntent`'s close delay covers
 * the rest.
 *
 * Width stays data-driven (`width` on the nav item) because the legacy markup set
 * it per-panel with an inline style rather than a class.
 */
export interface DropdownPanelProps {
  group: NavGroupId;
  eyebrow: string;
  width: number;
  links: NavLink[];
  activeItem?: string | undefined;
  panelId: string;
  open: boolean;
  scrolled: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function DropdownPanel({
  group,
  eyebrow,
  width,
  links,
  activeItem,
  panelId,
  open,
  scrolled,
  onMouseEnter,
  onMouseLeave,
}: DropdownPanelProps) {
  return (
    <div
      id={panelId}
      style={{ width: `${width}px` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        MEGA_PANEL_BASE,
        'absolute left-1/2 min-w-[520px] -translate-x-1/2 px-6 py-5 shadow-mega',
        scrolled ? 'top-[calc(100%+10px)]' : 'top-[calc(100%+16px)]',
        // Hover bridge between the trigger and the panel.
        'before:absolute before:-top-3 before:left-0 before:h-3 before:w-full before:content-[""]',
        open ? 'block animate-mega-fade' : 'hidden',
      )}
    >
      <p className="mb-3 px-2 text-[11px] font-800 uppercase tracking-widest text-slate-400">
        {eyebrow}
      </p>
      {links.map((link) => (
        <SmartLink
          key={link.id}
          href={link.href}
          className={megaItemClass({ active: activeItem === link.id })}
          data-nav-group={group}
          data-nav-id={link.id}
          {...(link.external ? { forceExternal: true } : {})}
        >
          {link.icon ? (
            <MegaIconChip icon={link.icon} active={activeItem === link.id} />
          ) : null}
          <div className="min-w-0">
            <div className={MEGA_TITLE_CLASS}>
              {link.label}
              <MegaArrow />
            </div>
            {link.description ? (
              <div className={MEGA_DESC_CLASS}>{link.description}</div>
            ) : null}
          </div>
        </SmartLink>
      ))}
    </div>
  );
}
