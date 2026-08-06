import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import { AppImage } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';
import {
  GradientText,
  HEADING_CLASS,
  SUBHEADING_CLASS,
} from '@/components/ui/Typography';
import { FDE_CONTENT, FDE_PROOF_CARDS } from '@/constants/home';

/**
 * Section 4.5 — Forward-Deployed Engineers, as Tailwind utilities.
 *
 * Copy left, photo with three floating proof cards right. The cards' entrance
 * stagger and the sparkline draw stay GSAP (see `HomeAnimations`); their idle glow
 * is `animate-fde-glow`, behind `motion-safe:` so it only runs for visitors who
 * have not asked for reduced motion — the legacy equivalent was a
 * `@media (prefers-reduced-motion: no-preference)` block.
 *
 * Below 560px the cards leave the absolute flow and stack under the photo
 * (`to-560:static`), because three overlapping panels on a phone cover the image
 * they are annotating.
 *
 * The photo is a remote Unsplash URL in the original and stays remote — it is stock
 * art, not a brand asset, so bundling it would add ~200KB to the repo for no gain.
 */

/** Per-card position. Order matches `FDE_PROOF_CARDS`. */
const CARD_POSITION = [
  '-right-4 top-2',
  'bottom-[74px] -left-4',
  'bottom-0 right-3.5',
] as const;

/** Staggered glow so the three cards do not pulse in unison. */
const CARD_DELAY = [
  '',
  'motion-safe:[animation-delay:.6s]',
  'motion-safe:[animation-delay:1.2s]',
] as const;

export function ForwardDeployedSection() {
  return (
    <section
      id="forward-deployed-engineers"
      className="relative overflow-hidden py-16 sm:py-20"
    >
      <div className="relative mx-auto max-w-shell px-6">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
          {/* Left: copy */}
          <div className={reveal('left')} {...revealAttrs()}>
            <h2 className={cn(HEADING_CLASS, 'mt-4')}>
              {FDE_CONTENT.headingLead}
              <br />
              <GradientText>{FDE_CONTENT.headingHighlight}</GradientText>
            </h2>
            <p className={cn(SUBHEADING_CLASS, 'mt-4')}>
              {FDE_CONTENT.subheading}
            </p>
            <div className="mt-4">
              <SmartLink
                href={FDE_CONTENT.ctaHref}
                className={buttonClass('primary')}
              >
                {FDE_CONTENT.ctaLabel} <ArrowIcon />
              </SmartLink>
            </div>
          </div>

          {/* Right: photo + floating proof cards */}
          <div className={reveal('right')} {...revealAttrs()}>
            {/* `before:` is the soft brand glow behind the photo. */}
            <div className="relative mt-2 px-3.5 pb-[46px] pt-[18px] before:absolute before:inset-0 before:z-0 before:rounded-[40px] before:bg-[radial-gradient(65%_65%_at_65%_25%,rgba(37,99,235,.12),transparent_70%)] before:content-[''] to-560:p-0">
              <div className="relative z-[1] overflow-hidden rounded-[20px] border border-white/60 shadow-[0_30px_60px_-24px_rgba(15,23,42,.28)]">
                <AppImage
                  src={FDE_CONTENT.photo.src}
                  alt={FDE_CONTENT.photo.alt}
                  width={FDE_CONTENT.photo.width}
                  height={FDE_CONTENT.photo.height}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="block h-[400px] w-full object-cover"
                />
              </div>

              {FDE_PROOF_CARDS.map((card, cardIndex) => (
                <div
                  key={card.id}
                  className={cn(
                    'absolute z-[2] w-[196px] rounded-[14px] bg-white p-3 px-3.5 shadow-float',
                    'motion-safe:animate-fde-glow',
                    CARD_POSITION[cardIndex],
                    CARD_DELAY[cardIndex],
                    // On a phone the cards stack under the photo instead of
                    // covering it.
                    'to-560:static to-560:mt-3 to-560:w-auto to-560:animate-none',
                  )}
                >
                  <div className="mb-[5px] flex items-center gap-2">
                    <span
                      className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[50%] text-[14px]"
                      style={card.iconStyle}
                    >
                      <Icon name={card.icon} />
                    </span>
                    <b className="text-[12.5px] font-800 text-ink">
                      {card.title}
                    </b>
                  </div>
                  <p className="m-0 text-[12px] leading-[1.4] text-muted">
                    {card.description}
                  </p>

                  {'brands' in card && card.brands ? (
                    <div className="mt-2 flex gap-1.5">
                      {card.brands.map((brand) => (
                        <span
                          key={brand.id}
                          style={brand.style}
                          className="flex h-[22px] w-[22px] items-center justify-center rounded-md text-[12px]"
                        >
                          <Icon name={brand.icon} />
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {'sparkline' in card && card.sparkline ? (
                    <svg
                      width="100%"
                      height="26"
                      viewBox="0 0 160 26"
                      preserveAspectRatio="none"
                      aria-hidden
                      className="mt-1.5 block"
                    >
                      <polyline
                        points="2,22 30,16 58,19 86,10 114,13 158,3"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        // GSAP animates strokeDashoffset from this length to 0.
                        strokeDasharray="180"
                      />
                    </svg>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
