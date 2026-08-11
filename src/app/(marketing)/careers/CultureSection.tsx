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
 * "Life at Clovity" — photo left, culture copy right.
 *
 * WHAT THE CMS ACTUALLY OWNS HERE IS THE PHOTOGRAPH, and only that. It is worth
 * saying why, because the obvious reading of the content type is wrong.
 *
 * `life-at-clovity` looks like it should supply this whole block — it has
 * `header_normal`, `header_highlighted`, `image` and `info`. But the live instance
 * holds 12 rows arranged as four themed galleries of three
 * ("Clovity's Proud Achievements", "At Clovity Cherished Moments", "Employee
 * Recognition", "More Than Just Works"), where each row is ONE PHOTO and `info` is
 * its caption — "Clovity Team Unites for Team Week Celebrations at Noida HQ, India".
 * The header repeats across the three rows of a gallery; it names the gallery, not
 * the row.
 *
 * So wiring `header_*` to this section's headline and `info` to its opening
 * paragraph would print a gallery title and a photo caption where the design has a
 * culture pitch. The section would be "dynamic" and read as broken.
 *
 * What the collection genuinely has that this block needs is a real photograph of
 * the team, which beats the stock image the published page uses. So: the lead photo
 * of the first gallery (`sectionOrder` then `order`) comes from the CMS, and the
 * headline, paragraph and four bullets stay editorial copy — there is no field in
 * `clovity-admin` that means any of them.
 *
 * (If the copy should become editable, the clean fix is a `careers-page` single type
 * in Strapi with `heading` / `intro` / `bullets` fields. That is a schema change in
 * `clovity-admin`, which is outside this app.)
 *
 * `id="culture"` is the hero's "Life at Clovity" button target.
 *
 * `image` may be `null` if a row's media relation is missing; the section then
 * renders copy-only rather than an empty frame, which is the honest degradation.
 */
export function CultureSection({
  /** Build-time snapshot. Refreshed in the browser — see `api/cms.hooks.ts`. */
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
