import { cn } from '@/lib/cn';
import type { ClientLogo } from '@/types/content';
import { AppImage } from '@/components/ui/Image';

/**
 * The infinite client-logo marquee. The list renders twice - `w-max` +
 * `animate-marquee` translates the track 0 → −50%, and the second (duplicate)
 * copy is what reads as the loop point; it is `aria-hidden` so assistive tech
 * isn't doubled. No `sizes` prop: the pill is a fixed 148×100 box, so Next
 * emits a `1x`/`2x` srcset instead of one entry per configured width.
 */
/**
 * The pill treatment shared by every page. The border/shadow live in the home
 * page's own `.trusted-sec .logo-pill` override, not here - the About page
 * shares `.trusted-sec` but not that override, so its pills stay bare.
 */
const PILL_BASE =
  'group flex h-[100px] w-[148px] shrink-0 items-center justify-center rounded-[10px] bg-white px-3 py-2.5 [transition:border-color_.25s,box-shadow_.25s,transform_.25s] hover:-translate-y-0.5';

/** The home page's own `.trusted-sec .logo-pill` override. */
export const HOME_LOGO_PILL_CLASS =
  'border border-[#eef1f6] shadow-[0_2px_10px_rgba(15,23,42,.04)]';

function LogoTrack({
  logos,
  duplicate = false,
  pillClassName,
}: {
  logos: ClientLogo[];
  duplicate?: boolean;
  pillClassName?: string;
}) {
  return (
    <div
      className="flex items-center gap-10 px-5"
      {...(duplicate ? { 'aria-hidden': true } : {})}
    >
      {logos.map((logo) => (
        <div key={logo.id} className={cn(PILL_BASE, pillClassName)}>
          <AppImage
            src={logo.url}
            alt={logo.name}
            width={148}
            height={100}
            className="max-h-full max-w-full object-contain transition-transform duration-[250ms] group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  );
}

export interface ClientMarqueeProps {
  logos: ClientLogo[];
  /**
   * Colour the edge fades blend into - must match the background behind the
   * marquee. Inline style rather than a class since the value comes from data.
   */
  fadeColor?: string;
  /** Per-page pill override - see `HOME_LOGO_PILL_CLASS`. */
  pillClassName?: string;
}

export function ClientMarquee({
  logos,
  fadeColor = '#f7f9fc',
  pillClassName,
}: ClientMarqueeProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Edge fades that hide the loop seam. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24"
        style={{
          background: `linear-gradient(90deg,${fadeColor},transparent)`,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24"
        style={{
          background: `linear-gradient(270deg,${fadeColor},transparent)`,
        }}
      />

      <div className="flex w-max animate-marquee py-3 hover:[animation-play-state:paused] motion-reduce:animate-none">
        <LogoTrack logos={logos} pillClassName={pillClassName} />
        <LogoTrack logos={logos} duplicate pillClassName={pillClassName} />
      </div>
    </div>
  );
}
