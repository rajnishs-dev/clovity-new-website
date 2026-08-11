import { Section, StatBand } from '@/components/ui';
import { ABOUT_STATS } from '@/constants/about';

/**
 * The four-metric navy band.
 *
 * The gradient lives on the SECTION and the band itself is transparent, which is how
 * the published `.ab-stat-band` override works: `theme.css` paints the band `#0f172a`,
 * and this page replaces that with its own three-stop navy on the wrapper so the
 * colour runs edge to edge behind the 24px-radius grid.
 */
export function StatsSection() {
  return (
    <Section
      padding="tight"
      className="bg-[linear-gradient(135deg,#0b1730_0%,#152a6b_60%,#1d3a8a_100%)]"
    >
      <StatBand items={ABOUT_STATS} />
    </Section>
  );
}
