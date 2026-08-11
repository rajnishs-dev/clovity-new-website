import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs, type RevealDirection } from '@/lib/reveal';
import { SmartLink } from '../Link';

/**
 * Card shells, as Tailwind utilities.
 *
 * Replaces the legacy `.card` / `.app-card` / `.exp-card` rules. The lift is the
 * original's exact spring - `cubic-bezier(.34,1.56,.64,1)` over 300ms - expressed
 * as an arbitrary `[transition:…]` property because the three transitioned
 * properties had different easings, which `transition-*` + `ease-*` utilities
 * cannot express (they apply one easing to all).
 *
 *   'default'   ← .card       20px radius
 *   'app'       ← .app-card   10px radius (the Marketplace tiles)
 *   'expertise' ← .exp-card   gradient underline that scales in on hover
 *   'plain'     ← no chrome, for callers that bring their own
 */
export type CardVariant = 'default' | 'app' | 'expertise' | 'plain';

/** Shared lift transition + hover target. `border-blue-200` is #bfdbfe. */
const LIFT =
  '[transition:transform_.3s_cubic-bezier(.34,1.56,.64,1),box-shadow_.3s,border-color_.3s] hover:-translate-y-[5px] hover:border-blue-200';

const VARIANT_CLASS: Record<CardVariant, string> = {
  default: cn(
    'rounded-[20px] border border-line-soft bg-white',
    LIFT,
    'hover:shadow-lift-soft',
  ),
  app: cn(
    'rounded-[10px] border border-line-soft bg-white',
    LIFT,
    'hover:shadow-lift',
  ),
  /**
   * The gradient underline is an `after:` pseudo-element that scales in from the
   * left on hover - kept as a pseudo-element rather than a real node so the card's
   * DOM stays as it was, and so the bar cannot be reached by the tab order.
   */
  expertise: cn(
    'group relative block overflow-hidden rounded-[20px] border border-line-soft bg-white p-8 text-inherit no-underline',
    LIFT,
    'hover:shadow-lift',
    'after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-brand-600 after:to-orange after:transition-transform after:duration-[350ms] after:ease-native after:content-[""]',
    'hover:after:scale-x-100',
  ),
  plain: '',
};

/**
 * Classes for the arrow inside an `expertise` card.
 *
 * The legacy CSS reached it with `.exp-card:hover .exp-arrow`. Here the card sets
 * `group` and the arrow opts in with `group-hover:` - same result, but the arrow
 * no longer depends on a stylesheet knowing its class name.
 */
export const EXP_ARROW_CLASS =
  'text-faint [transition:transform_.2s,color_.2s] group-hover:translate-x-1 group-hover:text-orange';

interface CardBaseProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  style?: CSSProperties;
  /** Scroll-reveal direction, or `false` for a static card. */
  revealFrom?: RevealDirection | false;
  revealDelayMs?: number;
}

export interface CardProps extends CardBaseProps {
  href?: undefined;
  as?: 'div' | 'article' | 'li';
}

export interface CardLinkProps extends CardBaseProps {
  /** Makes the whole card a single link, as the legacy card markup does. */
  href: string;
  forceExternal?: boolean;
  'aria-label'?: string;
}

export function Card({
  children,
  variant = 'default',
  className,
  style,
  revealFrom = false,
  revealDelayMs,
  as: Tag = 'div',
}: CardProps) {
  const revealing = revealFrom !== false;
  return (
    <Tag
      className={cn(
        VARIANT_CLASS[variant],
        revealing && reveal(revealFrom, revealDelayMs),
        className,
      )}
      style={style}
      {...(revealing ? revealAttrs() : {})}
    >
      {children}
    </Tag>
  );
}

export function CardLink({
  children,
  href,
  variant = 'default',
  className,
  style,
  revealFrom = false,
  revealDelayMs,
  forceExternal = false,
  ...rest
}: CardLinkProps) {
  const revealing = revealFrom !== false;
  return (
    <SmartLink
      href={href}
      forceExternal={forceExternal}
      className={cn(
        VARIANT_CLASS[variant],
        'block no-underline',
        revealing && reveal(revealFrom, revealDelayMs),
        className,
      )}
      style={style}
      {...(revealing ? revealAttrs() : {})}
      {...rest}
    >
      {children}
    </SmartLink>
  );
}

/** Padded inner region - the legacy `.csp-card-body` (28px). */
export function CardBody({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn('p-7', className)} style={style}>
      {children}
    </div>
  );
}

/** The rounded icon chip inside a card - legacy `.card-icon` (52×52, r14). */
export function CardIcon({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={cn(
        'flex h-[52px] w-[52px] items-center justify-center rounded-[14px] text-[26px]',
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}
