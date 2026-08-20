import { Section } from '@/components/ui/Section';
import { GradientText, HEADING_CLASS } from '@/components/ui/Typography';
import { AppImage } from '@/components/ui/Image';
import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import {
  MARKETPLACE_APPS_CATALOG,
  MARKETPLACE_APPS_PROBLEM_CONTENT,
} from '@/constants/expertise/marketplace-apps';

/** Scattered position/rotation per real app tile - matched by array order to `MARKETPLACE_APPS_CATALOG`. */
const TILE_LAYOUT = [
  { left: 90, top: 78, rotate: -7 },
  { left: 250, top: 48, rotate: 9 },
  { left: 66, top: 220, rotate: 11 },
  { left: 258, top: 228, rotate: -9 },
] as const;

/**
 * Loosely scattered app tiles - real logos from the published catalog, not
 * stock art - each tilted and shadowed like a dropped stack of cards, on the
 * same soft gradient glow as the other pages' diagrams.
 */
function FloatingAppTiles() {
  return (
    <div className="relative mx-auto h-[300px] w-[320px] sm:h-[320px] sm:w-[340px]">
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,.12),transparent_70%)]"
      />
      {MARKETPLACE_APPS_CATALOG.map((app, index) => {
        const layout = TILE_LAYOUT[index];
        if (!layout) return null;
        return (
          <div
            key={app.id}
            className="absolute h-20 w-20 overflow-hidden rounded-[20px] shadow-[0_18px_34px_-10px_rgba(15,23,42,.3)]"
            style={{
              left: layout.left,
              top: layout.top,
              transform: `translate(-50%,-50%) rotate(${layout.rotate}deg)`,
            }}
          >
            <AppImage
              src={app.logo.src}
              alt={app.logo.alt}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}

export function ProblemSection() {
  return (
    <Section className="bg-[#eaf8ff]">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div
          className={cn(reveal('left'), 'md:text-center lg:text-left')}
          {...revealAttrs()}
        >
          <h2 className={HEADING_CLASS}>
            {MARKETPLACE_APPS_PROBLEM_CONTENT.headingLead}
            <GradientText>
              {MARKETPLACE_APPS_PROBLEM_CONTENT.headingHighlight}
            </GradientText>
          </h2>
          <div className="mt-5 space-y-4">
            {MARKETPLACE_APPS_PROBLEM_CONTENT.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[16px] leading-[1.75] text-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div className={reveal('right')} {...revealAttrs()}>
          <FloatingAppTiles />
        </div>
      </div>
    </Section>
  );
}
