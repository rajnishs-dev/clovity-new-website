import type { CSSProperties, ReactNode } from 'react';
import { Text, type TextProps } from '../Text';

/** A block paragraph. Same scales as `<Text>`, always rendered as `<p>`. */
export interface ParagraphProps {
  children: ReactNode;
  size?: TextProps['size'];
  className?: string;
  style?: CSSProperties;
}

export function Paragraph({
  children,
  size = 'medium',
  className,
  style,
}: ParagraphProps) {
  return (
    <Text as="p" size={size} className={className} style={style}>
      {children}
    </Text>
  );
}
