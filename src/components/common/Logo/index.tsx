import logoBlack from '@/assets/logos/clovity-logo-black.gif';
import logoWhite from '@/assets/logos/clovity-logo-white.gif';
import { cn } from '@/lib/cn';
import { ROUTES } from '@/constants/routes';
import { AppImage } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';

/**
 * The Clovity wordmark. Both GIFs stay mounted and one is hidden via
 * visibility - swapping `src` would flash a missing image on first scroll.
 * `animated` forces `unoptimized`, since the image optimizer would flatten a GIF to one frame.
 */
export interface LogoProps {
  /** True while the header is transparent over dark artwork. */
  showWhite?: boolean;
  className?: string;
  imageClassName?: string;
  /** Wrap in a link to the home page. */
  href?: string | false;
  /** Set on the header logo only - it is the LCP-adjacent element. */
  priority?: boolean;
}

function LogoImages({
  showWhite,
  imageClassName,
  priority,
}: Required<Pick<LogoProps, 'showWhite' | 'priority'>> & {
  imageClassName?: string;
}) {
  // No width/height: the static import already carries intrinsic dimensions.
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
      aria-label="Clovity - go to home page"
    >
      {images}
    </SmartLink>
  );
}
