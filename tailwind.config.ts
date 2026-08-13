import type { Config } from 'tailwindcss';

/**
 * The design system, expressed entirely as Tailwind theme tokens.
 *
 * This file replaces the hand-written stylesheets the migration started with
 * (`theme.css`, `pages/home.css`, `migration.css`). Every value below was read
 * out of those files, so the tokens are the legacy design's own numbers - nothing
 * was re-picked or rounded.
 *
 * Pinned to Tailwind 3.4 on purpose: the legacy site was authored against the v3
 * CDN, and v4 changes preflight defaults (border colour, shadow scale naming,
 * default font stack) in ways that would visibly shift this design.
 *
 * ── BREAKPOINT ORDER IS LOAD-BEARING ──
 * Tailwind emits media queries in the order `screens` declares them, and same-
 * specificity rules are resolved by source order. So:
 *   • min-width screens are listed ascending  → a larger min beats a smaller one
 *   • max-width screens follow, descending    → a narrower max beats a wider one
 * Reordering this object silently changes which rule wins in overlapping ranges.
 *
 * The `to-*` names read as "up to and including": `to-640:` === the legacy
 * `@media (max-width: 640px)`. The odd values (1020, 820, 585…) are the legacy
 * CSS's own breakpoints, kept exactly so responsive behaviour is unchanged.
 */
