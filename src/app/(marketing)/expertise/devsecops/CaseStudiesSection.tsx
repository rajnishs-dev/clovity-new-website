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
import { DEVSECOPS_CASE_STUDIES_CONTENT } from '@/constants/devsecops';

/**
 * "Pipelines We Already Work In" - the live case-study rail, the same band the ITSM,
 * Atlassian, Cloud Migration and Marketplace Apps pages carry.
 *
 * Uses the shared `ResourceCard` and `CategoryPill`, so a card here is identical to the same
 * case study on `/case-study` - including its category pill tint, resolved through
 * `resolveCategoryMeta` rather than hard-coded, so a new category picks up its styling in
 * one place.
 *
 * ── THE PAGE'S ONLY PROOF BAND ──
 * A second one sat directly below this for a short while: `ProofSection`, a single featured
 * long-form article ("Our Own Thinking, Written Down") in a `FeaturedResourceCard`. It was
 * removed on request, along with the blog lookup that fed it - see `data/devsecops.ts`.
 *
 * Returns `null` on an empty list, so a CMS returning nothing cannot leave a heading over
 * empty space. That matters more now than it did with two bands: this rail is the page's
 * whole proof, so an empty CMS would leave the page with none at all.
 */
export function CaseStudiesSection({
  caseStudies,
}: {
  caseStudies: CaseStudyItem[];
}) {
  if (caseStudies.length === 0) return null;

  return (
    <Section padding="tight" className="bg-[#eaf8ff]">
      <SectionHeader
        heading={
          <>
            {DEVSECOPS_CASE_STUDIES_CONTENT.headingLead}
            <GradientText>
              {DEVSECOPS_CASE_STUDIES_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        subheading={DEVSECOPS_CASE_STUDIES_CONTENT.subheading}
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
          href={DEVSECOPS_CASE_STUDIES_CONTENT.moreHref}
          className={buttonClass('secondary')}
        >
          {DEVSECOPS_CASE_STUDIES_CONTENT.moreLabel} <ArrowIcon />
        </SmartLink>
      </div>
    </Section>
  );
}
