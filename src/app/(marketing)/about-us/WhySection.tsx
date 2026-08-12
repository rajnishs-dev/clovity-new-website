import { GradientText, PillarGrid, Section, SectionHeader } from '@/components/ui';
import { ABOUT_WHY_CARDS, ABOUT_WHY_CONTENT } from '@/constants/about';

/**
 * "Three Things That Set Us Apart" - the three-pillar value prop.
 *
 * `padding="tight"` is `py-12 sm:py-16`, which is what this page uses throughout
 * (the home page's sections are one step looser at `py-16 sm:py-20`).
 *
 * `md:text-center` on the header is not redundant: `SectionHeader` composes
 * `reveal()`, whose base string ends in `md:text-left`, so a centred header needs
 * the centring restated at `md` to win the cascade.
 */
export function WhySection() {
  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        label={ABOUT_WHY_CONTENT.label}
        labelClassName="mb-4"
        heading={
          <>
            {ABOUT_WHY_CONTENT.headingLead}
            <GradientText>{ABOUT_WHY_CONTENT.headingHighlight}</GradientText>
          </>
        }
        className="mx-auto mb-8 max-w-[680px] md:text-center"
      />
      <PillarGrid cards={ABOUT_WHY_CARDS} />
    </Section>
  );
}
