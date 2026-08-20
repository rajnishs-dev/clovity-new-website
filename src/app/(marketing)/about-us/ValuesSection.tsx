import {
  BentoGrid,
  GradientText,
  Section,
  SectionHeader,
} from '@/components/ui';
import { ABOUT_VALUES, ABOUT_VALUES_CONTENT } from '@/constants/about';

/**
 * "The Principles Behind Every Engagement" - the four-tile bento grid.
 *
 * `.val-sec` is `#f8fafc` with a 1px `#eef2f7` rule top and bottom. Those rules are
 * what separate this section from the white ones either side of it, so they are part
 * of the design rather than decoration.
 */
export function ValuesSection() {
  return (
    <Section
      padding="tight"
      className="border-y border-line-faint bg-[#eaf8ff]"
    >
      <SectionHeader
        labelClassName="mb-4"
        heading={
          <>
            {ABOUT_VALUES_CONTENT.headingLead}
            <GradientText>{ABOUT_VALUES_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={ABOUT_VALUES_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-8 max-w-[680px] md:text-center"
      />
      <BentoGrid tiles={ABOUT_VALUES} />
    </Section>
  );
}
