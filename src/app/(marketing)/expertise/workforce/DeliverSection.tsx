import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { ServiceOffering } from '@/types/content';
import { GradientText, Icon, Section, SectionHeader } from '@/components/ui';
import {
  WF_DELIVER_CONTENT,
  WF_DELIVER_GROUPS,
  WF_OFFERINGS,
} from '@/constants/workforce';

/**
 * "Capacity, and the Capability to Replace It" - the six sub-services.
 *
 * ── THE SPINE LIST, PORTED ──
 * This is `theme.css`'s `.spine-list` / `.spine-item` / `.spine-dot` ("non-sequential icon
 * list on continuous spine"), which this page's comp uses for exactly this content and
 * which nothing in the app had ported yet. Values are the legacy ones: 48x48 tile at 14px
 * radius, 22px gap, 32px item padding, and a 2px `#e2e8f0` spine running from the bottom
 * of one tile to the top of the next.
 *
 * It is NOT the hairline two-column list the Managed Services and DevSecOps delivery
 * sections use. That one presents items as parallel areas of continuous work; the spine
 * presents them as one connected offer, which is the argument here - the enablement half
 * only means anything attached to the capacity half.
 *
 * ── TWO LABELLED GROUPS, AND THE ORDER IS THE POINT ──
 * "Add capacity" (2) then "Build capability" (4). A team under pressure searches for the
 * first two; the last four are what stop the first two becoming permanent. Six items
 * under one heading would flatten that into a menu.
 *
 * ── THE SPINE HAS TO SURVIVE THE COLUMN COLLAPSE ──
 * Each group lays out two-up at `ml` and one-up below, so which items still have a
 * neighbour BELOW them changes with the breakpoint - and a spine segment pointing at
 * nothing is worse than no spine. `connectorClass` computes that from the index rather
 * than hard-coding per-item classes: in one column every item but the last continues; in
 * two columns only items in the upper row do. Same reasoning as the column rule in
 * `managed-services/DeliverSection.tsx`, which derives its borders the same way.
 */

/**
 * Visibility classes for one item's spine segment in a 2-up-at-`ml` grid.
 *
 * Returns `null` when this item ends its column at every width, so the caller can skip
 * rendering the element entirely instead of shipping a hidden one.
 *
 * The two conditions are not symmetric: in one column an item continues if anything
 * follows it at all, while in two columns it continues only if a further ROW exists
 * beneath it (items pair up row-wise - 0,1 then 2,3). So "continues in two columns but
 * not in one" cannot happen, and there is deliberately no branch for it: that would need
 * `index === count - 1` and `index + 2 < count` to hold together.
 */
function connectorClass(index: number, count: number): string | null {
  const continuesInOneColumn = index < count - 1;
  const continuesInTwoColumns = index + 2 < count;

  if (!continuesInOneColumn) return null;
  return continuesInTwoColumns ? '' : 'ml:hidden';
}

function SpineList({ offerings }: { offerings: ServiceOffering[] }) {
  return (
    <ul
      className={cn(
        'm-0 grid list-none gap-x-12 ml:grid-cols-2',
        revealAligned('left'),
      )}
      {...revealAttrs()}
    >
      {offerings.map((offering, index) => {
        const connector = connectorClass(index, offerings.length);

        return (
          <li
            key={offering.id}
            className="group relative flex gap-[22px] pb-8 last:pb-0 ml:[&:nth-last-child(-n+2)]:pb-0"
          >
            {connector === null ? null : (
              <span
                aria-hidden
                className={cn(
                  'absolute bottom-0 left-[23px] top-12 w-0.5 bg-line',
                  connector,
                )}
              />
            )}

            <span
              className={cn(
                'relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-brand-50 transition-colors duration-200 group-hover:bg-brand-100',
                offering.iconChipClass,
              )}
            >
              <Icon name={offering.icon} size={20} />
            </span>

            <div className="min-w-0">
              <b className="mb-2 block text-[17px] font-500 leading-[1.3] tracking-[-.01em] text-title">
                {offering.title}
              </b>
              <p className="m-0 mb-3.5 text-[14.5px] leading-[1.7] text-body">
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
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** The uppercase divider that opens each group. */
function GroupLabel({
  label,
  caption,
  className,
}: {
  label: string;
  caption: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-7 flex flex-wrap items-baseline gap-x-3.5 gap-y-1 border-b border-line pb-3.5',
        revealAligned('left'),
        className,
      )}
      {...revealAttrs()}
    >
      <span className="text-[12px] font-800 uppercase tracking-[.14em] text-brand-600">
        {label}
      </span>
      <span className="text-[13.5px] leading-[1.5] text-faint">{caption}</span>
    </div>
  );
}

const CAPACITY_COUNT = WF_DELIVER_GROUPS.capacity.count;
const CAPACITY_OFFERINGS = WF_OFFERINGS.slice(0, CAPACITY_COUNT);
const CAPABILITY_OFFERINGS = WF_OFFERINGS.slice(CAPACITY_COUNT);

export function DeliverSection() {
  return (
    <Section
      padding="tight"
      className="border-y border-line-faint bg-[#eaf8ff]"
    >
      <SectionHeader
        heading={
          <>
            {WF_DELIVER_CONTENT.headingLead}
            <GradientText>{WF_DELIVER_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={WF_DELIVER_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-11 max-w-[730px] md:text-center"
      />

      <GroupLabel
        label={WF_DELIVER_GROUPS.capacity.label}
        caption={WF_DELIVER_GROUPS.capacity.caption}
      />
      <SpineList offerings={CAPACITY_OFFERINGS} />

      <GroupLabel
        label={WF_DELIVER_GROUPS.capability.label}
        caption={WF_DELIVER_GROUPS.capability.caption}
        className="mt-12"
      />
      <SpineList offerings={CAPABILITY_OFFERINGS} />
    </Section>
  );
}
