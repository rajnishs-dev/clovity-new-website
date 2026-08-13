import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Pill chips, as Tailwind utilities.
 *
 *   'a'         ← .a-chip   the Pulse AI capability pills
 *   'cloud'     ← .tag-chip the section pattern library's wrapped pill cloud
 *   'assurance' ← .aspill   the migration assurance strip
 *
 * Icon color reproduces the legacy descendant selector (`.a-chip i {...}`)
 * via `[&_i]:` arbitrary variants, since the icon is passed in by the caller.
 */
export type ChipVariant = 'a' | 'cloud' | 'assurance';

const VARIANT_CLASS: Record<ChipVariant, string> = {
  a: cn(
    'inline-flex items-center gap-2 rounded-pill border border-line bg-white px-4 py-[9px] text-[13px] font-500 text-[#334155]',
    'shadow-[0_1px_4px_rgba(15,23,42,.05)]',
    '[&_i]:text-[12px] [&_i]:text-brand-600',
  ),
  cloud: cn(
    'inline-flex items-center gap-2 rounded-pill border border-line bg-white px-[18px] py-2.5 text-[13.5px] font-700 text-muted',
    '[transition:border-color_.2s,transform_.2s,box-shadow_.2s]',
    'hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_8px_20px_rgba(15,23,42,.08)]',
    '[&_i]:text-brand-600',
  ),
  assurance: cn(
    'flex items-center gap-2 rounded-pill border border-line bg-white px-[18px] py-[9px] text-[12.5px] font-700 text-ink shadow-xs',
    '[transition:transform_.25s,border-color_.25s,box-shadow_.25s]',
    'hover:-translate-y-[3px] hover:border-[#bbf7d0] hover:shadow-[0_8px_20px_rgba(22,163,74,.13)]',
    '[&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0 [&_svg]:text-brand-green',
  ),
};

/**
 * The chip classes as a plain string, for the few places that need the treatment
 * on an element the component cannot render - e.g. an anchor that must be the
 * direct child of a flex row.
 */
export function chipClass(variant: ChipVariant = 'a', extra?: string): string {
  return cn(VARIANT_CLASS[variant], extra);
}

export interface ChipProps {
  children: ReactNode;
  variant?: ChipVariant;
  className?: string;
  style?: CSSProperties;
  /** Icon node rendered before the label. */
  icon?: ReactNode;
}

export function Chip({
  children,
  variant = 'a',
  className,
  style,
  icon,
}: ChipProps) {
  return (
    <span className={cn(VARIANT_CLASS[variant], className)} style={style}>
      {icon}
      {children}
    </span>
  );
}
