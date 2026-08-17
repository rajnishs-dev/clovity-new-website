import { Section } from '@/components/ui/Section';
import { AppImage } from '@/components/ui/Image';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { cn } from '@/lib/cn';
import {
  CLOUD_MIGRATION_TRUST_BADGES,
  CLOUD_MIGRATION_TRUST_CONTENT,
} from '@/constants/expertise/cloud-migration';

export function TrustSection() {
  return (
    <Section padding="tight" className="border-y border-line-faint bg-[#eaf8ff]">
      <p
        className={cn(
          'mb-10 text-[14px] font-500 uppercase tracking-[.14em] text-brand-600 text-center',
          revealAligned('center'),
        )}
        {...revealAttrs()}
      >
        {CLOUD_MIGRATION_TRUST_CONTENT.label}
      </p>
      <div
        className={cn(
          'flex flex-wrap items-center justify-center gap-x-16 gap-y-8',
          revealAligned('center'),
        )}
        {...revealAttrs()}
      >
        {CLOUD_MIGRATION_TRUST_BADGES.map((badge) => (
          <div key={badge.id} className="relative h-24 w-[200px]">
            <AppImage
              src={badge.image.src}
              alt={badge.image.alt}
              fill
              sizes="200px"
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
