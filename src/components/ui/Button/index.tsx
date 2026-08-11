import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Spinner } from '../Spinner';
import { SmartLink } from '../Link';

/**
 * The button system, as Tailwind utilities.
 *
 * These variants replace the legacy `.btn-primary` / `.btn-secondary` /
 * `.btn-white` / `.btn-ghost-dark` rules. Every value is the original's:
 * 13px×28px padding, 14.5px / weight 500, 2px border, 100px pill radius, and the
 * −1px hover lift with a brand-tinted shadow.
 *
 * Two things worth knowing:
 *
 *  • `[transition:…]` arbitrary property, not `transition-colors`. The originals
 *    set different durations per property (background .25s, transform .2s), which
 *    no combination of `transition-*` + `duration-*` utilities can express —
 *    those apply one duration to every property. The arbitrary property keeps the
 *    per-property timing exact.
 *
 *  • `size="md"` adds nothing. It is the design's own size, already in the base
 *    string; `sm` and `lg` override through `cn`/tailwind-merge, so there is one
 *    definition of the default rather than two that can drift.
 */

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'icon'
  | 'white'
  | 'whitePill'
  | 'ghostDark';

export type ButtonSize = 'sm' | 'md' | 'lg';

/** Shared by every pill variant. */
const PILL_BASE =
  'inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-pill border-2 px-7 py-[13px] text-[14.5px] font-500 no-underline';

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: cn(
    PILL_BASE,
    'border-brand-600 bg-brand-600 text-white',
    '[transition:background_.25s,border-color_.25s,transform_.2s,box-shadow_.25s]',
    'hover:-translate-y-px hover:border-brand-700 hover:bg-brand-700 hover:shadow-brand-glow',
  ),

  secondary: cn(
    PILL_BASE,
    'border-brand-600 bg-transparent text-brand-600',
    '[transition:background_.25s,color_.25s,transform_.2s]',
    'hover:-translate-y-px hover:border-brand-600 hover:bg-brand-600 hover:text-white',
  ),

  // The legacy design has no separate outline treatment — secondary IS the
  // outline button (transparent fill, 2px brand border). Aliased rather than
  // invented, so no new visual style enters the system.
  outline: cn(
    PILL_BASE,
    'border-brand-600 bg-transparent text-brand-600',
    '[transition:background_.25s,color_.25s,transform_.2s]',
    'hover:-translate-y-px hover:border-brand-600 hover:bg-brand-600 hover:text-white',
  ),

  ghost: cn(
    PILL_BASE,
    'border-transparent bg-transparent text-brand-600 transition-colors hover:bg-brand-50',
  ),

  link: 'inline-flex items-center gap-2 text-[14.5px] font-500 text-brand-600 transition-colors hover:text-brand-700 hover:underline',

  icon: 'inline-flex items-center justify-center rounded-full border border-line bg-white text-[#334155] shadow-[0_4px_14px_rgba(15,23,42,.14)] transition-all duration-200 hover:border-brand-600 hover:bg-brand-600 hover:text-white disabled:cursor-default disabled:opacity-35 disabled:hover:border-line disabled:hover:bg-white disabled:hover:text-[#334155]',

  // The final-CTA white button: 14px radius, weight 800, 10px gap — this is the
  // home page's own `.btn-white`, which overrode the shared pill treatment.
  white: cn(
    // The 2px white border comes from the shared button rule, which the home
    // page's own .btn-white override never reset — so it applied, and dropping it
    // made this button 4px shorter and 4px narrower than the original.
    'inline-flex items-center gap-2.5 rounded-[14px] border-2 border-white bg-white px-[26px] py-3.5 text-[14.5px] font-800 text-[#152a6b] no-underline',
    'shadow-[0_8px_20px_-6px_rgba(0,0,0,.25)] [transition:transform_.2s,box-shadow_.2s]',
    'hover:-translate-y-0.5 hover:bg-white hover:text-[#152a6b] hover:shadow-[0_12px_26px_-6px_rgba(0,0,0,.3)]',
  ),

  /**
   * The interior pages' `.btn-white` — the shared pill, not the home page's.
   *
   * `white` above is the HOME page's override (14px radius, weight 800,
   * `#152a6b` text). About / Careers / Contact never load that override, so their
   * white CTA is the base `theme.css` rule: 100px pill, weight 700, `#1e40af`
   * text, 13px×28px padding. Two different buttons, so two variants — folding them
   * together would silently restyle one of the two.
   *
   * The hover here is the CTA-card-scoped one those pages declare: it stays white
   * (the shared rule would flip it to orange), lifts 3px and casts a neutral
   * shadow. This variant is only used inside that card, which is what makes the
   * scoped hover the correct one to bake in.
   */
  whitePill: cn(
    PILL_BASE,
    'border-white bg-white font-700 text-brand-800',
    '[transition:background_.25s,color_.25s,transform_.2s,box-shadow_.25s]',
    'hover:-translate-y-[3px] hover:border-white hover:bg-white hover:text-brand-800 hover:shadow-[0_10px_24px_rgba(15,23,42,.15)]',
  ),

  ghostDark: cn(
    'inline-flex items-center gap-2 rounded-[14px] border border-white/[.28] bg-white/[.08] px-[26px] py-[13px] text-[14.5px] font-700 text-white no-underline',
    '[transition:background_.22s,border-color_.22s,transform_.2s]',
    'hover:-translate-y-0.5 hover:bg-white/[.16]',
  ),
};

