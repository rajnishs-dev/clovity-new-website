/** Accessibility helpers shared across interactive components. */

/** Keys that should activate a `role="button"` element. */
export const ACTIVATION_KEYS = ['Enter', ' ', 'Spacebar'] as const;

export function isActivationKey(key: string): boolean {
  return (ACTIVATION_KEYS as readonly string[]).includes(key);
}

/** CSS selector matching every natively focusable element. */
export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

/** Every focusable descendant of `container`, in DOM order. */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (el) =>
      el.offsetWidth > 0 ||
      el.offsetHeight > 0 ||
      el === document.activeElement,
  );
}

/**
 * Trap Tab inside `container`. Returns a `keydown` handler to attach - the
 * caller owns attach/detach so it stays symmetric with the effect lifecycle.
 */
export function createFocusTrap(container: HTMLElement) {
  return function handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const focusable = getFocusableElements(container);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };
}

/** Stable id generator for aria-controls / aria-labelledby pairs. */
export function ariaId(prefix: string, suffix: string | number): string {
  return `${prefix}-${String(suffix).replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}
