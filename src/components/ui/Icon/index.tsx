import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { ICONS, type IconName, isIconName, resolveIcon } from './registry';

export { ICONS, isIconName, resolveIcon };
export type { IconName };
export type { Glyph, GlyphProps } from './brands';

/**
 * The one icon component. Lucide for UI glyphs, inline SVG for brand marks.
 *
 * MIGRATION NOTE — this replaced a Font Awesome webfont. Two things that mattered:
 *
 * 1. WHY THE SWITCH FIXED A REAL BUG. Font Awesome sized glyphs with `font-size`
 *    and drew them from `content` on a `::before`. That made an icon's box depend on
 *    a webfont loading, a `content` declaration surviving minification, and a
 *    `font-family` cascade the app did not control. An SVG has intrinsic geometry —
 *    it is either in the DOM or it is not.
 *
 * 2. WHY `size` DEFAULTS TO `1em`. Every call site that had an opinion about icon
 *    size expressed it as a font-size — `text-[11px]`, `text-xs`,
 *    `style={{ fontSize: '10px' }}` — because that is how a webfont glyph is sized.
 *    Defaulting the SVG to `1em` means those existing declarations keep working
 *    verbatim instead of having to be found and rewritten as `size` props, so the
 *    conversion does not silently resize a hundred icons. Pass `size` explicitly
 *    when an icon should NOT track the surrounding text.
 *
 * SIZING AN ICON INSIDE A CHIP — the size belongs on the CHIP, as its `text-[Npx]`,
 * and the icon inherits it. Do not also put a `text-*` class on the `<Icon>`: it
 * wins over the chip and the chip's number becomes a lie.
 *
 * Aim for a glyph around **52% of the chip's width**. The inherited numbers from the
 * Font Awesome era are all far below that — 31–48% — because a filled webfont glyph
 * carries much more visual mass than a Lucide outline at the same pixel size, so
 * every chip on the site rendered a thin, undersized mark until those values were
 * corrected. `tools/verify-icons.mjs` reports the ratio.
 */
export interface IconProps {
  /** A registered icon name. See `registry.ts`. */
  name: IconName;
  className?: string;
  /**
   * Accessible name. Omit for decorative icons (the default), which is the right
   * choice whenever the icon sits next to a text label that already says the same
   * thing — announcing both is noise.
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
 * The "opens in a new tab" mark used on external mega-menu links.
 *
 * Now Lucide's `ExternalLink` rather than Font Awesome's
 * `arrow-up-right-from-square`. Same meaning, and it reads more clearly at the 10px
 * the mega menu renders it at.
 */
export function ExternalIcon({ className }: { className?: string }) {
  return <Icon name="external-link" className={cn('text-[10px]', className)} />;
}
