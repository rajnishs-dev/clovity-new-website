'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ServiceOffering } from '@/types/content';
import { cn } from '@/lib/cn';
import { Icon } from '@/components/ui/Icon';

/**
 * The six-engagement card rail: four cards visible, the rest reached with the
 * prev/next buttons.
 *
 * ── WHY THIS IS THE ONLY CLIENT COMPONENT ON THE PAGE ──
 * Everything except the two arrow buttons is static markup and CSS. The buttons
 * need `scrollBy`, and their disabled states need to know where the rail is
 * scrolled to, so the rail is a Client Component and `DeliverSection` stays a
 * Server Component that just renders the heading and hands the data down.
 *
 * ── SCROLL-SNAP FIRST, BUTTONS SECOND ──
 * The rail is a real horizontally-scrolling list with `snap-x`, so it is swipeable
 * and keyboard-scrollable with no JavaScript at all. The buttons are an
 * enhancement on top of that, not the mechanism - if the JS never arrives the
 * section still works.
 *
 * The native scrollbar is hidden (`scrollbar-width` plus the WebKit
 * pseudo-element). Scrolling itself is untouched - only the bar is gone, because a
 * grey track running under tilted cards read as a stray rule. The affordance is
 * carried instead by the arrows at desktop and by the deliberate peek of the next
 * card at phone widths.
 *
 * ── THE HOVER REVEAL ──
 * Default face: coloured card, engagement title, a large ghosted icon. Revealed
 * face: white card, heavy dark border, the description and the three
 * deliverables. Cross-faded on `group-hover` AND `group-focus-within` - the second
 * is not decoration, it is what makes the revealed copy reachable by keyboard and
 * by tap on a touch screen, where `:hover` never fires. That is why each card
 * carries `tabIndex={0}`.
 *
 * The revealed face's title is `aria-hidden` because the default face already
 * states it; without that, both layers sit in the accessibility tree and every
 * card announces its title twice.
 */

/**
 * Per-card fill, in the brand's own dot order: yellow, orange, pink, blue, green.
 *
 * The hexes are sampled from the global colour table of
 * `assets/logos/clovity-logo-black.gif` rather than eyeballed, so these are the
 * logo's actual values. Six cards over five colours, so the sixth restarts the
 * series.
 *
 * ── CONTRAST, MEASURED ──
 * The ink is one value for all six cards (`CARD_INK`, currently white). Measured
 * WCAG ratios for white title text on these fills:
 *
 *     yellow #f7ce19   1.52:1      pink  #e6298c   4.15:1
 *     orange #f79421   2.28:1      blue  #298cce   3.66:1
 *     green  #73bd7b   2.26:1
 *
 * Large text needs 3:1, so pink and blue pass and yellow, orange and green do
 * not. Dark `#101214` would clear all five (4.5:1 to 12.3:1) but reads much
 * heavier against the saturated fills, and white was chosen for the look.
 *
 * If that trade needs revisiting, the fix is per-card ink rather than a global
 * flip: make `CARD_INK` an array parallel to this one and use dark on the yellow,
 * orange and green only. The fills themselves are the logo's, so they are the one
 * thing here that should not be adjusted.
 *
 * Raw hexes applied inline, not `bg-[#…]` classes, because each value is needed
 * twice - as the resting fill and as the revealed face's border - and one array is
 * safer than two that have to stay in step.
 */
const CARD_TONE = [
  '#f7ce19',
  '#f79421',
  '#e6298c',
  '#298cce',
  '#73bd7b',
  '#f7ce19',
] as const;

/**
 * Resting tilt per card; every card straightens on hover.
 *
 * These DO have to be literal class strings: Tailwind only emits utilities it can
 * find complete in the source, so a rotation built at runtime would compile to
 * nothing and every card would sit square.
 */
const CARD_TILT = [
  '-rotate-[1.6deg]',
  'rotate-[1.2deg]',
  '-rotate-[1deg]',
  'rotate-[1.8deg]',
  '-rotate-[1.4deg]',
  'rotate-[1deg]',
] as const;

/**
 * The +/- disc's pressed state.
 *
 * Deliberately NOT used for the revealed face's border any more - that now takes
 * the card's own colour so the turned-over card still reads as the same card. The
 * disc stays this dark slate on every card because the minus inside it is white,
 * and white on the yellow or green fill would be illegible.
 */
