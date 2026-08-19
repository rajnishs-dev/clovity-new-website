import { cn } from '@/lib/cn';
import { reveal, revealAligned, revealAttrs } from '@/lib/reveal';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';
import { GradientText, Section, SectionHeader } from '@/components/ui';
import {
  MS_BENCH_ROLES,
  MS_EMBEDDED_CONTENT,
} from '@/constants/managed-services';

/**
 * "One Hire Gets You One Person. This Gets You the Bench." - the embedded pod.
 *
 * This is the page's actual argument, so it is the only section built as a
 * left-copy/right-artifact split: the shape says "here is a claim, and here is the
 * thing that backs it" rather than the header-over-grid every other section uses.
 *
 * ── THE ARTIFACT IS A ROSTER, NOT A CARD GRID ──
 * Six disciplines as ROWS in one bordered panel, each a role and what it covers on
 * your instance. Six separate cards would read as six services you select from, which
 * is the opposite of the point - the whole claim is that they arrive together. One
 * panel with hairlines between rows makes them one object.
 *
 * The panel's footer states the thing a buyer immediately worries about: six
 * disciplines sounds like six people to chase. It is the last line for that reason.
 *
 * ── WHAT IS NOT HERE ──
 * No cost comparison. The competitor hook behind this section pairs the breadth claim
 * with "at a fraction of the cost of a full-time hire", and that half needs a real
 * number we do not have - see the note at the top of `constants/managed-services.ts`.
 * The breadth argument stands on its own and does not commit the company to a price.
 */
export function EmbeddedSection() {
  return (
    <Section padding="tight" className="bg-white">
      <div className="grid items-start gap-x-16 gap-y-10 ml:grid-cols-[minmax(0,420px)_1fr]">
        <div>
          <SectionHeader
            heading={
              <>
                {MS_EMBEDDED_CONTENT.headingLead}
                <GradientText>
                  {MS_EMBEDDED_CONTENT.headingHighlight}
                </GradientText>
              </>
            }
            subheading={MS_EMBEDDED_CONTENT.subheading}
            subheadingClassName="mt-4"
            align="left"
            className="mb-7"
          />

          <div
            className={cn(reveal('up', 150), 'md:text-left')}
            {...revealAttrs()}
          >
            <SmartLink
              href={MS_EMBEDDED_CONTENT.ctaHref}
              className={buttonClass('primary')}
            >
              {MS_EMBEDDED_CONTENT.ctaLabel} <ArrowIcon />
            </SmartLink>
          </div>
        </div>

        {/* The panel chrome lives on this wrapper, not on the `<dl>`, so the footer
            note can be a sibling of the list. A `<dl>` may only contain dt/dd groups
            (optionally each wrapped in a `<div>`, which is the form used below) - a
            stray `<p>` inside it is invalid, and the browser's recovery is to leave it
            in place while the document stops validating. */}
        <div
          className={cn(
            'overflow-hidden rounded-[14px] border border-line-soft bg-soft',
            revealAligned('left'),
          )}
          {...revealAttrs()}
        >
          <dl className="m-0">
            {MS_BENCH_ROLES.map((entry, index) => (
              <div
                key={entry.id}
                className={cn(
                  'flex items-start gap-4 px-6 py-5',
                  index > 0 && 'border-t border-line-soft',
                )}
              >
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line-soft bg-white shadow-[0_3px_10px_rgba(37,99,235,.10)]',
                    entry.iconChipClass,
                  )}
                >
                  <Icon name={entry.icon} size={19} />
                </span>

                <div className="min-w-0">
                  <dt className="text-[15.5px] font-600 leading-[1.35] tracking-[-.01em] text-title">
                    {entry.role}
                  </dt>
                  <dd className="m-0 mt-1 text-[13.5px] leading-[1.6] text-[#64748b]">
                    {entry.depth}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          <p className="m-0 flex items-center gap-2.5 border-t border-line-soft bg-white px-6 py-4 text-[13.5px] font-600 leading-[1.5] text-brand-700">
            <Icon
              name="circle-check"
              size={16}
              aria-hidden
              className="shrink-0"
            />
            {MS_EMBEDDED_CONTENT.note}
          </p>
        </div>
      </div>
    </Section>
  );
}
