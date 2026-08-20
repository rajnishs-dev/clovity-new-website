import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { cn } from '@/lib/cn';
import { PULSE_AI_CAPABILITIES } from '@/constants/home';
import { CLOUD_MIGRATION_AI_CONTENT } from '@/constants/expertise/cloud-migration';

/** Shorter than the Atlassian page's AI section on purpose - a tie-in, not the flagship pitch. */
const RELEVANT_CAPABILITY_IDS = new Set([
  'project-health',
  'anomaly-detection',
]);

export function AiTieInSection() {
  const capabilities = PULSE_AI_CAPABILITIES.filter((c) =>
    RELEVANT_CAPABILITY_IDS.has(c.id),
  );

  return (
    <Section className="bg-[#eaf8ff]">
      <SectionHeader
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {CLOUD_MIGRATION_AI_CONTENT.headingLead}
            <GradientText>
              {CLOUD_MIGRATION_AI_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        subheading={CLOUD_MIGRATION_AI_CONTENT.subheading}
      />
      <div
        className={cn(
          'mt-8 flex flex-wrap justify-center gap-2.5',
          revealAligned('center'),
        )}
        {...revealAttrs()}
      >
        {capabilities.map((capability) => (
          <Chip
            key={capability.id}
            variant="a"
            icon={<Icon name={capability.icon} />}
          >
            {capability.label}
          </Chip>
        ))}
      </div>
    </Section>
  );
}
