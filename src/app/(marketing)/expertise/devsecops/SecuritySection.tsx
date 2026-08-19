import { cn } from '@/lib/cn';
import { reveal, revealAligned, revealAttrs } from '@/lib/reveal';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';
import { Container, GradientText } from '@/components/ui';
import {
  DEVSECOPS_SECURITY_CONTENT,
  DEVSECOPS_SECURITY_FACTS,
} from '@/constants/devsecops';

/**
 * 'The Reason to Take the "Sec" Seriously' - the regulated-delivery band.
 *
 * ── LIGHT, NOT DARK ──
 * An earlier pass painted this navy to mark it as the page's closing argument. It
 * worked in isolation and not in place: the page is light throughout, and a single
 * dark band mid-scroll read as a different page spliced in. Emphasis now comes from
 * composition and a tinted wash rather than from inverting the palette, which is the
 * cheaper and more durable way to say "this one matters".
 *
 * ── THE COMPOSITION IS TWO STACKED ZONES ──
 * Not the 420px-plus-`1fr` split it started as - that is the same shape the Pulse AI
 * section above it uses, so two consecutive sections read as one component.
 *
 *  1. A statement zone - heading left, standfirst right, bottom-aligned to the
 *     heading's last line (`lg:items-end`), CTA beneath.
 *  2. A four-across LEDGER separated by vertical hairlines, each entry led by a large
 *     ordinal. A ledger says "these are the defaults, itemised" in a way a 2x2 grid
 *     of checkmarks does not, and it deliberately echoes the stat band under the hero
 *     so the page opens and closes on the same device.
 *
 * Below `ml` the ledger stacks and its dividers flip horizontal, because a vertical
 * rule between stacked rows separates nothing.
 */
export function SecuritySection() {
  return (
    // `bg-soft`. Before that it was `#eaf8ff`, and before that a blue-to-peach wash
    // ending in `#fff4ec` - the only warm background on the site, which read as a
    // different site spliced in. The tint went when this page narrowed to white and
    // `bg-soft` only; the orbs below still supply the colour the flat tone gives up.
    <section className="relative isolate overflow-hidden bg-soft py-14 lg:py-20">
      {/* The same orb device the hero and the final CTA use. The warm orb is the
          brand orange `#f2642a` at low opacity - exactly how the hero and
          `FinalCta` spend that colour - rather than a flat peach that exists
          nowhere in the palette. Decorative, and `pointer-events-none` so it never
          intercepts the CTA. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <span className="absolute -left-[130px] -top-[140px] h-[360px] w-[360px] rounded-[50%] bg-[radial-gradient(circle_at_35%_35%,#bfdbfe,transparent_70%)] opacity-70" />
        <span className="absolute -bottom-[130px] right-[-70px] h-[320px] w-[320px] rounded-[50%] bg-[radial-gradient(circle_at_35%_30%,#f2642a,transparent_70%)] opacity-[.14]" />
      </div>

      <Container className="relative z-[1]">
        <div
          className={cn(reveal('left'), 'text-left md:text-left')}
          {...revealAttrs()}
        >
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
            <h2 className="text-[clamp(30px,3.4vw,46px)] font-normal leading-[1.08] tracking-[-0.032em] text-title">
              {DEVSECOPS_SECURITY_CONTENT.headingLead}
              <GradientText>
                {DEVSECOPS_SECURITY_CONTENT.headingHighlight}
              </GradientText>
            </h2>
            <p className="text-[16px] leading-[1.7] text-muted lg:pb-1">
              {DEVSECOPS_SECURITY_CONTENT.subheading}
            </p>
          </div>

          <div className="mt-8">
            <SmartLink
              href={DEVSECOPS_SECURITY_CONTENT.ctaHref}
              className={buttonClass('primary')}
            >
              {DEVSECOPS_SECURITY_CONTENT.ctaLabel} <ArrowIcon />
            </SmartLink>
          </div>
        </div>

        <ol
          className={cn(
            'm-0 mt-12 grid list-none border-t border-line pt-10 ml:grid-cols-4 ml:gap-0 to-900:gap-8',
            revealAligned('left'),
          )}
          {...revealAttrs()}
        >
          {DEVSECOPS_SECURITY_FACTS.map((fact, index) => (
            <li
              key={fact.id}
              className={cn(
                'ml:px-6 ml:first:pl-0 ml:last:pr-0',
                index > 0 && 'ml:border-l ml:border-line',
                index > 0 && 'to-900:border-t to-900:border-line to-900:pt-7',
              )}
            >
              <div className="mb-3 flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="font-display text-[24px] font-800 leading-none tracking-[-.02em] text-brand-600"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="h-4 w-px bg-line" />
                <span className="flex h-4 w-4 items-center justify-center text-brand-500">
                  <Icon name="circle-check" size={15} />
                </span>
              </div>

              <b className="mb-2 block text-[15.5px] font-700 leading-[1.3] text-title">
                {fact.title}
              </b>
              <p className="m-0 text-[13.5px] leading-[1.65] text-muted">
                {fact.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
