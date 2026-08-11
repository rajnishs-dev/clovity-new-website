'use client';

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { createFocusTrap, getFocusableElements } from '@/lib/a11y';
import { Icon } from '../Icon';

/**
 * Accessible modal dialog.
 *
 * Everything a dialog owes the keyboard, in one place:
 *   • `role="dialog"` + `aria-modal` + `aria-labelledby`
 *   • focus moves in on open and returns to the trigger on close
 *   • Tab is trapped inside the panel
 *   • Escape and backdrop click both dismiss
 *   • background scroll is frozen while open
 *
 * Rendered through a portal on `document.body` so an `overflow: hidden` or
 * `transform` ancestor cannot clip or mis-position it.
 */
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Hide the visible title but keep it as the accessible name. */
  hideTitle?: boolean;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_CLASS = {
  sm: 'max-w-[420px]',
  md: 'max-w-[600px]',
  lg: 'max-w-[880px]',
} as const;

export function Modal({
  open,
  onClose,
  title,
  children,
  hideTitle = false,
  footer,
  size = 'md',
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    if (panel) {
      const focusable = getFocusableElements(panel);
      (focusable[0] ?? panel).focus();
    }

    const trap = panel ? createFocusTrap(panel) : null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }
      trap?.(event);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[rgba(2,6,23,.6)] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative z-10 max-h-[calc(100vh-2rem)] w-full overflow-y-auto rounded-[20px] bg-white p-7 shadow-[0_30px_70px_rgba(4,10,25,.35)]',
          SIZE_CLASS[size],
          className,
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2
            id={titleId}
            className={cn(
              'text-[19px] font-700 leading-tight text-[#0f172a]',
              hideTitle && 'sr-only',
            )}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200"
          >
            <Icon name="close" className="text-lg" />
          </button>
        </div>
        <div>{children}</div>
        {footer ? (
          <div className="mt-6 flex justify-end gap-3">{footer}</div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
