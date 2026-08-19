import { Section, StatBand } from '@/components/ui';
import { ABOUT_STATS } from '@/constants/about';

/** The four-metric stat band, on a light section. */
export function StatsSection() {
  return (
    <Section padding="tight" className="bg-soft">
      <StatBand items={ABOUT_STATS} />
    </Section>
  );
}