const REVEAL_INK = '#2e3d4f';

/**
 * Title and ghosted-artwork ink - one value for every fill. See the contrast note
 * on `CARD_TONE` before changing it.
 */
const CARD_INK = '#fff';

export function DeliverRail({ offerings }: { offerings: ServiceOffering[] }) {
  const railRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [scrollable, setScrollable] = useState(false);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    // 1px of slack: fractional layout widths mean `scrollLeft` rarely lands
    // exactly on the maximum, so a strict comparison never reports "at end".
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 1);
    // At very wide viewports every card can fit, and two permanently-disabled
    // arrows are worse than no arrows.
    setScrollable(el.scrollWidth > el.clientWidth + 1);
  }, []);

  useEffect(() => {
    sync();
    // `resize` as well as `scroll`: card width - and therefore whether there is
    // anything left to scroll at all - changes with the viewport.
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [sync]);

  /** Advance by one card, measured rather than assumed. */
  const step = (direction: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    const card = el.querySelector('li');
    const gap = 20; // matches `gap-5`
    const distance = card
      ? card.getBoundingClientRect().width + gap
      : el.clientWidth;
    el.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  const arrowClass =
    'flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-[#334155] shadow-xs transition-all duration-200 hover:border-brand-600 hover:bg-brand-600 hover:text-white disabled:cursor-default disabled:opacity-35 disabled:hover:border-line disabled:hover:bg-white disabled:hover:text-[#334155]';

  return (
    <div className="relative">
      <ul
        ref={railRef}
        onScroll={sync}
        className={cn(
          'm-0 flex snap-x snap-mandatory list-none gap-5 overflow-x-auto scroll-smooth',
          // Room for the tilt and the lifted shadow, which the scroll container
          // would otherwise clip at its own edges.
          '-mx-2 px-2 pb-3 pt-3',
          // Hide the native bar without disabling the scrolling itself.
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        )}
      >
        {offerings.map((offering, index) => {
          const tone = CARD_TONE[index % CARD_TONE.length];
          return (
            <li
              key={offering.id}
              className={cn(
                // `flex` so the card stretches to this item's height, and the items
                // themselves stretch to the tallest in the row.
                'group flex shrink-0 snap-start pl-2',
                // One-and-a-bit cards on a phone so the peek shows the rail moves,
                // two at tablet, three from `ml`, four from `xl`. The subtracted
                // rems are the gaps: two 20px gaps for three cards, three for four.
                //
                // Four-up deliberately waits for `xl` (1280px) rather than starting
                // at `ml` (900px): at 900px four cards are only 205px wide, which
                // forced the card to 540px tall to fit the wrapped copy and looked
                // like a column of slivers. Holding three until 1280px keeps every
                // card at least ~270px, so the height stays at its 400px floor
                // almost everywhere.
                'basis-[80%] sm:basis-[47%]',
                'ml:basis-[calc((100%-2.5rem)/3)] xl:basis-[calc((100%-3.75rem)/4)]',
              )}
            >
              <div
                tabIndex={0}
                className={cn(
                  // ── HEIGHT IS CONTENT-DRIVEN, NOT A FIXED NUMBER ──
                  // How tall a card needs to be follows its *width*, not the
                  // viewport: a narrower card wraps the revealed description onto
                  // more lines. Card width swings from 241px to 305px inside the
                  // `ml` 4-up band alone, and at 241px the copy wants 438px against
                  // the 430px a fixed height gave it - so the last bullet was cut
                  // off at ~1024px.
                  //
                  // So the revealed face sits in normal flow and sets the card's
                  // intrinsic height, the flex row stretches every card to the
                  // tallest, and `min-h` only stops short copy from producing a
                  // squat card. Nothing clips at any width and there is no dead
                  // space left to tune.
                  'relative flex min-h-[400px] w-full flex-col',
                  'overflow-hidden rounded-[26px] outline-none',
                  '[transition:transform_.35s_cubic-bezier(.34,1.56,.64,1),box-shadow_.35s_ease]',
                  'shadow-[0_18px_40px_-20px_rgba(15,23,42,.3)]',
                  'hover:shadow-[0_26px_54px_-18px_rgba(15,23,42,.34)]',
                  'focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2',
                  CARD_TILT[index % CARD_TILT.length],
                  'group-focus-within:rotate-0 group-hover:rotate-0',
                )}
                style={{ backgroundColor: tone }}
              >
                {/* ── Default face ── */}
                <div className="absolute inset-0 flex flex-col p-6 transition-opacity duration-300 group-focus-within:opacity-0 group-hover:opacity-0 sm:p-7">
                  <b
                    className="block max-w-[88%] text-[20px] font-500 leading-[1.18] tracking-[-.01em] sm:text-[22px]"
                    style={{ color: CARD_INK }}
                  >
                    {offering.title}
                  </b>
                  {/* Stands in for the reference's 3D hand photography. There is no
                    such art in the repo, and the site's own icon set at display
                    size reads as a deliberate graphic rather than a missing photo.
                    Swap for real imagery here if it ever lands. */}
                  <span
                    aria-hidden
                    className="mt-auto flex justify-center opacity-[.8]"
                    style={{ color: CARD_INK }}
                  >
                    <Icon name={offering.icon} size={150} strokeWidth={1.1} />
                  </span>
                </div>

                {/* ── Revealed face ──
                  In normal flow, unlike the default face - this is the element
                  whose copy sets the card's height, then stretches back over the
                  whole card once the row has equalised so it still covers the fill
                  edge to edge.
                  `grow`, deliberately not `flex-1`: `flex-1` is `flex:1 1 0%`, and
                  a zero flex-basis stops the copy contributing its full height to
                  the card's intrinsic height - it measured 16px short at 1024px,
                  which is exactly the clipping this was meant to fix. `grow`
                  leaves `flex-basis:auto`, so content sets the base size and the
                  item only grows from there.

                  The border takes the card's own colour, so a turned-over card
                  still reads as the same card - the fill it replaces is restated
                  as an outline rather than dropped for a neutral slate. */}
                <div
                  className="relative flex grow flex-col rounded-[26px] border-4 bg-white p-5 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 sm:p-6"
                  style={{ borderColor: tone }}
                >
                  <span
                    aria-hidden
                    className="block text-[11.5px] font-800 uppercase leading-[1.35] tracking-[.09em] text-brand-700"
                  >
                    {offering.title}
                  </span>
                  <p className="m-0 mt-3 text-[13.5px] leading-[1.6] text-muted">
                    {offering.description}
                  </p>
                  <ul className="m-0 mt-3.5 flex list-none flex-col gap-2 border-t border-line-faint pt-3">
                    {offering.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-[12.5px] font-500 leading-[1.5] text-[#334155]"
                      >
                        <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center text-brand-600">
                          <Icon name="circle-check" size={14} />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ── The +/− disc ──
                  Both glyphs are absolutely positioned and centred INDEPENDENTLY.
                  They used to be flex siblings, which meant each one took width in
                  the row and pushed the other off-centre - the plus sat visibly
                  left of the middle. Overlaying them is what actually centres
                  both. */}
                <span
                  aria-hidden
                  className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white sm:bottom-6 sm:right-6"
                >
                  <span
                    className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100"
                    style={{ backgroundColor: REVEAL_INK }}
                  />
                  <span
                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 group-focus-within:opacity-0 group-hover:opacity-0"
                    style={{ color: REVEAL_INK }}
                  >
                    <Icon name="plus" size={16} />
                  </span>
                  {/* No `minus` glyph in the icon registry, and a 2px rule is a truer
                    minus than a rotated plus would be. */}
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
                    <span className="h-[2px] w-3.5 rounded-full bg-white" />
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Controls. Hidden from assistive tech: the rail is a scrollable list that
          keyboard users already reach directly, so these would only add two
          redundant stops. Hidden outright when nothing overflows. */}
      {scrollable ? (
        <div aria-hidden className="mt-3 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            tabIndex={-1}
            className={arrowClass}
          >
            <Icon name="arrow-left" className="text-[14px]" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={atEnd}
            tabIndex={-1}
            className={arrowClass}
          >
            <Icon name="arrow-right" className="text-[14px]" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
