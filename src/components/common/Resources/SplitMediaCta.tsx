import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import type { ImageSource } from '@/types/content';
import { buttonClass } from '@/components/ui/Button';
import { AppImage } from '@/components/ui/Image';
import { ArrowIcon } from '@/components/ui/Icon';
import { LABEL_CLASS } from '@/components/ui/Typography';
import { SmartLink } from '@/components/ui/Link';

/** The photo + copy + CTA split section used near the bottom of case-study and events listings. */
export interface SplitMediaCtaProps {
  image: ImageSource;
  imageAlt: string;
  label: string;
  heading: ReactNode;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
}

export function SplitMediaCta({
  image,
  imageAlt,
  label,
  heading,
  description,
  ctaLabel,
  ctaHref,
  className,
}: SplitMediaCtaProps) {
  return (
    <section className={cn('py-14 sm:py-16', className)}>
      <div className="mx-auto max-w-shell px-6">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div
            className={cn(
              'relative h-[280px] overflow-hidden rounded-[10px] bg-slate-100 sm:h-[360px]',
              reveal('left'),
            )}
            {...revealAttrs()}
          >
            <AppImage
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className={reveal('right')} {...revealAttrs()}>
            <span className={cn(LABEL_CLASS, 'mb-4 block')}>{label}</span>
            <h2 className="mb-4 text-[clamp(24px,2.8vw,36px)] font-normal leading-[1.2] tracking-[-0.02em] text-title">
              {heading}
            </h2>
            <p className="mb-6 text-[16px] leading-[1.65] text-black">
              {description}
            </p>
            <SmartLink href={ctaHref} className={buttonClass('primary')}>
              {ctaLabel} <ArrowIcon />
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  );
}
