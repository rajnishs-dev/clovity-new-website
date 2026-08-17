import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { AppImage } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import {
  CLOUD_MIGRATION_APPROACH_CONTENT,
  CLOUD_MIGRATION_APPROACH_OPTIONS,
} from '@/constants/expertise/cloud-migration';

/**
 * Three migration-option cards with checklists - the structural idea behind
 * catworkx's "Full / Hybrid / Fresh Start" comparison and Praecipio's "big
 * bang vs. phased" framing, rewritten as our own three real paths.
 */
export function ApproachComparisonSection() {
  return (
    <Section className="bg-[#eaf8ff]">
      <SectionHeader
        label={CLOUD_MIGRATION_APPROACH_CONTENT.label}
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {CLOUD_MIGRATION_APPROACH_CONTENT.headingLead}
            <GradientText>{CLOUD_MIGRATION_APPROACH_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={CLOUD_MIGRATION_APPROACH_CONTENT.subheading}
      />

      <div
        className={cn(
          'mt-12 grid grid-cols-3 gap-6 to-900:grid-cols-1',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        {CLOUD_MIGRATION_APPROACH_OPTIONS.map((option) => (
          <Card key={option.id} as="article" variant="default" className="relative p-7">
            <div className="relative mb-4 h-16 w-16">
              <AppImage src={option.iconImage} alt="" fill sizes="56px" className="object-contain" />
            </div>
            <b className="mb-2 block text-[17px] font-500 tracking-[-.01em] text-title">
              {option.name}
            </b>
            <p className="mb-4 text-[13.5px] leading-[1.6] text-muted">{option.description}</p>
            <ul className="mb-5 space-y-2">
              {option.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-[13px] text-ink">
                  <Icon name="check" className="mt-0.5 shrink-0 text-brand-green" />
                  {point}
                </li>
              ))}
            </ul>
            <SmartLink
              href={ROUTES.discover.contact}
              className="inline-flex items-center gap-1.5 text-[13.5px] font-700 text-brand-600 transition-colors hover:text-brand-700"
            >
              Talk to an Expert
              <ArrowIcon />
            </SmartLink>
          </Card>
        ))}
      </div>
    </Section>
  );
}
