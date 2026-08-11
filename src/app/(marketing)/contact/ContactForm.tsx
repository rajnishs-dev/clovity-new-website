'use client';

import { useId, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/cn';
import { buildEnquirySchema, type EnquiryFormValues } from '@/lib/validation';
import type { ContactFormConfig } from '@/types/content';
import { useInTouch } from '@/api/cms.hooks';
import { Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import {
  CONTACT_FORM_CONTENT,
  CONTACT_FORM_SLUG,
  CONTACT_TOPICS,
} from '@/constants/contact';
import { submitEnquiryAction } from './actions';

/**
 * The contact form card.
 *
 * WHAT THE PUBLISHED PAGE DID AND WHAT THIS DOES DIFFERENTLY —
 * `handleContactForm()` there called `preventDefault()`, hid the form and showed the
 * thank-you panel. Nothing was sent, nothing was validated. The visuals are reproduced
 * exactly; what is new is that a submission now reaches Strapi and that an invalid
 * entry gets a message instead of a silent success.
 *
 * FIELDS ARE DRIVEN BY THE CMS. The Strapi `get-in-touch` row for this page decides
 * whether name, company and phone appear and whether each is required. Email, topic and
 * message are always present — they are the enquiry, and hiding one would leave a form
 * that cannot be acted on.
 *
 * The four short fields are PAIRED DYNAMICALLY rather than hard-coded into two rows.
 * `.ct-row-2` is a two-column grid, so if an editor hides one field a fixed row would
 * render one input beside an empty half. Chunking the visible ones keeps every row
 * full, and with all four shown it produces the published pairing exactly:
 * name + email, then company + phone.
 *
 * The submit goes through a Server Action, so the Strapi write token stays on the
 * server — see `../actions.ts`.
 */

/* ── Shared field styling, from `.ct-field` ─────────────────────────────── */

const LABEL_CLASS =
  'mb-2 block text-[12.5px] font-800 tracking-[.01em] text-[#334155]';

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
  /** Build-time snapshot. Refreshed in the browser — see `api/cms.hooks.ts`. */
  initialConfig,
}: {
  initialConfig: ContactFormConfig;
}) {
  const { data: config } = useInTouch(
    CONTACT_FORM_SLUG,
    initialConfig,
  );
  const baseId = useId();
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
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
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: EnquiryFormValues) => {
    setFormError(null);
    const result = await submitEnquiryAction(values);

    if (result.ok) {
      setSent(true);
      return;
    }

    // Field-level messages from the server take precedence over the banner, so the
    // visitor is pointed at the input rather than told "something is wrong".
    for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
      const message = messages[0];
      if (!message) continue;
      if (field in values) {
        setError(field as keyof EnquiryFormValues, { message });
      }
    }
    setFormError(result.message);
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
      <div
        role="status"
        aria-live="polite"
        className="px-3 py-9 text-center"
      >
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
      <h2 className="mb-2 text-[clamp(20px,2vw,26px)] font-500 tracking-[-.01em] text-title">
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

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting || undefined}
          className={buttonClass('primary', 'md', 'w-full justify-center')}
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
