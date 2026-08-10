'use client';

import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Tooltip that works without a mouse.
 *
 * Opens on hover AND on focus, closes on blur, mouse-leave and Escape, and is
 * wired with `aria-describedby` so the text is actually announced rather than
 * being a purely visual hint. CSS-only `:hover` tooltips are invisible to
 * keyboard and screen-reader users, which is why this is a component.
 *
 * Never put essential information here - a tooltip is supplementary by
 * definition, and touch devices have no hover state at all.
 */
export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

const SIDE_CLASS = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
} as const;

export function Tooltip({
  content,
  children,
  side = 'top',
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') setOpen(false);
      }}
    >
      <span aria-describedby={open ? tooltipId : undefined}>{children}</span>
      <span
        id={tooltipId}
        role="tooltip"
        hidden={!open}
        className={cn(
          'pointer-events-none absolute z-50 w-max max-w-[240px] rounded-lg bg-[#0f172a] px-3 py-2 text-[12.5px] font-500 leading-snug text-white shadow-[0_8px_24px_rgba(15,23,42,.24)]',
          SIDE_CLASS[side],
          className,
        )}
      >
        {content}
      </span>
    </span>
  );
}
