import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import { cn } from '@/lib/cn';

/**
 * next/image wrapper carrying the project's defaults.
 *
 * Why every `<img>` in the migration goes through this:
 *  • animated GIFs must be `unoptimized`; the optimizer would flatten them to a
 *    single frame. The Clovity logo is a 2.4MB animated GIF, so this matters.
 *  • a static import (`import logo from '@/assets/images/…'`) supplies intrinsic
 *    width/height, which removes the layout shift the legacy `<img>` tags caused.
 *
 * WHEN TO PASS `sizes` — this is the decision that actually moves bytes:
 *  • FLUID images (fill mode, or a width that tracks the viewport) need `sizes`.
 *    Without it the browser assumes 100vw and downloads a far larger candidate
 *    than it will display. Use one of the IMAGE_SIZES presets.
 *  • FIXED-SIZE images (logo pills, app tiles, badges, stat icons) should NOT
 *    pass `sizes`. Next then emits a two-candidate `1x`/`2x` srcset instead of one
 *    entry per configured width — on this page that is the difference between 2
 *    and ~19 candidates across 46 marquee logos.
 *
 * `quality` is left to Next's default (75). Anything else must be listed in
 * `images.qualities` in next.config.ts or the optimizer answers 400.
 */

/**
 * `sizes` presets for FLUID images only — see the note above on when to pass
 * `sizes` at all. Fixed-size images (logos, badges, icons) deliberately have no
 * preset here, because the right answer for them is to omit `sizes` entirely.
 */
export const IMAGE_SIZES = {
  /** Full-bleed hero / background. */
  full: '100vw',
  /** Half-width on desktop, full below lg. */
  half: '(min-width: 1024px) 50vw, 100vw',
  /** A third on desktop, half on tablet, full on mobile. */
  third: '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  /** Card media inside the 1280px shell. */
  card: '(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw',
} as const;

export interface AppImageProps extends Omit<NextImageProps, 'sizes'> {
  sizes?: string;
  /** Set for animated GIFs so the optimizer does not flatten them. */
  animated?: boolean;
}

export function AppImage({
  className,
  sizes,
  animated = false,
  unoptimized,
  alt,
  ...rest
}: AppImageProps) {
  // `fill` has no intrinsic size, so it always needs a `sizes` value; default it
  // to 100vw rather than letting the browser guess silently.
  const resolvedSizes = sizes ?? (rest.fill ? IMAGE_SIZES.full : undefined);

  return (
    <NextImage
      alt={alt}
      className={cn(className)}
      unoptimized={unoptimized ?? animated}
      {...(resolvedSizes ? { sizes: resolvedSizes } : {})}
      {...rest}
    />
  );
}

/**
 * `fill`-mode image inside a positioned parent. Used where the legacy CSS
 * already sized the wrapper and stretched the img to `width/height: 100%`
 * (`.ei-img img`, `.mega-feature-img img`, `.split-media-media img`).
 */
export function CoverImage({
  className,
  sizes = IMAGE_SIZES.card,
  alt,
  ...rest
}: Omit<AppImageProps, 'fill' | 'width' | 'height'>) {
  return (
    <AppImage
      alt={alt}
      fill
      sizes={sizes}
      className={cn(className)}
      {...rest}
    />
  );
}
