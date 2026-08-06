import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { IconName } from '@/types/icon';
import { ButtonLink } from '../Button';
import { Icon } from '../Icon';

/**
 * Shown when a list resolves to nothing — an empty blog filter, a search with no
 * hits, a category with no published items yet.
 *
 * Always offers a next action. A dead end with no way forward is a worse outcome
 * than the empty result itself.
 */
export interface EmptyStateProps {
  title: string;
  description?: string;
  /** Illustration glyph. */
  icon?: IconName;
  action?: { label: string; href: string };
  children?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon = 'inbox',
  action,
  children,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-16 text-center',
        className,
      )}
    >
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-[22px] text-brand-600">
        <Icon name={icon} />
      </span>
      <p className="mb-2 text-[19px] font-700 text-[#0f172a]">{title}</p>
      {description ? (
        <p className="mb-6 max-w-[440px] text-[14.5px] leading-relaxed text-[#64748b]">
          {description}
        </p>
      ) : null}
      {action ? (
        <ButtonLink href={action.href} variant="secondary" size="sm">
          {action.label}
        </ButtonLink>
      ) : null}
      {children}
    </div>
  );
}
