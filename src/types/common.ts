import type { ReactNode } from 'react';

/** Anything that can be rendered as a child. */
export type Children = { children?: ReactNode };

/** Standard prop bag every presentational component accepts. */
export type WithClassName = { className?: string };

/** Discriminated loading state for any async slice of UI. */
export type AsyncState = 'idle' | 'loading' | 'succeeded' | 'failed';

/** A value that may not have arrived yet. */
export type Maybe<T> = T | null | undefined;

/** Make `K` required on an otherwise partial `T`. */
export type RequireOnly<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/** Union of the values of a const object — safer than enums. */
export type ValueOf<T> = T[keyof T];

/** Shared visual scales used across the UI kit. */
export type Size = 'sm' | 'md' | 'lg';

export type Tone =
  'brand' | 'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';
