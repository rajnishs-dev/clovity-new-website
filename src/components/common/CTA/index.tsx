import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import type { CtaLink } from '@/types/content';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { ButtonLink, type ButtonVariant } from '@/components/ui/Button';

/**
 * A row of CTA buttons driven by data.
 *
 * Every CTA on the site is a `<CtaLink>` record, so a CMS-managed button - new
 * label, new destination, different variant - needs no component change. The
 * trailing arrow is added automatically for the variants that carry one in the
 * original design.
 */
const VARIANT_MAP: Record<CtaLink['variant'], ButtonVariant> = {
  primary: 'primary',
  secondary: 'secondary',
  white: 'white',
  'white-pill': 'whitePill',
  'ghost-dark': 'ghostDark',
};

/** Variants that render a trailing arrow in the original design. */
const ARROW_VARIANTS = new Set<CtaLink['variant']>([
  'primary',
  'secondary',
  'white',
  'white-pill',
]);

/**
 * The trailing glyph for one CTA.
 *
 * `cta.icon` wins when set, which is how the interior pages get their
 * `arrow-up-right` without a second component. `text-xs` matches the `text-xs` the
 * markup puts on every one of these arrows.
 */
function trailingGlyph(cta: CtaLink) {
  if (!ARROW_VARIANTS.has(cta.variant)) return undefined;
  return cta.icon ? (
    <Icon name={cta.icon} className="text-xs" />
  ) : (
    <ArrowIcon />
  );
}

export interface CtaGroupProps {
  ctas: CtaLink[];
  className?: string;
  /** Suppress the automatic trailing arrow. */
  hideArrows?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CtaGroup({
  ctas,
  className,
  hideArrows = false,
  size = 'md',
}: CtaGroupProps) {
  if (ctas.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-3.5', className)}>
      {ctas.map((cta) => (
        <ButtonLink
          key={cta.id}
          href={cta.href}
          variant={VARIANT_MAP[cta.variant]}
          size={size}
          {...(cta.external ? { forceExternal: true } : {})}
          {...(!hideArrows && trailingGlyph(cta)
            ? { trailingIcon: trailingGlyph(cta) }
            : {})}
        >
          {cta.label}
        </ButtonLink>
      ))}
    </div>
  );
}

/**
 * The final CTA card that overlaps into the footer, as Tailwind utilities.
 *
 * The negative vertical margins (−180px top and bottom) are what pull the card up
 * out of the credentials section and down into the footer, so it straddles the
 * seam. They only work because the footer reserves matching space via its
 * `overlap` prop and the credentials section carries the bottom padding - three
 * pieces that have to agree, which is why each one says so in a comment.
 *
 * The three orbs and the dot grid are decorative `<span>`s rather than
 * pseudo-elements because there are more of them than an element has pseudo-slots,
 * and each carries its own radial gradient.
 */
export interface FinalCtaProps {
  heading: ReactNode;
  description: ReactNode;
  ctas: CtaLink[];
  id?: string;
  className?: string;
  /**
   * Classes for the gradient card itself.
   *
   * The interior pages (About / Careers / Contact) declare their own `.cta-card`
   * gradient — `#152a6b → #2557c9 → #3568e0`, a step darker than the home page's —
   * and their own heading clamp. Those are page-level stylesheet values in the
   * published markup, not a shared token, so they arrive as overrides here rather
   * than changing the default and shifting the home page with it.
   */
  cardClassName?: string;
  headingClassName?: string;
  /**
   * Pull the card up out of the preceding section (the home page's `-mt-[180px]`).
   *
   * Off for the interior pages, whose `.cta-card` sets `margin-top: 0` — the
   * section above them is padded normally and there is nothing to tuck into. It
   * still overlaps DOWNWARD into the footer either way; that is the `-mb-[180px]`
   * below, which is not optional because the footer reserves matching space.
   */
  pullUp?: boolean;
  /**
   * The hand-drawn arrow-and-sparkle flourish under the heading.
   *
   * Home page only. The interior pages' CTA cards have no such mark, and rendering
   * one would be inventing artwork the design does not have.
   */
  flourish?: boolean;
}

export function FinalCta({
  heading,
  description,
  ctas,
  id = 'final-cta',
  className,
  cardClassName,
  headingClassName,
  pullUp = true,
  flourish = true,
}: FinalCtaProps) {
  return (
    <section
      id={id}
      className={cn('mx-5 overflow-visible bg-transparent', className)}
    >
      <div
        className={cn(
          'relative mx-auto -mb-[180px] flex max-w-shell flex-wrap items-center justify-between gap-12 overflow-hidden rounded-[32px] bg-grad-cta px-14 py-[60px] shadow-cta',
          pullUp && '-mt-[180px]',
          'to-900:justify-center to-900:px-9 to-900:py-12 to-900:text-center',
          'to-640:-mb-[100px] to-640:rounded-[24px]',
          reveal(),
          cardClassName,
        )}
        {...revealAttrs()}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          <span className="absolute -top-[130px] right-[-90px] h-[300px] w-[300px] rounded-[50%] bg-[radial-gradient(circle_at_32%_32%,#6ea3ff,#3568e0_65%,#1c3f9e_100%)] opacity-90" />
          <span className="absolute -bottom-[90px] right-2.5 h-[190px] w-[190px] rounded-[50%] bg-[radial-gradient(circle_at_35%_30%,#8fd3ff,#3ba0e6_70%)] opacity-70" />
          <span className="absolute -bottom-[30px] right-[170px] h-24 w-24 rounded-[50%] bg-[#0f2a6b] opacity-60" />
        </div>

        <div className="relative z-[1] min-w-[280px] flex-[1_1_380px] to-900:max-w-full to-900:flex-[1_1_100%]">
          <h2
            className={cn(
              'm-0 text-[clamp(30px,3.2vw,46px)] font-normal leading-[1.1] tracking-[-0.03em] text-white',
              headingClassName,
            )}
          >
            {heading}
          </h2>
          {flourish ? (
          <svg
            width="170"
            height="64"
            viewBox="0 0 170 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className="mt-3.5 opacity-80 to-900:hidden"
          >
            <path
              d="M4 18C42 62 108 62 142 26"
              stroke="#fff"
              strokeOpacity=".55"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M142 26l-4 13M142 26l-12 4"
              stroke="#fff"
              strokeOpacity=".55"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M154 4l3.2 8.8 8.8 3.2-8.8 3.2-3.2 8.8-3.2-8.8-8.8-3.2 8.8-3.2 3.2-8.8z"
              fill="#fff"
              fillOpacity=".9"
            />
          </svg>
          ) : null}
        </div>

        <div className="relative z-[1] min-w-[280px] max-w-[460px] flex-[1_1_380px] to-900:max-w-full to-900:flex-[1_1_100%]">
          <p className="mb-7 mt-0 text-[16px] leading-[1.7] text-[#dbe6ff]">
            {description}
          </p>
          <div className="flex flex-wrap gap-3.5 to-900:justify-center">
            {ctas.map((cta) => (
              <ButtonLink
                key={cta.id}
                href={cta.href}
                variant={VARIANT_MAP[cta.variant]}
                {...(cta.external ? { forceExternal: true } : {})}
                {...(trailingGlyph(cta)
                  ? { trailingIcon: trailingGlyph(cta) }
                  : {})}
              >
                {cta.label}
              </ButtonLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
