import { Loader } from '@/components/ui/Loader';

/**
 * Route-level loading UI. Next.js shows this while a Server Component tree is
 * still streaming, so a slow data fetch produces a deliberate loading state
 * instead of a blank frame.
 */
export default function RootLoading() {
  return <Loader fullScreen label="Loading Clovity" />;
}
