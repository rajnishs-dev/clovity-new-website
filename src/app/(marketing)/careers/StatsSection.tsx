import { Section, StatBand } from '@/components/ui';
import { CAREERS_STATS } from '@/constants/careers';

/**
 * The four-metric navy band.
 *
 * Identical treatment to the About page's — `.cr-stat-band` and `.ab-stat-band` are
 * the same three-stop gradient with the same orange accent — but different metrics:
 * this page leads with Platinum and adds the Great Place to Work certification,
 * because those are the two a candidate is weighing.
 */
export function StatsSection() {
  return (
    <Section
      padding="tight"
      className="bg-[linear-gradient(135deg,#0b1730_0%,#152a6b_60%,#1d3a8a_100%)]"
    >
      <StatBand items={CAREERS_STATS} />
    </Section>
  );
}
