'use client';

import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import { useSnapCarousel } from '@/hooks/useSnapCarousel';
import type { ClientLogo, CustomerStory } from '@/types/content';
import { Icon } from '@/components/ui/Icon';
import { AppImage } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';
import {
  GradientText,
  HEADING_CLASS,
  SUBHEADING_CLASS,
} from '@/components/ui/Typography';
import { TRUSTED_BY_CONTENT } from '@/constants/home';
import { ClientMarquee, HOME_LOGO_PILL_CLASS } from '@/components/common/ClientMarquee';

/**
 * Section 2 - Trusted By: intro copy, three customer-story cards, logo marquee.
 *
 * The story cards are their own treatment rather than the shared `<Card>`: the
 * legacy `.csp-card` uses a 3px lift and a different shadow/border pair from
 * `.card`, so folding them together would change one of them.
 *
 * `group` on the card drives the arrow nudge that `.csp-card:hover .csp-link i`
 * used to do - the arrow no longer depends on a stylesheet knowing its class name.
 *
 * Below `md` the grid becomes a one-card-at-a-time scroll-snap rail (same
 * `useSnapCarousel` hook the AI Delivery and Expert Insights rails use), with
 * dots for navigation since there's no room for arrows at that width.
 *
 * Data comes in as props so the page can swap static constants for CMS responses
 * without this component changing.
 */
const CARD_GAP = 20; // matches `gap-5`

export interface TrustedBySectionProps {
  stories: CustomerStory[];
  logos: ClientLogo[];
}

export function TrustedBySection({ stories, logos }: TrustedBySectionProps) {
  const { trackRef, activeIndex, scrollToIndex } = useSnapCarousel({
    gap: CARD_GAP,
    itemCount: stories.length,
  });

  return (
    <section className="relative overflow-hidden bg-white py-12 lg:py-16">
      <div
        // `reveal()` bakes in `md:text-left` (it's meant for content that
        // re-aligns on desktop) - this heading stays centered at every
        // breakpoint, so `md:text-center` has to come after it to win.
        className={cn(
          'relative mx-auto mb-8 lg:mb-10 max-w-shell px-6 text-center',
          reveal(),
          'md:text-center',
        )}
        {...revealAttrs()}
      >
        <h2 className={HEADING_CLASS}>
          {TRUSTED_BY_CONTENT.headingLead}
          <GradientText>{TRUSTED_BY_CONTENT.headingHighlight}</GradientText>
        </h2>
        <p className={`${SUBHEADING_CLASS} mx-auto mt-3 max-w-[560px]`}>
          {TRUSTED_BY_CONTENT.subheading}
        </p>
      </div>

      <div className="mx-auto mb-8 max-w-shell px-6 sm:mb-12">
        <div
          ref={trackRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Customer stories"
          className={`grid grid-cols-3 gap-5 to-900:mx-auto to-900:grid-cols-2 to-767:flex to-767:snap-x to-767:snap-mandatory to-767:overflow-x-auto to-767:pb-1 to-767:[scrollbar-width:none] to-767:[&::-webkit-scrollbar]:hidden ${reveal()}`}
          {...revealAttrs()}
        >
          {stories.map((story) => (
            <SmartLink
              key={story.id}
              href={story.href}
              className="group block rounded-[10px] border border-line-soft bg-white text-inherit no-underline shadow-card [transition:transform_.25s,box-shadow_.25s,border-color_.25s] hover:-translate-y-[3px] hover:border-[#dbe7fb] hover:shadow-card-hover to-767:w-full to-767:flex-[0_0_100%] to-767:[scroll-snap-align:start]"
            >
              <div className="p-7">
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                  <AppImage
                    src={story.logo.src}
                    alt={story.logo.alt}
                    sizes="160px"
                    className="mb-5 h-[70px] w-auto max-w-[160px] object-contain object-left"
                    {...(story.logo.width && story.logo.height
                      ? { width: story.logo.width, height: story.logo.height }
                      : {})}
                  />
                  <span className="mb-4 inline-block whitespace-nowrap text-[11px] font-800 uppercase tracking-[.1em] text-black">
                    {story.tag}
                  </span>
                </div>

                <h3 className="mb-2.5 text-[18px] font-800 leading-[1.3] tracking-[-.015em] text-ink">
                  {story.title}
                </h3>
                <p className="mb-[18px] text-[14.5px] leading-[1.6] text-black">
                  {story.description}
                </p>
                <span className="inline-flex items-center gap-2 text-[14px] font-700 text-brand-600">
                  {story.ctaLabel}
                  <Icon name="arrow-right"
                    className="text-[12px] transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </SmartLink>
          ))}
        </div>

        {stories.length > 1 && (
          <div className="mt-5 hidden justify-center gap-[7px] to-767:flex">
            {stories.map((story, index) => (
              <button
                key={story.id}
                type="button"
                aria-label={`Go to story ${index + 1}`}
                aria-current={activeIndex === index || undefined}
                onClick={() => scrollToIndex(index)}
                className={cn(
                  'h-[9px] cursor-pointer border-none p-0 transition-all duration-200',
                  activeIndex === index
                    ? 'w-[22px] rounded-[5px] bg-brand-600'
                    : 'w-[9px] rounded-[50%] bg-[#dbe7ff]',
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* The home page's own `.trusted-sec .logo-pill` border + shadow override. */}
      <ClientMarquee logos={logos} pillClassName={HOME_LOGO_PILL_CLASS} />
    </section>
  );
}
