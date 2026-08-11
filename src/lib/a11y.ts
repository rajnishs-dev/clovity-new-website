/**
 * Accessibility helpers shared across interactive components.
 *
 * Two of them: `getFocusableElements` and `createFocusTrap`, used by the mobile menu,
 * the drawer and the modal. Everything else this file once exported had no caller.
 */

/** CSS selector matching every natively focusable element. */
const FOCUSABLE_SELECTOR = [
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
