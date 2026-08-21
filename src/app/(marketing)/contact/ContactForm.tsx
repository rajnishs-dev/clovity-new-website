'use client';

import { useId, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/cn';
import { buildEnquirySchema, type EnquiryFormValues } from '@/lib/validation';
import type { ContactFormConfig } from '@/types/content';
import { isCmsConfigured, postEnquiry } from '@/api/cms';
import { useInTouch } from '@/api/cms.hooks';
import { Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/Link';
import { ROUTES } from '@/constants/routes';
import {
  CONTACT_FORM_CONTENT,
  CONTACT_FORM_SLUG,
  CONTACT_TOPICS,
} from '@/constants/contact';

/**
 * The contact form card.
 *
 * The published page's handler just called `preventDefault()` and showed the thank-you
 * panel - nothing was sent or validated. This reproduces the visuals but actually posts
 * to Strapi and validates first.
 *
 * Fields are driven by the CMS: the `get-in-touch` row decides whether name, company and
 * phone appear and whether each is required. Email, topic and message are always shown.
 *
 * The four short fields are paired dynamically rather than hard-coded into two rows,
 * since `.ct-row-2` is a two-column grid and a fixed row would leave a lone input beside
 * an empty half if the CMS hides one.
 *
 * The submit POSTs to Strapi from the browser, so the request is visible in a visitor's
 * Network tab - see the note on `onSubmit` for the trade-off.
 */

/* ── Shared field styling, from `.ct-field` ─────────────────────────────── */

const LABEL_CLASS =
  'mb-2 block text-[13.5px] font-800 tracking-[.01em] text-black';

const CONTROL_CLASS = cn(
  'w-full rounded-xl border border-line bg-white px-4 py-[13px] text-[14.5px] text-ink outline-none',
  'placeholder:text-faint',
  '[transition:border-color_.2s,box-shadow_.2s]',
  'focus:border-brand-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,.12)]',
);

/** Every field sits in a 20px-tall stack slot. */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: ReactNode;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className={LABEL_CLASS}>
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-[12.5px] text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Split the visible short fields into rows of two. */
function pairs<T>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (let index = 0; index < items.length; index += 2) {
    rows.push(items.slice(index, index + 2));
  }
  return rows;
}

export function ContactForm({
  /** Build-time snapshot. Refreshed in the browser - see `api/cms.hooks.ts`. */
  initialConfig,
}: {
  initialConfig: ContactFormConfig;
}) {
  const { data: config } = useInTouch(CONTACT_FORM_SLUG, initialConfig);
  const baseId = useId();
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(buildEnquirySchema(config)),
    defaultValues: {
      fullName: '',
      email: '',
      company: '',
      phone: '',
      topic: '',
      message: '',
      consent: false,
    },
    mode: 'onSubmit',
  });

  /**
   * A browser-side write (`POST .../contact-uses` plus the `get-in-touch-lead` row), so
   * it's visible in the Network tab. Two things the old Server Action did that this
   * can't: it re-validated against the config it fetched itself (a hand-crafted POST
   * here bypasses `config`'s rules), and it kept `CMS_API_TOKEN` server-side (this POST
   * uses the public token, which needs `create` on these collections).
   */
  const onSubmit = async (values: EnquiryFormValues) => {
    setFormError(null);

    // No CMS configured - behave as the published page did: reveal the thank-you panel.
    // Validation has already run, so a malformed address still gets a message.
    if (!isCmsConfigured()) {
      setSent(true);
      return;
    }

    try {
      await postEnquiry({
        email: values.email,
        message: values.message,
        ...(values.fullName ? { fullName: values.fullName } : {}),
        ...(values.company ? { company: values.company } : {}),
        ...(values.phone ? { phone: values.phone } : {}),
        ...(values.topic ? { topic: values.topic } : {}),
        emailSubject: config.emailSubject,
        ...(config.sourceId ? { sourceId: config.sourceId } : {}),
      });
      setSent(true);
    } catch {
      // Strapi's own message is never shown: it is not useful to a visitor and it would
      // leak the collection's shape.
      setFormError(CONTACT_FORM_CONTENT.errorFallback);
    }
  };

  const id = (name: string) => `${baseId}-${name}`;

  /* The short fields, in published order, minus any the CMS hides. */
  const shortFields: ReactNode[] = [];

  if (config.showFullName) {
    shortFields.push(
      <Field
        key="fullName"
        id={id('fullName')}
        label={CONTACT_FORM_CONTENT.fields.fullName.label}
        error={errors.fullName?.message}
      >
        <input
          id={id('fullName')}
          type="text"
          autoComplete="name"
          placeholder={CONTACT_FORM_CONTENT.fields.fullName.placeholder}
          className={CONTROL_CLASS}
          aria-invalid={errors.fullName ? true : undefined}
          aria-describedby={
            errors.fullName ? `${id('fullName')}-error` : undefined
          }
          {...register('fullName')}
        />
      </Field>,
    );
  }

  shortFields.push(
    <Field
      key="email"
      id={id('email')}
      label={CONTACT_FORM_CONTENT.fields.email.label}
      error={errors.email?.message}
    >
      <input
        id={id('email')}
        type="email"
        autoComplete="email"
        placeholder={CONTACT_FORM_CONTENT.fields.email.placeholder}
        className={CONTROL_CLASS}
        aria-invalid={errors.email ? true : undefined}
        aria-describedby={errors.email ? `${id('email')}-error` : undefined}
        {...register('email')}
      />
    </Field>,
  );

  if (config.showCompany) {
    shortFields.push(
      <Field
        key="company"
        id={id('company')}
        label={CONTACT_FORM_CONTENT.fields.company.label}
        error={errors.company?.message}
      >
        <input
          id={id('company')}
          type="text"
          autoComplete="organization"
          placeholder={CONTACT_FORM_CONTENT.fields.company.placeholder}
          className={CONTROL_CLASS}
          aria-invalid={errors.company ? true : undefined}
          aria-describedby={
            errors.company ? `${id('company')}-error` : undefined
          }
          {...register('company')}
        />
      </Field>,
    );
  }

  if (config.showPhone) {
    shortFields.push(
      <Field
        key="phone"
        id={id('phone')}
        label={
          <>
            {CONTACT_FORM_CONTENT.fields.phone.label}{' '}
            {config.requirePhone ? null : (
              <span className="font-600 text-faint">
                {CONTACT_FORM_CONTENT.fields.phone.optionalNote}
              </span>
            )}
          </>
        }
        error={errors.phone?.message}
      >
        <input
          id={id('phone')}
          type="tel"
          autoComplete="tel"
          placeholder={CONTACT_FORM_CONTENT.fields.phone.placeholder}
          className={CONTROL_CLASS}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? `${id('phone')}-error` : undefined}
          {...register('phone')}
        />
      </Field>,
    );
  }

  if (sent) {
    return (
      <div role="status" aria-live="polite" className="px-3 py-9 text-center">
        <Icon
          name="circle-check"
          className="mb-4 text-[38px] text-brand-green"
        />
        <b className="mb-2 block text-[19px] text-ink">
          {CONTACT_FORM_CONTENT.successTitle}
        </b>
        <p className="m-0 text-[14.5px] text-muted">
          {CONTACT_FORM_CONTENT.successBody}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-2 text-[clamp(20px,2vw,26px)] font-500 tracking-[-.01em] text-black">
        {CONTACT_FORM_CONTENT.heading}
      </h2>
      <p className="mb-7 text-[15px] text-muted">
        {CONTACT_FORM_CONTENT.description}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {pairs(shortFields).map((row, index) => (
          <div
            // Rows are positional and their contents are stable per config, so the
            // index is the only identity they have.
            key={`row-${index}`}
            className="grid grid-cols-2 gap-4 to-520:grid-cols-1"
          >
            {row}
          </div>
        ))}

        <Field
          id={id('topic')}
          label={CONTACT_FORM_CONTENT.fields.topic.label}
          error={errors.topic?.message}
        >
          <select
            id={id('topic')}
            className={CONTROL_CLASS}
            defaultValue=""
            aria-invalid={errors.topic ? true : undefined}
            aria-describedby={errors.topic ? `${id('topic')}-error` : undefined}
            {...register('topic')}
          >
            <option value="">
              {CONTACT_FORM_CONTENT.fields.topic.placeholder}
            </option>
            {CONTACT_TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id={id('message')}
          label={CONTACT_FORM_CONTENT.fields.message.label}
          error={errors.message?.message}
        >
          <textarea
            id={id('message')}
            rows={5}
            placeholder={CONTACT_FORM_CONTENT.fields.message.placeholder}
            className={cn(CONTROL_CLASS, 'min-h-[120px] resize-y')}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={
              errors.message ? `${id('message')}-error` : undefined
            }
            {...register('message')}
          />
        </Field>

        <div className="mb-5">
          <label
            htmlFor={id('consent')}
            className="flex items-start gap-2.5 text-[13.5px] leading-[1.5] text-black"
          >
            <input
              id={id('consent')}
              type="checkbox"
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-line text-brand-600 focus:ring-2 focus:ring-brand-600/30"
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={
                errors.consent ? `${id('consent')}-error` : undefined
              }
              {...register('consent')}
            />
            <span>
              {CONTACT_FORM_CONTENT.fields.consent.text}{' '}
              {CONTACT_FORM_CONTENT.fields.consent.dataNote}{' '}
              <TextLink
                href={ROUTES.legal.privacy}
                className="no-underline hover:underline"
              >
                {CONTACT_FORM_CONTENT.fields.consent.privacyLinkLabel}
              </TextLink>
            </span>
          </label>
          {errors.consent ? (
            <p
              id={`${id('consent')}-error`}
              role="alert"
              className="mt-1.5 text-[12.5px] text-red-600"
            >
              {errors.consent.message}
            </p>
          ) : null}
          <p className="mt-2.5 text-[13px] text-gray-800">
            {CONTACT_FORM_CONTENT.fields.consent.withdrawNote}{' '}
            <a
              href={`mailto:${CONTACT_FORM_CONTENT.fields.consent.withdrawEmail}`}
              className="text-brand-600 no-underline hover:underline"
            >
              {CONTACT_FORM_CONTENT.fields.consent.withdrawEmail}
            </a>
            .
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting || undefined}
          className={buttonClass('primary', 'md', 'justify-center')}
        >
          {isSubmitting
            ? CONTACT_FORM_CONTENT.submittingLabel
            : CONTACT_FORM_CONTENT.submitLabel}
          <Icon name="send" className="text-xs" />
        </button>

        {formError ? (
          <p role="alert" className="mt-3 text-[13px] text-red-600">
            {formError}
          </p>
        ) : null}
      </form>
    </div>
  );
}
