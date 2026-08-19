import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/Link';
import { GradientText, Section, SectionHeader } from '@/components/ui';
import { WF_CONTRAST, WF_CONTRAST_CONTENT } from '@/constants/workforce';

/**
 * "Embedded Either Way. The Difference Is Who Owns the Platform."
 *
 * ── WHY THIS SECTION EXISTS AT ALL ──
 * Clovity's home page promises "Forward-Deployed Engineers. Embedded, Not On-Call.", and
 * both this page and `/expertise/managed-services` apply that promise to their own work.
 * Two pages making the same embedded claim is a positioning problem, not a copy problem,
 * and the fix is not to soften one of them - it is to name the thing that actually differs.
 * That is platform ownership: here the client keeps it, there we take it.
 *
 * So this section is a two-column contrast rather than a features list, and the OTHER
 * offer gets equal space and a working link to its page. A reader who belongs on Managed
 * Services should leave for it from here; a reader talked into the wrong engagement is a
 * refund, not a sale.
 *
 * ── THE `owns` FIELD IS THE HEADLINE OF EACH CARD ──
 * "You do" / "We do" is set at display size above the offer name, because that answer is
 * the whole discriminator and it fits in two words. Everything below it is elaboration.
 *
 * The current page's card is tinted and carries an `aria-current`-style "You are here"
 * marker; the other is plain white with an outbound link. Both keep the same internal
 * structure so the comparison reads across, and neither is stripped of detail to make the
 * other look better.
 */
export function ContrastSection() {
  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        heading={
          <>
            {WF_CONTRAST_CONTENT.headingLead}
            <GradientText>{WF_CONTRAST_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={WF_CONTRAST_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[760px] md:text-center"
      />

      <div
        className={cn(
          'grid gap-6 ml:grid-cols-2 to-900:grid-cols-1',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        {WF_CONTRAST.map((offer) => (
          <div
            key={offer.id}
            className={cn(
              'flex flex-col rounded-[14px] border px-7 py-7',
              offer.current
                ? 'border-brand-200 bg-brand-50/50 shadow-[0_18px_40px_-24px_rgba(37,99,235,.35)]'
                : 'border-line-soft bg-white',
            )}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                {/* The discriminator, set above the offer name because it IS the
                    answer the reader came for. */}
                <span className="mb-1 block text-[11.5px] font-800 uppercase tracking-[.12em] text-faint">
                  Who owns the platform
                </span>
                <b className="block text-[clamp(24px,2.6vw,30px)] font-500 leading-[1.1] tracking-[-.02em] text-title">
                  {offer.owns}
                </b>
              </div>

              <span
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line-soft bg-white shadow-[0_4px_12px_rgba(37,99,235,.10)]',
                  offer.iconChipClass,
                )}
              >
                <Icon name={offer.icon} size={22} />
              </span>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-2.5 border-t border-line-faint pt-4">
              <b className="text-[17px] font-600 tracking-[-.01em] text-title">
                {offer.title}
              </b>
              {offer.current ? (
                <span className="rounded-pill bg-brand-600 px-2.5 py-1 text-[11px] font-800 uppercase tracking-[.08em] text-white">
                  This page
                </span>
              ) : null}
            </div>

            <p className="m-0 mb-5 text-[14.5px] leading-[1.7] text-body">
              {offer.description}
            </p>

            <ul className="m-0 mb-6 flex list-none flex-col gap-2.5">
              {offer.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-2.5 text-[14px] leading-[1.6] text-muted"
                >
                  <Icon
                    name="circle-check"
                    size={16}
                    aria-hidden
                    className="mt-[3px] shrink-0 text-brand-600"
                  />
                  {point}
                </li>
              ))}
            </ul>

            {/* `mt-auto` pins this block to the bottom of the card, so both cards
                end level however long their bullet lists run. It does NOT align the
                two `chooseWhen` lines with each other - the Managed Services card
                carries an outbound link beneath its line and this one does not, so
                that line necessarily sits higher on the right. Reserving an empty
                link row here to force it would put a hole in the card to align two
                sentences nobody reads side by side. */}
            <div className="mt-auto">
              <p className="m-0 border-t border-line-faint pt-4 text-[14px] font-600 leading-[1.6] text-brand-700">
                {offer.chooseWhen}
              </p>

              {offer.href ? (
                <SmartLink
                  href={offer.href}
                  className="mt-3.5 inline-flex items-center gap-2 text-[14px] font-600 text-brand-600 no-underline transition-colors hover:text-brand-700 hover:underline"
                >
                  Go to {offer.title} <ArrowIcon />
                </SmartLink>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
