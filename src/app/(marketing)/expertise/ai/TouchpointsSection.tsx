import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/Link';
import { GradientText, Section, SectionHeader } from '@/components/ui';
import { AI_TOUCHPOINTS, AI_TOUCHPOINTS_CONTENT } from '@/constants/ai';

/**
 * "There Is No Standalone AI Engagement Here" - AI inside the other five practices.
 *
 * ── THIS IS THE ADAPTAVIST FRAMING, BUILT AS LINKS RATHER THAN CLAIMS ──
 * The argument is that AI runs through the work rather than being sold beside it, and the only
 * honest way to make that argument is to hand the reader the pages that actually deliver it.
 * So every row is a real internal link, which is why `AiTouchpoint.href` is a required field -
 * see the note on the type. A version of this section with no destinations would be a list of
 * adjectives about ourselves.
 *
 * It also does real work for the site: this is the one page that links to all five of its
 * siblings, which is exactly what a hub for a cross-cutting capability should do.
 *
 * ── WHOLE ROWS ARE THE LINK ──
 * Each row is a single `<a>` wrapping the practice name and the effect, not a name with a
 * trailing "learn more" - the entire row is the target a reader aims at, and a 40px-wide link
 * at the end of a wide row is a needlessly small hit area. The arrow is decorative and moves
 * on hover; it carries no separate href.
 *
 * `<ol>` rather than `<ul>`: the order is deliberate - ITSM and Cloud Migration first because
 * they are where AI has the most to do, Workforce last because it is what makes the rest stick.
 */
export function TouchpointsSection() {
  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        heading={
          <>
            {AI_TOUCHPOINTS_CONTENT.headingLead}
            <GradientText>
              {AI_TOUCHPOINTS_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        subheading={AI_TOUCHPOINTS_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[760px] md:text-center"
      />

      <ol
        className={cn(
          'm-0 list-none overflow-hidden rounded-[14px] border border-line-soft',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        {AI_TOUCHPOINTS.map((touchpoint, index) => (
          <li
            key={touchpoint.id}
            className={index > 0 ? 'border-t border-line-soft' : undefined}
          >
            <SmartLink
              href={touchpoint.href}
              className="group flex items-start gap-4 bg-white px-6 py-5 no-underline transition-colors duration-200 hover:bg-soft ml:items-center"
            >
              <span
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line-soft bg-white shadow-[0_3px_10px_rgba(37,99,235,.10)] transition-colors duration-200 group-hover:border-brand-200',
                  touchpoint.iconChipClass,
                )}
              >
                <Icon name={touchpoint.icon} size={19} />
              </span>

              <div className="min-w-0 flex-1 ml:grid ml:grid-cols-[minmax(0,230px)_1fr] ml:items-center ml:gap-6">
                <b className="block text-[15.5px] font-600 leading-[1.35] tracking-[-.01em] text-title transition-colors duration-200 group-hover:text-brand-700">
                  {touchpoint.practice}
                </b>
                <span className="mt-1 block text-[13.5px] leading-[1.6] text-[#64748b] ml:mt-0">
                  {touchpoint.effect}
                </span>
              </div>

              <span className="mt-1 shrink-0 text-brand-600 transition-transform duration-200 group-hover:translate-x-1 ml:mt-0">
                <ArrowIcon />
              </span>
            </SmartLink>
          </li>
        ))}
      </ol>
    </Section>
  );
}
