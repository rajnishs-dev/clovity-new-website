import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs, type RevealDirection } from '@/lib/reveal';
import type { ContentImage } from '@/types/content';
import { AppImage, IMAGE_SIZES } from '../Image';

/**
 * `theme.css`'s `.split-media` - the photo-beside-copy layout used by About's
 * "Who We Are" / "Let's Build What's Next" and Careers' "Life at Clovity".
 *
 * One column below 1024px, two equal columns above, 56px gap, vertically centred.
 *
 * `reverse` reproduces `.split-media--reverse > *:first-child { order: 2 }`, which
 * only applies at `lg`. That detail is load-bearing: the media stays the FIRST child
 * in the DOM either way, so on a phone the photo is always above the copy - which is
 * the reading order the design wants. Swapping the JSX order instead would put the
 * photo below the copy on mobile for reversed sections only.
 */
export interface SplitMediaProps {
  /** The framed photo. Rendered first in the DOM regardless of `reverse`. */
  media: ReactNode;
  children: ReactNode;
  /** Move the media to the right-hand column at `lg` and up. */
  reverse?: boolean;
  className?: string;
}

export function SplitMedia({
  media,
  children,
  reverse = false,
  className,
}: SplitMediaProps) {
  return (
    <div
      className={cn(
        'grid items-center gap-10 md:grid-cols-2',
        className,
      )}
    >
      <div className={cn(reverse && 'lg:order-2')}>{media}</div>
      {children}
    </div>
  );
}

/**
 * `.split-media-media` - the rounded, shadowed photo frame.
 *
 * Deliberately NOT a `fill` image. The frame has no height of its own: the original
 * is a bare `<img>` whose natural aspect ratio sets the box, and `height: 100%`
 * against an auto-height parent resolves to auto. A `fill` image would collapse the
 * frame to zero height unless an aspect ratio were invented for it, so the intrinsic
 * width/height pair from `ContentImage` is what keeps the layout the published one.
 */
export interface SplitMediaFrameProps {
  image: ContentImage;
  /** Scroll-reveal direction, or `false` for no reveal. */
  revealFrom?: RevealDirection | false;
  /** `priority` for a frame above the fold. */
  priority?: boolean;
  className?: string;
}

export function SplitMediaFrame({
  image,
  revealFrom = 'left',
  priority = false,
  className,
}: SplitMediaFrameProps) {
  const revealing = revealFrom !== false;

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[10px] shadow-[0_24px_60px_rgba(15,23,42,.14)]',
        revealing && reveal(revealFrom),
        className,
      )}
      {...(revealing ? revealAttrs() : {})}
    >
      <AppImage
        src={image.src}
        alt={image.alt}
        sizes={IMAGE_SIZES.half}
        priority={priority}
        className="block h-full w-full object-cover"
        {...(image.width && image.height
          ? { width: image.width, height: image.height }
          : {})}
      />
    </div>
  );
}
