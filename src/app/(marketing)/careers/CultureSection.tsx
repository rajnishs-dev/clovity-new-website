'use client';

import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { CultureHighlight } from '@/types/content';
import { useLifeAtClovity } from '@/api/cms.hooks';
import {
  GradientText,
  HEADING_CLASS,
  Icon,
  LABEL_CLASS,
  Section,
  SplitMedia,
  SplitMediaFrame,
} from '@/components/ui';
import { CAREERS_CULTURE_CONTENT } from '@/constants/careers';

/**
 * "Life at Clovity" - photo left, culture copy right.
 *
 * The CMS (`life-at-clovity`) only supplies the lead photograph here: its rows are
 * per-photo gallery captions, not fields for this section's headline/copy, so wiring
 * those in would print a gallery caption where the design wants a culture pitch. The
 * lead photo of the first gallery comes from the CMS; headline, paragraph and bullets
 * stay editorial copy.
 *
 * `id="culture"` is the hero's "Life at Clovity" button target. `image` may be `null`
 * if the media relation is missing, in which case the section renders copy-only.
 */
export function CultureSection({
  /** Build-time snapshot. Refreshed in the browser - see `api/cms.hooks.ts`. */
  initialHighlight,
}: {
  initialHighlight: CultureHighlight;
}) {
  const { data: highlight } = useLifeAtClovity(initialHighlight);

  const copy = (
    <div className={revealAligned('left', 'right')} {...revealAttrs()}>
      <p className={cn(LABEL_CLASS, 'mb-4 text-[13px]')}>
        {CAREERS_CULTURE_CONTENT.label}
      </p>
      <h2 className={cn(HEADING_CLASS, 'mb-6')}>
        {CAREERS_CULTURE_CONTENT.headingLead}
        <GradientText>
          {CAREERS_CULTURE_CONTENT.headingHighlight}
        </GradientText>
      </h2>
      <p className="text-[16px] leading-[1.75] text-muted">
        {CAREERS_CULTURE_CONTENT.intro}
      </p>

      <ul className="mt-5 flex list-none flex-col gap-3.5 p-0">
        {CAREERS_CULTURE_CONTENT.bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex items-start gap-3 text-[15px] leading-[1.6] text-muted"
          >
            <Icon
              name="circle-check"
              className="mt-[3px] shrink-0 text-[15px] text-brand-600"
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Section id="culture" padding="tight" className="bg-white">
      {highlight.image ? (
        <SplitMedia
          media={
            <SplitMediaFrame image={highlight.image} revealFrom="left" />
          }
        >
          {copy}
        </SplitMedia>
      ) : (
        copy
      )}
    </Section>
  );
}
