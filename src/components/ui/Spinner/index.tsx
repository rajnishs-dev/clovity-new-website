import { cn } from '@/lib/cn';

/**
 * Indeterminate spinner. Pure CSS (Tailwind's `animate-spin`) rather than an
 * SVG animation, so it costs nothing and respects the reduced-motion override
 * in the page stylesheet.
 */
export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  /** Announce to screen readers. Omit inside a button that is already busy. */
  label?: string;
}

const SIZE_CLASS = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-9 w-9 border-[3px]',
} as const;

export function Spinner({ size = 'sm', className, label }: SpinnerProps) {
  return (
    <span
      className={cn(
        'inline-block shrink-0 animate-spin rounded-full border-current border-t-transparent',
        SIZE_CLASS[size],
        className,
      )}
      {...(label
        ? { role: 'status', 'aria-label': label }
        : { 'aria-hidden': true })}
    />
  );
}
