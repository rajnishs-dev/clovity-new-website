import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { faqSchema } from '@/lib/schema';
import { GradientText, Icon, SectionHeader } from '@/components/ui';
import { JsonLd } from '@/components/common/JsonLd';
import { AI_FAQ, AI_FAQ_CONTENT } from '@/constants/ai';

/**
 * "What a Security Reviewer Will Ask" - seven disclosures.
 *
 * Native `<details>`/`<summary>` rather than the shared `<Accordion>`, matching the ITSM,
 * Managed Services, Workforce and Careers FAQs: several answers may be open at once,
 * `<details>` needs no JS so the section stays a Server Component, and the plus-to-cross
 * rotation does not map onto `Accordion`'s chevron.
 *
 * The marker is suppressed twice on purpose - `list-none` for browsers that honour `::marker`,
 * the webkit selector for Safari, which does not. Dropping either leaves a stray triangle in
 * one engine.
 *
 * ── THE HEADING NAMES THE AUDIENCE, BECAUSE IT DECIDES THE DEAL ──
 * On every other expertise page the FAQ handles a buyer's objections. On an AI page the
 * blocking reader is the security or data-privacy reviewer, and three of these answers exist to
 * be forwarded to one: where the data goes, which model runs, and what happens when it is wrong.
 * Each deliberately refuses to answer generally and points at a written answer instead - see the
 * note on model names and hosting claims at the top of `constants/ai.ts`.
 *
 * FAQPage JSON-LD is emitted from the same array that renders, so the structured data cannot
 * drift from the visible answers. That matters more here than anywhere: a stale data-handling
 * answer surfacing in a search result is a claim we did not make about a topic we cannot afford
 * to be wrong on.
 */
/*
 * ── `bg-white`, WHERE THE OTHER FAQs ARE `bg-[#eaf8ff]` ──
 * The ITSM, Managed Services and Workforce FAQs sit on `bg-[#eaf8ff]`. This one is white so the
 * page's run alternates - see the background note in `page.tsx`. The cost is that the
 * accordion items are white cards on a white band, so they read from their border and their
 * open shadow rather than from a tone change.
 *
 * NOTE the class list below is a plain string, not `cn()`. Two competing `bg-*` utilities
 * here would NOT be merged by tailwind-merge: both would land in the attribute and the winner
 * would be decided by their order in the generated stylesheet, which this file does not
 * control. Keep exactly one background class.
 */
export function FaqSection() {
  return (
    <section className="border-t border-line-faint bg-[#eaf8ff] py-12 sm:py-16">
      <JsonLd schema={faqSchema(AI_FAQ)} />

      <div className="mx-auto w-full max-w-[900px] px-6">
        <SectionHeader
          heading={
            <>
              {AI_FAQ_CONTENT.headingLead}
              <GradientText>{AI_FAQ_CONTENT.headingHighlight}</GradientText>
            </>
          }
          className="mx-auto mb-10 max-w-[640px] md:text-center"
        />

        <div className={revealAligned('left')} {...revealAttrs()}>
          {AI_FAQ.map((entry) => (
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
