import { cn } from '@/lib/cn';
import { StatBand, type StatBandProps } from '@/components/ui/StatBand';

/**
 * `StatBand` plus an optional citation line underneath.
 *
 * Exists because these pages mostly reuse the home page's company-wide
 * numbers (300+ engagements, 17 years, etc.) rather than a service-specific
 * metric - the org's own rule ("trace every number to a source") means a
 * reused company stat must say so, not sit under a heading that implies it's
 * specific to this one service.
 */
export interface MetricStatProps extends StatBandProps {
  citation?: string;
  wrapperClassName?: string;
}

export function MetricStat({
  citation,
  wrapperClassName,
  ...bandProps
}: MetricStatProps) {
  return (
    <div className={cn(wrapperClassName)}>
      <StatBand {...bandProps} />
      {citation ? (
        <p className="mt-3 text-center text-[12px] text-faint">{citation}</p>
      ) : null}
    </div>
  );
}
