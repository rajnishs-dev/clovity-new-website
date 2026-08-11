import { cn } from '@/lib/cn';
import { initials as toInitials } from '@/lib/format';
import { AppImage } from '../Image';

/**
 * Avatar with an initials fallback.
 *
 * The gradient initials treatment matches the legacy `.quote-avatar`
 * (linear-gradient #2563eb → #f2642a, 52px, white 800 weight), so testimonial
 * blocks look the same whether or not a photo exists.
 */
export interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}

export function Avatar({ name, src, size = 52, className }: AvatarProps) {
  const dimension = { width: size, height: size };

  if (src) {
    return (
      <span
        className={cn('block overflow-hidden rounded-full', className)}
        style={dimension}
      >
        {/* Fixed square - no `sizes`, so Next emits a 1x/2x srcset. */}
        <AppImage
          src={src}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </span>
    );
  }

  // Initials fallback - the legacy `.quote-avatar` treatment, as utilities.
  return (
    <span
      className={cn(
        'flex items-center justify-center rounded-[50%] bg-grad-brand-orange text-[15px] font-800 text-white',
        className,
      )}
      style={dimension}
      aria-label={name}
      role="img"
    >
      {toInitials(name)}
    </span>
  );
}
