'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema, type NewsletterFormValues } from '@/lib/validation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  resetNewsletter,
  subscribeToNewsletter,
} from '@/store/slices/contactSlice';
import { buttonClass } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

/**
 * Footer newsletter form. `subscribeToNewsletter` posts directly to Strapi's
 * `subscribe` collection from the browser (visible in the Network tab); with
 * no CMS configured the thunk reports success without writing, matching the
 * legacy handler. New here: an invalid address gets a message instead of a silent "success".
 */
export interface NewsletterProps {
  /** Recorded with the subscription so signup sources can be attributed. */
  source?: string;
  className?: string;
  heading?: string;
  description?: string;
}

export function Newsletter({
  source = 'footer',
  className,
  heading = 'Stay Updated',
  description = 'Get the latest Atlassian and AI insights directly in your inbox.',
}: NewsletterProps) {
  const dispatch = useAppDispatch();
  const { status, message } = useAppSelector(
    (state) => state.contact.newsletter,
  );

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '', source },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: NewsletterFormValues) => {
    // The "CMS not configured" case is handled inside the thunk, which reports success
    // without writing - so there is no branch here.
    const result = await dispatch(
      subscribeToNewsletter({ email: values.email, source }),
    );
    if (subscribeToNewsletter.fulfilled.match(result)) {
      reset({ email: '', source });
    }
  };

  /**
   * The confirmation clears itself after five seconds. Not cosmetic: this
   * state lives in Redux, shared by every `<Newsletter>` on the page, so
   * without this it would linger under an empty input after navigation.
   */
  useEffect(() => {
    if (status !== 'succeeded') return;
    const timer = setTimeout(() => dispatch(resetNewsletter()), 5000);
    return () => clearTimeout(timer);
  }, [status, dispatch]);

  /** Clicking away dismisses a validation message, as the published footer does. */
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        clearErrors();
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [clearErrors]);

  const isBusy = isSubmitting || status === 'loading';

  return (
    <div className={className}>
      <h4 className="mb-5 text-[16px] font-600 tracking-wide text-white">
        {heading}
      </h4>
      <p className="mb-4 text-[15px] leading-[1.65] text-white">
        {description}
      </p>

      <form
        ref={formRef}
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Your work email
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="Your work email"
          className="w-full rounded-xl border border-white/[.12] bg-white/[.07] px-4 py-3 text-[13.5px] font-500 text-white outline-none transition-all focus:border-brand-600"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'newsletter-email-error' : undefined}
          {...register('email')}
        />

        <button
          type="submit"
          className={buttonClass(
            'primary',
            'md',
            'w-full justify-center px-5 py-[11px] text-[13.5px]',
          )}
          disabled={isBusy}
          aria-busy={isBusy || undefined}
        >
          {isBusy ? 'Subscribing…' : 'Subscribe'}
          <Icon name="send" className="text-xs" />
        </button>
      </form>

      {errors.email ? (
        <p
          id="newsletter-email-error"
          role="alert"
          className="mt-2 text-[12.5px] text-red-400"
        >
          {errors.email.message}
        </p>
      ) : null}

      {status === 'succeeded' ? (
        <p role="status" className="mt-2 text-[12.5px] text-green-400">
          {message ?? 'Thank you for subscribing!'}
        </p>
      ) : null}

      {status === 'failed' && message ? (
        <p role="alert" className="mt-2 text-[12.5px] text-red-400">
          {message}
        </p>
      ) : null}
    </div>
  );
}
