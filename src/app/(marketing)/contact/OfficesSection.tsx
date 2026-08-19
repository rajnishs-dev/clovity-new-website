import { GradientText, Section, SectionHeader } from '@/components/ui';
import { CONTACT_OFFICES, CONTACT_OFFICES_CONTENT } from '@/constants/contact';
import { OfficeCard } from './OfficeCard';

/**
 * "Wherever You're Delivering, We're Close By" - the eight-office flip-card grid. Three
 * columns at desktop, two below 1020px, one below 560px.
 *
 * Cards stagger 50ms apart, matching the published `transition-delay`; the reveal helper
 * caps at 300ms, so the last card lands with the seventh rather than later.
 *
 * A Server Component - only `OfficeCard` is a client component, needed for tap-to-flip.
 */

/** 50ms per card, matching the published `transition-delay` ladder. */
const STAGGER_STEP_MS = 50;

export function OfficesSection() {
  return (
    <Section className="border-y border-line-faint bg-soft">
      <SectionHeader
        labelClassName="mb-4"
        heading={
          <>
            {CONTACT_OFFICES_CONTENT.headingLead}
            <GradientText>
              {CONTACT_OFFICES_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        subheading={CONTACT_OFFICES_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-12 max-w-[640px] md:text-center"
      />

      <div className="grid grid-cols-3 gap-5 to-1020:grid-cols-2 to-560:grid-cols-1">
        {CONTACT_OFFICES.map((office, index) => (
          <OfficeCard
            key={office.id}
            office={office}
            revealDelayMs={index * STAGGER_STEP_MS}
          />
        ))}
      </div>
    </Section>
  );
}
