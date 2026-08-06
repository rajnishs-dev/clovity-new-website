import { cn } from '@/lib/cn';

/**
 * Loading placeholder. Shaped to the real content's box so the swap does not
 * shift layout — the whole point of a skeleton over a spinner.
 *
 * `aria-hidden` because a skeleton conveys nothing to a screen reader; the
 * container should own the `aria-busy`/`role="status"` announcement instead.
 */
export interface SkeletonProps {
  className?: string;
  /** Applies the pill radius used by chips and buttons. */
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const RADIUS_CLASS = {
  sm: 'rounded',
  md: 'rounded-[10px]',
  lg: 'rounded-[20px]',
  full: 'rounded-full',
} as const;

export function Skeleton({ className, rounded = 'md' }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'block animate-pulse bg-slate-200/70',
        RADIUS_CLASS[rounded],
        className,
      )}
    />
  );
}

/** Text-block skeleton: N lines, last one short, matching real paragraph rag. */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <span className={cn('flex flex-col gap-2', className)} aria-hidden>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          rounded="sm"
          className={cn('h-3.5', index === lines - 1 && 'w-2/3')}
        />
      ))}
    </span>
  );
}

/** Card skeleton matching the `.csp-card` / `.app-card` footprint. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn('rounded-[10px] border border-[#e8edf4] p-7', className)}
      role="status"
      aria-busy="true"
      aria-label="Loading content"
    >
      <Skeleton className="mb-5 h-[70px] w-[160px]" />
      <Skeleton rounded="sm" className="mb-4 h-3 w-24" />
      <Skeleton rounded="sm" className="mb-2.5 h-5 w-full" />
      <SkeletonText lines={2} />
    </div>
  );
}
