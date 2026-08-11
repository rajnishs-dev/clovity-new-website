import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { ABOUT_MISSION_QUOTE } from '@/constants/about';

/**
 * The mission statement, in `theme.css`'s `.quote-band`.
 *
 * A 900px track — narrower than the site's 1280px shell — because a single sentence
 * set at up to 28px needs a shorter measure to stay readable.
 *
 * The opening quotation mark is a real character in a `<span>`, not a `::before`:
 * the published markup writes `&ldquo;` into the DOM, and it is styled at 56px in
 * Georgia, a serif, which is the only place on the site that departs from the two
 * brand faces. That is deliberate — a serif quote mark reads as a quote mark; the
 * geometric sans version reads as stray punctuation.
 *
 * `aria-hidden` on it, though: a screen reader announcing "left double quotation
 * mark" before the sentence is noise, and the `<blockquote>` already conveys that
 * this is a quotation.
 */
export function MissionSection() {
  return (
    <section className="bg-white pb-16 pt-4 sm:pb-20 sm:pt-8">
      <div className="mx-auto w-full max-w-[900px] px-6">
        <blockquote
          className={cn(
            'relative overflow-hidden rounded-[28px] border border-[#e0e7ff] bg-[linear-gradient(135deg,#eff6ff,#fef1e8)] p-14 text-center',
            revealAligned('center'),
          )}
          {...revealAttrs()}
        >
          <span
            aria-hidden
            className="mb-2 block font-[Georgia,serif] text-[56px] font-900 leading-none text-brand-200"
          >
            &ldquo;
          </span>
          <p className="m-0 text-[clamp(20px,2.4vw,28px)] font-500 leading-[1.5] tracking-[-.01em] text-title">
            {ABOUT_MISSION_QUOTE}
          </p>
        </blockquote>
      </div>
    </section>
  );
}
