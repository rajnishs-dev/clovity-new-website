import { cn } from '@/lib/cn';

/**
 * Rule between content blocks. Presentational, so it carries `role="presentation"`
 * rather than the implicit `separator` role — screen readers should not announce
 * decorative lines.
 */
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  /** Announce as a real separator (use when it divides list semantics). */
  semantic?: boolean;
}

export function Divider({
  orientation = 'horizontal',
  className,
  semantic = false,
}: DividerProps) {
  return (
    <hr
      {...(semantic
        ? { 'aria-orientation': orientation }
        : { role: 'presentation' })}
      className={cn(
        'border-0 bg-[#e2e8f0]',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  );
}
