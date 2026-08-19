import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { MetricStat } from '@/components/expertise';
import {
  MARKETPLACE_APPS_METRICS,
  MARKETPLACE_APPS_METRICS_CONTENT,
} from '@/constants/expertise/marketplace-apps';

export function MetricsSection() {
  return (
    <Section className="bg-white">
      <SectionHeader
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {MARKETPLACE_APPS_METRICS_CONTENT.headingLead}
            <GradientText>
              {MARKETPLACE_APPS_METRICS_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
      />
      <MetricStat
        items={MARKETPLACE_APPS_METRICS}
        wrapperClassName="mt-10"
        className="grid-cols-3"
      />
    </Section>
  );
}
