import { cn } from './cn';

/**
 * Scroll-reveal, as Tailwind utilities.
 *
 * The legacy site did this with three CSS classes (`.sr`, `.sr-l`, `.sr-r`) plus
 * a fourth (`.in`) that JavaScript added on intersection, and a `data-delay`
 * attribute the script turned into a `setTimeout`.
 *
 * Here the hidden and revealed states are both Tailwind utilities on the same
 * element, switched by a `data-shown` attribute variant. Two things this buys:
 *
 *  1. No JS-to-CSS class contract. The old `.in` class only meant something
 *     because a stylesheet defined it; rename either side and the animation
 *     silently dies. `data-[shown=true]:` is self-contained.
 *  2. The element stays server-rendered. A `<Reveal>` client component would
 *     have pushed every revealed section into the client bundle; setting one
 *     attribute from a single document-level hook does not.
 *
 * Stagger is now `transition-delay` rather than a delayed class toggle. Same
 * visual result — the element sits at opacity 0 either way — with no timers to
 * leak on unmount.
 *
 * Values are the legacy ones exactly: 28px offset, 700ms, CSS `ease`.
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
 * for reduced motion, even before the observer runs — the legacy equivalent was
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
 * WHY THIS IS NEEDED — `reveal()` emits `text-center md:text-left` as part of its
 * base string, so applying it to a block silently changes that block's alignment:
 * centred on small screens, left-aligned from 768px up. For anything whose design
 * specifies a single alignment (a centred section header, a left-aligned card body)
 * that is a visual change coming from a motion utility, which is not a decision the
 * motion utility should be making.
 *
 * Rather than edit `reveal()` — the home page's sections were written against its
 * current output and changing it would shift that page — this composes on top and
 * lets tailwind-merge resolve the conflict, so the alignment a caller asks for is
 * the alignment that renders at every width.
 *
 * Use this on interior pages. Both alignments are declared at both breakpoints on
 * purpose: naming only the base would leave `reveal()`'s `md:text-left` in play.
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
 * Marks the element for the reveal observer.
 *
 * OPTIONAL. `useScrollReveal` also matches the `transition-reveal` class that
 * `reveal()` always emits, so the classes on their own are enough. This is kept
 * because it reads as an explicit "this element animates in" signal in JSX.
 *
 * It used to be mandatory, and that was a design mistake: a caller who applied
 * `reveal()` but forgot this left the element stuck at `opacity: 0` with nothing
 * to recover it — no error, no warning, just invisible content.
 */
export function revealAttrs(): { 'data-reveal': '' } {
  return { 'data-reveal': '' };
}
