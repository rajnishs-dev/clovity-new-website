import { cn } from '@/lib/cn';
import { reveal, revealAligned, revealAttrs } from '@/lib/reveal';
import { GradientText, Icon, Section, SectionHeader } from '@/components/ui';
import { WF_SOURCING, WF_SOURCING_CONTENT } from '@/constants/workforce';

/**
 * "You Have Three Ways to Close a Skill Gap" - the sourcing comparison.
 *
 * ── WHY A COMPARISON AND NOT A PROBLEM GRID ──
 * The comp opens with a dark panel reading "Traditional hiring 8-12 weeks" against
 * "Clovity Workforce Solutions 2-3 weeks". Those week counts have no source (see the note
 * in `constants/workforce.ts`), and dropping them would leave a two-row panel making no
 * argument. So the speed claim is made structurally instead: three routes, each stating
 * what it is good for AND what it costs, which is the same point without a number nobody
 * can stand behind.
 *
 * ── EVERY COLUMN CARRIES A TRADE-OFF, INCLUDING OURS ──
 * `SourcingOption.tradeoff` is a required field for that reason - a comparison where only
 * the recommended column has no downside reads as an advert, and a reader who has hired
 * before stops trusting the rest of the page. The emphasised column is tinted, never
 * exempted.
 *
 * The two halves of each card are a `<dl>`, so "Where it wins" / "What it costs" are real
 * labels a screen reader announces with their values rather than colour-coded prose. The
 * plus and minus glyphs are `aria-hidden`; the `<dt>` text carries the meaning.
 */
export function SourcingSection() {
  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        heading={
          <>
            {WF_SOURCING_CONTENT.headingLead}
            <GradientText>{WF_SOURCING_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={WF_SOURCING_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[730px] md:text-center"
      />

      <ul
        className={cn(
          'm-0 grid list-none gap-6 ml:grid-cols-3 to-900:grid-cols-1',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        {WF_SOURCING.map((option) => (
          <li
            key={option.id}
            className={cn(
              'flex flex-col overflow-hidden rounded-[14px] border bg-white',
              '[transition:border-color_.3s_ease,box-shadow_.3s_ease]',
              option.emphasis
                ? 'border-brand-200 shadow-[0_18px_40px_-24px_rgba(37,99,235,.35)]'
                : 'border-line-soft',
            )}
          >
            <div
              className={cn(
                'flex items-start gap-3.5 px-6 pb-5 pt-6',
                option.emphasis && 'bg-brand-50/60',
              )}
            >
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line-soft bg-white shadow-[0_4px_12px_rgba(37,99,235,.10)]',
                  option.iconChipClass,
                )}
              >
                <Icon name={option.icon} size={21} />
              </span>
              <b className="pt-1 text-[17px] font-500 leading-[1.3] tracking-[-.01em] text-title">
                {option.route}
              </b>
            </div>

            <dl className="m-0 flex flex-1 flex-col gap-4 border-t border-line-faint px-6 py-5">
              <div>
                <dt className="mb-1.5 flex items-center gap-2 text-[11.5px] font-800 uppercase tracking-[.12em] text-[#16a34a]">
                  <Icon name="plus" aria-hidden className="text-[10px]" />
                  Where it wins
                </dt>
                <dd className="m-0 text-[14px] leading-[1.65] text-body">
                  {option.strength}
                </dd>
              </div>

              <div>
                <dt className="mb-1.5 flex items-center gap-2 text-[11.5px] font-800 uppercase tracking-[.12em] text-accent-600">
                  {/* No 'minus' glyph in the registry - `close` is the honest
                      substitute and reads as a cost, not as a rating. */}
                  <Icon name="close" aria-hidden className="text-[10px]" />
                  What it costs
                </dt>
                <dd className="m-0 text-[14px] leading-[1.65] text-body">
                  {option.tradeoff}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>

      <p
        className={cn(
          'm-0 mx-auto mt-8 flex max-w-[640px] items-center justify-center gap-2.5 text-center text-[13.5px] font-600 leading-[1.55] text-brand-700',
          reveal('up', 150),
          'md:text-center',
        )}
        {...revealAttrs()}
      >
        <Icon name="circle-check" size={16} aria-hidden className="shrink-0" />
        {WF_SOURCING_CONTENT.note}
      </p>
    </Section>
  );
}
