import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { faqSchema } from '@/lib/schema';
import { GradientText, Icon, SectionHeader } from '@/components/ui';
import { JsonLd } from '@/components/common/JsonLd';
import { WF_FAQ, WF_FAQ_CONTENT } from '@/constants/workforce';

/**
 * "Before You Add Someone to Your Standup" - seven disclosures.
 *
 * Native `<details>`/`<summary>` rather than the shared `<Accordion>`, matching the ITSM,
 * Managed Services and Careers FAQs: several answers may be open at once, `<details>` needs
 * no JS so the section stays a Server Component, and the plus-to-cross rotation does not map
 * onto `Accordion`'s chevron.
 *
 * The marker is suppressed twice on purpose - `list-none` for browsers that honour
 * `::marker`, the webkit selector for Safari, which does not. Dropping either leaves a stray
 * triangle in one engine.
 *
 * FAQPage JSON-LD is emitted from the same array that renders, so the structured data cannot
 * drift from the visible answers. That matters more than usual here: three of these answers
 * are the page's position on what it will NOT promise - turnaround times, diversity-program
 * eligibility and contract vehicles - and a stale copy of any of them in a search result
 * would be worse than none.
 */
export function FaqSection() {
  return (
    <section className="border-t border-line-faint bg-soft py-12 sm:py-16">
      <JsonLd schema={faqSchema(WF_FAQ)} />

      <div className="mx-auto w-full max-w-[900px] px-6">
        <SectionHeader
          heading={
            <>
              {WF_FAQ_CONTENT.headingLead}
              <GradientText>{WF_FAQ_CONTENT.headingHighlight}</GradientText>
            </>
          }
          className="mx-auto mb-10 max-w-[640px] md:text-center"
        />

        <div className={revealAligned('left')} {...revealAttrs()}>
          {WF_FAQ.map((entry) => (
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
