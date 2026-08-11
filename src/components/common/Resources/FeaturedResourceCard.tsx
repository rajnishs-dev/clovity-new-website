import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { ContentImage } from '@/types/content';
import { ArrowIcon } from '@/components/ui/Icon';
import { CoverImage } from '@/components/ui/Image';
import { CardLink } from '@/components/ui/Card';

/**
 * The oversized lead card at the top of every resource listing - the legacy
 * `.feat-post` / `.cs-featured` / `.evt-featured`. Image on one side, copy on
 * the other at `lg` and up. Below `lg` the caller sizes it as a regular grid
 * cell (no `lg:col-span-*`), so it stacks like an ordinary `ResourceCard` -
 * image on top, excerpt visible - and falls in line with the rest of the grid.
 */
export interface FeaturedResourceCardProps {
  href: string;
  external?: boolean;
  image: ContentImage;
  ribbon?: string;
  title: string;
  excerpt?: string;
  /** Category pill + date/location row, rendered above the title. */
  meta?: ReactNode;
  ctaLabel?: string;
  className?: string;
}

export function FeaturedResourceCard({
  href,
  external,
  image,
  ribbon,
  title,
  excerpt,
  meta,
  ctaLabel = 'Read More',
  className,
}: FeaturedResourceCardProps) {
  return (
    <CardLink
      href={href}
      forceExternal={external}
      revealFrom="up"
      className={cn(
        'grid grid-cols-1 overflow-hidden rounded-[8px] text-left lg:grid-cols-[0.95fr_1fr]',
        className,
      )}
    >
      <div className="relative h-[240px] overflow-hidden bg-slate-100 md:h-[255px]">
        {ribbon ? (
          <span className="absolute left-3.5 top-3.5 z-[1] rounded-full bg-brand-600 px-3 py-1 text-[10.5px] font-800 uppercase tracking-[.06em] text-white shadow-[0_6px_16px_rgba(37,99,235,.35)]">
            {ribbon}
          </span>
        ) : null}
        <CoverImage
          src={image.src}
          alt={image.alt}
          sizes="(min-width: 1024px) 560px, 100vw"
        />
      </div>

      <div className="flex flex-col justify-center p-5 lg:p-8">
        {meta}
        <h2 className="mb-1.5 line-clamp-3 text-[18px] font-500 leading-[1.35] text-title lg:mb-2 lg:text-[clamp(19px,1.9vw,24px)] lg:leading-[1.28] lg:tracking-[-0.01em]">
          {title}
        </h2>
        {excerpt ? (
          <p className="mb-4 line-clamp-3 text-[16px] leading-[1.65] text-black lg:hidden">
            {excerpt}
          </p>
        ) : null}
        <span className="inline-flex w-fit items-center gap-1.5 text-[14px] font-800 text-brand-700 lg:gap-2">
          {ctaLabel} <ArrowIcon />
        </span>
      </div>
    </CardLink>
  );
}
