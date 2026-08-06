import logoBlack from '@/assets/images/clovity-logo-black.gif';
import logoWhite from '@/assets/images/clovity-logo-white.gif';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/config/routes';
import { AppImage } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';

/**
 * The Clovity wordmark.
 *
 * Both GIFs stay mounted and one is hidden, exactly as the legacy header did —
 * swapping a `src` in JS would flash a missing image on the first scroll, whereas
 * toggling visibility on an already-decoded frame is instant.
 *
 * MIGRATION NOTE — which mark shows used to be decided by CSS in `home.css`
 * (`#navbar.scrolled .nav-logo-white { display: none }`). That meant the logo's
 * behaviour lived in a page stylesheet rather than in the logo, and interior pages
 * — which never loaded that block — would have rendered both marks stacked. It is
 * now the `showWhite` prop, so the component is correct wherever it is used.
 *
 * `animated` forces `unoptimized`: these are animated GIFs, and the image
 * optimizer would flatten them to a single frame.
 */
export interface LogoProps {
  /** True while the header is transparent over dark artwork. */
  showWhite?: boolean;
  className?: string;
  imageClassName?: string;
  /** Wrap in a link to the home page. */
  href?: string | false;
  /** Set on the header logo only — it is the LCP-adjacent element. */
  priority?: boolean;
}

function LogoImages({
  showWhite,
  imageClassName,
  priority,
}: Required<Pick<LogoProps, 'showWhite' | 'priority'>> & {
  imageClassName?: string;
}) {
  /**
   * No width/height: a static import already carries the file's intrinsic
   * dimensions, so next/image derives the correct aspect ratio. Display size
   * stays a class concern.
   */
  const shared = { alt: 'Clovity', animated: true, priority } as const;

  return (
    <>
      <AppImage
        {...shared}
        src={logoWhite}
        className={cn(imageClassName, showWhite ? 'block' : 'hidden')}
      />
      <AppImage
        {...shared}
        src={logoBlack}
        className={cn(imageClassName, showWhite ? 'hidden' : 'block')}
      />
    </>
  );
}

export function Logo({
  showWhite = false,
  className,
  imageClassName,
  href = ROUTES.home,
  priority = false,
}: LogoProps) {
  const images = (
    <LogoImages
      showWhite={showWhite}
      imageClassName={imageClassName}
      priority={priority}
    />
  );

  if (href === false) {
    return (
      <span className={cn('flex flex-shrink-0 items-center', className)}>
        {images}
      </span>
    );
  }

  return (
    <SmartLink
      href={href}
      className={cn('flex flex-shrink-0 items-center', className)}
      aria-label="Clovity — go to home page"
    >
      {images}
    </SmartLink>
  );
}
