'use client';

import { useAutoScrollMarquee } from '@/hooks/useAutoScrollMarquee';
import type { CredentialBadge, CredentialRow } from '@/types/content';
import { AppImage } from '@/components/ui/Image';

/**
 * The `md`-and-below stand-in for `CredentialsSection`'s three flex-wrap
 * rows: one draggable, auto-scrolling strip built on `useAutoScrollMarquee`.
 *
 * Unlike `ClientMarquee` (a pure CSS `translateX` loop with no user input),
 * this track is a real `overflow-x-auto` element - the hook only nudges
 * `scrollLeft` forward while idle, so swiping it is native browser scrolling
 * the whole time: drag left to move the strip left, drag right to move it
 * right, exactly as any other horizontal scroller behaves.
 *
 * `isSvg` and the card treatment are intentionally re-declared here rather
 * than imported from `CredentialsSection` - that file imports this one for
 * the mobile strip, so importing back would be a cycle.
 */
function isSvg(source: CredentialBadge['image']['src']): boolean {
  const path = typeof source === 'string' ? source : source.src;
  return path.toLowerCase().includes('.svg');
}

/**
 * Marquee-only card treatment. Every badge gets the same rounded white box in
 * the strip - including the four bare Atlassian partner badges, which render
 * unwrapped in the desktop rows - and none of them carry the desktop card's
 * drop shadow: constant sideways motion turned it into a smear rather than
 * depth, so a plain border stands in for it instead.
 */
function MarqueeCard({ badge }: { badge: CredentialBadge }) {
  return (
    <div className="flex h-[100px] w-[140px] items-center justify-center rounded-2xl border border-line-soft bg-white p-4">
      <AppImage
        src={badge.image.src}
        alt={badge.image.alt}
        sizes="140px"
        unoptimized={isSvg(badge.image.src)}
        className="h-auto max-h-full w-auto max-w-full object-contain"
        {...(badge.image.width && badge.image.height
          ? { width: badge.image.width, height: badge.image.height }
          : {})}
      />
    </div>
  );
}

function CredentialTrack({
  badges,
  duplicate = false,
}: {
  badges: CredentialBadge[];
  duplicate?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-5 px-2.5"
      {...(duplicate ? { 'aria-hidden': true } : {})}
    >
      {badges.map((badge, index) => (
        <div key={`${badge.id}-${index}`} className="shrink-0">
          <MarqueeCard badge={badge} />
        </div>
      ))}
    </div>
  );
}

export function CredentialsMarquee({ rows }: { rows: CredentialRow[] }) {
  const badges: CredentialBadge[] = rows.flatMap((row) => row.badges);
  const { trackRef } = useAutoScrollMarquee({ speed: 40 });

  return (
    <div className="relative hidden w-full to-767:block">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-12 bg-[linear-gradient(90deg,#fff,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-12 bg-[linear-gradient(270deg,#fff,transparent)]"
      />

      <div
        ref={trackRef}
        className="flex touch-pan-x cursor-grab gap-0 overflow-x-auto py-2 active:cursor-grabbing [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <CredentialTrack badges={badges} />
        <CredentialTrack badges={badges} duplicate />
      </div>
    </div>
  );
}
