import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { ContactFormConfig } from '@/types/content';
import { Icon, Section, SmartLink } from '@/components/ui';
import {
  CONTACT_CHANNELS,
  CONTACT_SIDE_CONTENT,
} from '@/constants/contact';
import { ContactForm } from './ContactForm';

/**
 * The form-and-side-card split.
 *
 * `1.15fr .85fr` above 1020px, one column below - the form gets the extra width
 * because it holds two-up rows and the side card is a single list.
 *
 * The side card is a Server Component: it is static content, so only the form itself
 * ships JavaScript. That is why the two are separate components rather than one - the
 * card's markup would otherwise be dragged into the client bundle for no reason.
 *
 * `items-start` on the grid, not `items-center`: the side card is shorter than the
 * form, and centring it would leave it floating beside the middle of the form rather
 * than aligned with its top edge.
 */
export function ContactSection({ config }: { config: ContactFormConfig }) {
  return (
    <Section className="bg-white">
      <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_.85fr] to-1020:grid-cols-1">
        <div
          className={cn(
            'relative rounded-3xl border border-line-soft bg-white p-10 shadow-[0_20px_50px_-22px_rgba(15,23,42,.14)] to-640:px-[22px] to-640:py-7',
            revealAligned('left', 'left'),
          )}
          {...revealAttrs()}
        >
          <ContactForm initialConfig={config} />
        </div>

        <aside
          className={cn(
            'relative overflow-hidden rounded-3xl bg-[linear-gradient(160deg,#0b1730_0%,#152a6b_60%,#1d3a8a_100%)] px-8 py-9 text-white',
            revealAligned('left', 'right'),
          )}
          {...revealAttrs()}
        >
          <p className="relative z-[1] mb-[22px] text-[12px] font-800 uppercase tracking-[.1em] text-[#fdba74]">
            {CONTACT_SIDE_CONTENT.directHeading}
          </p>

          {CONTACT_CHANNELS.map((channel) => (
            <div
              key={channel.id}
              className="relative z-[1] mb-5 flex items-start gap-3.5"
            >
              <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-white/[.16] bg-white/10 text-[22px] text-[#fdba74]">
                {/* Size comes from the chip's own text-[22px] - ~52% of 42px. */}
                <Icon name={channel.icon} />
              </span>
              <div>
                <b className="mb-[3px] block text-[12.5px] font-700 uppercase tracking-[.04em] text-faint">
                  {channel.label}
                </b>
                {channel.href ? (
                  <SmartLink
                    href={channel.href}
                    className="text-[14.5px] font-600 text-white no-underline transition-colors hover:text-[#fdba74]"
                  >
                    {channel.value}
                  </SmartLink>
                ) : (
                  <span className="text-[14.5px] font-600 text-white">
                    {channel.value}
                  </span>
                )}
              </div>
            </div>
          ))}

          <div className="relative z-[1] my-6 border-t border-white/[.12]" />

          <p className="relative z-[1] mb-4 text-[12px] font-800 uppercase tracking-[.1em] text-[#fdba74]">
            {CONTACT_SIDE_CONTENT.nextHeading}
          </p>
          <ol className="relative z-[1] m-0 flex list-none flex-col gap-3.5 p-0">
            {CONTACT_SIDE_CONTENT.steps.map((step, index) => (
              <li
                key={step}
                className="flex gap-3 text-[13.5px] leading-[1.55] text-[#cbd8f5]"
              >
                <span
                  aria-hidden
                  className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-[rgba(253,186,116,.35)] bg-[rgba(253,186,116,.15)] text-[11px] font-800 text-[#fdba74]"
                >
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </Section>
  );
}
