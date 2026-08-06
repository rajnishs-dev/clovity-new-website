import { HERO_CONTENT } from '@/constants/home';
import { HERO_VIDEO_SRC, heroVideoPoster } from '@/constants/media';

/**
 * Section 1 — the hero banner, as Tailwind utilities.
 *
 * A Server Component: video, scrim and copy are static markup, so none of this
 * ships as JavaScript.
 *
 * The entrance is `animate-hero-rise-*` — a CSS animation, not GSAP. A React
 * effect cannot reproduce the original's GSAP timeline without a visible flicker:
 * the server-rendered headline paints first, and the effect (even
 * `useLayoutEffect`) only runs after hydration, so the text would appear, blink
 * out, then fade in. The keyframes carry the original timeline's exact numbers
 * (h1: 0.4s delay / 0.55s / 20px; sub: 0.75s delay / 0.4s / 14px, both on
 * `power2.out` = cubic-bezier(.215,.61,.355,1)) and `both` fill mode replaces the
 * original's 2s "safety net" timeout.
 *
 * `min-h-[100svh]` — small-viewport height, so the hero is not clipped by mobile
 * browser chrome the way `100vh` would be.
 *
 * Video decisions:
 *  • served from /public, not bundled — an 8.8MB asset must be range-requestable
 *    so the browser can stream rather than buffer it whole
 *  • `poster` is a bundled, optimizable still that paints immediately and stands
 *    in permanently for anyone on a data saver or with autoplay blocked
 *  • `preload="metadata"` — the original let the browser default to `auto`, which
 *    starts downloading megabytes before the visitor has scrolled an inch
 *  • `muted` + `playsInline` are what make autoplay legal on iOS and Chrome
 *  • `aria-hidden` because it is decorative, as the original marked it
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#05080f] text-white"
    >
      {/* Gradient fallback behind the video, so the hero is never bare. */}
      <div className="absolute inset-0 z-[-2] h-full w-full bg-[radial-gradient(120%_80%_at_75%_30%,#1b3a6b_0%,transparent_55%),linear-gradient(160deg,#0a1524_0%,#0b1a30_45%,#060b16_100%)] object-cover">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroVideoPoster.src}
          aria-hidden
          className="absolute inset-0 z-[-2] h-full w-full object-cover"
        >
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
      </div>

      {/* Scrim: darkens top and bottom so the copy stays legible over any frame. */}
      <div className="absolute inset-0 z-[-1] bg-[linear-gradient(180deg,rgba(6,11,22,.35)_0%,rgba(6,11,22,.15)_30%,rgba(6,11,22,.55)_100%),radial-gradient(90%_60%_at_50%_78%,rgba(8,14,28,.7)_0%,transparent_70%)]" />

      <div className="z-[2] mt-[70px] flex flex-1 flex-col items-center justify-center px-[clamp(16px,4vw,40px)] pb-16 pt-10 text-center">
        <span className="mb-[26px] inline-flex items-center gap-2.5 text-[13px] font-normal uppercase tracking-[.28em] text-white/70">
          {HERO_CONTENT.eyebrow}
        </span>

        <h1 className="mx-auto max-w-[20ch] animate-hero-rise-lg text-[clamp(2.6rem,7.2vw,6.6rem)] font-light leading-[1.02] tracking-[-0.04em] text-white [text-shadow:0_2px_40px_rgba(2,8,20,.35)] motion-reduce:animate-none">
          {HERO_CONTENT.heading}
        </h1>

        <p className="mx-auto mt-[22px] max-w-[820px] animate-hero-rise-sm text-[18px] font-light leading-[1.7] text-white/75 motion-reduce:animate-none">
          {HERO_CONTENT.subheading}
        </p>

        <a
          href={HERO_CONTENT.scrollCueHref}
          aria-label={HERO_CONTENT.scrollCueLabel}
          className="absolute bottom-8 left-1/2 z-10 flex h-11 w-11 -translate-x-1/2 animate-scroll-bounce items-center justify-center rounded-[50%] border-[1.5px] border-white/30 text-white/60 no-underline [transition:border-color_.2s,color_.2s] hover:border-white/70 hover:text-white motion-reduce:animate-none"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M12 5v14m0 0l-6-6m6 6l6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
