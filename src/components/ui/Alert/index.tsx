import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { IconName } from '@/types/icon';
import { Icon } from '../Icon';

/**
 * Inline feedback banner - form results, API failures, notices.
 *
 * The ARIA wiring is the important part: `error` uses `role="alert"` (assertive,
 * interrupts) because a failed submit must be heard immediately, while the other
 * tones use `role="status"` (polite) so a success message does not cut across
 * what the visitor is reading.
 */
export type AlertTone = 'success' | 'error' | 'warning' | 'info';

const TONE: Record<
  AlertTone,
  { container: string; icon: IconName; iconColor: string }
> = {
  success: {
    container: 'bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]',
    icon: 'circle-check',
    iconColor: 'text-[#16a34a]',
  },
  error: {
    container: 'bg-[#fef2f2] border-[#fecaca] text-[#b91c1c]',
    icon: 'alert-circle',
    iconColor: 'text-[#dc2626]',
  },
  warning: {
    container: 'bg-[#fffbeb] border-[#fde68a] text-[#b45309]',
    icon: 'alert-triangle',
    iconColor: 'text-[#d97706]',
  },
  info: {
    container: 'bg-brand-50 border-brand-100 text-brand-800',
    icon: 'info',
    iconColor: 'text-brand-600',
  },
};

export interface AlertProps {
  children: ReactNode;
  tone?: AlertTone;
  title?: string;
  className?: string;
  /** Renders a dismiss button and calls back when pressed. */
  onDismiss?: () => void;
}

export function Alert({
  children,
  tone = 'info',
  title,
  className,
  onDismiss,
}: AlertProps) {
  const config = TONE[tone];

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'flex items-start gap-3 rounded-xl border p-4 text-[14px] leading-relaxed',
        config.container,
        className,
      )}
    >
      <Icon name={config.icon} className={cn('mt-0.5', config.iconColor)} />
      <div className="flex-1">
        {title ? <p className="mb-1 font-700">{title}</p> : null}
        <div>{children}</div>
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className="shrink-0 rounded p-1 opacity-60 transition-opacity hover:opacity-100"
        >
          <Icon name="close" />
        </button>
      ) : null}
    </div>
  );
}
