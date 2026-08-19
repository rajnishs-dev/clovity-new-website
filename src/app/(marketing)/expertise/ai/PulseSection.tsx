import { cn } from '@/lib/cn';
import { reveal, revealAligned, revealAttrs } from '@/lib/reveal';
import {
  Chip,
  GradientText,
  Icon,
  Section,
  SectionHeader,
} from '@/components/ui';
import { AppImage } from '@/components/ui/Image';
import { CtaGroup } from '@/components/common/CTA';
import {
  PULSE_AI_CAPABILITIES,
  PULSE_AI_CONTENT,
  PULSE_AI_CTAS,
} from '@/constants/home';
import { AI_PULSE_CONTENT } from '@/constants/ai';
import { appPulseAi } from '@/constants/media';

/**
 * "Most AI Consultancies Have Not Shipped One" - the Pulse AI spotlight.
 *
 * ── THE PRODUCT COPY IS IMPORTED, NOT RESTATED ──
 * `PULSE_AI_CONTENT`, `PULSE_AI_CAPABILITIES` and `PULSE_AI_CTAS` come from
 * `constants/home.ts`, the same three the home page's spotlight and
 * `expertise/atlassian`'s `AiAutomationSection` already render. So Pulse AI is described in
 * exactly one place in the codebase and this page cannot drift from the product. Only the
 * argument FOR it on an expertise page lives in `AI_PULSE_CONTENT`.
 *
 * Note `PULSE_AI_CONTENT.description` begins with a leading space and is written to follow
 * `productName` - it is a sentence fragment, not a standalone string. Rendering it without the
 * bolded product name in front produces " is an AI copilot for Jira...", which is why the two
 * are set as one paragraph below rather than in separate elements.
 *
 * ── WHY THIS SECTION IS SHAPED LIKE A PRODUCT CARD ──
 * Every other section on this page argues about services. This one has an actual artifact
 * behind it, and the artifact is the page's whole differentiator - none of the competitor sites
 * this page was modelled against ships a product of their own. So the right half is built to
 * look like what it is: a listing. Logo, name, description, capability chips, and the two real
 * CTAs (a free Marketplace install and the product collateral), which are the only outbound
 * links on this page that let a reader evaluate us without talking to us.
 *
 * The panel closes on the read-only disclosure. It is the first question a platform owner asks
 * about anything AI touching their Jira, and answering it inside the product card - rather than
 * only in the FAQ - is the difference between a claim and a commitment.
 */
export function PulseSection() {
  return (
    <Section padding="tight" className="bg-white">
      <div className="grid items-start gap-x-16 gap-y-10 ml:grid-cols-[minmax(0,430px)_1fr]">
        <div>
          <SectionHeader
            heading={
              <>
                {AI_PULSE_CONTENT.headingLead}
                <GradientText>{AI_PULSE_CONTENT.headingHighlight}</GradientText>
              </>
            }
            subheading={AI_PULSE_CONTENT.subheading}
            subheadingClassName="mt-4"
            align="left"
            className="mb-7"
          />

          <ul
            className={cn(
              'm-0 flex list-none flex-col gap-3',
              reveal('up', 150),
              'md:text-left',
            )}
            {...revealAttrs()}
          >
            {AI_PULSE_CONTENT.proofPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2.5 text-[14.5px] leading-[1.6] text-body"
              >
                <Icon
                  name="circle-check"
                  size={17}
                  aria-hidden
                  className="mt-[3px] shrink-0 text-brand-600"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div
          className={cn(
            'overflow-hidden rounded-[14px] border border-line-soft bg-white shadow-[0_18px_40px_-24px_rgba(37,99,235,.35)]',
            revealAligned('left'),
          )}
          {...revealAttrs()}
        >
          <div className="flex items-start gap-4 border-b border-line-faint bg-soft px-7 py-6">
            {/* Fixed 52x52 tile - no `sizes`, so Next emits a 1x/2x pair rather
                than one candidate per configured device width. */}
            <AppImage
              src={appPulseAi}
              alt="Pulse AI logo"
              width={52}
              height={52}
              // Arbitrary sizes, not `h-13 w-13` - Tailwind's default spacing
              // scale has no 13, so that class emits nothing and the tile would
              // fall back to its intrinsic 126px.
              className="h-[52px] w-[52px] shrink-0 rounded-[12px] object-cover"
            />
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2.5">
                <b className="text-[19px] font-600 tracking-[-.01em] text-title">
                  {PULSE_AI_CONTENT.productName}
                </b>
                <span className="rounded-md bg-atlassian px-2 py-1 text-[10px] font-800 uppercase tracking-[.06em] text-white">
                  Marketplace
                </span>
                <span className="rounded-md bg-[#dcfce7] px-2 py-1 text-[10px] font-800 uppercase tracking-[.06em] text-[#15803d]">
                  Free
                </span>
              </div>
              <p className="m-0 text-[13px] font-600 uppercase tracking-[.1em] text-faint">
                AI copilot for Jira
              </p>
            </div>
          </div>

          <div className="px-7 py-6">
            {/* `productName` + `description` set as ONE paragraph - the description
                is a fragment that starts mid-sentence. See the note above. */}
            <p className="m-0 mb-5 text-[14.5px] leading-[1.7] text-body">
              <b className="font-600 text-title">
                {PULSE_AI_CONTENT.productName}
              </b>
              {PULSE_AI_CONTENT.description}
            </p>

            <ul className="m-0 mb-6 flex list-none flex-wrap gap-2.5">
              {PULSE_AI_CAPABILITIES.map((capability) => (
                <li key={capability.id}>
                  <Chip
                    variant="a"
                    icon={<Icon name={capability.icon} size={13} aria-hidden />}
                  >
                    {capability.label}
                  </Chip>
                </li>
              ))}
            </ul>

            <CtaGroup ctas={PULSE_AI_CTAS} size="sm" />
          </div>

          <p className="m-0 flex items-start gap-2.5 border-t border-line-faint bg-soft px-7 py-4 text-[13px] leading-[1.6] text-muted">
            <Icon
              name="lock"
              size={15}
              aria-hidden
              className="mt-[3px] shrink-0 text-brand-600"
            />
            {AI_PULSE_CONTENT.footnote}
          </p>
        </div>
      </div>
    </Section>
  );
}
