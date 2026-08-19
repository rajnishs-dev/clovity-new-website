'use client';

import { useState } from 'react';
import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/cn';
import {
  ATLASSIAN_SUITE_CONTENT,
  ATLASSIAN_SUITE_TABS,
} from '@/constants/expertise/atlassian';

const TAB_ID_PREFIX = 'suite-coverage';

export function SuiteCoverageSection() {
  const [activeId, setActiveId] = useState(ATLASSIAN_SUITE_TABS[0]!.id);
  const activeTab = ATLASSIAN_SUITE_TABS.find((tab) => tab.id === activeId)!;

  return (
    <Section className="bg-soft">
      <SectionHeader
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {ATLASSIAN_SUITE_CONTENT.headingLead}
            <GradientText>
              {ATLASSIAN_SUITE_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
      />

      <div className="mt-10">
        <Tabs
          items={ATLASSIAN_SUITE_TABS.map((tab) => ({
            id: tab.id,
            label: (
              // `min-w-0` on the inner span as well as on the tab itself - a nested
              // flex container has its own `min-width:auto` floor, so relaxing only
              // the button leaves this span holding the row open. See `tabClassName`.
              <span className="flex min-w-0 items-center gap-2">
                <Icon name={tab.icon} size={16} />
                {tab.label}
              </span>
            ),
          }))}
          activeId={activeId}
          onChange={setActiveId}
          label="Atlassian suite coverage"
          orientation="horizontal"
          idPrefix={TAB_ID_PREFIX}
          className="mx-auto flex max-w-[560px] justify-center gap-2 rounded-pill border border-line-soft bg-white p-1.5"
          // `min-w-0` is load-bearing, not tidying. `flex-1` is `flex:1 1 0%`, but a
          // flex item also has `min-width:auto`, which refuses to shrink below its
          // CONTENT width - so at 390px these four tabs held the strip 25px wider than
          // the viewport and the whole PAGE scrolled sideways, not just the strip.
          // Measured: 415px document against a 390px viewport, back to exactly 390 with
          // this in place.
          tabClassName="min-w-0 flex-1 rounded-pill px-4 py-2.5 text-[13.5px] font-600 text-muted transition-colors"
          activeTabClassName="bg-brand-600 text-white"
        />

        <TabPanel
          tabId={activeId}
          idPrefix={TAB_ID_PREFIX}
          className={cn(
            'mx-auto mt-8 max-w-[720px] rounded-[10px] border border-line-soft bg-white p-8 sm:p-10',
          )}
        >
          <b className="mb-2 block text-[19px] font-500 tracking-[-.01em] text-title">
            {activeTab.title}
          </b>
          <p className="mb-6 text-[15px] leading-[1.7] text-muted">
            {activeTab.description}
          </p>
          <ul className="space-y-3">
            {activeTab.points.map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 text-[14.5px] text-muted"
              >
                <Icon
                  name="circle-check"
                  className="mt-0.5 shrink-0 text-brand-600"
                />
                {point}
              </li>
            ))}
          </ul>
        </TabPanel>
      </div>
    </Section>
  );
}
