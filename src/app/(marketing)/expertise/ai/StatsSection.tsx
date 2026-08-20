import { Section, StatBand } from '@/components/ui';
import { AI_STATS } from '@/constants/ai';

/**
 * The four-cell metric strip, directly under the hero.
 *
 * Flush, matching every other expertise page's equivalent - no `-mt-8` lift, because the hero
 * above ends in artwork with a scrim and there is no seam to hide.
 *
 * No `SectionHeader`: the band is the whole section. Every value traces to a published source;
 * see the header comment in `constants/ai.ts`, which also records the four percentages from
 * this page's comp that are NOT here, and why Pulse AI's install count is not here either.
 */
export function StatsSection() {
  return (
    <Section
      padding="tight"
      className="border-b border-line-faint bg-[#eaf8ff]"
    >
      <StatBand items={AI_STATS} />
    </Section>
  );
}
