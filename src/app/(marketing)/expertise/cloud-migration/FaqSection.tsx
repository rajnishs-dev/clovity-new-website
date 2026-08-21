import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { faqSchema } from '@/lib/schema';
import { GradientText, Icon, SectionHeader } from '@/components/ui';
import { JsonLd } from '@/components/common/JsonLd';
import {
  CLOUD_MIGRATION_FAQ_CONTENT,
  CLOUD_MIGRATION_FAQS,
} from '@/constants/expertise/cloud-migration';

/**
 * "Before You Move Anything" - six disclosures, matching the Atlassian page's
 * "Before You Hand Over Your Instance" band.
 *
 * ── THIS REPLACED AN `<Accordion>`, AND THAT WAS THE POINT ──
 * Until now this was the only FAQ on the site built on the shared `<Accordion>` component.
 * Two things came with that: it emitted no `FAQPage` JSON-LD, so search engines could not
 * read it as an FAQ the way they can every sibling page's, and `<Accordion>` is a client
 * component, so this band shipped JavaScript to open a disclosure that `<details>` opens for
 * free. Both are gone.
 *
 * Native `<details>`/`<summary>`, so several answers may be open at once and the section
 * stays a Server Component. The marker is suppressed twice on purpose - `list-none` for
 * browsers that honour `::marker`, the webkit selector for Safari, which does not. Dropping
 * either leaves a stray triangle in one engine.
 *
 * ── WHITE, WHICH COSTS THE CARDS THEIR TONE CONTRAST ──
 * Kept in the same position as the accordion it replaced, mid-page between the AI tie-in and
 * the metrics band, so the page's alternation is untouched. Both neighbours are tinted, which
 * forces this band white - so the items read from their border and open shadow rather than
 * from a background change, exactly as on the Atlassian page.
 *
 * FAQPage JSON-LD is emitted from the same array that renders, so the structured data cannot
 * drift from the visible answers.
 */
export function FaqSection() {
  return (
    <section className="border-y border-line-faint bg-white py-12 sm:py-16">
      <JsonLd schema={faqSchema(CLOUD_MIGRATION_FAQS)} />

      <div className="mx-auto w-full max-w-[900px] px-6">
        <SectionHeader
          heading={
            <>
              {CLOUD_MIGRATION_FAQ_CONTENT.headingLead}
              <GradientText>
                {CLOUD_MIGRATION_FAQ_CONTENT.headingHighlight}
              </GradientText>
            </>
          }
          className="mx-auto mb-10 max-w-[640px] md:text-center"
        />

        <div className={revealAligned('left')} {...revealAttrs()}>
          {CLOUD_MIGRATION_FAQS.map((entry) => (
            <details
              key={entry.id}
              className={cn(
                'group mb-3.5 rounded-[10px] border border-line-soft bg-white px-4 py-1',
                '[transition:border-color_.2s,box-shadow_.2s]',
                'open:border-brand-200 open:shadow-[0_12px_30px_rgba(15,23,42,.06)]',
              )}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 text-base font-600 text-title [&::-webkit-details-marker]:hidden">
                {entry.question}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[12px] text-brand-600 transition-[transform,background-color,color] duration-[250ms] group-open:rotate-45 group-open:bg-brand-600 group-open:text-white">
                  <Icon name="plus" />
                </span>
              </summary>
              <p className="mb-4 mt-0 pr-11 text-[14.5px] leading-[1.7] text-body">
                {entry.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
