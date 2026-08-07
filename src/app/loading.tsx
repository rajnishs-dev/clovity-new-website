import { cn } from '@/lib/cn';
import { SkeletonCard } from '@/components/ui/Skeleton';

/**
 * Route-level loading UI. Next.js shows this while a Server Component tree is
 * still streaming, so a slow data fetch produces a deliberate loading state
 * instead of a blank frame.
 *
 * Shaped to the home page's own layout (floating header + dark hero + a card
 * row) rather than a generic spinner, so the swap into real content doesn't
 * jolt — same idea as `Skeleton`, just applied at the page level.
 */
const pulse = 'animate-pulse rounded-full bg-white/10';

export default function RootLoading() {
  return (
    <div role="status" aria-live="polite" aria-label="Loading Clovity">
      {/* Header pill */}
      <div className="fixed inset-x-0 top-3.5 z-50 px-[clamp(16px,3vw,24px)]" aria-hidden>
        <div className="mx-auto flex max-w-nav items-center justify-between gap-4 rounded-[44px] py-2.5 pl-3 pr-3.5">
          <div className={cn(pulse, 'h-[60px] w-[130px] md:h-[72px]')} />
          <div className="hidden items-center gap-6 lg:flex">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className={cn(pulse, 'h-3 w-16')} />
            ))}
          </div>
          <div className={cn(pulse, 'h-10 w-28 rounded-full')} />
        </div>
      </div>

      {/* Hero */}
      <div
        className="flex min-h-[100svh] flex-col items-center justify-center gap-6 bg-[#05080f] px-[clamp(16px,4vw,40px)]"
        aria-hidden
      >
        <div className={cn(pulse, 'h-3 w-40')} />
        <div className={cn(pulse, 'h-14 w-[min(720px,80vw)] rounded-2xl')} />
        <div className={cn(pulse, 'h-14 w-[min(520px,60vw)] rounded-2xl')} />
        <div className={cn(pulse, 'mt-4 h-4 w-[min(600px,70vw)]')} />
        <div className={cn(pulse, 'h-4 w-[min(440px,50vw)]')} />
      </div>

      {/* Trusted-by style card row */}
      <div className="mx-auto max-w-shell px-6 py-12 lg:py-16" aria-hidden>
        <div className="mx-auto mb-10 flex max-w-[560px] flex-col items-center gap-3">
          <div className="h-6 w-64 animate-pulse rounded-[10px] bg-slate-200/70" />
          <div className="h-4 w-96 max-w-full animate-pulse rounded-[10px] bg-slate-200/70" />
        </div>
        <div className="grid grid-cols-3 gap-5 to-900:grid-cols-2 to-767:grid-cols-1">
          {Array.from({ length: 3 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>

      <span className="sr-only">Loading Clovity</span>
    </div>
  );
}
