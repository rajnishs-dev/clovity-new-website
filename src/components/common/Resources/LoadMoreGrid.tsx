'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';

/**
 * Reveals a static list in batches behind a "Load More" button. Deliberately
 * not URL-driven pagination - every item is already bundled static content,
 * so `<Pagination>` stays reserved for a real paginated API response.
 *
 * `items` is an array of already-rendered cards, not raw data plus a render
 * callback: a Server Component parent can hand this Client Component
 * pre-rendered JSX, but not a render function, since closures aren't
 * serializable across the server/client boundary.
 */
export function LoadMoreGrid({
  items,
  initialCount,
  step = initialCount,
  gridClassName,
  loadMoreLabel = 'Load More',
  doneLabel = "You're all caught up",
}: {
  items: ReactNode[];
  initialCount: number;
  step?: number;
  gridClassName?: string;
  loadMoreLabel?: string;
  doneLabel?: string;
}) {
  const [visible, setVisible] = useState(initialCount);
  const done = visible >= items.length;

  return (
    <>
      <div className={gridClassName}>{items.slice(0, visible)}</div>

      {items.length > initialCount ? (
        <div className="mt-11 flex justify-center">
          <button
            type="button"
            disabled={done}
            onClick={() =>
              setVisible((count) => Math.min(items.length, count + step))
            }
            className={cn(
              buttonClass('secondary'),
              done && 'pointer-events-none opacity-50',
            )}
          >
            {done ? doneLabel : loadMoreLabel}
            <Icon name={done ? 'check' : 'chevron-down'} className="text-xs" />
          </button>
        </div>
      ) : null}
    </>
  );
}
