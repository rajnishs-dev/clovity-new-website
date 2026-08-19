import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import type { ContactFormConfig } from '@/types/content';
import { AppImage, Icon, Section, SmartLink } from '@/components/ui';
import { CONTACT_CHANNELS, CONTACT_SIDE_CONTENT } from '@/constants/contact';
import { contactWorldMap } from '@/constants/media';
import { ContactForm } from './ContactForm';

/**
 * The form-and-side-card split. `1.15fr .85fr` above 1020px (the form holds two-up
 * rows, the side card is a single list), one column below.
 *
 * The side card is a Server Component so only the form ships JavaScript - that's why
 * they're separate components rather than one.
 *
 * `items-start`, not `items-center`: the side card is shorter than the form, and
 * centring it would float it beside the form's middle rather than its top edge.
 */
export function ContactSection({ config }: { config: ContactFormConfig }) {
  return (
    <Section className="bg-white">
      <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_.85fr] to-1020:grid-cols-1">
        <div
          className={cn(
            'relative rounded-[10px] border border-line-soft bg-white p-10 shadow-[0_20px_50px_-22px_rgba(15,23,42,.14)] to-640:px-[22px] to-640:py-7',
            revealAligned('left', 'left'),
          )}
          {...revealAttrs()}
        >
          <ContactForm initialConfig={config} />
        </div>

        <aside
          className={cn(
            'relative overflow-hidden rounded-[10px] border border-line-soft px-8 py-9',
            revealAligned('left', 'right'),
          )}
          {...revealAttrs()}
        >
          {/* Light bg image - the same world map `website-t`'s ScheduleDemo
              widget uses, tinted with a translucent wash so it reads as
              texture behind the content rather than competing with it. */}
          <AppImage src={contactWorldMap} alt="" fill unoptimized />
          <div className="absolute inset-0 bg-[#f8faff]/75" />

          <p className="relative z-[1] mb-[22px] text-[12px] font-800 uppercase tracking-[.1em] text-brand-600">
            {CONTACT_SIDE_CONTENT.directHeading}
          </p>

          {CONTACT_CHANNELS.map((channel) => (
            <div
              key={channel.id}
              className="relative z-[1] mb-5 flex items-start gap-3.5"
            >
              <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl text-[22px] text-brand-600">
                {/* Size comes from the chip's own text-[22px] - ~52% of 42px. */}
                <Icon name={channel.icon} size={24} />
              </span>
              <div>
                <b className="mb-[3px] block text-[12.5px] font-700 uppercase tracking-[.04em] text-faint">
                  {channel.label}
                </b>
                {channel.href ? (
                  <SmartLink
                    href={channel.href}
                    className="text-[14.5px] font-600 text-title no-underline transition-colors hover:text-brand-700"
                  >
                    {channel.value}
                  </SmartLink>
                ) : (
                  <span className="text-[14.5px] font-600 text-title">
                    {channel.value}
                  </span>
                )}
              </div>
            </div>
          ))}

          <div className="relative z-[1] my-6 border-t border-line-soft" />

          <p className="relative z-[1] mb-4 text-[12px] font-800 uppercase tracking-[.1em] text-brand-600">
            {CONTACT_SIDE_CONTENT.nextHeading}
          </p>
          <ol className="relative z-[1] m-0 flex list-none flex-col gap-3.5 p-0">
            {CONTACT_SIDE_CONTENT.steps.map((step, index) => (
              <li
                key={step}
                className="flex gap-3 text-[13.5px] leading-[1.55] text-muted"
              >
                <span
                  aria-hidden
                  className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-brand-200 bg-brand-50 text-[11px] font-800 text-brand-600"
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
