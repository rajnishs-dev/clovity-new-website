import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import type { CredentialBadge, CredentialRow } from '@/types/content';
import { ArrowIcon } from '@/components/ui/Icon';
import { AppImage } from '@/components/ui/Image';
import { buttonClass } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';
import {
  GradientText,
  HEADING_CLASS,
  SUBHEADING_CLASS,
} from '@/components/ui/Typography';
import { CREDENTIALS_CONTENT } from '@/constants/home';
import { CredentialsMarquee } from './CredentialsMarquee';

/**
 * Badge rows are data (`CredentialRow`) rather than one wrapping row, because
 * at the collapsed single-column width all seven badges would otherwise fit
 * on one line, which isn't the design's arrangement.
 *
 * `pb-[240px]` reserves room for the final CTA card, which overlaps upward
 * via negative margins and is this section's sibling.
 *
 * `unoptimized` on SVG badges: Next's optimizer rejects SVG without
 * `dangerouslyAllowSVG`, and a vector gains nothing from rasterization.
 */
export interface CredentialsSectionProps {
  rows: CredentialRow[];
}

function isSvg(source: CredentialBadge['image']['src']): boolean {
  const path = typeof source === 'string' ? source : source.src;
  return path.toLowerCase().includes('.svg');
}

/**
 * Height is a fixed class (not responsive) so badges stay 100px tall on
 * mobile; `max-width` must stay a responsive class, or badges freeze at
 * 150px and stop fitting two per row on narrow screens.
 */
function PlainBadge({ badge }: { badge: CredentialBadge }) {
  return (
    <AppImage
      src={badge.image.src}
      alt={badge.image.alt}
      unoptimized={isSvg(badge.image.src)}
      className="h-[100px] w-auto max-w-[150px] object-contain to-640:max-w-[100px]"
      {...(badge.image.width && badge.image.height
        ? { width: badge.image.width, height: badge.image.height }
        : {})}
      {...(badge.imageStyle ? { style: badge.imageStyle } : {})}
    />
  );
}

/** A certification badge in its white card. */
function CardBadge({ badge }: { badge: CredentialBadge }) {
  return (
    <div className="flex h-[120px] w-[130px] items-center justify-center rounded-[10px] bg-white p-4 shadow-badge [transition:transform_.25s,box-shadow_.25s] hover:-translate-y-[3px] hover:shadow-badge-hover to-640:h-24 to-640:w-[120px] to-640:p-2.5">
      <AppImage
        src={badge.image.src}
        alt={badge.image.alt}
        sizes="130px"
        unoptimized={isSvg(badge.image.src)}
        className="h-auto max-h-full w-auto max-w-full object-contain"
        {...(badge.image.width && badge.image.height
          ? { width: badge.image.width, height: badge.image.height }
          : {})}
      />
    </div>
  );
}

export function CredentialsSection({ rows }: CredentialsSectionProps) {
  return (
    <section
      id="recognition"
      className="relative overflow-hidden bg-white pb-[240px] pt-12 lg:pt-16"
    >
      <div className="relative z-10 mx-auto max-w-shell px-6">
        <div className="grid items-center gap-8 lg:gap-10 lg:grid-cols-[1fr_1.5fr] to-1100:grid-cols-1 to-1100:text-center">
          <div
            className={cn(
              'max-w-[440px] to-1100:mx-auto to-1100:max-w-[620px]',
              reveal('left'),
            )}
            {...revealAttrs()}
          >
            <h2 className={cn(HEADING_CLASS, 'text-left to-1100:text-center')}>
              {CREDENTIALS_CONTENT.headingLead}
              <GradientText>
                {CREDENTIALS_CONTENT.headingHighlight}
              </GradientText>
              {CREDENTIALS_CONTENT.headingTail}
            </h2>
            <p
              className={cn(
                SUBHEADING_CLASS,
                'mt-4 text-left to-1100:text-center',
              )}
            >
              {CREDENTIALS_CONTENT.subheading}
            </p>
            {/* Visible at lg+ only; below that the CTA falls after the badge
                collage instead (second copy below), which keeps the
                items-center row-height math here unchanged. */}
            <SmartLink
              href={CREDENTIALS_CONTENT.ctaHref}
              className={cn(buttonClass('primary', 'md', 'mt-7'), 'to-1100:hidden')}
            >
              {CREDENTIALS_CONTENT.ctaLabel} <ArrowIcon />
            </SmartLink>
          </div>

          <div
            className={cn(
              'flex w-full flex-col items-center gap-6',
              reveal('right'),
            )}
            {...revealAttrs()}
          >
            {/* Below md the collage becomes a single auto-scrolling marquee -
                the flex-wrap rows have no room to breathe at that width. */}
            <div className="flex w-full flex-col items-center gap-6 to-767:hidden">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className={cn(
                    'flex flex-wrap items-center justify-center',
                    // Both rows collapse to a 14px gap below 640px. `.cred-row-plain`
                    // and `.cred-row` tie on specificity, and the media block comes
                    // later in the file - so the narrow gap wins for the plain row too,
                    // which also carries `.cred-row`.
                    row.variant === 'plain' ? 'gap-[34px]' : 'gap-5',
                    'to-640:gap-3.5', // both variants tie at a 14px gap below 640px
                  )}
                >
                  {row.badges.map((badge) =>
                    row.variant === 'plain' ? (
                      <PlainBadge key={badge.id} badge={badge} />
                    ) : (
                      <CardBadge key={badge.id} badge={badge} />
                    ),
                  )}
                </div>
              ))}
            </div>

            <CredentialsMarquee rows={rows} />
          </div>

          {/* Same CTA, lg-hidden twin of the one above. `justify-self-center`
              keeps it a content-sized pill instead of stretching to the
              column's full width. */}
          <SmartLink
            href={CREDENTIALS_CONTENT.ctaHref}
            className={cn(
              buttonClass('primary', 'md'),
              'hidden to-1100:inline-flex to-1100:justify-self-center',
            )}
          >
            {CREDENTIALS_CONTENT.ctaLabel} <ArrowIcon />
          </SmartLink>
        </div>
      </div>
    </section>
  );
}
