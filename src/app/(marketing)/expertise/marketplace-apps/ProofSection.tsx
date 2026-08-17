import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { ProofQuote } from '@/components/expertise';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { cn } from '@/lib/cn';
import { MARKETPLACE_APPS_PROOF_CONTENT } from '@/constants/expertise/marketplace-apps';
import { CUSTOMER_STORIES } from '@/constants/home';

export function ProofSection() {
  return (
    <Section className="bg-[#eaf8ff]">
      <SectionHeader
        label={MARKETPLACE_APPS_PROOF_CONTENT.label}
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {MARKETPLACE_APPS_PROOF_CONTENT.headingLead}
            <GradientText>{MARKETPLACE_APPS_PROOF_CONTENT.headingHighlight}</GradientText>
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
        {CUSTOMER_STORIES.map((story) => (
          <ProofQuote key={story.id} story={story} layout="stack" />
        ))}
      </div>
    </Section>
  );
}
