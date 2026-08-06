import { cn } from '@/lib/cn';
import type { NavColumn, NavGroupId, NavPanelRail } from '@/types/navigation';
import { ExternalIcon, Icon } from '@/components/ui/Icon';
import { AppImage } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';
import {
  MEGA_COL_TITLE_CLASS,
  MEGA_DESC_CLASS,
  MEGA_PANEL_BASE,
  MEGA_RAIL_CLASS,
  MEGA_TITLE_CLASS,
  MegaArrow,
  MegaIconChip,
  megaColumnClass,
  megaItemClass,
} from './megaStyles';

/**
 * The full-width mega panel (Expertise, Resources), as Tailwind utilities.
 *
 * `position: fixed` with a viewport-relative `top` is what the legacy CSS did,
 * and it is why the hover-intent bridge in `useHoverIntent` exists — the panel
 * sits below its trigger with a gap the cursor has to cross.
 *
 * `top` shifts from 104px to 88px once the header is scrolled, so the panel stays
 * tucked under the shrunken pill.
 *
 * The per-link icon chips ARE rendered here, which the legacy site does not do — it
 * ships them in the markup and then hides them with `.mega-icon { display: none }`.
 * See `megaItemClass` in `megaStyles.tsx` for why that was changed.
 */
export interface MegaPanelProps {
  group: NavGroupId;
  columns: NavColumn[];
  rail: NavPanelRail;
  variant?: 'resources';
  /** Currently active leaf id, for the highlight. */
  activeItem?: string | undefined;
  panelId: string;
  open: boolean;
  /** True once the header has the scrolled (shrunken) treatment. */
  scrolled: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function MegaPanel({
  group,
  columns,
  rail,
  variant,
  activeItem,
  panelId,
  open,
  scrolled,
  onMouseEnter,
  onMouseLeave,
}: MegaPanelProps) {
  return (
    <div
      id={panelId}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        MEGA_PANEL_BASE,
        'fixed left-1/2 right-auto w-full min-w-0 max-w-shell -translate-x-1/2 overflow-y-auto shadow-mega-full',
        'max-h-[calc(100vh-124px)]',
        scrolled ? 'top-[88px]' : 'top-[104px]',
        open ? 'block animate-mega-full-fade' : 'hidden',
      )}
    >
      <div
        className={cn(
          'mx-auto grid max-w-shell gap-x-8 gap-y-2 px-8 pb-12 pt-11',
          variant === 'resources'
            ? 'grid-cols-[1fr_1fr_420px]'
            : 'grid-cols-[repeat(3,1fr)_280px]',
          'to-1100:grid-cols-2',
        )}
      >
        {columns.map((column, index) => (
          <div key={column.id} className={megaColumnClass(index)}>
            <p className={MEGA_COL_TITLE_CLASS}>{column.title}</p>
            {column.links.map((link) => (
              <SmartLink
                key={link.id}
                href={link.href}
                className={megaItemClass({
                  inColumn: true,
                  active: activeItem === link.id,
                  ...(link.highlight ? { highlight: true } : {}),
                })}
                data-nav-group={group}
                data-nav-id={link.id}
                {...(link.external ? { forceExternal: true } : {})}
              >
                {link.icon ? (
                  <MegaIconChip
                    icon={link.icon}
                    active={activeItem === link.id}
                  />
                ) : null}
                <div className="min-w-0">
                  <div className={MEGA_TITLE_CLASS}>
                    {link.label}
                    {link.external ? <ExternalIcon /> : null}
                    {/* Highlight rows suppressed the arrow in the original. */}
                    {link.highlight ? null : <MegaArrow />}
                  </div>
                  {link.description ? (
                    <div className={MEGA_DESC_CLASS}>{link.description}</div>
                  ) : null}
                </div>
              </SmartLink>
            ))}
          </div>
        ))}

        {rail.kind === 'cta' ? (
          <div className={MEGA_RAIL_CLASS}>
            <div className="rounded-2xl border border-[#dbeafe] bg-[linear-gradient(160deg,#eff6ff_0%,#fef1e8_100%)] p-4">
              <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-[10px] bg-brand-600 text-[17px] text-white">
                <Icon name={rail.card.icon} />
              </div>
              <h4 className="mb-1.5 text-[14.5px] font-800 text-ink">
                {rail.card.title}
              </h4>
              <p className="mb-4 text-[12.5px] leading-[1.5] text-[#64748b]">
                {rail.card.description}
              </p>
              <SmartLink
                href={rail.card.href}
                className="inline-flex items-center gap-2 text-[13px] font-700 text-brand-600 no-underline hover:text-brand-700"
              >
                {rail.card.ctaLabel}
                <Icon name="arrow-right" />
              </SmartLink>
            </div>
          </div>
        ) : (
          <div className={MEGA_RAIL_CLASS}>
            <p className={MEGA_COL_TITLE_CLASS}>{rail.title}</p>
            <div className="flex flex-col">
              {rail.cards.map((card, index) => (
                <SmartLink
                  key={card.id}
                  href={card.href}
                  className={cn(
                    '-mx-1.5 flex flex-row-reverse items-center gap-3.5 rounded-[14px] border-b border-line-faint px-1.5 py-3.5 no-underline transition-[background] duration-150 hover:bg-soft',
                    // The legacy rule was `a.mega-feature-card:last-child`.
                    index === rail.cards.length - 1 && 'border-b-0 pb-1',
                  )}
                  {...(card.external ? { forceExternal: true } : {})}
                >
                  <div className="h-[92px] w-[150px] shrink-0 overflow-hidden rounded-2xl bg-line-faint">
                    {/* Fixed 92×92 thumb — no `sizes`, so Next emits 1x/2x. */}
                    <AppImage
                      src={card.imageUrl}
                      alt={card.imageAlt}
                      width={92}
                      height={92}
                      className="block h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="mb-1 block text-[10.5px] font-700 uppercase tracking-[.03em] text-brand-600">
                      {card.tag}
                    </span>
                    <div className="line-clamp-2 text-[15px] font-700 leading-[1.35] text-ink">
                      {card.title}
                    </div>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-600 text-brand-600 underline hover:text-brand-700">
                      {card.ctaLabel}
                      <Icon name="arrow-right"
                        style={{ fontSize: '10px' }}
                      />
                    </span>
                  </div>
                </SmartLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
