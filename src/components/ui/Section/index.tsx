import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs, type RevealDirection } from '@/lib/reveal';
import { Container, type ContainerWidth } from '../Container';
import { HEADING_CLASS, LABEL_CLASS, SUBHEADING_CLASS } from '../Typography';

/**
 * A page section with the site's vertical rhythm.
 *
 * `py-16 sm:py-20` is the spacing every home-page section used. Encoding it here
 * means a future spacing change is one edit rather than twenty, and no section
 * can drift by using `py-20` on its own.
 *
 * `bare` opts out of the inner Container for sections whose own layout owns the
 * width (the hero, the final CTA card, the full-bleed marquee).
 */
export type SectionPadding = 'default' | 'tight' | 'loose' | 'none';

const PADDING_CLASS: Record<SectionPadding, string> = {
  default: 'py-16 sm:py-20',
  tight: 'py-12 sm:py-16',
  loose: 'py-20 sm:py-28',
  none: '',
};

export interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Classes for the inner Container. */
  innerClassName?: string;
  padding?: SectionPadding;
  width?: ContainerWidth;
  /** Render children directly, without the Container wrapper. */
  bare?: boolean;
  style?: CSSProperties;
  'aria-labelledby'?: string;
  'aria-label'?: string;
}

export function Section({
  children,
  id,
  className,
  innerClassName,
  padding = 'default',
  width = 'shell',
  bare = false,
  style,
  ...aria
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(PADDING_CLASS[padding], className)}
      style={style}
      {...aria}
    >
      {bare ? (
        children
      ) : (
        <Container width={width} className={innerClassName}>
          {children}
        </Container>
      )}
    </section>
  );
}

/**
 * The heading block that opens most sections.
 *
 * Reuses the exported heading/subheading/label utility strings so there is one
 * definition of the section type scale, and wires the scroll-reveal utilities so
 * a caller cannot forget the matching `data-reveal` attribute.
 */
export interface SectionHeaderProps {
  /** May contain a `<GradientText>` highlight. */
  heading: ReactNode;
  subheading?: ReactNode;
  label?: string;
  align?: 'center' | 'left';
  className?: string;
  headingClassName?: string;
  subheadingClassName?: string;
  /** Scroll-reveal direction, or `false` to render statically. */
  revealFrom?: RevealDirection | false;
  revealDelayMs?: number;
  id?: string;
  style?: CSSProperties;
}

export function SectionHeader({
  heading,
  subheading,
  label,
  align = 'center',
  className,
  headingClassName,
  subheadingClassName,
  revealFrom = 'up',
  revealDelayMs,
  id,
  style,
}: SectionHeaderProps) {
  const revealing = revealFrom !== false;

  return (
    <div
      className={cn(
        align === 'center' ? 'text-center' : 'text-left',
        revealing && reveal(revealFrom, revealDelayMs),
        className,
      )}
      style={style}
      {...(revealing ? revealAttrs() : {})}
    >
      {label ? <span className={LABEL_CLASS}>{label}</span> : null}
      <h2 id={id} className={cn(HEADING_CLASS, headingClassName)}>
        {heading}
      </h2>
      {subheading ? (
        <p className={cn(SUBHEADING_CLASS, subheadingClassName)}>
          {subheading}
        </p>
      ) : null}
    </div>
  );
}
