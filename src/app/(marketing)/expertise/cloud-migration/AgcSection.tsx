'use client';

import { cn } from '@/lib/cn';
import { useAutoRotate } from '@/hooks/useAutoRotate';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { AGC_STEPS, MIGRATION_BENEFITS } from '@/constants/home';
import { ROUTES } from '@/constants/routes';
import { CLOUD_MIGRATION_AGC_CONTENT } from '@/constants/expertise/cloud-migration';

/**
 * A two-panel auto-rotating stack - same interaction as the home page's
 * `PublicSectorSection` (glass-morphism card, autoplay, hover-pause, arrow
 * nav) - contrasting the commercial-cloud path with the AGC path, rather
 * than a flat "AGC-only" block. Reuses the real `MIGRATION_BENEFITS` and
 * `AGC_STEPS` data; no new claims.
 */
const PANEL_COUNT = 2;
const PANEL_BASE =
  'relative rounded-[10px] p-6 !pt-10 [grid-area:1/1] [transition:transform_.6s_cubic-bezier(.22,.61,.36,1),opacity_.6s_ease,box-shadow_.6s_ease] to-640:px-5 to-640:py-6';

export function AgcSection() {
  const reducedMotion = useReducedMotion();
  const { index, next, previous, pause, resume } = useAutoRotate({
    count: PANEL_COUNT,
    intervalMs: 5000,
    enabled: !reducedMotion,
  });

  const stackClass = (panelIndex: number) => {
    if (reducedMotion) return '';
    return index === panelIndex
      ? 'z-[2] sm:translate-x-0 scale-100 opacity-100 pointer-events-auto'
      : 'z-[1] sm:-translate-x-[35px] scale-[.96] opacity-[.55] pointer-events-none';
  };

  return (
    <Section className="bg-soft">
      <SectionHeader
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {CLOUD_MIGRATION_AGC_CONTENT.headingLead}
            <GradientText>
              {CLOUD_MIGRATION_AGC_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        subheading={CLOUD_MIGRATION_AGC_CONTENT.subheading}
      />

      <div
        className="relative mt-10 grid"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div className="absolute right-[26px] top-3 z-[5] flex gap-4 text-ink">
          <button
            type="button"
            aria-label="Previous panel"
            onClick={previous}
            className="flex h-5 w-6 cursor-pointer items-center justify-center border-none bg-none p-0 text-[17px] text-inherit opacity-80 [transition:opacity_.2s,transform_.2s] hover:-translate-x-[3px] hover:opacity-100"
          >
            <Icon name="arrow-left" />
          </button>
          <button
            type="button"
            aria-label="Next panel"
            onClick={next}
            className="flex h-5 w-6 cursor-pointer items-center justify-center border-none bg-none p-0 text-[17px] text-inherit opacity-80 [transition:opacity_.2s,transform_.2s] hover:translate-x-[3px] hover:opacity-100"
          >
            <Icon name="arrow-right" />
          </button>
        </div>

        {/* Panel 1 - commercial cloud */}
        <div
          className={cn(
            PANEL_BASE,
            'border border-white/[.65] bg-white/[.82] shadow-panel backdrop-blur-[18px] backdrop-saturate-[160%]',
            stackClass(0),
          )}
        >
          <h3 className="mb-2.5 text-[19px] font-500 leading-[1.32] text-black">
            Commercial Cloud
          </h3>
          <p className="mb-[22px] text-[14px] leading-[1.65] text-black">
            Standard Atlassian Cloud - the right destination for most teams:
            faster releases, no infrastructure to patch, and every new Atlassian
            feature on day one.
          </p>
          <div className="grid grid-cols-3 gap-x-5 to-560:grid-cols-1 to-560:gap-y-4">
            {MIGRATION_BENEFITS.map((benefit) => (
              <div key={benefit.id} className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-blue-50 text-[16px] text-brand-600">
                  <Icon name={benefit.icon} />
                </span>
                <span className="text-[13.5px] font-700 text-black">
                  {benefit.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <ButtonLink
              href={ROUTES.discover.contact}
              variant="primary"
              size="sm"
              trailingIcon={<ArrowIcon />}
            >
              Start a Migration Assessment
            </ButtonLink>
          </div>
        </div>

        {/* Panel 2 - Atlassian Government Cloud */}
        <div
          className={cn(
            PANEL_BASE,
            'mt-[22px] border border-[#e8edf7] bg-white shadow-panel-plain',
            stackClass(1),
          )}
        >
          <h3 className="mb-2.5 text-[19px] font-500 leading-[1.32] text-black">
            Atlassian Government Cloud
          </h3>
          <p className="mb-[22px] text-[14px] leading-[1.65] text-black">
            AGC is Atlassian&rsquo;s{' '}
            <strong>FedRAMP Moderate authorized</strong> environment - Jira,
            Jira Service Management, and Confluence, managed for CUI and federal
            security standards, with{' '}
            <strong>FedRAMP High and IL5 on Atlassian&rsquo;s roadmap</strong>.
          </p>
          <div className="grid grid-cols-2 gap-x-[22px] gap-y-5 to-560:grid-cols-1">
            {AGC_STEPS.map((step) => (
              <div key={step.id} className="relative flex gap-3.5">
                <span className="relative z-[1] flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[50%] bg-brand-600 text-[12.5px] font-800 text-white">
                  {step.order}
                </span>
                <div>
                  <b className="mb-[3px] block text-[14.5px] font-800 text-black">
                    {step.title}
                  </b>
                  <p className="m-0 text-[13px] leading-[1.55] text-black">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <ButtonLink
              href={ROUTES.discover.contact}
              variant="secondary"
              size="sm"
              trailingIcon={<ArrowIcon />}
            >
              Start an AGC Readiness Assessment
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
