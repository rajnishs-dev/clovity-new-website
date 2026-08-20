import { Section, StatBand } from '@/components/ui';
import { DEVSECOPS_STATS } from '@/constants/devsecops';

/**
 * The four-cell metric strip, directly under the hero.
 *
 * Flush, matching the ITSM page's equivalent. An earlier version pulled the band up
 * with `-mt-8` to straddle a hard colour edge, which the old self-painted gradient
 * hero created; the shared `BannerHero` ends in a photograph with a scrim, so there
 * is no seam to hide and the lift just detached the band from its own section.
 *
 * No `SectionHeader` - the band is the whole section, the way About and Careers
 * render it. Every value traces to a published source; see the header comment in
 * `constants/devsecops.ts`.
 */
export function StatsSection() {
  return (
    // White: this page's white/`bg-[#eaf8ff]` run starts here - see the note in
    // `page.tsx` for why the phase is what it is.
    <Section padding="tight" className="border-b border-line-faint bg-white">
      <StatBand items={DEVSECOPS_STATS} />
    </Section>
  );
}
