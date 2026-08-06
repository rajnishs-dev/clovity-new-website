'use client';

import { cn } from '@/lib/cn';
import { useAutoRotate } from '@/hooks/useAutoRotate';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { FactItem, ProcessStep } from '@/types/content';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';
import {
  GradientText,
  HEADING_CLASS,
  SUBHEADING_CLASS,
} from '@/components/ui/Typography';
import { AGC_CONTENT, PUBLIC_SECTOR_CONTENT } from '@/constants/home';
import { publicSectorBg } from '@/constants/media';

/**
 * Section 2.5 — Public Sector + Atlassian Government Cloud, as Tailwind
 * utilities.
 *
 * Two panels share one grid cell (`[grid-area:1/1]`), so the stack is always as
 * tall as the taller card and the shorter one cannot make the section jump when it
 * rotates to the front. Autoplay is 5s, arrows jump and restart the timer, hover
 * pauses — all matching the original.
 *
 * Reduced motion drops the stacking transforms entirely, which is what the legacy
 * script did by bailing out before adding `.gcs-slider`: both panels then render in
 * normal flow, fully visible, with no rotation.
 *
 * The `nth-child` selectors the original used to strip dividers off the first row
 * (`.gfg-item:nth-child(-n+2)`) and to stop the last step's padding
 * (`.agc-step:nth-child(n+3)`) are now index checks. The data is mapped here, so
 * the index is already in hand — and unlike nth-child, it cannot be thrown off by
 * a wrapper element appearing later.
 *
 * The section background is set inline because the URL is a build-hashed asset
 * path, which no static Tailwind class can name. Size, position and repeat stay
 * utilities.
 *
 * Accessibility note — deliberately NOT adding `aria-hidden` to the panel behind.
 * The rotation is a visual affordance; hiding half the section's content from
 * screen readers to mirror a decorative z-order would remove real information.
 */
export interface PublicSectorSectionProps {
  facts: FactItem[];
  agcSteps: ProcessStep[];
}

const PANEL_COUNT = 2;

/** Shared shell for both stacked panels. */
const PANEL_BASE =
  'relative rounded-[10px] p-6 pt-8 [grid-area:1/1] [transition:transform_.6s_cubic-bezier(.22,.61,.36,1),opacity_.6s_ease,box-shadow_.6s_ease] to-640:px-5 to-640:py-6';

