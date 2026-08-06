'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { createFocusTrap, getFocusableElements } from '@/utils/a11y';

/**
 * Slide-in panel. The mobile navigation is built on this.
 *
 * NOT portalled, unlike Modal: the panel must stay inside the header's React
 * tree so the nav data and active-link state flow down normally, and the legacy
 * `#mobile-menu` CSS (which owns the `translateX` transition) targets it by id
 * at document level anyway.
 *
 * It stays mounted and translated off-screen rather than unmounting, which is
 * what makes the 0.35s cubic-bezier slide-out visible — unmounting would cut it
 * off. `inert` keeps the hidden panel out of the tab order and the a11y tree.
 */
export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the panel. */
  label: string;
  children: ReactNode;
  /** DOM id — the legacy stylesheet targets `#mobile-menu`. */
  id?: string;
  side?: 'left' | 'right';
  className?: string;
  /** Skip the built-in transform classes when custom CSS owns the animation. */
  unstyled?: boolean;
}

export function Drawer({
  open,
  onClose,
  label,
  children,
  id,
  side = 'right',
  className,
  unstyled = false,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const labelId = useId();

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) {
      previousFocusRef.current?.focus();
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    if (panel) {
      const focusable = getFocusableElements(panel);
      (focusable[0] ?? panel).focus();
    }

    const trap = panel ? createFocusTrap(panel) : null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      trap?.(event);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      id={id}
      role="dialog"
      aria-modal={open || undefined}
      aria-label={label}
      aria-labelledby={undefined}
      aria-hidden={!open || undefined}
      // `inert` is a boolean attribute; React 19 forwards it correctly.
      inert={!open}
      tabIndex={-1}
      data-label-id={labelId}
      className={cn(
        !unstyled && [
          'fixed inset-y-0 z-[999] flex w-full max-w-[420px] flex-col bg-white shadow-[0_30px_70px_rgba(4,10,25,.35)] transition-transform duration-[350ms] ease-[cubic-bezier(.4,0,.2,1)]',
          side === 'right' ? 'right-0' : 'left-0',
          open
            ? 'translate-x-0'
            : side === 'right'
              ? 'translate-x-full'
              : '-translate-x-full',
        ],
        className,
      )}
    >
      {children}
    </div>
  );
}
