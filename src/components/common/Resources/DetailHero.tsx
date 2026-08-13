import type { ReactNode } from 'react';
import { breadcrumbSchema } from '@/lib/schema';
import type { BreadcrumbItem } from '@/types/seo';
import type { ContentImage } from '@/types/content';
import { Icon } from '@/components/ui/Icon';
import { CoverImage } from '@/components/ui/Image';
import { SmartLink } from '@/components/ui/Link';
import { JsonLd } from '../JsonLd';

/** The light hero at the top of every detail page's article column: breadcrumb, cover image, title, and a meta row. */
export interface DetailHeroProps {
  breadcrumb: BreadcrumbItem[];
  currentLabel: string;
  /** Optional: the webinar detail page omits this to show its co-host panel where the banner would be. */
  image?: ContentImage;
  title: string;
  meta: ReactNode;
}

export function DetailHero({
  breadcrumb,
  currentLabel,
  image,
  title,
  meta,
}: DetailHeroProps) {
  return (
    <div className="mb-8">
      <JsonLd
        schema={breadcrumbSchema([
          ...breadcrumb,
          { name: currentLabel, href: '' },
        ])}
      />
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex flex-wrap items-center gap-2 text-[13.5px] font-500 text-faint"
      >
        {breadcrumb.map((item) => (
          <span key={item.href} className="flex items-center gap-2">
            <SmartLink
              href={item.href}
              className="text-faint transition-colors hover:text-brand-700"
            >
              {item.name}
            </SmartLink>
            <Icon name="chevron-right" className="text-[9px] text-[#cbd5e1]" />
          </span>
        ))}
        <span
          aria-current="page"
          className="max-w-[60vw] truncate text-title sm:max-w-[420px]"
        >
          {currentLabel}
        </span>
      </nav>

      {image ? (
        <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-[10px] shadow-[0_24px_56px_-16px_rgba(15,23,42,.18)]">
          <CoverImage
            src={image.src}
            alt={image.alt}
            sizes="(min-width: 1024px) 940px, 100vw"
            priority
          />
        </div>
      ) : null}

      <h1 className="mb-4 text-[clamp(24px,3vw,36px)] font-500 leading-[1.2] tracking-[-0.02em] text-title">
        {title}
      </h1>

      {meta}
    </div>
  );
}