const config: Config = {
  /**
   * One glob over all of src, not a per-directory list.
   *
   * The previous list named app/components/features/constants/config and omitted
   * `lib/`, `hooks/` and `utils/` - which silently broke every class string those
   * files build. `lib/reveal.ts` holds the entire scroll-reveal treatment, so none
   * of it was in the stylesheet: the classes were on the elements, the rules did
   * not exist, and nothing failed loudly.
   *
   * Tailwind's scanner cannot warn about this, so the glob is deliberately broad.
   * Any file that composes a class string must be covered.
   */
  content: ['./src/**/*.{ts,tsx}'],

  theme: {
    /* ── Breakpoints ─────────────────────────────────────────────────────── */
    screens: {
      // min-width, ascending
      sm: '640px',
      md: '768px',
      ml: '900px', // legacy @media (min-width: 900px)
      lg: '1024px',
      xl: '1280px',
      wide: '1450px', // legacy @media (min-width: 1450px)
      '2xl': '1536px',

      // max-width, descending
      'to-1100': { max: '1100px' },
      'to-1024': { max: '1024px' },
      'to-1020': { max: '1020px' },
      'to-900': { max: '900px' },
      'to-820': { max: '820px' },
      'to-767': { max: '767px' },
      'to-680': { max: '680px' },
      'to-640': { max: '640px' },
      'to-585': { max: '585px' },
      'to-560': { max: '560px' },
      /**
       * The About/Careers stat band and the Contact form's two-up rows.
       *
       * A NAMED screen, not an arbitrary `max-[520px]:` variant - that variant
       * silently produces NO CSS in this project. Tailwind only generates the
       * `max-*` family when every entry in `screens` is a plain min-width string,
       * and the `to-*` entries above are `{ max: … }` objects, so it is disabled
       * wholesale. There is no warning: the class is accepted, no rule is emitted,
       * and the layout just keeps its desktop columns on a phone.
       */
      'to-520': { max: '520px' },
      'to-480': { max: '480px' },
    },

    extend: {
      /* ── Type ──────────────────────────────────────────────────────────── */
      fontFamily: {
        // next/font injects `--font-space-grotesk` in the root layout.
        // Tailwind's preflight puts fontFamily.sans on <html>, which is how the
        // whole site inherits Space Grotesk without a `font-sans` class anywhere.
        sans: ['var(--font-space-grotesk)', '"DM Sans"', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        // `.askai` in the legacy hero asked for Inter, which was never loaded -
        // so it always fell through to system-ui. Kept faithful.
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },

      fontWeight: {
        // Non-standard numeric weights the legacy markup uses throughout
        // (`font-700`, `font-800`, …). 300/400 come from Tailwind's own
        // `font-light` / `font-normal`.
        '500': '500',
        '600': '600',
        '700': '700',
        '800': '800',
        '900': '900',
      },

      /**
       * No custom `fontSize` tokens on purpose.
       *
       * A named size token and a named colour token both compile to `text-*`,
       * and `tailwind-merge` classifies `text-<name>` heuristically - it cannot
       * tell `text-heading` (a clamp size) from `text-heading` (a hex colour), so
       * one would silently drop the other. Colour tokens are named below; the
       * handful of fluid sizes use arbitrary values (`text-[clamp(...)]`) at the
       * call site, which tailwind-merge classifies correctly and which documents
       * the actual value where it is read.
       */

      /* ── Colour ────────────────────────────────────────────────────────── */
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dce9ff',
          200: '#b9d3ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        navy: '#0f172a',

        // Named tokens replacing the legacy `:root` custom properties, so the
        // same greys are not re-typed as hex literals in forty components.
        ink: '#0f172a', // --ink
        title: '#111827', // body color / heading ink
        body: '#475569', // --body
        muted: '#1e293b', // --muted
        faint: '#94a3b8', // --faint
        line: '#e2e8f0', // --line
        'line-soft': '#e8edf4', // card borders
        'line-faint': '#eef2f7', // mega-menu dividers
        soft: '#f8fafc', // --bg-soft
        orange: '#f2642a', // brand orange
        'brand-green': '#16a34a', // --green

        // Hero ("h2") palette, from the second `:root` block.
        hero: {
          blue: '#2f7bff',
          'blue-2': '#1a5fe0',
          ink: '#0b1524',
          line: '#e4e8ef',
          pill: 'rgba(255,255,255,.55)',
        },

        // Third-party brand colours the markup hard-codes.
        atlassian: '#0052cc',
      },

      /* ── Depth ─────────────────────────────────────────────────────────── */
      boxShadow: {
        // Repeated tokens. One-offs stay as arbitrary values at the call site.
        xs: '0 1px 2px rgba(15,23,42,.05)',
        card: '0 8px 24px rgba(15,23,42,.05)',
        'card-hover': '0 16px 32px rgba(15,23,42,.08)',
        lift: '0 20px 48px rgba(15,23,42,.1)',
        'lift-soft': '0 20px 48px rgba(15,23,42,.09)',
        mega: '0 24px 64px rgba(15,23,42,.12), 0 4px 16px rgba(15,23,42,.06)',
        'mega-full':
          '0 32px 64px rgba(15,23,42,.14), 0 4px 16px rgba(15,23,42,.06)',
        pill: '0 10px 40px rgba(4,10,25,.28)',
        badge: '0 10px 26px rgba(5,10,35,.2)',
        'badge-hover': '0 14px 32px rgba(5,10,35,.28)',
        panel:
          '-28px 10px 55px -14px rgba(5,10,35,.45), 0 1px 0 rgba(255,255,255,.6) inset',
        'panel-plain': '-28px 10px 55px -14px rgba(5,10,35,.28)',
        float: '0 16px 34px -12px rgba(15,23,42,.25)',
        'float-glow': '0 20px 42px -10px rgba(37,99,235,.35)',
        cta: '0 40px 80px -28px rgba(26,10,46,.55)',
        askbox: '0 30px 70px rgba(4,10,25,.35)',
        'brand-glow': '0 8px 24px rgba(37,99,235,.3)',
        'orange-glow': '0 8px 24px rgba(242,100,42,.35)',
      },

      /* ── Motion ────────────────────────────────────────────────────────── */
      transitionProperty: {
        /**
         * Named tokens instead of arbitrary values like
         * `transition-[opacity,transform]`.
         *
         * That arbitrary form silently produced NO CSS - the class never made it
         * into the stylesheet, so `transition-property` fell back to its initial
         * value `all` and every scroll-reveal transitioned every property. A
         * named token cannot fail that way, and the failure is invisible without
         * a computed-style check, which is exactly why these are tokens.
         */
        reveal: 'opacity, transform',
        color: 'color',
        top: 'top',
        height: 'height',
        width: 'width',
      },

      transitionTimingFunction: {
        /**
         * DEFAULT is overridden to the CSS `ease` keyword.
         *
         * Tailwind's own default is `cubic-bezier(.4,0,.2,1)`, but the legacy
         * stylesheet wrote `transition: background .25s` etc. without an easing -
         * which resolves to `ease` (cubic-bezier(.25,.1,.25,1)). Setting DEFAULT
         * here fixes every `transition-*` utility at once instead of needing an
         * explicit `ease-*` on ~450 elements. Call sites that genuinely wanted a
         * different curve still state it.
         */
        DEFAULT: 'ease',
        native: 'ease',
        // `ease-in-out` is already cubic-bezier(.4,0,.2,1), which is what the
        // legacy mobile menu and hover handlers used - no token needed for it.
        spring: 'cubic-bezier(.34,1.56,.64,1)', // card lift
        flood: 'cubic-bezier(.22,.61,.36,1)', // card stack / hover flood
        'power2-out': 'cubic-bezier(.215,.61,.355,1)', // GSAP power2.out
        smooth: 'cubic-bezier(.2,.6,.2,1)', // station / path cards
      },

      keyframes: {
        // Mega menus
        megaFade: {
          from: {
            opacity: '0',
            transform: 'translateX(-50%) translateY(-6px)',
          },
          to: { opacity: '1', transform: 'translateX(-50%) translateY(0)' },
        },
        megaFullFade: {
          from: {
            opacity: '0',
            transform: 'translateX(-50%) translateY(-8px)',
          },
          to: { opacity: '1', transform: 'translateX(-50%) translateY(0)' },
        },

        // Client logo marquee - travels exactly -50% because the track holds the
        // list twice, which is what makes the loop seamless.
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },

        // Hero
        heroRise20: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        heroRise14: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scrollBounce: {
          '0%,100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%': { transform: 'translateX(-50%) translateY(10px)' },
        },
        h2pulse: {
          '0%': { transform: 'scale(1)', opacity: '.7' },
          '70%': { transform: 'scale(1.5)', opacity: '0' },
          '100%': { opacity: '0' },
        },

        // Small indicators
        paiBlink: { '50%': { opacity: '.35' } },
        scrollCueBounce: {
          '0%,100%': { transform: 'translateY(0)', opacity: '.5' },
          '50%': { transform: 'translateY(8px)', opacity: '1' },
        },
        mapPulse: {
          '0%,100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.6)', opacity: '.5' },
        },
        bannerPing: {
          '0%,100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.8)', opacity: '.4' },
        },
        // Named `pingSoft` because Tailwind already ships an `animate-ping`
        // with different keyframes.
        pingSoft: {
          '0%,100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.5)', opacity: '.5' },
        },
        floatY: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        /**
         * Interior-page hero orbs (`@keyframes abFloat` / `crFloat`).
         *
         * Separate from `floatY` because the travel is 16px, not 10px, and the two
         * are used side by side on the Careers hero - merging them would change one
         * of the two amplitudes.
         */
        heroOrbFloat: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        blinkCaret: {
          'from,to': { borderColor: 'transparent' },
          '50%': { borderColor: '#f2642a' },
        },

        // Migration flow: the bright segment running along the dashed spine.
        mfLineRun: { to: { strokeDashoffset: '-1000' } },

        // Forward-deployed proof cards: shadow breathes between two states.
        fdeFloatGlow: {
          '0%,100%': { boxShadow: '0 16px 34px -12px rgba(15,23,42,.25)' },
          '50%': { boxShadow: '0 20px 42px -10px rgba(37,99,235,.35)' },
        },
      },

      animation: {
        'mega-fade': 'megaFade .2s ease forwards',
        'mega-full-fade': 'megaFullFade .2s ease forwards',
        marquee: 'marquee 45s linear infinite',
        // Delays and durations taken off the original GSAP hero timeline
        // (0.2s start, then '-=0.2' / '-=0.2' relative positions).
        'hero-rise-lg':
          'heroRise20 .55s cubic-bezier(.215,.61,.355,1) .4s both',
        'hero-rise-sm':
          'heroRise14 .4s cubic-bezier(.215,.61,.355,1) .75s both',
        'scroll-bounce': 'scrollBounce 2s ease-in-out infinite',
        'h2-pulse': 'h2pulse 2.6s ease-out infinite',
        'pai-blink': 'paiBlink 1.6s infinite',
        'scroll-cue': 'scrollCueBounce 1.8s ease-in-out infinite',
        'map-pulse': 'mapPulse 2.5s ease-in-out infinite',
        'banner-ping': 'bannerPing 2s ease-in-out infinite',
        'ping-soft': 'pingSoft 2s ease-in-out infinite',
        'float-y': 'floatY 3s ease-in-out infinite',
        'hero-orb': 'heroOrbFloat 10s ease-in-out infinite',
        // `reverse` is part of the shorthand, matching `animation: crFloat 12s
        // ease-in-out infinite reverse` on the second orb.
        'hero-orb-reverse': 'heroOrbFloat 12s ease-in-out infinite reverse',
        'blink-caret': 'blinkCaret .75s step-end infinite',
        'mf-line': 'mfLineRun 3.6s linear infinite',
        'fde-glow': 'fdeFloatGlow 4.5s ease-in-out infinite',
      },

      /* ── Layout ────────────────────────────────────────────────────────── */
      maxWidth: {
        shell: '1280px', // every section's content track
        nav: '1360px', // the header pill
        flow: '1220px', // migration flow
        askbox: '1120px',
      },

      borderRadius: {
        pill: '100px',
        mega: '22px',
      },

      backgroundImage: {
        // Reusable gradients. Section-specific one-offs stay at the call site.
        'grad-text':
          'linear-gradient(90deg,#1d4ed8 0%,#2563eb 60%,#0ea5e9 100%)',
        'grad-text-warm':
          'linear-gradient(135deg,#1d4ed8 0%,#2563eb 50%,#f2642a 100%)',
        'grad-brand': 'linear-gradient(135deg,#2563eb,#1d4ed8)',
        'grad-brand-orange': 'linear-gradient(135deg,#2563eb,#f2642a)',
        'grad-tint': 'linear-gradient(135deg,#eff6ff,#fef1e8)',
        'grad-cta':
          'linear-gradient(135deg,#23408a 0%,#3a6fde 65%,#5b89eb 100%)',
        /** `.mig-sec` - the cloud-migration section's backdrop. */

        /**
         * AI-delivery carousel card: a darkening scrim composited over a photo.
         *
         * Two background layers cannot come from two separate utilities - the
         * second `background-image` would replace the first - so the whole value
         * lives here as one token, with the photo injected through
         * `--card-photo`. The variable is the only runtime part, set inline
         * because the URL is a build-hashed asset path.
         */
        'deliver-card':
          'linear-gradient(180deg,rgba(10,20,45,.1) 0%,rgba(8,15,38,.6) 62%,rgba(6,10,30,.88) 100%), var(--card-photo)',
      },
    },
  },

  plugins: [],
};

export default config;
