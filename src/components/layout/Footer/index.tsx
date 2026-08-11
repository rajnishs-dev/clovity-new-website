import logoWhite from '@/assets/images/clovity-logo-white.gif';
import { cn } from '@/lib/cn';
import { FOOTER_COLUMNS, FOOTER_SOCIALS } from '@/constants/navigation';
import { ROUTES } from '@/constants/routes';
import { siteConfig } from '@/constants/site';
import { Icon } from '@/components/ui/Icon';
import { AppImage } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';
import { Newsletter } from '@/components/common/Newsletter';
import { FooterLinkColumn } from './FooterLinkColumn';

/**
 * Site footer, as Tailwind utilities.
 *
 * A Server Component: the grid, brand copy and legal bar are static, so none of
 * it needs to reach the browser as JavaScript. Only the active-link columns and
 * the newsletter form are client components.
 *
 * `overlap` reproduces the legacy `.footer-overlap` padding (260px, stepping down
 * at 900px and 640px). It exists purely to make room for the final CTA card, which
 * tucks itself up into the footer with negative margins - so pages without that
 * CTA leave it off rather than carrying dead space.
 *
 * MIGRATION NOTE - the social icons and legal links previously set their hover
 * state with inline `onmouseover` / `onmouseout` attributes plus an inline
 * `style`. Because inline styles beat classes, Tailwind `hover:` variants could
 * not have overridden them; converting meant removing the inline style entirely.
 * The timings below are the ones those elements' own Tailwind classes implied
 * (`transition-all` / `transition-colors` = 150ms, cubic-bezier(.4,0,.2,1)).
 */
export interface FooterProps {
  overlap?: boolean;
  className?: string;
}

export function Footer({ overlap = false, className }: FooterProps) {
  return (
    <footer
      className={cn(
        'bg-[#0a0f1e] pb-0',
        overlap && 'pt-[260px] to-900:pt-[190px] to-640:pt-[150px]',
        className,
      )}
    >
      <div className="mx-auto max-w-shell px-6">
        <div className="grid gap-16 border-b border-white/10 pb-16 lg:grid-cols-[300px_1fr]">
          {/* Brand column */}
          <div>
            <div className="mb-5">
              <SmartLink
                href={ROUTES.home}
                aria-label="Clovity - go to home page"
              >
                <AppImage
                  src={logoWhite}
                  alt="Clovity"
                  animated
                  className="-ml-[18px] h-16 w-auto"
                />
              </SmartLink>
            </div>

            <p className="mb-6 text-[15px] leading-relaxed text-white">
              {siteConfig.footerBlurb}
            </p>

            <ul className="flex list-none gap-3 p-0">
              {FOOTER_SOCIALS.map((social) => (
                <li key={social.id}>
                  <SmartLink
                    href={social.href}
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[.06] text-[16px] text-white transition-all duration-150 ease-in-out hover:bg-brand-600 hover:text-white focus-visible:bg-brand-600 focus-visible:text-white"
                  >
                    {/* Size comes from the chip's `text-[16px]`. */}
                    <Icon name={social.icon} />
                  </SmartLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Link columns + newsletter */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {FOOTER_COLUMNS.map((column) => (
              <FooterLinkColumn key={column.id} column={column} />
            ))}
            <Newsletter source="footer" />
          </div>
        </div>

        {/* Legal bar */}
        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-[14.5px] text-faint">
            © {siteConfig.copyrightYear} {siteConfig.legalName} All rights
            reserved.
          </p>
          <nav aria-label="Legal" className="flex gap-6">
            {siteConfig.legalLinks.map((link) => (
              <SmartLink
                key={link.id}
                href={link.href}
                prefetch={false}
                className="text-[14.5px] text-faint transition-colors duration-150 ease-in-out hover:text-brand-500 focus-visible:text-faint"
              >
                {link.label}
              </SmartLink>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
