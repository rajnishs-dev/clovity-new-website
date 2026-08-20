import { Section, StatBand } from '@/components/ui';
import { MS_STATS } from '@/constants/managed-services';

/**
 * The four-cell metric strip, directly under the hero.
 *
 * Flush, matching the ITSM and DevSecOps equivalents - no `-mt-8` lift, because the
 * shared `BannerHero` ends in a photograph with a scrim and there is no seam to hide.
 *
 * No `SectionHeader`: the band is the whole section. Every value traces to a published
 * source; see the header comment in `constants/managed-services.ts`. Three of the four
 * are words rather than numbers ("Monthly", "Proactive", "Platinum"), which is
 * deliberate - the honest figures available for this page are commitments and
 * credentials, not metrics, and inventing an uptime percentage to fill the row is
 * exactly what that comment forbids.
 */
export function StatsSection() {
  return (
    <Section
      padding="tight"
      className="border-b border-line-faint bg-[#eaf8ff]"
    >
      <StatBand items={MS_STATS} />
    </Section>
  );
}
