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
import { isCmsConfigured, postRecordingRequest } from '@/api/cms';

/**
 * "Register Now!" - the webinar recording request form, ported from the published page.
 *
 * Same fields and `recordings` collection, same browser-side POST as `website-t`, so the
 * request carries `NEXT_PUBLIC_CMS_API_TOKEN` (Next inlines it into this chunk) and is
 * visible in a visitor's Network tab. The token needs `create` on `recording`, and
 * anyone reading the bundle can use it directly - the alternative was a Server Action,
 * which hides the token but shows a POST to this page instead of Strapi.
 *
 * Success is shown in place rather than by navigating to `/success`, since the visitor
 * is mid-article in a sidebar and losing their place to read one sentence is worse.
 */

const FIELD_CLASS =
  'w-full border-0 border-b border-line bg-transparent py-1.5 text-[14px] text-title outline-none transition-colors placeholder:text-faint focus:border-brand-600';

const ERROR_CLASS = 'mt-1 block text-[12.5px] text-red-600';

const GENERIC_ERROR =
  'Something went wrong sending your request. Please try again, or email sales@clovity.com.';

/** Titlecase, so "jane" and "Jane" are not two people in the admin panel's list. */
const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

export function RegisterForm({
  title,
  docId,
  whenLabel,
}: {
  title: string;
  /** The webinar's Strapi `documentId`, written to `recording.recordingDocId`. */
  docId: string;
  /** The session date as the CMS spells it. Fills the required `recordingMonth`. */
  whenLabel?: string;
}) {
  const formId = useId();
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
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

    /**
     * No CMS configured - report success rather than showing a visitor an error caused by
     * our own deployment state. Validation has already run, so a malformed address still
     * gets a message instead of a silent "sent".
     */
    if (!isCmsConfigured()) {
      setSent(true);
      return;
    }

    try {
      /**
       * `recordingMonth` and `recordingDocId` are BOTH required by the content type.
       * `website-t` fills the month from the webinar's `eventHeader`, which is null on
       * three of the four published sessions - so its own POST 400s there. The session
       * date, then the title, keeps the row valid and still identifies the webinar.
       */
      await postRecordingRequest({
        firstName: capitalize(values.firstName),
        lastName: capitalize(values.lastName),
        email: values.email,
        country: values.country,
        recordingDocId: docId,
        recordingMonth: whenLabel?.trim() || title.trim(),
      });
      setSent(true);
    } catch {
      // Strapi's own message is not shown: it is not useful to a visitor and it would
      // leak the collection's shape.
      setFormError(GENERIC_ERROR);
    }
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
        className="rounded-[10px] border border-line-soft bg-white p-5 shadow-xs"
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
    <div className="rounded-[10px] border border-line-soft bg-white p-5 shadow-xs">
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
