import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import { cn } from '@/lib/cn';

/**
 * next/image wrapper carrying the project's defaults.
 *
 * Animated GIFs must be `unoptimized`, since the optimizer flattens them to a
 * single frame (the Clovity logo is a 2.4MB animated GIF).
 *
 * `sizes` is the choice that actually moves bytes: FLUID images (fill mode,
 * or a width that tracks the viewport) need it via an `IMAGE_SIZES` preset,
 * or the browser assumes 100vw and downloads an oversized candidate.
 * FIXED-SIZE images (logos, badges, icons) should omit `sizes` entirely so
 * Next emits a 1x/2x srcset instead of one entry per configured width - the
 * difference between 2 and ~19 candidates across 46 marquee logos.
 *
 * `quality` stays at Next's default (75) - anything else must be listed in
 * `images.qualities` in next.config.ts or the optimizer 400s.
 */

/**
 * `sizes` presets for FLUID images only - see the note above on when to pass
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
