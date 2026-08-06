import type { CSSProperties, ReactNode } from 'react';
import { Typography, type TypographyVariant } from '../Typography';

/**
 * Semantic heading with an explicit level, so the document outline is a
 * deliberate choice rather than a side effect of which visual size looked right.
 *
 * `level` sets the tag (h1…h6); `visual` optionally borrows a different scale.
 * That separation is what lets a section keep a correct h2 while looking like
 * the smaller h3 the design calls for.
 */
export interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  visual?: TypographyVariant;
  id?: string;
  style?: CSSProperties;
}

const LEVEL_VARIANT: Record<
  HeadingProps['level'],
  Extract<TypographyVariant, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'>
> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export function Heading({
  level,
  children,
  className,
  visual,
  id,
  style,
}: HeadingProps) {
  return (
    <Typography
      variant={visual ?? LEVEL_VARIANT[level]}
      as={`h${level}` as const}
      className={className}
      id={id}
      style={style}
    >
      {children}
    </Typography>
  );
}
