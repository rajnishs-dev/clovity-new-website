import { useEffect, useState } from 'react';

/**
 * Returns `value`, delayed until `delayMs` has passed with no further change.
 *
 * Used to debounce as-you-type search filtering: the input stays responsive
 * (its own state updates every keystroke), while the expensive part - the
 * result set re-filtering, and the list's re-render - only happens once the
 * visitor pauses, instead of on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
