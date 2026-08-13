import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { ICONS, type IconName, isIconName, resolveIcon } from './registry';

export { ICONS, isIconName, resolveIcon };
export type { IconName };
export type { Glyph, GlyphProps } from './brands';

/**
 * The one icon component. Lucide for UI glyphs, inline SVG for brand marks.
 *
 * Replaced a Font Awesome webfont: sizing via `font-size` + `content` on a
 * `::before` made an icon's box depend on the webfont loading; an SVG has
 * intrinsic geometry instead.
 *
 * `size` defaults to `1em` because every call site already expressed icon
 * size as a font-size (`text-[11px]`, etc.) under the old webfont, so keeping
 * that default meant none of them had to be rewritten. Pass `size` when an
 * icon should NOT track the surrounding text.
 *
 * Size an icon inside a chip on the CHIP's `text-[Npx]`, not on `<Icon>`
 * itself (a `text-*` there wins and the chip's number becomes a lie). Aim for
 * ~52% of the chip's width - Lucide's outline reads thinner than the old
 * filled webfont glyphs at the same pixel size, so the inherited Font
 * Awesome-era ratios (31–48%) undersize every chip. `tools/verify-icons.mjs`
 * checks the ratio.
 */
export interface IconProps {
  /** A registered icon name. See `registry.ts`. */
  name: IconName;
  className?: string;
  /**
   * Accessible name. Omit for decorative icons (the default), which is the right
   * choice whenever the icon sits next to a text label that already says the same
   * thing - announcing both is noise.
   */
  label?: string;
  /**
   * Rendered size. Any CSS length; a number is treated as pixels.
   * Defaults to `1em` so the icon scales with its container's font-size.
   */
  size?: number | string;
  /** Lucide stroke weight. Ignored by the filled brand marks. */
  strokeWidth?: number;
  style?: CSSProperties;
}

export function Icon({
  name,
  className,
  label,
  size = '1em',
  strokeWidth = 2,
  style,
}: IconProps) {
  const Glyph = ICONS[name];

  const a11y = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const };

  return (
    <Glyph
      // `shrink-0` because an SVG is a flex item with a definite size and will
      // otherwise be squeezed by a long sibling label; the old `<i>` was sized by
      // its font and never collapsed. `align-[-0.125em]` reproduces the optical
      // baseline offset Font Awesome applied, for the icons that sit inline in text
      // rather than in a flex row. Both come before `className` so a caller can
      // override either through tailwind-merge.
      className={cn('inline-block shrink-0 align-[-0.125em]', className)}
      size={size}
      strokeWidth={strokeWidth}
      {...(style ? { style } : {})}
      {...a11y}
    />
  );
}

/** The right-arrow that follows nearly every CTA label on the site. */
export function ArrowIcon({ className }: { className?: string }) {
  return <Icon name="arrow-right" className={cn('text-xs', className)} />;
}

/**
 * The "opens in a new tab" mark on external mega-menu links - Lucide's
 * `ExternalLink` in place of Font Awesome's `arrow-up-right-from-square`.
 */
export function ExternalIcon({ className }: { className?: string }) {
  return <Icon name="external-link" className={cn('text-[10px]', className)} />;
}
