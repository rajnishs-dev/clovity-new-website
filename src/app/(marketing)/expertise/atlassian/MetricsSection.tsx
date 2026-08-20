import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { MetricStat } from '@/components/expertise';
import {
  ATLASSIAN_METRICS,
  ATLASSIAN_METRICS_CONTENT,
} from '@/constants/expertise/atlassian';

export function MetricsSection() {
  return (
    <Section className="bg-[#eaf8ff]">
      <SectionHeader
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {ATLASSIAN_METRICS_CONTENT.headingLead}
            <GradientText>
              {ATLASSIAN_METRICS_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
      />
      <MetricStat
        items={ATLASSIAN_METRICS}
        wrapperClassName="mt-10"
        // `StatBand`'s base layout is grid-cols-4; three items need
        // grid-cols-3 instead so there's no empty fourth cell. The
        // `to-900`/`to-520` collapse breakpoints stay untouched.
        className="grid-cols-3"
      />
    </Section>
  );
}
