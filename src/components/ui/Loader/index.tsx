import { cn } from '@/lib/cn';
import { Spinner } from '../Spinner';

/**
 * Full-region loading state, used by `loading.tsx` route files and by sections
 * awaiting API data.
 *
 * `role="status"` + `aria-live="polite"` so the wait is announced once, without
 * interrupting whatever the visitor is currently reading.
 */
export interface LoaderProps {
  label?: string;
  className?: string;
  /** Fill the viewport (route-level) rather than just the parent box. */
  fullScreen?: boolean;
}

export function Loader({
  label = 'Loading',
  className,
  fullScreen = false,
}: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center gap-4 text-brand-600',
        fullScreen ? 'min-h-[60svh] w-full' : 'w-full py-16',
        className,
      )}
    >
      <Spinner size="lg" />
      <span className="text-[14px] font-500 text-[#64748b]">{label}</span>
    </div>
  );
}
