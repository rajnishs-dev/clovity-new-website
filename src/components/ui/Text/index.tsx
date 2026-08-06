import type { CSSProperties, ElementType, ReactNode } from 'react';
import { Typography, type TypographyVariant } from '../Typography';

/** Inline / block text at one of the body scales. */
export interface TextProps {
  children: ReactNode;
  size?: 'large' | 'medium' | 'small' | 'caption';
  className?: string;
  as?: ElementType;
  style?: CSSProperties;
}

const SIZE_VARIANT: Record<
  NonNullable<TextProps['size']>,
  TypographyVariant
> = {
  large: 'bodyLarge',
  medium: 'bodyMedium',
  small: 'bodySmall',
  caption: 'caption',
};

export function Text({
  children,
  size = 'medium',
  className,
  as = 'span',
  style,
}: TextProps) {
  return (
    <Typography
      variant={SIZE_VARIANT[size]}
      as={as}
      className={className}
      style={style}
    >
      {children}
    </Typography>
  );
}
