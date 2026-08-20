import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import {
  GradientText,
  Section,
  SectionHeader,
  SplitMedia,
  SplitMediaFrame,
} from '@/components/ui';
import {
  ITSM_GLOSSARY,
  ITSM_GLOSSARY_CONTENT,
  ITSM_GLOSSARY_IMAGE,
} from '@/constants/itsm';

/**
 * "ITSM, ITIL and ESM - What Each One Actually Means".
 *
 * Was a nested-band containment diagram on the left (ITSM applies ITIL, ESM
 * extends ITSM) paired with the definitions on the right. Now a photo on the
 * left via the shared `SplitMedia`/`SplitMediaFrame` - the same photo-beside-
 * copy treatment About's "Who We Are" and Careers' "Life at Clovity" use - and
 * the definitions unchanged on the right. The split is narrower on the media
 * side (`.75fr 1fr` rather than `SplitMedia`'s default even two columns)
 * because the photo is illustrative, not the content - the definitions are.
 *
 * Each entry's `scope` line (who it covers - e.g. "IT Ops · Service Desk ·
 * Engineering · Security") used to be the text that made the diagram's
 * nesting legible. With the diagram gone it is folded into the definition
 * list instead, as a small caption under each definition, so that detail
 * is not simply dropped.
 */
export function GlossarySection() {
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

      <SplitMedia
        className="md:grid-cols-[.75fr_1fr]"
        media={
          <SplitMediaFrame image={ITSM_GLOSSARY_IMAGE} revealFrom="left" />
        }
      >
        {/* Definitions, in reading order - a description list, since that is
            literally what this is, and `<dt>`/`<dd>` is what lets a screen reader
            announce each term with its own definition. */}
        <dl
          className={cn('m-0', revealAligned('left', 'right'))}
          {...revealAttrs()}
        >
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
                <span className="text-[12px] font-600 uppercase tracking-[.1em] text-black">
                  {entry.expansion}
                </span>
              </dt>
              <dd className="m-0 text-[15px] leading-[1.75] text-muted">
                {entry.definition}
              </dd>
              <p className="m-0 mt-2 text-[12.5px] font-600 leading-[1.45] text-faint">
                {entry.scope}
              </p>
            </div>
          ))}
        </dl>
      </SplitMedia>
    </Section>
  );
}
