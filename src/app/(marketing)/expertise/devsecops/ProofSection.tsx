import type { BlogPost } from '@/types/content';
import { formatContentDate } from '@/lib/format';
import { GradientText, Section, SectionHeader } from '@/components/ui';
import {
  CategoryPill,
  FeaturedResourceCard,
  MetaItem,
} from '@/components/common/Resources';
import { DEVSECOPS_PROOF_CONTENT } from '@/constants/devsecops';

/**
 * "Our Own Thinking, Written Down" - one featured article.
 *
 * A single `FeaturedResourceCard` rather than the ITSM page's three-up
 * `ResourceCard` grid, for two reasons. One is variety. The other is that it is
 * honest about what exists: the DevSecOps post is the one long-form piece we have
 * published on this subject, and padding it out to three cards would mean filling
 * two slots with articles about something else.
 *
 * Returns `null` when the post is missing, which can only happen if the slug in
 * `DEVSECOPS_PROOF_CONTENT.featuredSlug` stops matching - a heading over empty space
 * is worse than no section.
 */
export function ProofSection({ playbook }: { playbook: BlogPost | undefined }) {
  if (!playbook) return null;

  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        heading={
          <>
            {DEVSECOPS_PROOF_CONTENT.headingLead}
            <GradientText>
              {DEVSECOPS_PROOF_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        subheading={DEVSECOPS_PROOF_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[720px] md:text-center"
      />

      <FeaturedResourceCard
        href={playbook.href}
        external={playbook.external}
        image={playbook.image}
        ribbon={DEVSECOPS_PROOF_CONTENT.ribbon}
        title={playbook.title}
        excerpt={playbook.excerpt}
        ctaLabel={DEVSECOPS_PROOF_CONTENT.ctaLabel}
        className="border border-line-soft"
        meta={
          <>
            <CategoryPill
              label={playbook.category ?? 'DevSecOps'}
              icon="shield-half"
              tone="blue"
            />
            <div className="mb-2 flex flex-wrap gap-4">
              <MetaItem icon="calendar-days">
                {formatContentDate(playbook.publishedAt)}
              </MetaItem>
              {playbook.readingMinutes ? (
                <MetaItem icon="clipboard-list">
                  {playbook.readingMinutes} min read
                </MetaItem>
              ) : null}
            </div>
          </>
        }
      />
    </Section>
  );
}
