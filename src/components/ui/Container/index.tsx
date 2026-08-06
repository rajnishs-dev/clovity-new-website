import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * The page shell. Every section in the legacy markup wrapped its content in
 * `max-w-[1280px] mx-auto px-6`; this is that, named once.
 *
 * `width="nav"` is the wider 1360px track the header pill uses.
 */
export type ContainerWidth = 'shell' | 'nav' | 'prose' | 'full';

const WIDTH_CLASS: Record<ContainerWidth, string> = {
  shell: 'max-w-[1280px]',
  nav: 'max-w-[1360px]',
  prose: 'max-w-[760px]',
  full: 'max-w-none',
};

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  width?: ContainerWidth;
  /** Drop the default horizontal padding (for full-bleed children). */
  flush?: boolean;
  as?: ElementType;
  id?: string;
}

export function Container({
  children,
  className,
  width = 'shell',
  flush = false,
  as: Tag = 'div',
  id,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      className={cn(
        'mx-auto w-full',
        WIDTH_CLASS[width],
        !flush && 'px-6',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
