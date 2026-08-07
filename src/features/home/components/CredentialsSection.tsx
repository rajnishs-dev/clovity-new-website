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
 * Section 4.5b — "Credentials Earned, Not Claimed.", as Tailwind utilities.
 *
 * Two columns: copy and a CTA on the left, a badge collage on the right, split
 * `1fr 1.5fr`. Below 1100px it becomes one centred column.
 *
 * The collage is three rows. The first holds the four Atlassian partner badges bare
 * on the background at a wider 34px gap; the other two hold the certification badges
 * in uniform 130×120 white cards, four then three. The rows are data (see
 * `CredentialRow`) rather than one wrapping row, because once the layout collapses
 * to a single column the right side is wide enough to fit all seven cards on one
 * line, which is not the arrangement the design specifies.
 *
 * `pb-[240px]` is not this section's own spacing — it reserves room for the final
 * CTA card, which overlaps upward with negative margins. It stays on the section for
 * the same reason the original put it there: the CTA is a sibling, so nothing else
 * can create that space.
 *
 * The section is white and borderless: `.cred` paints `--bg-soft` with rules above
 * and below, and `.cred-dark` — which every instance also carries — overrides all
 * three.
 *
 * `unoptimized` on the SVG badges: Next's optimizer rejects SVG without
 * `dangerouslyAllowSVG`, and a vector badge gains nothing from rasterisation.
 */
export interface CredentialsSectionProps {
  rows: CredentialRow[];
}

function isSvg(source: CredentialBadge['image']['src']): boolean {
  const path = typeof source === 'string' ? source : source.src;
  return path.toLowerCase().includes('.svg');
}

/**
 * A bare partner badge.
 *
 * WHICH DIMENSION IS INLINE AND WHICH IS A CLASS IS LOAD-BEARING.
 *
 * The original sets `height: 100px` inline on each of these, and an inline style
 * outranks a media query — so the `≤640px` rule that would drop them to 56px never
 * applies, and they stay 100px tall on mobile. That is reproduced.
 *
 * `max-width` is the opposite: it comes from the stylesheet (150px, tightening to
 * 100px below 640px), so it MUST be a responsive class here. Baking it in as an
 * inline style froze the badges at 150px, and on a 390px screen they stopped fitting
 * two to a row — the section came out 154px too tall.
 *
 * Only the Marketplace Partner lockup carries an inline `max-width` in the original,
 * and its 160px correctly overrides both breakpoints.
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
    <div className="flex h-[120px] w-[130px] items-center justify-center rounded-2xl bg-white p-4 shadow-badge [transition:transform_.25s,box-shadow_.25s] hover:-translate-y-[3px] hover:shadow-badge-hover to-640:h-24 to-640:w-[120px] to-640:p-2.5">
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
            {/*
              Visible at `lg`+ only. Below that the grid collapses to one
              column and the CTA has to fall after the badge collage instead —
              see the second copy below. Keeping this one in place (rather than
              pulling the CTA out into its own grid row) means the `items-center`
              row-height math above stays exactly what it was.
            */}
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
            {/*
              Below `md` the collage becomes a single auto-scrolling marquee
              (`CredentialsMarquee`) — three flex-wrap rows have no room to
              breathe at that width, so the rows themselves are hidden rather
              than reflowed.
            */}
            <div className="flex w-full flex-col items-center gap-6 to-767:hidden">
              {rows.map((row) => (
                <div
                  key={row.id}
                  className={cn(
                    'flex flex-wrap items-center justify-center',
                    // Both rows collapse to a 14px gap below 640px. `.cred-row-plain`
                    // and `.cred-row` tie on specificity, and the media block comes
                    // later in the file — so the narrow gap wins for the plain row too,
                    // which also carries `.cred-row`.
                    row.variant === 'plain' ? 'gap-[34px]' : 'gap-5',
                    'to-640:gap-3.5',
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

          {/*
            Same CTA, `lg`-hidden twin of the one above — see that comment.
            `justify-self-center`: a grid item is blockified regardless of its
            own `display`, so without it this would stretch to the column's
            full width instead of staying a content-sized pill.
          */}
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
