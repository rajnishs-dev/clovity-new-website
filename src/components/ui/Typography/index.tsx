import type { CSSProperties, ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * The typography system, as Tailwind utilities.
 *
 * These replace the legacy `.s-heading` / `.s-sub` / `.s-label` rules and the
 * ad-hoc type scales scattered through the page stylesheets. Every value is read
 * out of the original CSS:
 *
 *   display     ← .hero h1            clamp(2.6rem,7.2vw,6.6rem) / 300 / -0.04em
 *   h1, h2      ← .s-heading          clamp(30px,3.2vw,46px) / 400 / -0.03em
 *   h3          ← .agc-panel h3       19px / 500 / 1.32
 *   h4          ← .mega-cta-card h4   14.5px / 800
 *   h5          ← .hi-col-head b      20px / 700 / 1.3
 *   h6          ← .stn b              15px / 800
 *   subtitle    ← .s-sub              16px / 400 / 1.65
 *   bodyLarge   ← .pulse-sec p.body-d 18px / 1.8
 *   bodySmall   ← .gfg-item p         13.5px / 1.55
 *   caption     ← .fde-tl-step p      11.5px / 1.4
 *   label       ← .s-label            14px / 500 / .14em / uppercase
 *
 * The three most-reused strings are exported so sections and the Section header
 * share one definition rather than restating the clamp in every file.
 */

/** `.s-heading` - the site's section heading. */
export const HEADING_CLASS =
  'text-[clamp(30px,3.2vw,46px)] font-normal leading-[1.1] tracking-[-0.03em] text-title';

/** `.s-sub` - the supporting paragraph under a section heading. */
export const SUBHEADING_CLASS =
  'text-[16px] font-normal leading-[1.65] text-black';

/** `.s-label` - the small uppercase eyebrow above a heading. */
export const LABEL_CLASS =
  'inline-block text-[14px] font-500 uppercase tracking-[.14em] text-brand-600 mb-4';

export type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'caption'
  | 'label';

const VARIANT_CLASS: Record<TypographyVariant, string> = {
  // `font-light` is Tailwind's built-in 300. The legacy Tailwind config only
  // extended fontWeight with 500–900, so `font-300` generates no CSS at all.
  display:
    'font-light text-[clamp(2.6rem,7.2vw,6.6rem)] leading-[1.02] tracking-[-0.04em]',
  h1: HEADING_CLASS,
  h2: HEADING_CLASS,
  h3: 'text-[19px] font-500 leading-[1.32] text-title',
  h4: 'text-[14.5px] font-800 text-ink',
  h5: 'text-[20px] font-700 leading-[1.3] text-title',
  h6: 'text-[15px] font-800 text-ink',
  subtitle: SUBHEADING_CLASS,
  bodyLarge: 'text-[18px] leading-[1.8] text-muted',
  bodyMedium: 'text-[16px] leading-[1.65] text-muted',
  bodySmall: 'text-[13.5px] leading-[1.55] text-body',
  caption: 'text-[11.5px] leading-[1.4] text-[#64748b]',
  label: LABEL_CLASS,
};

/** Default element per variant - keeps the heading hierarchy honest. */
const VARIANT_TAG: Record<TypographyVariant, ElementType> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle: 'p',
  bodyLarge: 'p',
  bodyMedium: 'p',
  bodySmall: 'p',
  caption: 'span',
  label: 'span',
};

export interface TypographyProps {
  variant: TypographyVariant;
  children: ReactNode;
  className?: string;
  /**
   * Override the rendered element. Use this to keep a visual scale while fixing
   * the document outline - e.g. a card title that looks like an h4 but must be an
   * h3 because of where it sits in the page.
   */
  as?: ElementType;
  id?: string;
  style?: CSSProperties;
}

export function Typography({
  variant,
  children,
  className,
  as,
  id,
  style,
}: TypographyProps) {
  const Tag = as ?? VARIANT_TAG[variant];
  return (
    <Tag
      id={id}
      className={cn(VARIANT_CLASS[variant], className)}
      style={style}
    >
      {children}
    </Tag>
  );
}

/* ── Named shorthands ───────────────────────────────────────────────────── */

type Shorthand = Omit<TypographyProps, 'variant'>;

export const Display = (p: Shorthand) => (
  <Typography variant="display" {...p} />
);
export const Heading1 = (p: Shorthand) => <Typography variant="h1" {...p} />;
export const Heading2 = (p: Shorthand) => <Typography variant="h2" {...p} />;
export const Heading3 = (p: Shorthand) => <Typography variant="h3" {...p} />;
export const Heading4 = (p: Shorthand) => <Typography variant="h4" {...p} />;
export const Heading5 = (p: Shorthand) => <Typography variant="h5" {...p} />;
export const Heading6 = (p: Shorthand) => <Typography variant="h6" {...p} />;
export const Subtitle = (p: Shorthand) => (
  <Typography variant="subtitle" {...p} />
);
export const BodyLarge = (p: Shorthand) => (
  <Typography variant="bodyLarge" {...p} />
);
export const BodyMedium = (p: Shorthand) => (
  <Typography variant="bodyMedium" {...p} />
);
export const BodySmall = (p: Shorthand) => (
  <Typography variant="bodySmall" {...p} />
);
export const Caption = (p: Shorthand) => (
  <Typography variant="caption" {...p} />
);
export const Label = (p: Shorthand) => <Typography variant="label" {...p} />;

/**
 * The gradient-highlight span used inside headings across the site.
 *
 * `bg-clip-text` + `text-transparent` is the Tailwind spelling of the legacy
 * `.grad` rule. Autoprefixer adds the `-webkit-background-clip` needed by Safari.
 */
export function GradientText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn('bg-grad-text bg-clip-text text-transparent', className)}
    >
      {children}
    </span>
  );
}
