import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Small status/label pill. Tones are taken from the badges already in the
 * legacy markup: the blue Atlassian "Marketplace" tag (#0052cc) and the green
 * FREE pill (#f0fdf4 / #16a34a).
 */
export type BadgeTone =
  'atlassian' | 'brand' | 'success' | 'neutral' | 'accent';
export type BadgeShape = 'rounded' | 'pill';

const TONE_CLASS: Record<BadgeTone, string> = {
  atlassian: 'bg-[#0052cc] text-white',
  brand: 'bg-brand-600 text-white',
  success: 'bg-[#f0fdf4] text-[#16a34a]',
  neutral: 'bg-slate-100 text-slate-700',
  accent: 'bg-[#fdece1] text-orange',
};

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  shape?: BadgeShape;
  className?: string;
  style?: CSSProperties;
}

export function Badge({
  children,
  tone = 'brand',
  shape = 'rounded',
  className,
  style,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2 py-1 text-[10px] font-800 leading-none',
        shape === 'pill' ? 'rounded-full' : 'rounded-md',
        TONE_CLASS[tone],
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}
