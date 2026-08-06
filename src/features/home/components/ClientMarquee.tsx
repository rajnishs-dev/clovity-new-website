import type { ClientLogo } from '@/types/content';
import { AppImage } from '@/components/ui/Image';

/**
 * The infinite client-logo marquee, as Tailwind utilities.
 *
 * `w-max` + `animate-marquee` translates the track 0 → −50% over 45s, which is why
 * the list is rendered twice: the second copy is what the eye reads as the loop
 * point. Hover pauses it via `[animation-play-state:paused]` — there is no
 * Tailwind utility for that property, so an arbitrary property is the right tool.
 *
 * The duplicate is `aria-hidden` so assistive tech reads the 23 logos once instead
 * of 46; the original had no such guard.
 *
 * No `sizes` prop on purpose: the pill is a fixed 148×100 box, so Next emits a
 * two-candidate `1x`/`2x` srcset instead of one entry per configured width. Across
 * 46 pills that is the single biggest HTML saving on the page.
 */
function LogoTrack({
  logos,
  duplicate = false,
}: {
  logos: ClientLogo[];
  duplicate?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-10 px-5"
      {...(duplicate ? { 'aria-hidden': true } : {})}
    >
      {logos.map((logo) => (
        <div
          key={logo.id}
          className="group flex h-[100px] w-[148px] shrink-0 items-center justify-center rounded-[10px] border border-[#eef1f6] bg-white px-3 py-2.5 shadow-[0_2px_10px_rgba(15,23,42,.04)] [transition:border-color_.25s,box-shadow_.25s,transform_.25s] hover:-translate-y-0.5"
        >
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

export function ClientMarquee({ logos }: { logos: ClientLogo[] }) {
  return (
    <div className="relative overflow-hidden">
      {/* Edge fades that hide the loop seam. */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-[linear-gradient(90deg,#f7f9fc,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-[linear-gradient(270deg,#f7f9fc,transparent)]"
      />

      <div className="flex w-max animate-marquee py-3 hover:[animation-play-state:paused] motion-reduce:animate-none">
        <LogoTrack logos={logos} />
        <LogoTrack logos={logos} duplicate />
      </div>
    </div>
  );
}