export function PublicSectorSection({
  facts,
  agcSteps,
}: PublicSectorSectionProps) {
  const reducedMotion = useReducedMotion();
  const { index, next, previous, pause, resume } = useAutoRotate({
    count: PANEL_COUNT,
    intervalMs: 5000,
    enabled: !reducedMotion,
  });

  /** Stacking classes only apply while the slider is actually running. */
  const stackClass = (panelIndex: number) => {
    if (reducedMotion) return '';
    return index === panelIndex
      ? 'z-[2] translate-x-0 scale-100 opacity-100 pointer-events-auto'
      : 'z-[1] -translate-x-[35px] scale-[.96] opacity-[.55] pointer-events-none';
  };

  return (
    <section
      id="public-sector"
      className="relative bg-cover bg-left bg-no-repeat"
      style={{ backgroundImage: `url(${publicSectorBg.src})` }}
    >
      <div className="relative z-10 mx-auto max-w-shell px-6 py-16 pl-0 sm:py-20 to-900:pl-6">
        <div className="flex justify-end to-900:justify-center">
          <div className="w-full max-w-[860px] flex-[0_1_860px] to-900:max-w-full">
            <div className="relative">
              <h2 className={HEADING_CLASS}>
                {PUBLIC_SECTOR_CONTENT.headingLead}
                <GradientText>
                  {PUBLIC_SECTOR_CONTENT.headingHighlight}
                </GradientText>
                {PUBLIC_SECTOR_CONTENT.headingAfterHighlight}
                <br /> {PUBLIC_SECTOR_CONTENT.headingSecondLine}
              </h2>
              <p className={cn(SUBHEADING_CLASS, 'mt-3')}>
                {PUBLIC_SECTOR_CONTENT.subheading}
              </p>

              <div
                className="relative grid pl-5 pt-2"
                onMouseEnter={pause}
                onMouseLeave={resume}
              >
                <div className="absolute right-[26px] top-12 z-[5] flex gap-4 text-ink">
                  <button
                    type="button"
                    aria-label="Previous slide"
                    onClick={previous}
                    className="flex h-5 w-6 cursor-pointer items-center justify-center border-none bg-none p-0 text-[17px] text-inherit opacity-80 [transition:opacity_.2s,transform_.2s] hover:-translate-x-[3px] hover:opacity-100"
                  >
                    <Icon name="arrow-left" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next slide"
                    onClick={next}
                    className="flex h-5 w-6 cursor-pointer items-center justify-center border-none bg-none p-0 text-[17px] text-inherit opacity-80 [transition:opacity_.2s,transform_.2s] hover:translate-x-[3px] hover:opacity-100"
                  >
                    <Icon name="arrow-right" />
                  </button>
                </div>

                {/* Panel 1 — federal practice + procurement facts */}
                <div
                  className={cn(
                    PANEL_BASE,
                    'mt-7 border border-white/[.65] bg-white/[.82] shadow-panel backdrop-blur-[18px] backdrop-saturate-[160%]',
                    stackClass(0),
                  )}
                >
                  <div>
                    <p className="mb-4 text-[16px] text-black">
                      Clovity runs a <strong>U.S.-led federal practice</strong>{' '}
                      - secure, audit-ready Atlassian for the{' '}
                      <strong>IRS</strong>, <strong>U.S. Coast Guard</strong>,
                      and state, county, and city agencies nationwide.
                    </p>

                    <div className="mt-1 grid grid-cols-2 gap-x-7 gap-y-[18px] to-640:grid-cols-1">
                      {facts.map((fact, factIndex) => (
                        <div
                          key={fact.id}
                          className={cn(
                            'border-t border-ink/10 pt-4',
                            // The first row has no divider above it.
                            factIndex < 2 && 'border-t-0 pt-0',
                            // Single column below 640px: only the very first item
                            // leads the list, so every other one regains its rule.
                            factIndex === 0
                              ? 'to-640:border-t-0 to-640:pt-0'
                              : 'to-640:border-t to-640:pt-4',
                          )}
                        >
                          <b className="mb-[5px] block text-[16px] font-800 leading-[1.3] text-black">
                            {fact.title}
                          </b>
                          <p className="m-0 text-[13.5px] leading-[1.55] text-black">
                            {fact.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-[18px]">
                    <SmartLink
                      href={PUBLIC_SECTOR_CONTENT.ctaHref}
                      className={buttonClass(
                        'primary',
                        'md',
                        'px-4 py-3 text-[13px]',
                      )}
                    >
                      {PUBLIC_SECTOR_CONTENT.ctaLabel} <ArrowIcon />
                    </SmartLink>
                  </div>
                </div>

                {/* Panel 2 — AGC readiness */}
                <div
                  className={cn(
                    PANEL_BASE,
                    'mt-[22px] border border-[#e8edf7] bg-white shadow-panel-plain',
                    stackClass(1),
                  )}
                >
                  <h3 className="mb-2.5 text-[19px] font-500 leading-[1.32] text-black">
                    {AGC_CONTENT.heading}
                  </h3>
                  <p className="mb-[22px] text-[14px] leading-[1.65] text-black">
                    AGC is Atlassian&rsquo;s{' '}
                    <strong>FedRAMP Moderate authorized</strong> environment
                    &mdash; Jira, Jira Service Management, and Confluence,
                    managed for CUI and federal security standards, with{' '}
                    <strong>
                      FedRAMP High and IL5 on Atlassian&rsquo;s roadmap
                    </strong>
                    . Clovity takes agencies from Data Center to AGC end to end.
                  </p>

                  <div className="grid grid-cols-2 gap-x-[22px] to-560:grid-cols-1">
                    {agcSteps.map((step, stepIndex) => (
                      <div
                        key={step.id}
                        className={cn(
                          'relative flex gap-3.5 pb-5',
                          // Bottom row needs no gap under it…
                          stepIndex >= 2 && 'pb-0',
                          // …but in one column only the final step is last.
                          stepIndex >= 2 && 'to-560:pb-5',
                          stepIndex === agcSteps.length - 1 && 'to-560:pb-0',
                        )}
                      >
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
                    <SmartLink
                      href={AGC_CONTENT.ctaHref}
                      className={buttonClass(
                        'secondary',
                        'md',
                        'px-[18px] py-3 text-[13px]',
                      )}
                    >
                      {AGC_CONTENT.ctaLabel} <ArrowIcon />
                    </SmartLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
