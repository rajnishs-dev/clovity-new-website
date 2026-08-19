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
import { MS_PROOF_CONTENT } from '@/constants/managed-services';

/**
 * "Platforms We Already Run" - three case-study cards.
 *
 * Uses the shared `ResourceCard` and `CategoryPill`, so a card here is identical to the
 * same case study on `/case-study` - including its category pill tint, resolved through
 * `resolveCategoryMeta` rather than hard-coded, so a new category picks up its styling
 * in one place.
 *
 * Returns `null` on an empty list. `getManagedServicesCaseStudies` tops up from
 * adjacent work precisely so that should not happen, but a CMS returning nothing at all
 * would otherwise leave a heading over empty space.
 */
export function ProofSection({
  caseStudies,
}: {
  caseStudies: CaseStudyItem[];
}) {
  if (caseStudies.length === 0) return null;

  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        heading={
          <>
            {MS_PROOF_CONTENT.headingLead}
            <GradientText>{MS_PROOF_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={MS_PROOF_CONTENT.subheading}
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
          href={MS_PROOF_CONTENT.moreHref}
          className={buttonClass('secondary')}
        >
          {MS_PROOF_CONTENT.moreLabel} <ArrowIcon />
        </SmartLink>
      </div>
    </Section>
  );
}
