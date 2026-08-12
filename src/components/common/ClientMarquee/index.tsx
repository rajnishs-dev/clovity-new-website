import { cn } from '@/lib/cn';
import type { ClientLogo } from '@/types/content';
import { AppImage } from '@/components/ui/Image';

/**
 * The infinite client-logo marquee, as Tailwind utilities.
 *
 * `w-max` + `animate-marquee` translates the track 0 → −50% over 45s, which is why
 * the list is rendered twice: the second copy is what the eye reads as the loop
 * point. Hover pauses it via `[animation-play-state:paused]` - there is no
 * Tailwind utility for that property, so an arbitrary property is the right tool.
 *
 * The duplicate is `aria-hidden` so assistive tech reads the 23 logos once instead
 * of 46; the original had no such guard.
 *
 * No `sizes` prop on purpose: the pill is a fixed 148×100 box, so Next emits a
 * two-candidate `1x`/`2x` srcset instead of one entry per configured width. Across
 * 46 pills that is the single biggest HTML saving on the page.
 */
/**
 * The pill treatment shared by every page: `.logo-pill` in `theme.css`.
 *
 * The 1px border and soft shadow are NOT here, because they are not part of it -
 * they come from `.trusted-sec .logo-pill`, an override the home page declares in
 * its own stylesheet. The About page carries the same `.trusted-sec` class but
 * never loads that override, so its pills are bare white. Keeping the override out
 * of the base and passing it in from the home page is what lets both pages be
 * right; baking it in silently added a border to the About page's marquee.
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
   * Colour the edge fades blend into.
   *
   * Must match the background BEHIND the marquee, because that is the fade's whole
   * job - hiding the loop seam by dissolving into it. The home page's section is
   * `#f7f9fc`; the About page's gradient starts at `#f5f9ff`, and using the home
   * value there renders as a pale band down each edge.
   *
   * An inline style rather than an arbitrary class: the value comes from data, and
   * Tailwind cannot generate a class it does not see as a literal in the source.
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
