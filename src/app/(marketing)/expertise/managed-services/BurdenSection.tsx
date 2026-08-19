import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import {
  GradientText,
  Icon,
  PillarGrid,
  Section,
  SectionHeader,
} from '@/components/ui';
import {
  MS_BURDEN_CARDS,
  MS_BURDEN_CONTENT,
  MS_SHIFTS,
} from '@/constants/managed-services';

/**
 * "Nobody Was Hired to Administer Jira" - the problem, then the shift.
 *
 * Two halves in one section rather than two sections. The three cards state what goes
 * wrong when platform ownership is a side job; the strip underneath states what
 * changes when it is not. Split across two bands they would read as two arguments;
 * together they read as one, which is what they are.
 *
 * ── THE SHIFT STRIP ──
 * Three before/after rows from Clovity's own published page. Rendered as
 * `before → after` on one line rather than as a two-column table: at three rows a
 * table needs headers to explain itself, and "Reactive → Proactive" needs no header.
 *
 * The arrow is an `<Icon>`, not a literal "→" character. Space Grotesk has the glyph,
 * but it sits on the text baseline and reads as punctuation between two words rather
 * than as a transition between two states.
 *
 * `aria-hidden` on the arrow, with the relationship carried by real text in an
 * `sr-only` span instead: a screen reader announcing "Reactive right-arrow Proactive"
 * is worse than one announcing "Reactive, becomes, Proactive".
 */
export function BurdenSection() {
  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        heading={
          <>
            {MS_BURDEN_CONTENT.headingLead}
            <GradientText>{MS_BURDEN_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={MS_BURDEN_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[720px] md:text-center"
      />

      <PillarGrid cards={MS_BURDEN_CARDS} />

      <dl
        className={cn(
          'm-0 mt-11 grid gap-x-8 gap-y-6 rounded-[14px] border border-line-soft bg-soft px-7 py-7 ml:grid-cols-3',
          reveal('up', 150),
          'md:text-left',
        )}
        {...revealAttrs()}
      >
        {MS_SHIFTS.map((shift) => (
          <div key={shift.id}>
            <dt className="mb-2.5 text-[11.5px] font-800 uppercase tracking-[.12em] text-faint">
              {shift.aspect}
            </dt>
            <dd className="m-0 flex items-center gap-3">
              <span className="text-[16px] font-500 text-[#94a3b8] line-through decoration-[#cbd5e1]">
                {shift.before}
              </span>
              <Icon
                name="arrow-right"
                aria-hidden
                className="shrink-0 text-[12px] text-brand-500"
              />
              <span className="sr-only">becomes</span>
              <b className="text-[17px] font-600 tracking-[-.01em] text-title">
                {shift.after}
              </b>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
