'use client';

import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { BadgeGroup, ContentImage } from '@/types/content';
import { useAwards } from '@/api/cms.hooks';
import {
  AppImage,
  GradientText,
  Section,
  SectionHeader,
} from '@/components/ui';
import {
  ABOUT_AWARDS_GROUP,
  ABOUT_CREDENTIALS_CONTENT,
} from '@/constants/about';

/**
 * "Certifications & Awards" - two labelled rows of badge cards.
 *
 * Group one is the four Atlassian partner badges (bundled brand assets). Group two
 * is Strapi-backed: the `award` collection, ordered by its `order` column, falling
 * back to the eight badges the page publishes today. Both render through the same
 * card, so a CMS-supplied badge and a bundled one are indistinguishable on screen -
 * which is the point of the fallback.
 *
 * A CLIENT COMPONENT so the badge row refetches in the browser on every page load -
 * an award published in Strapi appears immediately rather than waiting out the
 * page's cache window. The prop it receives is the build-time snapshot, which is
 * what keeps the badges in the crawlable HTML; see `api/cms.hooks.ts`.
 *
 * CARD WIDTH IS A FLEX BASIS, NOT A GRID. `.cred-badge-grid` is a wrapping flex row
 * and the cards are a fixed 190px, so the number per row is whatever fits inside the
 * 980px track - 5 at desktop, wrapping to 3 for the second row of an 8-badge group.
 * Below 900px the width becomes a percentage (`33.333% - 11px`, i.e. three up minus
 * two thirds of the 16px gap) and below 640px `50% - 8px` for two up. Reimplementing
 * this as a grid would change how an odd-numbered group wraps.
 *
 * `unoptimized` for SVG: Next's optimizer rejects SVG unless
 * `dangerouslyAllowSVG` is set, and a vector badge gains nothing from rasterisation.
 * Same rule as the home page's credential collage.
 */

function isSvg(source: ContentImage['src']): boolean {
  const path = typeof source === 'string' ? source : source.src;
  return path.toLowerCase().includes('.svg');
}

function BadgeCard({
  badge,
}: {
  badge: BadgeGroup['badges'][number];
}) {
  return (
    <div
      className={cn(
        'relative flex w-[190px] flex-col items-center justify-center gap-2.5 overflow-hidden rounded-2xl border border-line-soft bg-white p-[18px] shadow-[0_1px_2px_rgba(15,23,42,.04)]',
        '[transition:transform_.25s,box-shadow_.25s,border-color_.25s]',
        'hover:scale-[1.06] hover:shadow-[0_14px_32px_rgba(15,23,42,.1)]',
        'to-900:w-[calc(33.333%_-_11px)]',
        'to-640:w-[calc(50%_-_8px)] to-640:p-4',
      )}
    >
      <AppImage
        src={badge.image.src}
        alt={badge.image.alt}
        unoptimized={isSvg(badge.image.src)}
        className={cn(
          'w-auto max-w-full object-contain',
          // The two Atlassian specialization lockups are drawn 6px taller and pulled
          // 16px down, which is how the design gets their baselines to line up with
          // the shorter badges beside them.
          badge.tall ? 'h-24 -mb-4' : 'h-[90px]',
        )}
        {...(badge.image.width && badge.image.height
          ? { width: badge.image.width, height: badge.image.height }
          : {})}
      />
    </div>
  );
}

export interface AboutCredentialsSectionProps {
  /** Group one - bundled Atlassian partner badges. Never from the CMS. */
  atlassianBadges: BadgeGroup;
  /** Group two, as fetched during static generation. Refreshed in the browser. */
  initialAwardBadges: BadgeGroup['badges'];
}

export function CredentialsSection({
  atlassianBadges,
  initialAwardBadges,
}: AboutCredentialsSectionProps) {
  const { data: awardBadges } = useAwards(initialAwardBadges);

  const groups: BadgeGroup[] = [
    atlassianBadges,
    {
      id: ABOUT_AWARDS_GROUP.id,
      label: ABOUT_AWARDS_GROUP.label,
      badges: awardBadges,
    },
  ];

  return (
    <Section padding="tight" className="border-y border-line-faint bg-soft">
      <SectionHeader
        label={ABOUT_CREDENTIALS_CONTENT.label}
        labelClassName="mb-4"
        heading={
          <>
            {ABOUT_CREDENTIALS_CONTENT.headingLead}
            <GradientText>
              {ABOUT_CREDENTIALS_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        subheading={ABOUT_CREDENTIALS_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto max-w-[620px] md:text-center"
      />

      {groups.map((group, index) => (
        <div
          key={group.id}
          className={cn(
            // 36px above the first group, 40px above the rest.
            index === 0 ? 'mt-9' : 'mt-10',
            revealAligned('center'),
          )}
          {...revealAttrs()}
        >
          <p className="mb-[18px] block text-center">
            <span className="inline-block text-[11.5px] font-800 uppercase tracking-[.1em] text-[#334155]">
              {group.label}
            </span>
          </p>
          <div className="mx-auto flex max-w-[980px] flex-wrap items-stretch justify-center gap-4">
            {group.badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      ))}
    </Section>
  );
}
