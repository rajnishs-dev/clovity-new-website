'use client';

import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  webinarRegistrationSchema,
  type WebinarRegistrationValues,
} from '@/lib/validation';
import { COUNTRIES } from '@/constants/countries';
import { buttonClass } from '@/components/ui/Button';
import { registerRecordingAction } from './actions';

/**
 * "Register Now!" - the webinar recording request form, ported from the published
 * webinar page.
 *
 * SAME FORM, SAME COLLECTION: the four fields, their copy, their required-ness and the
 * `recordings` row they produce all match `website-t`'s version, so requests from either
 * site land as one comparable set of leads.
 *
 * TWO DELIBERATE DIFFERENCES from that version, both about not shipping a write token to
 * the browser and not losing a lead:
 *
 *  • The submit goes through a Server Action (`./actions`), not a browser POST carrying
 *    `NEXT_PUBLIC_CMS_API_TOKEN`.
 *  • Success is shown IN PLACE rather than by navigating to `/success`. The visitor is
 *    mid-page on an article; throwing them to a different route to read one sentence
 *    loses their place, and this page has no other reason to navigate.
 */

const FIELD_CLASS =
  'w-full border-0 border-b border-line bg-transparent py-1.5 text-[14px] text-title outline-none transition-colors placeholder:text-faint focus:border-brand-600';

const ERROR_CLASS = 'mt-1 block text-[12.5px] text-red-600';

export function RegisterForm({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const formId = useId();
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<WebinarRegistrationValues>({
    resolver: zodResolver(webinarRegistrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      country: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: WebinarRegistrationValues) => {
    setFormError(null);
    // The session comes from the prop, not the form: nothing the visitor types decides
    // which webinar they asked about.
    const result = await registerRecordingAction(slug, values);

    if (result.ok) {
      setSent(true);
      return;
    }

    // Field-level messages from the server's own re-validation take precedence over the
    // banner, so a rejected address lands on the address rather than above the form.
    for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
      const message = messages[0];
      if (!message) continue;
      if (field in values) {
        setError(field as keyof WebinarRegistrationValues, { message });
      }
    }
    setFormError(result.message);
  };

  /**
   * A submit that validated to nothing renderable would look like a dead button, which
   * is exactly how a stray non-input field in the schema failed silently once. If the
   * resolver ever rejects a key with no visible input, say so instead of doing nothing.
   */
  const onInvalid = (formErrors: typeof errors) => {
    const rendered = ['firstName', 'lastName', 'email', 'country'];
    const hidden = Object.keys(formErrors).filter((key) => !rendered.includes(key));
    setFormError(
      hidden.length
        ? 'Something is wrong with this form. Please email sales@clovity.com.'
        : null,
    );
  };

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-[8px] border border-line-soft bg-white p-5 shadow-xs"
      >
        <h3 className="mb-2 text-[19px] font-500 text-title">
          You&apos;re registered
        </h3>
        <p className="text-[14px] leading-[1.65] text-body">
          We&apos;ll email the recording of{' '}
          <span className="font-600 text-title">{title}</span> to the address
          you gave us.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[8px] border border-line-soft bg-white p-5 shadow-xs">
      <h3 className="mb-2 text-[24px] font-600 leading-[1.2] text-navy">
        Register Now!
      </h3>
      <p className="mb-6 text-[14px] leading-[1.5] text-body">
        *If you can&apos;t make it to the live session, sign up anyway and
        we&apos;ll send you the recording.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="flex flex-col gap-5"
      >
        <div>
          <label htmlFor={`${formId}-first`} className="sr-only">
            First Name
          </label>
          <input
            id={`${formId}-first`}
            type="text"
            autoComplete="given-name"
            placeholder="First Name"
            aria-invalid={errors.firstName ? true : undefined}
            className={FIELD_CLASS}
            {...register('firstName')}
          />
          {errors.firstName ? (
            <span role="alert" className={ERROR_CLASS}>
              {errors.firstName.message}
            </span>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-last`} className="sr-only">
            Last Name
          </label>
          <input
            id={`${formId}-last`}
            type="text"
            autoComplete="family-name"
            placeholder="Last Name"
            aria-invalid={errors.lastName ? true : undefined}
            className={FIELD_CLASS}
            {...register('lastName')}
          />
          {errors.lastName ? (
            <span role="alert" className={ERROR_CLASS}>
              {errors.lastName.message}
            </span>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-email`} className="sr-only">
            Email
          </label>
          <input
            id={`${formId}-email`}
            type="email"
            autoComplete="email"
            placeholder="Email"
            aria-invalid={errors.email ? true : undefined}
            className={FIELD_CLASS}
            {...register('email')}
          />
          {errors.email ? (
            <span role="alert" className={ERROR_CLASS}>
              {errors.email.message}
            </span>
          ) : null}
        </div>

        <div>
          <label htmlFor={`${formId}-country`} className="sr-only">
            Select Country
          </label>
          {/*
            A native <select>, not the site's `Select` component: that one is a
            listbox built for a handful of filter options, and 249 countries in it
            would lose the type-to-jump and scroll behaviour a native control gives
            for free on both desktop and mobile.
          */}
          <select
            id={`${formId}-country`}
            autoComplete="country-name"
            aria-invalid={errors.country ? true : undefined}
            defaultValue=""
            className={`${FIELD_CLASS} appearance-none`}
            {...register('country')}
          >
            <option value="" disabled>
              Select Country
            </option>
            {COUNTRIES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {errors.country ? (
            <span role="alert" className={ERROR_CLASS}>
              {errors.country.message}
            </span>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonClass(
            'primary',
            'md',
            'w-full justify-center uppercase tracking-[.04em] disabled:cursor-not-allowed disabled:opacity-60',
          )}
        >
          {isSubmitting ? 'Sending…' : 'Get Recording'}
        </button>

        {formError ? (
          <p role="alert" className="text-[13px] text-red-600">
            {formError}
          </p>
        ) : null}
      </form>
    </div>
  );
}
