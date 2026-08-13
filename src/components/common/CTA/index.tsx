import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import type { CtaLink } from '@/types/content';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { ButtonLink, type ButtonVariant } from '@/components/ui/Button';

/** A row of CTA buttons driven by `CtaLink` data, with the trailing arrow added automatically per variant. */
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

/** The trailing glyph for one CTA - `cta.icon` wins when set, else the default arrow. */
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
 * The final CTA card that overlaps into the footer. The negative vertical
 * margins pull it up over the section above and down into the footer, which
 * only works because the footer reserves matching space via its `overlap`
 * prop - the two have to agree.
 */
export interface FinalCtaProps {
  heading: ReactNode;
  description: ReactNode;
  ctas: CtaLink[];
  id?: string;
  className?: string;
  /** Classes for the gradient card itself - interior pages override with their own (slightly darker) gradient. */
  cardClassName?: string;
  headingClassName?: string;
  /** Pull the card up into the preceding section (home page only; interior pages have nothing to tuck into). */
  pullUp?: boolean;
  /** The hand-drawn arrow-and-sparkle flourish under the heading (home page only). */
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
      className={cn('px-5 overflow-visible bg-transparent', className)}
    >
      <div
        className={cn(
          'relative mx-auto -mb-[180px] flex max-w-shell flex-wrap items-center justify-between gap-12 overflow-hidden rounded-[10px] bg-grad-cta px-14 py-[60px] shadow-cta',
          pullUp && '-mt-[180px]',
          'to-900:justify-center to-900:px-9 to-900:py-12 to-900:text-center',
          'to-640:-mb-[100px]',
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
