'use client';

import { useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { HEADER_CTA } from '@/config/navigation';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { ArrowIcon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';
import { Logo } from '@/components/common/Logo';
import { MobileMenu } from '../MobileMenu';
import { Navbar } from '../Navbar';

/**
 * Site header, as Tailwind utilities.
 *
 * MIGRATION NOTE - this component absorbed the single messiest part of the legacy
 * CSS. `#navbar` was styled twice: `theme.css` gave it the solid white bar that
 * interior pages use, and `home.css` re-declared the same id to make it a
 * transparent pill floating over the dark hero. Which one applied depended purely
 * on stylesheet import order, and the two blocks had to be read together to know
 * what any given page rendered.
 *
 * That is now a `variant` prop:
 *   • `floating` - transparent pill over dark artwork; gains a white pill on
 *     scroll and slides 14px → 10px from the top. The home page, and every
 *     resource listing page (blog/case-study/events/webinars/news), all of
 *     which open on a dark photo hero.
 *   • `pill`     - the same rounded white pill `floating` settles into on
 *     scroll, but present from first paint and unchanged by scrolling. For
 *     pages whose banner is NOT dark - a transparent header would have no
 *     contrast against a light hero, so those pages skip straight to the
 *     "scrolled" look. Every resource DETAIL page uses this.
 *   • `solid`    - transparent bar that fades to frosted white on scroll, with
 *     16px → 10px vertical padding. Plain interior pages with no hero at all.
 *
 * All three are rendered from one place, so the behaviour is readable without
 * cross-referencing multiple files.
 */

/**
 * Exact transforms the legacy `openMobileMenu()` applied to the bars.
 *
 * One intentional deviation: `closeMobileMenu()` set `hb3.style.width = '16px'`,
 * which did not match the markup's own initial `w-6` (24px) - so the third bar
 * silently shrank after the first open/close cycle. First paint is the contract,
 * so close restores 24px.
 */
const HAMBURGER_OPEN = {
  hb1: { transform: 'rotate(45deg) translate(4px, 5px)' },
  hb2: { opacity: 0 },
  hb3: { transform: 'rotate(-45deg) translate(3px, -4px)', width: '24px' },
} as const;

export interface HeaderProps {
  /**
   * `floating` for pages whose hero sits behind the header and is dark (the
   * home page, every resource listing page); `pill` for pages whose hero is
   * NOT dark (every resource detail page); `solid` for plain interior pages
   * with no hero.
   */
  variant?: 'floating' | 'pill' | 'solid';
  /** Fetch the logo with priority - it is the LCP-adjacent element. */
  priorityLogo?: boolean;
}

export function Header({
  variant = 'solid',
  priorityLogo = false,
}: HeaderProps) {
  const scrolled = useHeaderScroll();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const isPillShell = variant === 'floating' || variant === 'pill';
  // `pill` is always in the "settled" state; `floating` settles on scroll.
  const pillActive = variant === 'pill' || scrolled;
  // Nav text and hamburger bars go white only while a `floating` header is
  // still transparent over dark artwork - `pill` never is.
  const onDark = variant === 'floating' && !scrolled;

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 z-50 w-full',
          isPillShell
            ? cn(
                'transition-[top] duration-300 ease-native',
                pillActive ? 'top-2.5' : 'top-3.5',
              )
            : cn(
                'top-0 border-b border-transparent',
                '[transition:background_.35s_ease,box-shadow_.35s_ease,padding_.35s_ease,border-color_.35s_ease,backdrop-filter_.35s_ease]',
                scrolled
                  ? 'bg-white/95 py-2.5 shadow-[0_1px_24px_rgba(0,0,0,.06)] backdrop-blur-[10px]'
                  : // `opaque` at rest: 97% white, a visible `#e2e8f0` rule, a
                    // slightly tighter shadow and 12px padding. On scroll it hands
                    // over to the shared scrolled state above, which is what the
                    // published pages do — `#navbar.scrolled` outranks their own
                    // `#navbar` override on specificity.
                    opaque
                    ? 'border-line bg-white/[.97] py-3 shadow-[0_1px_20px_rgba(15,23,42,.06)] backdrop-blur-[10px]'
                    : 'bg-transparent py-4',
              ),
        )}
      >
        <div className={cn(isPillShell && 'px-3')}>
          <nav
            aria-label="Primary"
            className={cn(
              'mx-auto flex items-center justify-between gap-4',
              isPillShell
                ? cn(
                    'max-w-shell rounded-[44px] border',
                    '[transition:background_.3s_ease,border-color_.3s_ease,box-shadow_.3s_ease,backdrop-filter_.3s_ease,padding_.3s_ease]',
                    pillActive
                      ? 'border-hero-pill bg-white px-4 py-2 shadow-pill to-560:rounded-[30px] to-560:py-2 to-560:pl-2 to-560:pr-2.5'
                      : 'border-transparent bg-transparent pb-2.5 pl-1 pr-3 pt-2.5',
                  )
                : 'max-w-shell px-6',
            )}
          >
            <Logo
              /* 72px default, 56px settled - the height the legacy
                 `.nav-logo-img` rule resolved to on the home page. */
              imageClassName={cn(
                'w-auto [transition:height_.35s_ease,filter_.35s_ease]',
                pillActive ? 'h-[50px] md:h-[56px]' : 'h-[60px] md:h-[72px]',
              )}
              showWhite={onDark}
              priority={priorityLogo}
            />

            <Navbar onDark={onDark} scrolled={pillActive} />

            <div className="flex items-center gap-2">
              <SmartLink
                href={HEADER_CTA.href}
                className={buttonClass(
                  'primary',
                  'md',
                  'hidden px-[22px] py-[11px] text-sm lg:inline-flex',
                )}
              >
                {HEADER_CTA.label}
                <ArrowIcon />
              </SmartLink>

              <button
                ref={toggleRef}
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                className="flex cursor-pointer flex-col items-end gap-1.5 border-0 bg-transparent p-2 lg:hidden"
              >
                <span
                  className={cn(
                    'block h-[2px] w-6 origin-center rounded transition-all ease-in-out',
                    onDark ? 'bg-white' : 'bg-slate-700',
                  )}
                  style={mobileOpen ? HAMBURGER_OPEN.hb1 : undefined}
                />
                <span
                  className={cn(
                    'block h-[2px] w-6 rounded transition-all ease-in-out',
                    onDark ? 'bg-white' : 'bg-slate-700',
                  )}
                  style={mobileOpen ? HAMBURGER_OPEN.hb2 : undefined}
                />
                <span
                  className={cn(
                    'block h-[2px] w-6 rounded transition-all ease-in-out',
                    onDark ? 'bg-white' : 'bg-slate-700',
                  )}
                  style={mobileOpen ? HAMBURGER_OPEN.hb3 : undefined}
                />
              </button>
            </div>
          </nav>
        </div>
      </header>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        toggleRef={toggleRef}
      />
    </>
  );
}
