import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { GradientText, Icon, Section, SectionHeader } from '@/components/ui';
import {
  DEVSECOPS_DELIVER_CONTENT,
  DEVSECOPS_OFFERINGS,
} from '@/constants/devsecops';

/**
 * "Six Pieces of a Secure Delivery Practice".
 *
 * Borderless blocks in two columns with a single rule between them - no card
 * chrome at all. Deliberately different from the ITSM page's offering section
 * (full-width rows inside one bordered panel): two service pages that render their
 * core offering list identically read as one template filled in twice.
 *
 * The deliverables are CHIPS here rather than a checked list, for the same reason -
 * and because three short chips wrap to one or two lines inside a half-width
 * column, where checked rows would each take a full line and double the block's
 * height.
 *
 * The column rule is a border on the second column at `ml` and up, not a
 * pseudo-element on the grid: it then stops automatically when the layout collapses
 * to one column, with no breakpoint to keep in sync.
 */
export function DeliverSection() {
  return (
    <Section padding="tight" className="border-y border-line-faint bg-white">
      <SectionHeader
        heading={
          <>
            {DEVSECOPS_DELIVER_CONTENT.headingLead}
            <GradientText>
              {DEVSECOPS_DELIVER_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        subheading={DEVSECOPS_DELIVER_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[720px] md:text-center"
      />

      <ol
        className={cn(
          'm-0 grid list-none gap-x-14 ml:grid-cols-2',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        {DEVSECOPS_OFFERINGS.map((offering, index) => (
          <li
            key={offering.id}
            className={cn(
              'group py-7',
              // Hairline above every block except the first of each column. With
              // three rows of two, that means indices 0 and 1 at desktop and index
              // 0 alone once the grid collapses.
              index > 1 && 'border-t border-line',
              index === 1 && 'border-t border-line ml:border-t-0',
              // The column rule. Sits on the right-hand column so it disappears
              // with the second column itself.
              index % 2 === 1 && 'ml:border-l ml:border-line ml:pl-14',
            )}
          >
            <div className="mb-3 flex items-center gap-3">
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center',
                  offering.iconChipClass,
                )}
              >
                <Icon name={offering.icon} size={30} />
              </span>
              <span
                aria-hidden
                className="select-none font-display text-[15px] font-800 tracking-[.08em] text-faint transition-colors duration-200 group-hover:text-brand-600"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <b className="mb-2 block text-[19px] font-500 leading-[1.3] tracking-[-.01em] text-title">
              {offering.title}
            </b>
            <p className="m-0 text-[15px] leading-[1.7] text-muted">
              {offering.description}
            </p>

            <ul className="m-0 mt-4 flex list-none flex-wrap gap-2">
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
