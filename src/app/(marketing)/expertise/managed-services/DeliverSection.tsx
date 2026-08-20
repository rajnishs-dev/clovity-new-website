import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { GradientText, Icon, Section, SectionHeader } from '@/components/ui';
import { MS_DELIVER_CONTENT, MS_OFFERINGS } from '@/constants/managed-services';

/**
 * "Complete Atlassian Platform Support" - the six ongoing capability areas.
 *
 * A two-column list separated by hairlines, the same treatment as the DevSecOps
 * delivery section, NOT the tilted card rail the ITSM page uses. The rail is right
 * where the six items are engagements a buyer picks between; these six are areas of
 * continuous work that run together, and putting them on cards you flip through would
 * imply you choose among them.
 *
 * The column rule is a border on the odd-indexed items at `ml` and up rather than a
 * pseudo-element on the grid, so it disappears by itself when the layout collapses to
 * one column - no breakpoint to keep in sync.
 */
export function DeliverSection() {
  return (
    <Section
      padding="tight"
      className="border-y border-line-faint bg-[#eaf8ff]"
    >
      <SectionHeader
        heading={
          <>
            {MS_DELIVER_CONTENT.headingLead}
            <GradientText>{MS_DELIVER_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={MS_DELIVER_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[730px] md:text-center"
      />

      <ol
        className={cn(
          'm-0 grid list-none gap-x-14 ml:grid-cols-2',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        {MS_OFFERINGS.map((offering, index) => (
          <li
            key={offering.id}
            className={cn(
              'group py-7',
              // Hairline above every block except the first of each column. With
              // three rows of two that means indices 0 and 1 at desktop, and index 0
              // alone once the grid collapses.
              index > 1 && 'border-t border-line',
              index === 1 && 'border-t border-line ml:border-t-0',
            )}
          >
            <div className="mb-3 flex items-center gap-3.5">
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line-soft bg-white shadow-[0_4px_12px_rgba(37,99,235,.10)] transition-colors duration-200 group-hover:border-brand-200',
                  offering.iconChipClass,
                )}
              >
                <Icon name={offering.icon} size={21} />
              </span>
              <b className="text-[18px] font-500 leading-[1.25] tracking-[-.01em] text-title">
                {offering.title}
              </b>
            </div>

            <p className="m-0 mb-4 text-[14.5px] leading-[1.7] text-body">
              {offering.description}
            </p>

            <ul className="m-0 flex list-none flex-wrap gap-2">
              {offering.points.map((point) => (
                <li
                  key={point}
                  className="rounded-pill border border-line-soft bg-white px-3 py-1.5 text-[12.5px] font-600 text-muted transition-colors duration-200 group-hover:border-brand-200"
                >
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
