import { cn } from '@/lib/cn';
import type { NavGroupId, NavLink } from '@/types/navigation';
import { SmartLink } from '@/components/ui/Link';
import {
  MEGA_COL_TITLE_CLASS,
  MEGA_DESC_CLASS,
  MEGA_PANEL_BASE,
  MEGA_TITLE_CLASS,
  MegaArrow,
  MegaIconChip,
  megaItemClass,
} from './megaStyles';

/**
 * The narrow single-column dropdown (Discover). The `before:` strip bridges
 * the gap to the trigger so the cursor doesn't leave the hover target on its
 * way down; `useHoverIntent`'s close delay covers the rest.
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
        // Matches MegaPanel's top-88/top-104, offset for the header padding
        // this panel's absolutely-positioned wrapper doesn't include.
        scrolled ? 'top-[calc(100%+21px)]' : 'top-[calc(100%+23px)]',
        // Hover bridge between the trigger and the panel.
        'before:absolute before:-top-6 before:left-0 before:h-6 before:w-full before:content-[""]',
        open ? 'block animate-mega-fade' : 'hidden',
      )}
    >
      <p className={MEGA_COL_TITLE_CLASS}>{eyebrow}</p>
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
