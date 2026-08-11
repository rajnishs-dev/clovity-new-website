import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Editorial category tags - the small uppercase, letter-spaced label above a
 * card title, as Tailwind utilities.
 *
 *   'story'   ← .csp-tag           customer-story cards
 *   'feature' ← .mega-feature-tag  the Resources mega panel
 *   'date'    ← .ei-date           card-rail dates
 */
export type TagVariant = 'story' | 'feature' | 'date';

const VARIANT_CLASS: Record<TagVariant, string> = {
  story:
    'mb-4 inline-block whitespace-nowrap text-[11px] font-800 uppercase tracking-[.1em] text-black',
  feature:
    'mb-1 block text-[10.5px] font-700 uppercase tracking-[.03em] text-brand-600',
  date: 'mb-[9px] block text-[11px] font-800 uppercase tracking-[.07em] text-[#cbd5e1]',
};

export interface TagProps {
  children: ReactNode;
  variant?: TagVariant;
  className?: string;
  style?: CSSProperties;
}

export function Tag({
  children,
  variant = 'story',
  className,
  style,
}: TagProps) {
  return (
    <span className={cn(VARIANT_CLASS[variant], className)} style={style}>
      {children}
    </span>
  );
}
