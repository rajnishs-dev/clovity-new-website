import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import type { CustomerStory } from '@/types/content';
import { AppImage } from '@/components/ui/Image';
import { ButtonLink } from '@/components/ui/Button';
import { ArrowIcon } from '@/components/ui/Icon';

/**
 * The expertise pages' "proof" section, built ONLY from a real, already-
 * published `CustomerStory` - never an invented client quote. There is no
 * real testimonial copy anywhere in this codebase (`ABOUT_MISSION_QUOTE` is
 * Clovity's own mission statement, not a client attribution), so rather than
 * fabricate a pull-quote this renders the existing case-study teaser
 * (logo, tag, title, description, link) as a larger, more detailed card than
 * the home page's compact version.
 *
 * `layout="row"` (default) is the single-story featured card - logo beside
 * the copy. `layout="stack"` puts the logo above the copy instead, for
 * pages that show several stories side by side in a grid, where a row
 * layout would squeeze the text column too narrow.
 */
export interface ProofQuoteProps {
  story: CustomerStory;
  layout?: 'row' | 'stack';
  className?: string;
}

export function ProofQuote({ story, layout = 'row', className }: ProofQuoteProps) {
  return (
    <div
      className={cn(
        'grid gap-6 rounded-[10px] border border-line-soft bg-white p-8 sm:p-10',
        layout === 'row'
          ? 'gap-8 md:grid-cols-[160px,1fr] md:items-center md:gap-10'
          : 'gap-5',
        reveal('up'),
        className,
      )}
      {...revealAttrs()}
    >
      <div
        className={cn(
          'relative h-14 w-32',
          layout === 'row' ? 'md:h-16 md:w-40' : '',
        )}
      >
        <AppImage
          src={story.logo.src}
          alt={story.logo.alt}
          fill
          sizes="160px"
          className="object-contain object-left"
        />
      </div>
      <div>
        <span className="mb-3 inline-block text-[12px] font-700 uppercase tracking-[.12em] text-orange">
          {story.tag}
        </span>
        <h3 className="mb-2 text-[22px] font-500 leading-[1.3] tracking-[-.01em] text-title">
          {story.title}
        </h3>
        <p className="mb-5 text-[15px] leading-[1.7] text-muted">
          {story.description}
        </p>
        <ButtonLink
          href={story.href}
          variant="secondary"
          size="sm"
          trailingIcon={<ArrowIcon />}
        >
          {story.ctaLabel}
        </ButtonLink>
      </div>
    </div>
  );
}
