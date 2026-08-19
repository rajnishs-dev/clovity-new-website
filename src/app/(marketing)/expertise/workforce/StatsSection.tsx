import { Section, StatBand } from '@/components/ui';
import { WF_STATS } from '@/constants/workforce';

/**
 * The four-cell metric strip, directly under the hero.
 *
 * Flush, matching the ITSM, DevSecOps and Managed Services equivalents - no `-mt-8` lift,
 * because the hero above ends in a photograph with a scrim and there is no seam to hide.
 *
 * No `SectionHeader`: the band is the whole section. Every value traces to a published
 * source; see the header comment in `constants/workforce.ts`, which also records the four
 * numbers from this page's comp that are NOT here. Two of the four cells are words rather
 * than figures ("Platinum", "MBE") because the honest values available for a staffing
 * page are credentials, and a placement-satisfaction percentage invented to fill the row
 * is exactly what that comment forbids.
 */
export function StatsSection() {
  return (
    <Section padding="tight" className="border-b border-line-faint bg-soft">
      <StatBand items={WF_STATS} />
    </Section>
  );
}
