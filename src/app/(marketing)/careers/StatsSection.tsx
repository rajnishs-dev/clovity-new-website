import { Section, StatBand } from '@/components/ui';
import { CAREERS_STATS } from '@/constants/careers';

/**
 * The four-metric stat band, on a light section.
 *
 * Identical treatment to the About page's, but different metrics: this page leads
 * with Platinum and adds the Great Place to Work certification, because those are
 * the two a candidate is weighing.
 */
export function StatsSection() {
  return (
    <Section padding="tight" className="bg-[#eaf8ff]">
      <StatBand items={CAREERS_STATS} />
    </Section>
  );
}
