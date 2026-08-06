'use client';

import { cn } from '@/lib/cn';
import { useAppSelector } from '@/store/hooks';
import { isNavLinkActive } from '@/store/slices/navigationSlice';
import type { FooterColumn } from '@/types/navigation';
import { SmartLink } from '@/components/ui/Link';

/**
 * One footer link column.
 *
 * `FOOTER_LINK_CLASS` replaces the legacy `.footer-link` rule. The
 * `padding-left` in its transition list is intentional and inherited: the
 * original declared `transition: color .2s, padding-left .2s` even though nothing
 * ever changed the padding, so it is kept to leave the computed
 * `transition-property` identical.
 *
 * Split into its own client component so the rest of the footer stays a Server
 * Component — only the `.active` highlight needs store access.
 *
 * `prefetch={false}`: these are bulk navigation links on every page. Prefetching
 * all ~17 would fire a burst of requests for routes the visitor will not open.
 */
export const FOOTER_LINK_CLASS =
  'block py-1.5 text-[15px] leading-[1.2] text-white no-underline [transition:color_.2s,padding-left_.2s] hover:text-brand-500';

export function FooterLinkColumn({ column }: { column: FooterColumn }) {
  const navigation = useAppSelector((state) => state.navigation);

  return (
    <div>
      <h4 className="mb-5 text-[16px] font-600 tracking-wide text-white">
        {column.title}
      </h4>
      <div className="flex flex-col">
        {column.links.map((link) => (
          <SmartLink
            key={link.id}
            href={link.href}
            prefetch={false}
            className={cn(
              FOOTER_LINK_CLASS,
              link.group &&
                isNavLinkActive(navigation, link.group, link.id) &&
                'text-brand-600',
            )}
            {...(link.group ? { 'data-nav-group': link.group } : {})}
            data-nav-id={link.id}
            {...(link.external ? { forceExternal: true } : {})}
          >
            {link.label}
          </SmartLink>
        ))}
      </div>
    </div>
  );
}
