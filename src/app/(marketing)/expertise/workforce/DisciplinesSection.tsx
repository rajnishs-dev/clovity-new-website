import { cn } from '@/lib/cn';
import { reveal, revealAligned, revealAttrs } from '@/lib/reveal';
import {
  Chip,
  GradientText,
  Icon,
  Section,
  SectionHeader,
} from '@/components/ui';
import {
  WF_DISCIPLINES,
  WF_DISCIPLINES_CONTENT,
  WF_MODELS,
  WF_MODELS_LABEL,
} from '@/constants/workforce';

/**
 * "The Disciplines You Can Draw From" - the bench, then the engagement models.
 *
 * ── SIX ROWS IN ONE PANEL, NOT SIX CARDS ──
 * Same reasoning as the Managed Services bench roster, and the same shared shape: six
 * separate cards read as six services you select between, which is the opposite of the
 * claim. They arrive from one bench. What differs here is the ARRANGEMENT - three columns
 * of two rather than one column of six - because this list sits mid-page under a centred
 * header rather than beside a block of copy, and a single tall column there would leave
 * two thirds of the band empty.
 *
 * ── THE MODEL CHIPS ARE A FOOTER, NOT A SECTION ──
 * The comp gives "Delivery Models" a band of its own, centred, holding six tag chips and
 * nothing else. A whole band for six pills is thin, and it also separates the models from
 * the disciplines they apply to - so they run here as a labelled strip under the roster,
 * inside the same band. The heading count drops by one and the reader gets both halves of
 * one idea together.
 *
 * `Chip variant="cloud"` is the legacy `.tag-chip` the comp actually specifies, so the
 * treatment is the design's own rather than a new pill invented here.
 */
export function DisciplinesSection() {
  return (
    <Section
      padding="tight"
      className="border-b border-line-faint bg-[#eaf8ff]"
    >
      <SectionHeader
        heading={
          <>
            {WF_DISCIPLINES_CONTENT.headingLead}
            <GradientText>
              {WF_DISCIPLINES_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        subheading={WF_DISCIPLINES_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[720px] md:text-center"
      />

      {/* Chrome on the wrapper, not the `<dl>`: a `<dl>` may only contain dt/dd
          groups (optionally each wrapped in a `<div>`, the form used below), so the
          panel border has to live one level out. */}
      <div
        className={cn(
          'overflow-hidden rounded-[14px] border border-line-soft bg-white',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        <dl className="m-0 grid ml:grid-cols-3 to-900:grid-cols-1">
          {WF_DISCIPLINES.map((entry, index) => (
            <div
              key={entry.id}
              className={cn(
                'flex items-start gap-4 px-6 py-6',
                // A hairline above the second row at three columns, and above every
                // row but the first once the grid collapses to one.
                index > 2 && 'ml:border-t ml:border-line-soft',
                index > 0 && 'to-900:border-t to-900:border-line-soft',
                // Column rules between the three columns, dropped on the last of
                // each row so no border lands on the panel's own edge.
                index % 3 !== 2 && 'ml:border-r ml:border-line-soft',
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
      </div>

      <div
        className={cn('mt-10 text-center', reveal('up', 150), 'md:text-center')}
        {...revealAttrs()}
      >
        <p className="m-0 mb-5 text-[12px] font-800 uppercase tracking-[.14em] text-faint">
          {WF_MODELS_LABEL}
        </p>
        <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-3">
          {WF_MODELS.map((model) => (
            <li key={model.id}>
              <Chip
                variant="cloud"
                icon={<Icon name={model.icon} size={14} aria-hidden />}
              >
                {model.label}
              </Chip>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
