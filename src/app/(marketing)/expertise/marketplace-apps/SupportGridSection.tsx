import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { SmartLink } from '@/components/ui/Link';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { cn } from '@/lib/cn';
import {
  MARKETPLACE_APPS_SUPPORT_CARDS,
  MARKETPLACE_APPS_SUPPORT_CONTENT,
  MARKETPLACE_APPS_SUPPORT_LINK,
} from '@/constants/expertise/marketplace-apps';

/**
 * Cprime's deliberately lightweight "connected services" treatment - plain
 * icon + text link rows, no card chrome - rather than another icon-card
 * grid. Keeps this secondary section visually quieter than the app
 * showcase above it, which is where this page's real weight belongs.
 */
export function SupportGridSection() {
  return (
    <Section className="bg-[#eaf8ff]">
      <SectionHeader
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {MARKETPLACE_APPS_SUPPORT_CONTENT.headingLead}
            <GradientText>
              {MARKETPLACE_APPS_SUPPORT_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
      />
      <div
        className={cn(
          'mt-10 grid gap-1 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-line-soft',
          revealAligned('center'),
        )}
        {...revealAttrs()}
      >
        {MARKETPLACE_APPS_SUPPORT_CARDS.map((card) => (
          <div
            key={card.id}
            className="flex flex-col items-center px-5 py-4 text-center"
          >
            <Icon
              name={card.icon}
              size={30}
              className={cn('mb-3', card.iconChipClass)}
            />
            <b className="mb-1.5 block text-[20px] font-500 text-title">
              {card.title}
            </b>
            <p className="m-0 text-[16px] leading-[1.6] text-muted">
              {card.description}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <SmartLink
          href={MARKETPLACE_APPS_SUPPORT_LINK.href}
          forceExternal={MARKETPLACE_APPS_SUPPORT_LINK.external}
          className="inline-flex items-center gap-2 text-[14px] font-600 text-brand-600 underline decoration-brand-200 underline-offset-2 transition-colors hover:text-brand-700 hover:decoration-brand-600"
        >
          {MARKETPLACE_APPS_SUPPORT_LINK.label}
          <Icon name="arrow-right" className="text-sm" />
        </SmartLink>
      </div>
    </Section>
  );
}
