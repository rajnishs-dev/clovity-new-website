import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names, letting later Tailwind utilities beat earlier ones.
 *
 * `clsx` resolves conditionals/arrays/objects; `twMerge` then de-duplicates
 * conflicting Tailwind utilities so a caller's `className` can always override
 * a component's defaults without `!important`.
 *
 * Note: hand-written theme classes (`.btn-primary`, `.s-heading`, …) are opaque
 * to twMerge and pass through untouched — which is what we want, since those
 * carry the pixel contract from the legacy stylesheet.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
