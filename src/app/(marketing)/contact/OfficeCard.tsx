'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { OfficeLocation } from '@/types/content';
import { AppImage } from '@/components/ui/Image';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/Link';
import { CONTACT_OFFICES_CONTENT } from '@/constants/contact';

/**
 * One flip card in the global-offices grid.
 *
 * THREE THINGS FLIP IT, and each covers a different visitor:
 *  • `group-hover`       - a mouse on the desktop grid.
 *  • `data-flipped`      - a tap on a touch device, where there is no hover. This is
 *                          the click handler the published page's inline script added.
 *  • `group-focus-within` - a keyboard. The back face holds the office's mailto link,
 *                          and because the back is rotated away rather than removed,
 *                          that link is tabbable while invisible. Flipping on
 *                          focus-within means the card a keyboard user is reading is
 *                          the card that is showing. The original had no equivalent.
 *
 * The outer element stays a plain `<div>` with a click handler rather than becoming a
 * `<button>`: the back face contains an anchor, and an anchor inside a button is
 * invalid HTML that browsers resolve unpredictably. `group-focus-within` is what
 * recovers the keyboard path without that trade.
 *
 * `[transform-style:preserve-3d]` on the inner and `[backface-visibility:hidden]` on
 * both faces are what make this a rotation rather than a cross-fade - drop either and
 * the two faces render on top of each other mid-turn.
 */

/** Back-face gradient per accent, as the design defines them. */
const BACK_GRADIENT: Record<OfficeLocation['accent'], string> = {
  blue: 'bg-[linear-gradient(150deg,#0b1730,#1d3a8a)]',
  violet: 'bg-[linear-gradient(150deg,#1e1b4b,#4c1d95)]',
  orange: 'bg-[linear-gradient(150deg,#291709,#7c2d12)]',
  green: 'bg-[linear-gradient(150deg,#052e16,#166534)]',
};

const FACE_CLASS =
  'absolute inset-0 flex flex-col rounded-[20px] px-[22px] py-[26px] [backface-visibility:hidden]';

export function OfficeCard({
  office,
  revealDelayMs,
}: {
  office: OfficeLocation;
  revealDelayMs?: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      data-flipped={flipped}
      onClick={() => setFlipped((current) => !current)}
      className={cn(
        'group h-[225px] cursor-pointer [perspective:1400px]',
        revealAligned('center', 'up', revealDelayMs),
      )}
      {...revealAttrs()}
    >
      <div
        className={cn(
          'relative h-full w-full [transform-style:preserve-3d]',
          '[transition:transform_.65s_cubic-bezier(.4,0,.2,1)]',
          'group-hover:[transform:rotateY(180deg)]',
          'group-focus-within:[transform:rotateY(180deg)]',
          'group-data-[flipped=true]:[transform:rotateY(180deg)]',
        )}
      >
        {/* ── Front ── */}
        <div
          className={cn(
            FACE_CLASS,
            'items-center justify-center border border-line-soft bg-white text-center shadow-[0_4px_16px_rgba(15,23,42,.05)]',
          )}
        >
          <span className="relative mb-3.5 h-16 w-16 shrink-0 overflow-hidden rounded-full border-[3px] border-white shadow-[0_4px_14px_rgba(15,23,42,.16)] outline outline-1 outline-line-faint">
            <AppImage
              src={office.flag.src}
              alt={office.flag.alt}
              width={office.flag.width ?? 160}
              height={office.flag.height ?? 120}
              className="block h-full w-full object-cover"
            />
            <span className="absolute -bottom-[3px] -right-[3px] flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-[13px] text-white">
              {/* ~52% of the 24px chip. */}
              <Icon name={office.icon} />
            </span>
          </span>

          <span className="mb-1.5 text-[10.5px] font-800 uppercase tracking-[.08em] text-faint">
            {office.tag}
          </span>
          <b className="text-[16.5px] font-500 leading-[1.3] text-title">
            {office.city}
          </b>
          <span className="mt-3.5 inline-flex items-center gap-1.5 text-[10.5px] font-700 text-faint">
            <Icon name="refresh" className="text-[9px]" />
            {CONTACT_OFFICES_CONTENT.flipHint}
          </span>
        </div>

        {/* ── Back ── */}
        <div
          className={cn(
            FACE_CLASS,
            BACK_GRADIENT[office.accent],
            'items-start justify-center text-left text-white [transform:rotateY(180deg)]',
          )}
        >
          <b className="mb-2 block text-[13.5px] font-800 text-[#fdba74]">
            {office.title}
          </b>
          <p className="m-0 mb-3 text-[12.5px] leading-[1.55] text-line">
            {office.addressLines.map((line, index) => (
              <span key={line}>
                {index > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>

          {office.email ? (
            <SmartLink
              href={`mailto:${office.email}`}
              className="inline-flex w-full items-center gap-1.5 border-t border-white/20 pt-2.5 text-[12px] font-700 text-white no-underline transition-colors hover:text-[#fdba74]"
            >
              <Icon name="mail" />
              {office.email}
            </SmartLink>
          ) : (
            <span className="w-full border-t border-white/20 pt-2.5 text-[12px] text-white/50">
              {office.noEmailNote}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
