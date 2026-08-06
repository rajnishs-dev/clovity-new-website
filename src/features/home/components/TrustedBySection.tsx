import { reveal, revealAttrs } from '@/lib/reveal';
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
import { ClientMarquee } from './ClientMarquee';

/**
 * Section 2 — Trusted By: intro copy, three customer-story cards, logo marquee.
 *
 * The story cards are their own treatment rather than the shared `<Card>`: the
 * legacy `.csp-card` uses a 3px lift and a different shadow/border pair from
 * `.card`, so folding them together would change one of them.
 *
 * `group` on the card drives the arrow nudge that `.csp-card:hover .csp-link i`
 * used to do — the arrow no longer depends on a stylesheet knowing its class name.
 *
 * Data comes in as props so the page can swap static constants for CMS responses
 * without this component changing.
 */
export interface TrustedBySectionProps {
  stories: CustomerStory[];
  logos: ClientLogo[];
}

export function TrustedBySection({ stories, logos }: TrustedBySectionProps) {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div
        className={`relative mx-auto mb-8 max-w-shell px-6 text-center ${reveal()}`}
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
          className={`grid grid-cols-3 gap-5 to-900:mx-auto to-900:max-w-[460px] to-900:grid-cols-1 ${reveal()}`}
          {...revealAttrs()}
        >
          {stories.map((story) => (
            <SmartLink
              key={story.id}
              href={story.href}
              className="group block rounded-[10px] border border-line-soft bg-white text-inherit no-underline shadow-card [transition:transform_.25s,box-shadow_.25s,border-color_.25s] hover:-translate-y-[3px] hover:border-[#dbe7fb] hover:shadow-card-hover"
            >
              <div className="p-7">
                <div className="flex items-center justify-between gap-3">
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
      </div>

      <ClientMarquee logos={logos} />
    </section>
  );
}
