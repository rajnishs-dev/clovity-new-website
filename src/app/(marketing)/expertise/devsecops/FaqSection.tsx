import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { faqSchema } from '@/lib/schema';
import { GradientText, Icon, SectionHeader } from '@/components/ui';
import { JsonLd } from '@/components/common/JsonLd';
import { DEVSECOPS_FAQ, DEVSECOPS_FAQ_CONTENT } from '@/constants/devsecops';

/**
 * "The Ones We Always Get Asked" - seven disclosures.
 *
 * Native `<details>`/`<summary>`, matching the Careers and ITSM FAQs: several answers
 * may be open at once, `<details>` needs no JS so the section stays a Server
 * Component, and the plus-to-cross rotation does not map onto `Accordion`'s chevron.
 *
 * The marker is suppressed twice on purpose - `list-none` for browsers that honour
 * `::marker`, the webkit selector for Safari, which does not.
 *
 * Sits on `bg-[#eaf8ff]` rather than white so it separates from the white section above
 * it; the ITSM FAQ is white because the section above THAT one is tinted. Same
 * component, opposite tone, for the same reason.
 *
 * FAQPage JSON-LD comes from the same array that renders, so the structured data
 * cannot drift from the visible answers.
 */
export function FaqSection() {
  return (
    <section className="border-y border-line-faint bg-white py-12 sm:py-16">
      <JsonLd schema={faqSchema(DEVSECOPS_FAQ)} />

      <div className="mx-auto w-full max-w-[900px] px-6">
        <SectionHeader
          heading={
            <>
              {DEVSECOPS_FAQ_CONTENT.headingLead}
              <GradientText>
                {DEVSECOPS_FAQ_CONTENT.headingHighlight}
              </GradientText>
            </>
          }
          className="mx-auto mb-10 max-w-[600px] md:text-center"
        />

        <div className={revealAligned('left')} {...revealAttrs()}>
          {DEVSECOPS_FAQ.map((entry) => (
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
