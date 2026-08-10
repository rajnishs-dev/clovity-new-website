'use client';

import { useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';

/**
 * Reveals a static list in batches behind a "Load More" button - the legacy
 * `#load-more-btn` behaviour on `blog.html` / `news.html` (which just toggled
 * `display` on already-rendered cards), rebuilt as real client state instead
 * of a `data-page` attribute scan.
 *
 * Deliberately not URL-driven pagination: every item the list will ever hold
 * is already on the page (it's bundled static content), so there is nothing a
 * `?page=` link would make more crawlable - `<Pagination>` stays reserved for
 * a real paginated API response.
 *
 * `items` is an array of ALREADY-RENDERED cards (each with its own `key`), not
 * raw data plus a render callback. A Server Component parent can hand a Client
 * Component pre-rendered JSX as `children`/props - that's just a serialized
 * element tree - but it cannot hand it a render *function*, since closures
 * aren't serializable across the server/client boundary. Rendering each card
 * server-side and only slicing the resulting array client-side keeps every
 * page's `page.tsx` a plain Server Component.
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
