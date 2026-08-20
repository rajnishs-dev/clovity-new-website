import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { ProofQuote } from '@/components/expertise';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { cn } from '@/lib/cn';
import {
  CLOUD_MIGRATION_PROOF_CONTENT,
  CLOUD_MIGRATION_PROOF_STORIES,
} from '@/constants/expertise/cloud-migration';

export function ProofSection() {
  return (
    <Section className="bg-white">
      <SectionHeader
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {CLOUD_MIGRATION_PROOF_CONTENT.headingLead}
            <GradientText>
              {CLOUD_MIGRATION_PROOF_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
      />
      <div
        className={cn(
          'mt-10 grid grid-cols-3 gap-6 to-900:grid-cols-1',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        {CLOUD_MIGRATION_PROOF_STORIES.map((story) => (
          <ProofQuote key={story.id} story={story} layout="stack" />
        ))}
      </div>
    </Section>
  );
}
