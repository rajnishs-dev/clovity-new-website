'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '../Icon';

/**
 * A custom-styled single-select dropdown - the legacy `.evt-cat-dropdown` /
 * `.evt-status-dropdown` pattern (button + absolutely-positioned option list),
 * generalized into a reusable component instead of a native `<select>`.
 *
 * A native `<select>` cannot carry a colored dot swatch per option, cannot be
 * restyled past a browser's own popover chrome, and renders differently across
 * browsers/OSes - all of which the legacy design already relied on.
 * `role="listbox"`/`option` plus `aria-haspopup`/`aria-expanded`/`aria-selected`
 * reproduce a native select's semantics for assistive tech; closing on outside
 * click and `Escape` reproduces its interaction.
 */
export interface SelectOption<TValue extends string> {
  value: TValue;
  label: string;
  /** A small colored dot before the label, e.g. a category swatch. */
  dotColor?: string;
}

export interface SelectProps<TValue extends string> {
  value: TValue;
  onChange: (value: TValue) => void;
  options: SelectOption<TValue>[];
  ariaLabel: string;
  className?: string;
}

const TOGGLE_CLASS =
  'flex w-full items-center gap-2.5 whitespace-nowrap rounded-xl bg-white px-4 py-3 text-left text-[14px] font-700 text-title shadow-[0_0_0_1px_rgba(15,23,42,.08)] transition-shadow hover:shadow-[0_0_0_1px_rgba(37,99,235,.4)] focus-visible:shadow-[0_0_0_1.5px_#2563eb]';

const OPTION_CLASS =
  'flex w-full items-center gap-2.5 whitespace-nowrap rounded-[9px] border-0 bg-transparent px-3 py-2.5 text-left text-[13px] font-600 text-[#475569] transition-colors hover:bg-[#f8fafc] hover:text-brand-700';

const OPTION_ACTIVE_CLASS = 'bg-[#eff6ff] font-800 text-brand-700';

export function Select<TValue extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className,
}: SelectProps<TValue>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn('relative shrink-0', className)}>
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={TOGGLE_CLASS}
      >
        {current?.dotColor ? (
          <span
            className="h-[7px] w-[7px] shrink-0 rounded-full"
            style={{ background: current.dotColor }}
            aria-hidden
          />
        ) : null}
        <span className="min-w-0 flex-1 truncate">{current?.label}</span>
        <Icon
          name="chevron-down"
          className={cn(
            'shrink-0 text-[11px] text-[#94a3b8] transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 top-[calc(100%+8px)] z-[45] min-w-full rounded-[14px] bg-white p-1.5 shadow-[0_24px_64px_rgba(15,23,42,.12),0_4px_16px_rgba(15,23,42,.06)]"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                OPTION_CLASS,
                option.value === value && OPTION_ACTIVE_CLASS,
              )}
            >
              {option.dotColor ? (
                <span
                  className="h-[7px] w-[7px] shrink-0 rounded-full"
                  style={{ background: option.dotColor }}
                  aria-hidden
                />
              ) : null}
              {option.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
