import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { Accordion } from '@/components/ui/Accordion';
import {
  CLOUD_MIGRATION_FAQ_CONTENT,
  CLOUD_MIGRATION_FAQS,
} from '@/constants/expertise/cloud-migration';

/**
 * FAQ accordion - the structural idea behind ServiceRocket's FAQ section.
 * Every answer reuses real content already established elsewhere on this
 * page (migration sources, the phased-waves approach, AGC, Pulse AI)
 * instead of stating a new timeline or price we can't back up.
 */
export function FaqSection() {
  return (
    <Section width="prose" className="bg-white">
      <SectionHeader
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {CLOUD_MIGRATION_FAQ_CONTENT.headingLead}
            <GradientText>
              {CLOUD_MIGRATION_FAQ_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
      />
      <Accordion
        items={CLOUD_MIGRATION_FAQS.map((faq) => ({
          id: faq.id,
          title: (
            <span className="text-[15px] font-600 text-title">
              {faq.question}
            </span>
          ),
          content: (
            <p className="m-0 pb-2 text-[14.5px] leading-[1.7] text-muted">
              {faq.answer}
            </p>
          ),
        }))}
        className="mt-10 rounded-[10px] border border-line-soft bg-white px-6"
        itemClassName="border-b border-line-faint last:border-b-0"
        triggerClassName="border-b-0 py-5"
        panelClassName="pb-1 pl-0"
      />
    </Section>
  );
}
