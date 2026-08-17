import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { MetricStat } from '@/components/expertise';
import {
  CLOUD_MIGRATION_METRICS,
  CLOUD_MIGRATION_METRICS_CONTENT,
} from '@/constants/expertise/cloud-migration';

/** Small decorative cluster (buildings + a cloud badge) - a lighter echo of the hero's server/cloud illustration. */
function TrustedPartnerGlyph() {
  return (
    <div className="relative hidden h-[110px] w-[150px] shrink-0 items-end justify-center gap-2 lg:flex">
      <span className="h-[60px] w-9 rounded-t-[8px] bg-white shadow-[0_10px_20px_-8px_rgba(15,23,42,.18)]" />
      <span className="h-[84px] w-10 rounded-t-[8px] bg-white shadow-[0_10px_20px_-8px_rgba(15,23,42,.2)]" />
      <span className="h-[46px] w-9 rounded-t-[8px] bg-white shadow-[0_10px_20px_-8px_rgba(15,23,42,.16)]" />
      <span className="absolute -top-2 right-2 flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-white shadow-[0_10px_20px_-6px_rgba(37,99,235,.4)]">
        <Icon name="shield" size={18} />
      </span>
    </div>
  );
}

export function MetricsSection() {
  return (
    <Section>
      <div className="flex flex-col items-center gap-8 rounded-[10px] border border-line-soft bg-white p-8 sm:p-10 lg:flex-row lg:justify-between">
        <div className="flex-1">
          <SectionHeader
            label={CLOUD_MIGRATION_METRICS_CONTENT.label}
            className="max-w-[680px]"
            heading={
              <>
                {CLOUD_MIGRATION_METRICS_CONTENT.headingLead}
                <GradientText>{CLOUD_MIGRATION_METRICS_CONTENT.headingHighlight}</GradientText>
              </>
            }
            align="left"
          />
          <MetricStat
            items={CLOUD_MIGRATION_METRICS}
            wrapperClassName="mt-8"
            className="grid-cols-3 border-none"
          />
        </div>
        <TrustedPartnerGlyph />
      </div>
    </Section>
  );
}
