import logoBlack from '@/assets/logos/clovity-logo-black.gif';
import { AppImage } from '@/components/ui/Image';

/**
 * Route-level loading UI. Next.js shows this while a Server Component tree is
 * still streaming, so a slow data fetch produces a deliberate loading state
 * instead of a blank frame.
 */
export default function RootLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Clovity"
      className="flex min-h-[100svh] items-center justify-center bg-white"
    >
      <AppImage
        src={logoBlack}
        alt="Clovity"
        animated
        priority
        className="w-[160px] animate-pulse md:w-[200px]"
      />
      <span className="sr-only">Loading Clovity</span>
    </div>
  );
}
