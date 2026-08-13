'use client';

import { useAutoScrollMarquee } from '@/hooks/useAutoScrollMarquee';
import type { CredentialBadge, CredentialRow } from '@/types/content';
import { AppImage } from '@/components/ui/Image';

/**
 * `md`-and-below stand-in for `CredentialsSection`'s flex-wrap rows: a real
 * `overflow-x-auto` track where `useAutoScrollMarquee` only nudges
 * `scrollLeft` while idle, so dragging is native scrolling throughout.
 *
 * `isSvg` and the card treatment are re-declared here rather than imported
 * from `CredentialsSection`, which imports this file - importing back would
 * be a cycle.
 */
function isSvg(source: CredentialBadge['image']['src']): boolean {
  const path = typeof source === 'string' ? source : source.src;
  return path.toLowerCase().includes('.svg');
}

/** Marquee-only card treatment: no drop shadow (motion turned it into a
 *  smear), a plain border stands in instead. */
function MarqueeCard({ badge }: { badge: CredentialBadge }) {
  return (
    <div className="flex h-[100px] w-[140px] items-center justify-center rounded-[10px] border border-line-soft bg-white p-4">
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
