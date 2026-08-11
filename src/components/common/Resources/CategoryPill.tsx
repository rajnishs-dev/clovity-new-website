import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Icon, type IconName } from '@/components/ui/Icon';

/** Tone → background/text pair, lifted from the legacy `.cs-cat-*` / `.evt-cat-*` pills. */
export type CategoryTone = 'blue' | 'violet' | 'cyan' | 'pink';

const TONE_CLASS: Record<CategoryTone, string> = {
  blue: 'bg-[#eff6ff] text-[#1d4ed8]',
  violet: 'bg-[#f5f3ff] text-[#7c3aed]',
  cyan: 'bg-[#ecfeff] text-[#0e7490]',
  pink: 'bg-[#fdf2f8] text-[#db2777]',
};

export interface CategoryPillProps {
  label: string;
  icon: IconName;
  tone: CategoryTone;
  className?: string;
}

/** The small uppercase pill above a featured/grid card's title. */
export function CategoryPill({
  label,
  icon,
  tone,
  className,
}: CategoryPillProps) {
  return (
    <span
      className={cn(
        'mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-800 uppercase tracking-[.06em]',
        TONE_CLASS[tone],
        className,
      )}
    >
      <Icon name={icon} className="text-[11px]" /> {label}
    </span>
  );
}

/** The small grey meta item (date, location, client…) used in card meta rows. */
export function MetaItem({
  icon,
  children,
}: {
  icon: IconName;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] font-700 text-black">
      <Icon name={icon} className="text-[11px] text-[#94a3b8]" /> {children}
    </span>
  );
}
