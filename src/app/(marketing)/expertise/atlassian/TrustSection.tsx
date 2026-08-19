import { Section } from '@/components/ui/Section';
import { AppImage } from '@/components/ui/Image';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { cn } from '@/lib/cn';
import {
  ATLASSIAN_TRUST_BADGES,
  ATLASSIAN_TRUST_CONTENT,
} from '@/constants/expertise/atlassian';

/** Compact strip of the four real Atlassian partner badges - not the full About-page collage. */
export function TrustSection() {
  return (
    <Section padding="tight" className="border-y border-line-faint bg-soft">
      <p
        className={cn(
          'mb-10 text-center text-[14px] font-500 uppercase tracking-[.14em] text-brand-600',
          revealAligned('center'),
        )}
        {...revealAttrs()}
      >
        {ATLASSIAN_TRUST_CONTENT.label}
      </p>
      <div
        className={cn(
          'flex flex-wrap items-center justify-center gap-x-16 gap-y-8',
          revealAligned('center'),
        )}
        {...revealAttrs()}
      >
        {ATLASSIAN_TRUST_BADGES.map((badge) => (
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
