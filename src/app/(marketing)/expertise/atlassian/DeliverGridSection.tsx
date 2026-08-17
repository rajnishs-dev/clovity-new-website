import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { Card, CardIcon } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { cn } from '@/lib/cn';
import {
  ATLASSIAN_DELIVER_CARDS,
  ATLASSIAN_DELIVER_CONTENT,
} from '@/constants/expertise/atlassian';

/**
 * Uses the plain `Card` (lift + shadow on hover, no underline) rather than
 * `variant="expertise"` - that variant's gradient underline animates in on
 * hover, which read as a link affordance these cards don't have (there's no
 * dedicated sub-page per service yet).
 */
export function DeliverGridSection() {
  return (
    <Section className="bg-[#eaf8ff]">
      <SectionHeader
        label={ATLASSIAN_DELIVER_CONTENT.label}
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {ATLASSIAN_DELIVER_CONTENT.headingLead}
            <GradientText>{ATLASSIAN_DELIVER_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={ATLASSIAN_DELIVER_CONTENT.subheading}
      />
      <div
        className={cn(
          'mt-12 grid grid-cols-3 gap-6 to-900:grid-cols-1',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        {ATLASSIAN_DELIVER_CARDS.map((card) => (
          <Card key={card.id} as="article" variant="default" className="p-8">
            <CardIcon className={cn('mb-5 bg-white', card.iconChipClass)}>
              <Icon name={card.icon} size={26} />
            </CardIcon>
            <b className="mb-2.5 block text-[18px] font-500 tracking-[-.01em] text-title">
              {card.title}
            </b>
            <p className="m-0 text-[14.5px] leading-[1.7] text-muted">
              {card.description}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
