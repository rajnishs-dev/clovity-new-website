import type { CaseStudyItem } from '@/types/content';
import { cn } from '@/lib/cn';
import { reveal, revealAligned, revealAttrs } from '@/lib/reveal';
import { ArrowIcon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';
import { GradientText, Section, SectionHeader } from '@/components/ui';
import {
  CategoryPill,
  MetaItem,
  ResourceCard,
} from '@/components/common/Resources';
import { resolveCategoryMeta } from '../../case-study/categoryMeta';
import { AI_PROOF_CONTENT } from '@/constants/ai';

/**
 * "Where We Have Already Shipped It" - three case-study cards from Strapi.
 *
 * Uses the shared `ResourceCard` and `CategoryPill`, so a card here is identical to the same case
 * study on `/case-study` - including its category pill tint, resolved through
 * `resolveCategoryMeta` rather than hard-coded, so a new category picks up its styling in one
 * place.
 *
 * Returns `null` on an empty list. `getAiCaseStudies` tops up from adjacent work precisely so
 * that should not happen, but a CMS returning nothing at all would otherwise leave a heading
 * over empty space.
 */
export function ProofSection({
  caseStudies,
}: {
  caseStudies: CaseStudyItem[];
}) {
  if (caseStudies.length === 0) return null;

  return (
    // `bg-[#eaf8ff]`, unlike the Managed Services and Workforce proof rails which sit on
    // white. See the background note in `page.tsx`: removing the responsible-AI band
    // left this page with an even number of sections, which makes one repeated tone
    // unavoidable. Putting it here is the cheapest option - the `FaqSection` below
    // already ships a `border-t` hairline to mark the seam, and white `ResourceCard`s
    // read better on soft than on white anyway.
    <Section padding="tight" >
      <SectionHeader
        heading={
          <>
            {AI_PROOF_CONTENT.headingLead}
            <GradientText>{AI_PROOF_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={AI_PROOF_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[720px] md:text-center"
      />

      <div
        className={cn(
          'grid grid-cols-3 gap-6 to-1024:grid-cols-2 to-680:grid-cols-1',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        {caseStudies.map((study) => {
          const { tone, icon } = resolveCategoryMeta(study.category);
          return (
            <ResourceCard
              key={study.id}
              href={study.href}
              external={study.external}
              image={study.image}
              title={study.title}
              excerpt={study.excerpt}
              publishedAt={study.publishedAt}
              ctaLabel="Read the case study"
              badge={
                <CategoryPill
                  label={study.category ?? 'Case Study'}
                  icon={icon}
                  tone={tone}
                  className="mb-0"
                />
              }
              meta={
                study.client ? (
                  <div className="mb-2">
                    <MetaItem icon="building">
                      {study.client}
                      {study.industry ? ` · ${study.industry}` : ''}
                    </MetaItem>
                  </div>
                ) : undefined
              }
            />
          );
        })}
      </div>

      <div
        className={cn('mt-9 text-center', reveal(), 'md:text-center')}
        {...revealAttrs()}
      >
        <SmartLink
          href={AI_PROOF_CONTENT.moreHref}
          className={buttonClass('secondary')}
        >
          {AI_PROOF_CONTENT.moreLabel} <ArrowIcon />
        </SmartLink>
      </div>
    </Section>
  );
}
