import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { ContentImage } from '@/types/content';
import { formatContentDate } from '@/lib/format';
import { ArrowIcon } from '@/components/ui/Icon';
import { CoverImage } from '@/components/ui/Image';
import { CardLink } from '@/components/ui/Card';

/**
 * The grid card shared by every resource listing. `compact` drops the
 * excerpt and CTA, for the "Related" rail at the bottom of detail pages.
 */
export interface ResourceCardProps {
  href: string;
  external?: boolean;
  image: ContentImage;
  title: string;
  excerpt?: string;
  publishedAt: string;
  /** A pill rendered over the top-left of the image, e.g. a category label. */
  badge?: ReactNode;
  /** Extra meta line rendered above the title (location, client, etc.). */
  meta?: ReactNode;
  ctaLabel?: string;
  compact?: boolean;
  className?: string;
}

export function ResourceCard({
  href,
  external,
  image,
  title,
  excerpt,
  publishedAt,
  badge,
  meta,
  ctaLabel = 'Read More',
  compact = false,
  className,
}: ResourceCardProps) {
  return (
    <CardLink
      href={href}
      forceExternal={external}
      className={cn('flex h-full flex-col overflow-hidden rounded-[10px]', className)}
    >
      <div className="group relative h-[240px] overflow-hidden bg-slate-100 md:h-[255px]">
        <CoverImage
          src={image.src}
          alt={image.alt}
          className="transition-transform duration-500 group-hover:scale-[1.06]"
        />
        {badge ? (
          <div className="absolute left-3.5 top-3.5">{badge}</div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <time
          dateTime={publishedAt}
          className="mb-2.5 block text-[12.5px] font-700 text-black"
        >
          {formatContentDate(publishedAt)}
        </time>
        {meta}
        <h3 className="mb-1.5 mt-0.5 line-clamp-3 text-[18px] font-600 leading-[1.35] text-title">
          {title}
        </h3>
        {compact ? null : (
          <>
            {excerpt ? (
              <p className="mb-4 line-clamp-3 flex-1 text-[16px] leading-[1.65] text-black">
                {excerpt}
              </p>
            ) : (
              <div className="flex-1" />
            )}
            <span className="inline-flex w-fit items-center gap-1.5 text-[14px] font-800 text-brand-700">
              {ctaLabel} <ArrowIcon />
            </span>
          </>
        )}
      </div>
    </CardLink>
  );
}
