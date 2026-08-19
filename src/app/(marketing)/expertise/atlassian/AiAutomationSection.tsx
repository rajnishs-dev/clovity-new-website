import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { CtaGroup } from '@/components/common/CTA';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { cn } from '@/lib/cn';
import { PULSE_AI_CAPABILITIES, PULSE_AI_CTAS } from '@/constants/home';
import { ATLASSIAN_AI_CONTENT } from '@/constants/expertise/atlassian';

/** Reuses the real Pulse AI content already published on the home page - not restated, imported. */
export function AiAutomationSection() {
  return (
    <Section id="ai-automation" className="bg-white">
      <SectionHeader
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {ATLASSIAN_AI_CONTENT.headingLead}
            <GradientText>{ATLASSIAN_AI_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={ATLASSIAN_AI_CONTENT.subheading}
      />
      <div
        className={cn(
          'mt-8 flex flex-wrap justify-center gap-2.5',
          revealAligned('center'),
        )}
        {...revealAttrs()}
      >
        {PULSE_AI_CAPABILITIES.map((capability) => (
          <Chip
            key={capability.id}
            variant="a"
            icon={<Icon name={capability.icon} />}
          >
            {capability.label}
          </Chip>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <CtaGroup ctas={PULSE_AI_CTAS} />
      </div>
    </Section>
  );
}
