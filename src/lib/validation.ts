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

/**
 * The webinar "Get the Recording" form. All four fields are required,
 * mirroring the published page - Strapi only requires `firstName`/`email`,
 * but a half-filled lead isn't worth more than a complete one.
 *
 * The webinar's slug is passed to the action separately, not as a schema
 * field: as a schema field it failed validation invisibly (no input renders
 * its error), producing a dead submit button with no message.
 */
export const webinarRegistrationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'First name is required.')
    .max(80, 'That first name is too long.'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Last name is required.')
    .max(80, 'That last name is too long.'),
  email,
  country: z.string().trim().min(1, 'Please select a country.'),
});

export type WebinarRegistrationValues = z.infer<
  typeof webinarRegistrationSchema
>;

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

/**
 * The Contact page's enquiry form. Separate from `contactSchema` above, which
 * requires a `consent` boolean the published form doesn't render.
 *
 * Built from the CMS config, not fixed: the Strapi `get-in-touch` row decides
 * whether name/company/phone are shown and required, so a fixed schema would
 * either reject a field the page hides or accept one an editor marked
 * required. `message` and `email` are always required.
 */
export interface EnquiryFieldRules {
  showFullName: boolean;
  requireFullName: boolean;
  showCompany: boolean;
  requireCompany: boolean;
  showPhone: boolean;
  requirePhone: boolean;
}

/** Optional free-text field: absent, empty, or within length. */
const optionalText = (max: number, tooLong: string) =>
  z.string().trim().max(max, tooLong).optional().or(z.literal(''));

export function buildEnquirySchema(rules: EnquiryFieldRules) {
  return z.object({
    fullName:
      rules.showFullName && rules.requireFullName
        ? z
            .string()
            .trim()
            .min(2, 'Please enter your full name.')
            .max(120, 'That name is too long.')
        : optionalText(120, 'That name is too long.'),

    email,

    company:
      rules.showCompany && rules.requireCompany
        ? z
            .string()
            .trim()
            .min(2, 'Please enter your company name.')
            .max(160, 'That company name is too long.')
        : optionalText(160, 'That company name is too long.'),

    phone:
      rules.showPhone && rules.requirePhone
        ? z
            .string()
            .trim()
            .regex(/^[\d\s()+.-]{7,24}$/, 'Enter a valid phone number.')
        : z
            .string()
            .trim()
            .regex(/^[\d\s()+.-]{7,24}$/, 'Enter a valid phone number.')
            .optional()
            .or(z.literal('')),

    topic: z.string().trim().min(1, 'Please choose a topic.').max(120),

    message: z
      .string()
      .trim()
      .min(10, 'Please tell us a little about what you need.')
      .max(4000, 'Please keep the message under 4000 characters.'),
      consent: z.boolean().refine((value) => value === true, {
      message: 'Please consent to the collection and processing of your information.',
    }),
  });
}

/**
 * Field values the enquiry form holds.
 *
 * Derived from the permissive build so one type covers every configuration - the
 * required/optional distinction is a validation concern, not a shape concern, and
 * a per-config type would make the form component generic for no benefit.
 */
export type EnquiryFormValues = z.infer<
  ReturnType<typeof buildEnquirySchema>
>;

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
