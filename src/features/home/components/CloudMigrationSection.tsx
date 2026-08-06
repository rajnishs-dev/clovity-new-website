import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import type {
  MigrationBenefit,
  MigrationSource,
  ProcessStep,
} from '@/types/content';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';
import {
  GradientText,
  HEADING_CLASS,
  SUBHEADING_CLASS,
} from '@/components/ui/Typography';
import { MIGRATION_CONTENT } from '@/constants/home';

/**
 * Section 5 — "Data Center Is Ending. Your Momentum Isn't.", as Tailwind
 * utilities.
 *
 * The signature graphic is a three-column flow: source instance → four dashed
 * steps → Atlassian Cloud / AGC. The spine is an inline SVG with two stacked
 * paths — a static dotted track and a `#pulseGrad`-stroked segment whose
 * `stroke-dashoffset` runs on a loop (`animate-mf-line`). Both keep their exact
 * original `d` value; the curve was hand-tuned to land between the four step icons.
 *
 * Below 1020px the three columns become one, the spine is hidden (it would run
 * across nothing) and the steps wrap two-up — the legacy behaviour, kept.
 *
 * BACKGROUND — this used to composite a tinted data-centre photo. The original
 * dropped it: `.mig-sec` now paints only a soft three-stop gradient, and nothing in
 * the site references `data-center-bg` any more, so the photo is gone here too and
 * the asset is unused.
 *
 * The section also carries `bg-[#eaf8ff]` in the legacy markup. That sets only
 * `background-color`, which the opaque gradient covers completely — so it is a
 * no-op and is not reproduced. The gradient is the visible background.
 */

/** Tone classes for the destination benefit chips (legacy `.ic-*`). */
const TONE_CLASS: Record<string, string> = {
  'ic-blue': 'bg-[#d5e7ff] text-brand-600',
  'ic-vio': 'bg-[#dbe7ff] text-brand-700',
  'ic-org': 'bg-[#fdece1] text-orange',
  'ic-grn': 'bg-[#f0fdf4] text-brand-green',
};

const FLOW_PATH =
  'M10 24 C 95 4, 145 44, 230 24 S 375 4, 460 24 S 605 44, 690 24 S 800 4, 890 24';

export interface CloudMigrationSectionProps {
  sources: MigrationSource[];
  steps: ProcessStep[];
  benefits: MigrationBenefit[];
}

export function CloudMigrationSection({
  sources,
  steps,
  benefits,
}: CloudMigrationSectionProps) {
  return (
    <section
      id="cloud-migration"
      className="relative overflow-hidden bg-[#eaf8ff] py-16 sm:py-20"
    >
      <div className="relative z-10 mx-auto max-w-shell px-6">
        <div
          className={cn('mx-auto mb-6 max-w-[680px] text-center', reveal())}
          {...revealAttrs()}
        >
          <h2 className={HEADING_CLASS}>
            {MIGRATION_CONTENT.headingLead}
            <GradientText>{MIGRATION_CONTENT.headingHighlight}</GradientText>
          </h2>
          <p className={cn(SUBHEADING_CLASS, 'mt-3')}>
            {MIGRATION_CONTENT.subheading}
          </p>
        </div>

        <div
          className={cn(
            'relative mx-auto mb-[30px] grid max-w-flow grid-cols-[250px_1fr_250px] items-center gap-7',
            'to-1020:grid-cols-1 to-1020:gap-[26px]',
            reveal(),
          )}
          {...revealAttrs()}
        >
          {/* Source instance */}
          <div className="rounded-[10px] border border-line bg-white p-[22px] shadow-[0_14px_34px_-12px_rgba(15,23,42,.14)]">
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
              {sources.map((source) => (
                <li
                  key={source.id}
                  className="flex items-center gap-2.5 text-[13.5px] font-700 text-ink"
                >
                  {/*
                    No chip behind these — the glyph sits on the card in its
                    product's brand colour, and the background tint and radius are
                    deliberately gone.

                    The 22px BOX stays, though. It is not decoration: it is the
                    tallest thing in the row, so it sets the row height. Dropping it
                    let each row collapse to the 20.3px text line box and made the
                    section 9px shorter than the original.
                  */}
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

            {steps.map((step) => (
              <div
                key={step.id}
                className="relative z-[1] flex-1 px-1 text-center to-1020:flex-[0_0_45%]"
              >
                <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[50%] border border-[#dbe7ff] bg-white text-[24px] text-[#4f46e5] shadow-[0_4px_12px_rgba(37,99,235,.12)]">
                  {step.icon ? <Icon name={step.icon} /> : null}
                </span>
                <b className="mb-1 block text-[16px] font-800 text-ink">
                  {step.title}
                </b>
                <p className="m-0 text-[14px] leading-[1.5] text-muted">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          {/* Destination */}
          <div className="rounded-[10px] border border-[#dbe7ff] bg-[linear-gradient(180deg,#fff,#f5f9ff)] p-[22px] text-left shadow-[0_14px_34px_-12px_rgba(15,23,42,.14)]">
            {/*
              The head is a flex row — chip beside the title — because the original
              reuses `.mflow-src-head` here, the same wrapper the source card uses.

              THE TWO BOTTOM MARGINS ARE LOAD-BEARING, which is not obvious. They are
              left over from when this block stacked, and the instinct is to drop them
              as dead style in a centre-aligned flex row. A flex row does not ignore
              them: they are part of each item's margin box, so they enlarge the line's
              cross size. Together they make the head 56px instead of 42px. Removing
              them cost exactly 14px and left the section short on mobile.
            */}
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
              {benefits.map((benefit) => (
                <li
                  key={benefit.id}
                  className="flex items-center gap-2.5 text-[13.5px] font-700 text-[#334155]"
                >
                  <span
                    className={cn(
                      'm-0 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-lg text-[14px]',
                      TONE_CLASS[benefit.toneClass],
                    )}
                  >
                    <Icon name={benefit.icon} />
                  </span>{' '}
                  {benefit.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={cn('text-center', reveal())} {...revealAttrs()}>
          <SmartLink
            href={MIGRATION_CONTENT.ctaHref}
            className={buttonClass('primary')}
          >
            {MIGRATION_CONTENT.ctaLabel} <ArrowIcon />
          </SmartLink>
        </div>
      </div>
    </section>
  );
}
