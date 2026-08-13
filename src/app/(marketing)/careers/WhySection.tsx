import { GradientText, Section, SectionHeader } from '@/components/ui';
import { buttonClass } from '@/components/ui/Button';
import { ArrowIcon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/Link';
import { CAREERS_HERO, CAREERS_WHY_CONTENT } from '@/constants/careers';

/**
 * The legacy `/talent` page's intro banner, ported in place of the 3-card
 * "Why Clovity" grid About still uses - job-seeker copy calls for a different
 * layout than a client-facing feature grid.
 */
export function WhySection() {
  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        heading={
          <>
            {CAREERS_WHY_CONTENT.headingLead}
            <GradientText>{CAREERS_WHY_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={CAREERS_WHY_CONTENT.description}
        className="mx-auto max-w-[820px]"
      />
      <div className="mt-6 flex justify-center">
        <SmartLink
          href={CAREERS_HERO.openRolesAnchor}
          className={buttonClass('primary')}
        >
          View Open Positions <ArrowIcon />
        </SmartLink>
      </div>
    </Section>
  );
}
