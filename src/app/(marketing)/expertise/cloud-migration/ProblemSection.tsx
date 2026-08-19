import { Section } from '@/components/ui/Section';
import { GradientText, HEADING_CLASS } from '@/components/ui/Typography';
import { AppImage } from '@/components/ui/Image';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import { CLOUD_MIGRATION_PROBLEM_CONTENT } from '@/constants/expertise/cloud-migration';

/** Real data-center photo (see the constants file for sourcing/license note) - replaces the earlier vector diagram here. */
function ProblemPhoto() {
  return (
    <div className="relative mx-auto before:absolute before:inset-0 before:z-0 before:rounded-[32px] before:bg-[radial-gradient(65%_65%_at_65%_25%,rgba(37,99,235,.12),transparent_70%)] before:content-['']">
      <div className="relative z-[1] overflow-hidden rounded-[10px] border border-white/60 shadow-[0_24px_48px_-20px_rgba(15,23,42,.3)]">
        <AppImage
          src={CLOUD_MIGRATION_PROBLEM_CONTENT.image.src}
          alt={CLOUD_MIGRATION_PROBLEM_CONTENT.image.alt}
          sizes="(min-width: 1024px) 420px, 90vw"
          className="block h-auto w-full"
        />
      </div>
    </div>
  );
}

export function ProblemSection() {
  return (
    <Section className="bg-white">
      <div className="grid items-center gap-8 md:grid-cols-[1fr_1.05fr] lg:gap-10">
        <div className={reveal('left')} {...revealAttrs()}>
          <ProblemPhoto />
        </div>

        <div
          className={cn(reveal('right'), 'text-center md:text-left')}
          {...revealAttrs()}
        >
          <h2 className={HEADING_CLASS}>
            {CLOUD_MIGRATION_PROBLEM_CONTENT.headingLead}
            <GradientText>
              {CLOUD_MIGRATION_PROBLEM_CONTENT.headingHighlight}
            </GradientText>
            <br />
            <span className="text-[clamp(20px,2.4vw,30px)]">
              {CLOUD_MIGRATION_PROBLEM_CONTENT.headingSecondLine}
            </span>
          </h2>
          <div className="mt-5 space-y-4">
            {CLOUD_MIGRATION_PROBLEM_CONTENT.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[16px] leading-[1.75] text-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
