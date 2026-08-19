import { cn } from '@/lib/cn';
import { reveal, revealAligned, revealAttrs } from '@/lib/reveal';
import {
  GradientText,
  Icon,
  Section,
  SectionHeader,
} from '@/components/ui';
import {
  ITSM_ESM_BENEFITS,
  ITSM_ESM_BENEFITS_CONTENT,
  ITSM_GLOSSARY,
  ITSM_GLOSSARY_CONTENT,
} from '@/constants/itsm';

/**
 * "ITSM, ITIL and ESM - What Each One Actually Means".
 *
 * NOT three cards. The whole point of this section is that the three terms are not
 * peers - ITIL is the framework, ITSM applies it to IT, ESM extends that to the rest
 * of the business - and three identical cards side by side say the opposite. So the
 * left column is a nested-band diagram where containment IS the explanation, and the
 * right column is a description list.
 *
 * The bands are plain nested divs, not SVG: they have to hold real text at every
 * width, and text inside a scaled SVG either overflows or shrinks illegibly. Nesting
 * order comes from `GlossaryEntry.nest` rather than the array's order, because the
 * definitions read ITSM-first while the diagram must draw ITIL innermost.
 *
 * Built by folding the sorted entries from the inside out, so the JSX depth is data
 * and adding a fourth term would not need a fourth hand-written wrapper.
 */

/**
 * Per-depth chrome. Index is `nest`, so index 0 is the innermost band.
 *
 * The innermost band uses `bg-grad-tint`, the theme token. It was written out
 * long-hand as `linear-gradient(135deg,#eff6ff,#fef1e8)` - byte-identical to the
 * token's own value, so the output is unchanged, but as an arbitrary value it read
 * as a one-off colour choice rather than the palette's blue-to-warm tint.
 */
const BAND_CLASS = [
  'rounded-[10px] border border-[#dbe7ff] bg-gradient-to-br from-blue-50 to-[#e8effe]',
  'rounded-[14px] border border-brand-200 bg-white',
  'rounded-[18px] border-2 border-dashed border-brand-200 bg-[#f5f9ff]',
] as const;

export function GlossarySection() {
  // Innermost first, so the reduce below wraps each band in the next one out.
  const nested = [...ITSM_GLOSSARY].sort((a, b) => a.nest - b.nest);

  const diagram = nested.reduce<React.ReactNode>(
    (inner, entry, depth) => (
      <div
        key={entry.id}
        className={cn(
          'p-4 sm:p-5',
          BAND_CLASS[depth] ?? BAND_CLASS[BAND_CLASS.length - 1],
        )}
      >
        <div className="mb-3 flex items-start gap-3">
          <span
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]',
              entry.iconChipClass,
            )}
          >
            <Icon name={entry.icon} size={28} />
          </span>
          <div className="min-w-0">
            <b className="block text-[15px] font-800 leading-[1.25] text-ink">
              {entry.term}
            </b>
            <span className="block text-[11.5px] font-600 uppercase tracking-[.08em] text-brand-600">
              {entry.expansion}
            </span>
          </div>
        </div>
        {/* The scope line is what makes the nesting legible - each band names who
            it covers, so "ESM contains ITSM" reads as a fact rather than decoration. */}
        <p className="m-0 mb-3 text-[12.5px] font-600 leading-[1.45] text-muted">
          {entry.scope}
        </p>
        {inner}
      </div>
    ),
    null,
  );

  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        heading={
          <>
            {ITSM_GLOSSARY_CONTENT.headingLead}
            <GradientText>
              {ITSM_GLOSSARY_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        subheading={ITSM_GLOSSARY_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[720px] md:text-center"
      />

      <div className="grid items-start gap-10 ml:grid-cols-[minmax(0,380px)_1fr] ml:gap-14">
        <div
          className={cn(reveal('left'), 'text-left md:text-left')}
          {...revealAttrs()}
        >
          {diagram}
        </div>

        {/* Definitions, in reading order - a description list, since that is
            literally what this is, and `<dt>`/`<dd>` is what lets a screen reader
            announce each term with its own definition. */}
        <dl className={cn('m-0', revealAligned('left', 'right'))} {...revealAttrs()}>
          {ITSM_GLOSSARY.map((entry, index) => (
            <div
              key={entry.id}
              className={cn(
                'py-5',
                // Hairlines between entries only - no rule above the first or
                // below the last, so the list does not read as a boxed table.
                index > 0 && 'border-t border-line-faint',
                index === 0 && 'pt-0',
              )}
            >
              <dt className="mb-2 flex items-baseline gap-3">
                <span className="text-[22px] font-500 leading-[1.15] tracking-[-.02em] text-title">
                  {entry.term}
                </span>
                <span className="text-[12px] font-600 uppercase tracking-[.1em] text-faint">
                  {entry.expansion}
                </span>
              </dt>
              <dd className="m-0 text-[15px] leading-[1.75] text-muted">
                {entry.definition}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* The "why extend it" panel. Two columns of checked items at desktop; one
          below 680px, where a two-up split leaves ~14 characters per line. */}
      <div
        className={cn(
          'mt-10 rounded-[10px] border border-[#dbe7ff] bg-[linear-gradient(180deg,#fff,#f5f9ff)] px-8 py-9 shadow-[0_14px_34px_-12px_rgba(15,23,42,.1)]',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-12">
          <div>
            <b className="block text-[20px] font-500 leading-[1.3] tracking-[-.01em] text-title">
              {ITSM_ESM_BENEFITS_CONTENT.title}
            </b>
            <p className="m-0 mt-3 text-[15px] leading-[1.7] text-muted">
              {ITSM_ESM_BENEFITS_CONTENT.description}
            </p>
          </div>

          <ul className="m-0 grid list-none gap-x-8 gap-y-3.5 to-680:grid-cols-1 sm:grid-cols-2">
            {ITSM_ESM_BENEFITS.map((benefit) => (
              <li
                key={benefit}
                className="flex items-start gap-2.5 text-[14.5px] font-500 leading-[1.55] text-[#334155]"
              >
                <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center text-brand-600">
                  <Icon name="circle-check" size={17} />
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
