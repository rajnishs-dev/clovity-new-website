'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsletterSchema, type NewsletterFormValues } from '@/lib/validation';
import { isApiConfigured } from '@/services/api/axios';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  markNewsletterSubscribedLocally,
  subscribeToNewsletter,
} from '@/store/slices/contactSlice';
import { buttonClass } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

/**
 * Footer newsletter form, as Tailwind utilities.
 *
 * MIGRATION NOTE - the input's focus ring used to be inline
 * `onfocus="this.style.borderColor='#2563eb'"` on top of an inline `style`
 * attribute. Because inline styles beat classes, a Tailwind `focus:` variant could
 * not have won against it, so the previous port reproduced it with React state.
 * With the inline style gone, `focus:border-brand-600` does the job - the state,
 * the two handlers and the re-render on every focus all disappear.
 *
 * Behavioural parity while the backend is pending: the legacy handler called
 * `preventDefault()` and revealed the thank-you line. When the API is not
 * configured this does the same, so the UX is unchanged; once
 * `NEXT_PUBLIC_ENABLE_CMS=true` the same submit posts to the real endpoint. What
 * is genuinely new is validation - an invalid address now gets a message instead
 * of silent "success".
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: '', source },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: NewsletterFormValues) => {
    if (!isApiConfigured()) {
      dispatch(markNewsletterSubscribedLocally());
      reset({ email: '', source });
      return;
    }
    const result = await dispatch(
      subscribeToNewsletter({ email: values.email, source }),
    );
    if (subscribeToNewsletter.fulfilled.match(result)) {
      reset({ email: '', source });
    }
  };

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
