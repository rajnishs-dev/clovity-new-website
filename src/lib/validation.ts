import { z } from 'zod';

/**
 * Zod schemas shared by React Hook Form (client) and, later, the Express API
 * (server). One definition means the two can never disagree about what a valid
 * submission looks like - the most common source of "the form said OK but the
 * API rejected it" bugs.
 */

/**
 * Deliberately not a full RFC-5322 implementation. `z.string().email()` plus a
 * TLD requirement rejects everything a typo produces without rejecting valid
 * addresses that stricter regexes get wrong.
 */
const email = z
  .string()
  .trim()
  .min(1, 'Email is required.')
  .email('Enter a valid email address.')
  .max(254, 'That email address is too long.')
  .refine((value) => /\.[a-z]{2,}$/i.test(value), {
    message: 'Enter a valid email address, including the domain.',
  });

export const newsletterSchema = z.object({
  email,
  /** Which form instance submitted - footer, blog sidebar, modal. */
  source: z.string().optional(),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export const contactSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(120, 'That name is too long.'),
  workEmail: email,
  company: z
    .string()
    .trim()
    .max(160, 'That company name is too long.')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .trim()
    // Digits, spaces and the usual separators - permissive on purpose, because
    // international formats vary far more than most patterns allow for.
    .regex(/^[\d\s()+.-]{7,24}$/, 'Enter a valid phone number.')
    .optional()
    .or(z.literal('')),
  interest: z.string().trim().max(120).optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(20, 'Please give us at least a sentence or two (20 characters).')
    .max(4000, 'Please keep the message under 4000 characters.'),
  consent: z.literal(true, {
    message: 'Please confirm you agree to be contacted.',
  }),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const searchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(2, 'Enter at least two characters.')
    .max(120, 'That search is too long.'),
});

export type SearchFormValues = z.infer<typeof searchSchema>;

export const careerApplicationSchema = z.object({
  fullName: z.string().trim().min(2, 'Please enter your full name.'),
  email,
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s()+.-]{7,24}$/, 'Enter a valid phone number.'),
  linkedIn: z
    .string()
    .trim()
    .url('Enter a valid URL.')
    .optional()
    .or(z.literal('')),
  coverLetter: z.string().trim().max(4000).optional().or(z.literal('')),
  consent: z.literal(true, {
    message: 'Please confirm you agree to our processing of your application.',
  }),
});

export type CareerApplicationValues = z.infer<typeof careerApplicationSchema>;
