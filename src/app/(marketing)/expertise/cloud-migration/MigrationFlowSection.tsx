import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { revealAttrs, reveal } from '@/lib/reveal';
import { cn } from '@/lib/cn';
import {
  MIGRATION_BENEFITS,
  MIGRATION_CONTENT,
  MIGRATION_SOURCES,
  MIGRATION_STEPS,
} from '@/constants/home';
import { CLOUD_MIGRATION_FLOW_CONTENT } from '@/constants/expertise/cloud-migration';

/**
 * The source → animated path → destination flow, adapted from the home
 * page's `CloudMigrationSection` (same real `MIGRATION_SOURCES` /
 * `MIGRATION_STEPS` / `MIGRATION_BENEFITS` data, same visual treatment) -
 * this page's dedicated "delivery approach" section, rather than the generic
 * `ProcessTimeline` the Atlassian page uses, since a distinct real
 * methodology already exists for migration specifically.
 */
const TONE_CLASS: Record<string, string> = {
  'ic-blue': 'text-brand-600',
  'ic-vio': 'text-brand-700',
  'ic-org': 'text-orange',
  'ic-grn': 'text-brand-green',
};

const FLOW_PATH =
  'M10 24 C 95 4, 145 44, 230 24 S 375 4, 460 24 S 605 44, 690 24 S 800 4, 890 24';

export function MigrationFlowSection() {
  return (
    <Section>
      {/* `pulseGrad` def for the animated stroke below - the home page's own
          copy (`SvgGradientDefs`) lives in that page's private folder, so
          this section carries its own rather than reaching across pages. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <linearGradient id="pulseGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="60%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#f2642a" />
          </linearGradient>
        </defs>
      </svg>

      <SectionHeader
        label={CLOUD_MIGRATION_FLOW_CONTENT.label}
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {CLOUD_MIGRATION_FLOW_CONTENT.headingLead}
            <GradientText>{CLOUD_MIGRATION_FLOW_CONTENT.headingHighlight}</GradientText>
          </>
        }
      />

      <div
        className={cn(
          'relative mx-auto mt-12 grid max-w-flow grid-cols-[250px_1fr_250px] items-center gap-7',
          'to-1020:grid-cols-1 to-1020:gap-[26px]',
          reveal(),
        )}
        {...revealAttrs()}
      >
        {/* Source instance */}
        <div className="rounded-[10px] border border-line bg-white p-[22px] shadow-[0_14px_34px_-12px_rgba(15,23,42,.14)] to-1020:mx-auto to-1020:w-full to-1020:max-w-[420px]">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-blue-50 text-[20px] text-brand-600">
              <Icon name="server" />
            </span>
            <div>
              <b className="block text-[14.5px] font-800 leading-[1.3] text-ink">
                {MIGRATION_CONTENT.sourceCardTitle}
              </b>
              <small className="text-[12.5px] font-600 text-muted">
                {MIGRATION_CONTENT.sourceCardSubtitle}
              </small>
            </div>
          </div>
          <ul className="m-0 flex list-none flex-col gap-2 border-t border-dashed border-line pt-3">
            {MIGRATION_SOURCES.map((source) => (
              <li
                key={source.id}
                className="flex items-center gap-2.5 text-[13.5px] font-700 text-ink"
              >
                <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center">
                  <Icon name={source.icon} size={18} style={source.iconStyle} />
                </span>{' '}
                {source.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Four-step dashed path */}
        <div className="relative flex justify-between px-1 to-1020:flex-wrap to-1020:justify-center to-1020:gap-5">
          <svg
            viewBox="0 0 900 48"
            preserveAspectRatio="none"
            aria-hidden
            className="absolute left-0 top-0 z-0 h-12 w-full overflow-visible to-1020:hidden"
          >
            <path
              d={FLOW_PATH}
              fill="none"
              stroke="#d3e0fa"
              strokeWidth="2.2"
              strokeDasharray="6 8"
              strokeLinecap="round"
            />
            <path
              d={FLOW_PATH}
              fill="none"
              stroke="url(#pulseGrad)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeDasharray="46 1000"
              className="animate-mf-line [stroke-dashoffset:46] motion-reduce:animate-none"
            />
          </svg>

          {MIGRATION_STEPS.map((step) => (
            <div
              key={step.id}
              className="relative z-[1] flex-1 px-1 text-center to-1020:flex-[0_0_45%]"
            >
              <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[50%] border border-[#dbe7ff] bg-white text-[24px] text-[#4f46e5] shadow-[0_4px_12px_rgba(37,99,235,.12)]">
                {step.icon ? <Icon name={step.icon} /> : null}
              </span>
              <b className="mb-1 block text-[16px] font-800 text-ink">{step.title}</b>
              <p className="m-0 text-[14px] leading-[1.5] text-muted">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Destination */}
        <div className="rounded-[10px] border border-[#dbe7ff] bg-[linear-gradient(180deg,#fff,#f5f9ff)] p-[22px] text-left shadow-[0_14px_34px_-12px_rgba(15,23,42,.14)] to-1020:mx-auto to-1020:w-full to-1020:max-w-[420px]">
          <div className="mb-3.5 flex items-center gap-3">
            <span className="mb-3.5 flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[14px] bg-grad-brand-orange text-[22px] text-white shadow-[0_8px_18px_rgba(37,99,235,.32)]">
              <Icon name="cloud" />
            </span>
            <div>
              <b className="mb-[3px] block bg-grad-text bg-clip-text text-[13.5px] font-800 text-transparent">
                {MIGRATION_CONTENT.destinationTitle}
              </b>
              <small className="mb-4 block text-[12.5px] font-600 text-muted">
                {MIGRATION_CONTENT.destinationSubtitle}
              </small>
            </div>
          </div>
          <ul className="m-0 flex list-none flex-col gap-2.5 border-t border-line-faint pt-3.5">
            {MIGRATION_BENEFITS.map((benefit) => (
              <li
                key={benefit.id}
                className="flex items-center gap-2.5 text-[13.5px] font-700 text-[#334155]"
              >
                <span
                  className={cn(
                    'flex h-[22px] w-[22px] shrink-0 items-center justify-center',
                    TONE_CLASS[benefit.toneClass],
                  )}
                >
                  <Icon name={benefit.icon} size={18} />
                </span>{' '}
                {benefit.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
