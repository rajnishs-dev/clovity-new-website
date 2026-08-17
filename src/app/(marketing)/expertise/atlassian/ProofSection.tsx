import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { ProofQuote } from '@/components/expertise';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { cn } from '@/lib/cn';
import {
  ATLASSIAN_PROOF_CONTENT,
  ATLASSIAN_PROOF_STORIES,
} from '@/constants/expertise/atlassian';

export function ProofSection() {
  return (
    <Section>
      <SectionHeader
        label={ATLASSIAN_PROOF_CONTENT.label}
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {ATLASSIAN_PROOF_CONTENT.headingLead}
            <GradientText>{ATLASSIAN_PROOF_CONTENT.headingHighlight}</GradientText>
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
        {ATLASSIAN_PROOF_STORIES.map((story) => (
          <ProofQuote key={story.id} story={story} layout="stack" />
        ))}
      </div>
    </Section>
  );
}