/** `md` is the design default and lives in the base string. */
const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'px-4 py-3 text-[13px]',
  md: '',
  lg: 'px-9 py-4 text-[16px]',
};

const ICON_SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'h-[38px] w-[38px] text-[12px]',
  md: 'h-[42px] w-[42px] text-[13px]',
  lg: 'h-12 w-12 text-[15px]',
};

interface CommonProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  style?: CSSProperties;
  /** Shows a spinner, sets aria-busy, and blocks interaction. */
  loading?: boolean;
  /** Screen-reader text announced while `loading`. */
  loadingLabel?: string;
  leadingIcon?: ReactNode;
  /** Rendered after the label — where the CTA arrow goes. */
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

export interface ButtonProps
  extends
    CommonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> {
  href?: undefined;
}

export interface ButtonLinkProps extends CommonProps {
  /** Present → renders an anchor through SmartLink instead of a <button>. */
  href: string;
  forceExternal?: boolean;
  'aria-label'?: string;
  id?: string;
  onClick?: () => void;
}

function buttonClasses({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
}: Pick<CommonProps, 'variant' | 'size' | 'fullWidth' | 'className'>) {
  return cn(
    VARIANT_CLASS[variant],
    variant === 'icon' ? ICON_SIZE_CLASS[size] : SIZE_CLASS[size],
    fullWidth && 'w-full justify-center',
    className,
  );
}

function ButtonBody({
  children,
  loading,
  loadingLabel,
  leadingIcon,
  trailingIcon,
}: Pick<
  CommonProps,
  'children' | 'loading' | 'loadingLabel' | 'leadingIcon' | 'trailingIcon'
>) {
  return (
    <>
      {loading ? <Spinner size="sm" /> : leadingIcon}
      {children}
      {loading ? (
        <span className="sr-only">{loadingLabel ?? 'Loading'}</span>
      ) : (
        trailingIcon
      )}
    </>
  );
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  style,
  loading = false,
  loadingLabel,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses({ variant, size, fullWidth, className })}
      style={style}
      disabled={disabled ?? loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      <ButtonBody
        loading={loading}
        loadingLabel={loadingLabel}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
      >
        {children}
      </ButtonBody>
    </button>
  );
}

/**
 * A CTA that navigates. Almost every button in the legacy markup is actually an
 * `<a>`, so this is the common case — and it keeps `<button>` reserved for things
 * that really do act on the page.
 */
export function ButtonLink({
  children,
  href,
  variant = 'primary',
  size = 'md',
  className,
  style,
  loading = false,
  loadingLabel,
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  forceExternal = false,
  ...rest
}: ButtonLinkProps) {
  return (
    <SmartLink
      href={href}
      forceExternal={forceExternal}
      className={buttonClasses({ variant, size, fullWidth, className })}
      style={style}
      {...rest}
    >
      <ButtonBody
        loading={loading}
        loadingLabel={loadingLabel}
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
      >
        {children}
      </ButtonBody>
    </SmartLink>
  );
}

/**
 * The button classes as a plain string, for the few places that must render a
 * raw `<a>`/`<button>` — e.g. a form submit inside the footer, or a link whose
 * surrounding CSS grid needs the anchor to be the direct child.
 */
export function buttonClass(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  extra?: string,
): string {
  return buttonClasses({ variant, size, className: extra });
}
