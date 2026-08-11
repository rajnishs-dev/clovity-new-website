import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { faqSchema } from '@/lib/schema';
import { GradientText, Icon, SectionHeader } from '@/components/ui';
import { JsonLd } from '@/components/common/JsonLd';
import { CAREERS_FAQ, CAREERS_FAQ_CONTENT } from '@/constants/careers';

/**
 * "Frequently Asked Questions" — five disclosures.
 *
 * NATIVE `<details>` / `<summary>`, not the shared `<Accordion>`. Three reasons, in
 * order of weight:
 *
 *  1. The design lets several answers be open at once. `Accordion` closes the others
 *     by default, and its `allowMultiple` variant still routes through React state.
 *  2. `<details>` needs no JavaScript at all, so this whole section stays a Server
 *     Component and works before hydration — on a page whose other interactive
 *     element (the roles filter) already ships a client bundle, that is worth keeping.
 *  3. `Accordion` renders a chevron that rotates 180°; this design uses a plus that
 *     rotates 45° into a cross and inverts its chip. Bending one into the other would
 *     leave two variants of the same component with nothing shared.
 *
 * The plus is `group-open:rotate-45` — Tailwind compiles that to `.group[open] &`,
 * which is exactly the `[open] .faq-ic` selector the stylesheet used.
 *
 * The marker is suppressed twice on purpose: `list-none` covers browsers honouring
 * `::marker`, and `[&::-webkit-details-marker]:hidden` covers Safari, which does not.
 * Dropping either leaves a stray triangle in one engine.
 *
 * FAQPage JSON-LD is emitted alongside. It is not in the published markup, but it is
 * what makes these five answers eligible as a rich result, and it cannot drift from
 * what is rendered because both read the same array.
 */
export function FaqSection() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <JsonLd schema={faqSchema(CAREERS_FAQ)} />

      <div className="mx-auto w-full max-w-[900px] px-6">
        <SectionHeader
          label={CAREERS_FAQ_CONTENT.label}
          labelClassName="mb-4"
          heading={
            <>
              {CAREERS_FAQ_CONTENT.headingLead}
              <GradientText>
                {CAREERS_FAQ_CONTENT.headingHighlight}
              </GradientText>
            </>
          }
          className="mx-auto mb-10 max-w-[600px] md:text-center"
        />

        <div className={revealAligned('left')} {...revealAttrs()}>
          {CAREERS_FAQ.map((entry) => (
            <details
              key={entry.id}
              className={cn(
                'group mb-3.5 rounded-2xl border border-line-soft px-4 py-1',
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
