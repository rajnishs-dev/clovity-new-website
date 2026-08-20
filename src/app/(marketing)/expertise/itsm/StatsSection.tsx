import { Section, StatBand } from '@/components/ui';
import { ITSM_STATS } from '@/constants/itsm';

/**
 * The four-cell metric strip, directly under the hero.
 *
 * No `SectionHeader` - the band is the whole section, the way About and Careers
 * render it. Every value traces to a published source; see the header comment in
 * `constants/itsm.ts`.
 */
export function StatsSection() {
  return (
    <Section
      padding="tight"
      className="border-b border-line-faint bg-[#eaf8ff]"
    >
      <StatBand items={ITSM_STATS} />
    </Section>
  );
}
