'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';
import { searchSchema, type SearchFormValues } from '@/lib/validation';
import { useAppDispatch } from '@/store/hooks';
import { rememberQuery, setQuery } from '@/store/slices/searchSlice';
import { Icon } from '@/components/ui/Icon';

/**
 * Site search input. Submitting navigates to `/search?q=…` rather than
 * filtering in place, so a result set is linkable and the back button behaves.
 */
export interface SearchProps {
  className?: string;
  placeholder?: string;
  /** Accessible name for the search landmark. */
  label?: string;
  autoFocus?: boolean;
  /** Override navigation - e.g. to filter a list in place. */
  onSubmitQuery?: (query: string) => void;
}

export function Search({
  className,
  placeholder = 'Search Clovity',
  label = 'Search the site',
  autoFocus = false,
  onSubmitQuery,
}: SearchProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: { query: '' },
  });

  const onSubmit = (values: SearchFormValues) => {
    dispatch(setQuery(values.query));
    dispatch(rememberQuery(values.query));
    if (onSubmitQuery) {
      onSubmitQuery(values.query);
      return;
    }
    router.push(`/search?q=${encodeURIComponent(values.query)}`);
  };

  return (
    <form
      role="search"
      aria-label={label}
      onSubmit={handleSubmit(onSubmit)}
      className={cn('w-full', className)}
      noValidate
    >
      <div className="relative flex items-center">
        <label htmlFor="site-search" className="sr-only">
          {label}
        </label>
        <Icon name="search"
          className="pointer-events-none absolute left-4 text-[13px] text-[#94a3b8]"
        />
        <input
          id="site-search"
          type="search"
          placeholder={placeholder}
          autoFocus={autoFocus}
          autoComplete="off"
          className="w-full rounded-full border border-[#e2e8f0] bg-white py-3 pl-11 pr-24 text-[14px] font-500 text-[#1e293b] outline-none transition-colors placeholder:text-[#94a3b8] focus:border-brand-600"
          aria-invalid={errors.query ? true : undefined}
          aria-describedby={errors.query ? 'site-search-error' : undefined}
          {...register('query')}
        />
        <button
          type="submit"
          className="btn-primary absolute right-1.5"
          style={{ padding: '8px 18px', fontSize: '13px' }}
        >
          Search
        </button>
      </div>
      {errors.query ? (
        <p
          id="site-search-error"
          role="alert"
          className="mt-2 text-[12.5px] text-red-600"
        >
          {errors.query.message}
        </p>
      ) : null}
    </form>
  );
}
