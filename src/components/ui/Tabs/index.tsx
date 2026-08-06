'use client';

import { useCallback, useId, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Tab list following the WAI-ARIA tabs pattern.
 *
 * The legacy "What We Learn in the Field" tabs were plain buttons toggling an
 * `.active` class — no `role`, no arrow-key navigation, no association between
 * a tab and the cards it controlled. This keeps the same look and adds:
 *   • `role="tablist"` / `tab` / `tabpanel` with `aria-selected` + `aria-controls`
 *   • roving tabindex, so Tab enters the group once and arrows move within it
 *   • Home/End jump to the first/last tab
 *
 * Controlled on purpose: the home page holds the active tab in state because the
 * heading, subheading and "View More" link all change with it.
 */
export interface TabItem {
  id: string;
  label: ReactNode;
  /**
   * Extra classes for this tab only — e.g. a per-index staggered reveal.
   * Applied after `tabClassName`, so it wins on conflicts.
   */
  className?: string;
  /**
   * Extra DOM attributes for this tab only.
   *
   * This exists because a class alone is not always enough: the scroll-reveal
   * treatment needs both its utilities *and* a `data-reveal` attribute for the
   * observer to find the element. Without a way to pass the attribute, callers
   * could apply the classes and silently leave every tab stuck at opacity 0 —
   * which is exactly what happened.
   */
  attrs?: Record<string, string>;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  /** Accessible name for the tablist. */
  label: string;
  className?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  orientation?: 'horizontal' | 'vertical';
  /** DOM id prefix, so panels elsewhere can reference these tabs. */
  idPrefix?: string;
}

export function Tabs({
  items,
  activeId,
  onChange,
  label,
  className,
  tabClassName,
  activeTabClassName,
  orientation = 'vertical',
  idPrefix,
}: TabsProps) {
  const generatedId = useId();
  const base = idPrefix ?? generatedId;
  const listRef = useRef<HTMLDivElement | null>(null);

  const focusTabAt = useCallback((index: number) => {
    const buttons =
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[index]?.focus();
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = items.findIndex((item) => item.id === activeId);
    if (currentIndex < 0) return;

    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';

    let nextIndex: number | null = null;
    if (event.key === nextKey) nextIndex = (currentIndex + 1) % items.length;
    else if (event.key === prevKey)
      nextIndex = (currentIndex - 1 + items.length) % items.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = items.length - 1;

    if (nextIndex === null) return;
    const nextItem = items[nextIndex];
    if (!nextItem) return;

    event.preventDefault();
    onChange(nextItem.id);
    focusTabAt(nextIndex);
  };

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      aria-orientation={orientation}
      onKeyDown={onKeyDown}
      className={className}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            id={`${base}-tab-${item.id}`}
            aria-selected={isActive}
            aria-controls={`${base}-panel-${item.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(item.id)}
            className={cn(
              tabClassName,
              item.className,
              isActive && activeTabClassName,
            )}
            {...(item.attrs ?? {})}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

/** The panel controlled by a `<Tabs>` entry. Render one per visible tab. */
export function TabPanel({
  tabId,
  idPrefix,
  children,
  className,
}: {
  tabId: string;
  idPrefix: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${tabId}`}
      aria-labelledby={`${idPrefix}-tab-${tabId}`}
      tabIndex={0}
      className={className}
    >
      {children}
    </div>
  );
}
