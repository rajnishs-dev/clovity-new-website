'use client';

import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '../Icon';

/**
 * Accordion with correct disclosure semantics: each trigger is a real button
 * carrying `aria-expanded` and `aria-controls`, and each panel is a `region`
 * labelled by its trigger.
 *
 * The legacy mobile nav accordion toggled a `.open` class from a click handler
 * with no ARIA at all — a screen-reader user had no way to know a section was
 * collapsed. Same visuals, correct semantics.
 *
 * `allowMultiple={false}` (the default) reproduces the legacy behaviour of
 * closing every other section when one opens.
 */
export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  /** Ids open on first render. */
  defaultOpen?: string[];
  className?: string;
  itemClassName?: string;
  triggerClassName?: string;
  panelClassName?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className,
  itemClassName,
  triggerClassName,
  panelClassName,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpen);
  const baseId = useId();

  const toggle = (id: string) => {
    setOpenIds((current) => {
      const isOpen = current.includes(id);
      if (allowMultiple) {
        return isOpen ? current.filter((x) => x !== id) : [...current, id];
      }
      return isOpen ? [] : [id];
    });
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const triggerId = `${baseId}-trigger-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div key={item.id} className={itemClassName}>
            <button
              type="button"
              id={triggerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.id)}
              className={cn(
                'flex w-full items-center justify-between gap-4 border-0 border-b border-slate-100 bg-transparent py-3 text-left text-base font-700 text-slate-800',
                triggerClassName,
              )}
            >
              {item.title}
              <Icon name="chevron-down"
                className={cn(
                  'text-xs text-slate-400 transition-transform',
                  isOpen && 'rotate-180',
                )}
              />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className={cn('py-2 pl-4', panelClassName)}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
