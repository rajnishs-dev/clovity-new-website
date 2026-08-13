import { cn } from './cn';

/**
 * Scroll-reveal, as Tailwind utilities.
 *
 * The legacy site used CSS classes (`.sr`, `.sr-l`, `.sr-r`, `.in`) toggled by
 * JS plus a `data-delay` → `setTimeout`. Here the hidden/revealed states are
 * both Tailwind utilities on the same element, switched by a `data-shown`
 * variant:
 *
 *  1. No JS-to-CSS class contract to keep in sync - `data-[shown=true]:` is
 *     self-contained, unlike the old `.in` class.
 *  2. The element stays server-rendered, unlike a `<Reveal>` client component
 *     that would push every revealed section into the client bundle.
 *
 * Stagger is `transition-delay`, not a delayed class toggle, so there's no
 * timer to leak on unmount. Values match the legacy ones: 28px offset, 700ms,
 * CSS `ease`.
 */

export type RevealDirection = 'up' | 'left' | 'right';

const HIDDEN: Record<RevealDirection, string> = {
  up: 'translate-y-7',
  left: '-translate-x-7',
  right: 'translate-x-7',
};

const SHOWN: Record<RevealDirection, string> = {
  up: 'data-[shown=true]:translate-y-0',
  left: 'data-[shown=true]:translate-x-0',
  right: 'data-[shown=true]:translate-x-0',
};

/**
 * Stagger presets as literal class strings.
 *
 * Tailwind only generates classes it can find as complete literals in the
 * source, so `delay-[${ms}ms]` built at runtime would produce no CSS. Keying a
 * map of literals off the data is the way to keep stagger data-driven.
 */
const DELAY: Record<number, string> = {
  0: '',
  50: 'delay-[50ms]',
  100: 'delay-100',
  150: 'delay-150',
  200: 'delay-200',
  250: 'delay-[250ms]',
  300: 'delay-300',
};

/** Snap an arbitrary delay onto the nearest supported 50ms step. */
function delayClass(ms: number | undefined): string {
  if (!ms) return '';
  const step = Math.min(300, Math.max(0, Math.round(ms / 50) * 50));
  return DELAY[step] ?? '';
}

/**
 * Utilities for a scroll-revealed element.
 *
 * Pair with `revealAttrs()` so the observer can find it.
 * `motion-reduce:` guarantees the content is visible for anyone who has asked
 * for reduced motion, even before the observer runs - the legacy equivalent was
 * a 2.5s `setTimeout` that added `.sr-fallback` to `<html>`.
 */
export function reveal(
  direction: RevealDirection = 'up',
  delayMs?: number,
): string {
  return cn(
    // `transition-reveal` is a config token, not `transition-[opacity,transform]`:
    // the arbitrary form emitted no CSS at all, leaving the property at `all`.
    'text-center md:text-left opacity-0 transition-reveal duration-700 ease-native',
    HIDDEN[direction],
    'data-[shown=true]:opacity-100',
    SHOWN[direction],
    delayClass(delayMs),
    'motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
  );
}

/**
 * `reveal()` with the element's text alignment stated explicitly.
 *
 * `reveal()` bakes in `text-center md:text-left`, which silently changes
 * alignment for anything with a single specified alignment - a decision a
 * motion utility shouldn't be making. Rather than edit `reveal()` (the home
 * page depends on its current output), this composes on top and lets
 * tailwind-merge resolve the conflict.
 *
 * Both alignments are declared at both breakpoints on purpose - naming only
 * the base would leave `reveal()`'s `md:text-left` in play.
 */
const ALIGNMENT: Record<'left' | 'center', string> = {
  left: 'text-left md:text-left',
  center: 'text-center md:text-center',
};

export function revealAligned(
  align: 'left' | 'center',
  direction: RevealDirection = 'up',
  delayMs?: number,
): string {
  return cn(reveal(direction, delayMs), ALIGNMENT[align]);
}

/**
 * Marks the element for the reveal observer. OPTIONAL - `useScrollReveal` also
 * matches the `transition-reveal` class `reveal()` emits, so this is kept only
 * as a readable "this animates in" signal in JSX.
 *
 * Used to be mandatory; that was a mistake - a caller who forgot it left the
 * element stuck at `opacity: 0` with no error and no recovery.
 */
export function revealAttrs(): { 'data-reveal': '' } {
  return { 'data-reveal': '' };
}
