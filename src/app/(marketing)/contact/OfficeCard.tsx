'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { OfficeLocation } from '@/types/content';
import { AppImage, IMAGE_SIZES } from '@/components/ui/Image';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/Link';

/**
 * One flip card in the global-offices grid. Both faces show the same city photo; the
 * front is plain, the back has it under a dark scrim with the office's name and address.
 *
 * Three things flip it, one per input: `group-hover` (mouse), `data-flipped` (tap, since
 * touch has no hover), and `group-focus-within` (keyboard - the back holds a tabbable
 * mailto link, and flipping on focus keeps the visible face matching what's focused).
 *
 * The outer element is a `<div>` with a click handler, not a `<button>`, because the
 * back face contains an anchor and an anchor inside a button is invalid HTML.
 *
 * `[transform-style:preserve-3d]` on the inner and `[backface-visibility:hidden]` on
 * both faces make this a rotation rather than a cross-fade - drop either and the faces
 * render on top of each other mid-turn.
 */

/** Back-face title tint per accent - the four pairs the design defines. */
const ACCENT_TEXT: Record<OfficeLocation['accent'], string> = {
  blue: 'text-[#93c5fd]',
  violet: 'text-[#c4b5fd]',
  orange: 'text-[#fdba74]',
  green: 'text-[#86efac]',
};

const FACE_CLASS =
  'absolute inset-0 overflow-hidden rounded-[10px] [backface-visibility:hidden]';

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
        'group h-[260px] cursor-pointer [perspective:1400px]',
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
            'border border-line-soft shadow-[0_4px_16px_rgba(15,23,42,.05)]',
          )}
        >
          <AppImage
            src={office.image.src}
            alt={office.image.alt}
            fill
            sizes={IMAGE_SIZES.third}
            className="object-cover"
          />
        </div>

        {/* ── Back ── */}
        <div className={cn(FACE_CLASS, '[transform:rotateY(180deg)]')}>
          <AppImage
            src={office.image.src}
            alt=""
            fill
            sizes={IMAGE_SIZES.third}
            className="object-cover"
          />
          {/* The flat scrim - `website-t` composites this as a second
              background layer; here it is a real element so `next/image`
              can still own the photo underneath. */}
          <div className="absolute inset-0 bg-black/55" />

          <div className="relative z-[1] flex h-full flex-col items-start justify-center px-[22px] py-[26px] text-left text-white">
            <b
              className={cn(
                'mb-2 block text-[20px] font-800',
                ACCENT_TEXT[office.accent],
              )}
            >
              {office.title}
            </b>
            <p className="m-0 mb-3 text-[18px] leading-[1.55] text-white">
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
                className="inline-flex w-full items-center gap-1.5 border-t border-white/20 pt-2.5 text-[15px] font-700 text-white no-underline transition-colors hover:text-[#fdba74]"
              >
                <Icon name="mail" />
                {office.email}
              </SmartLink>
            ) : (
              <span className="w-full border-t border-white/20 pt-2.5 text-[13.5px] text-white/50">
                {office.noEmailNote}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
