import { cn } from '@/lib/cn';
import { reveal, revealAligned, revealAttrs } from '@/lib/reveal';
import { Icon } from '@/components/ui/Icon';
import { AppImage } from '@/components/ui/Image';
import { Container, GradientText } from '@/components/ui';
import {
  DEVSECOPS_ORBIT_CONTENT,
  DEVSECOPS_ORBIT_STAGES,
} from '@/constants/devsecops';
import { devsecopsOrbitDiagram } from '@/constants/media';

/**
 * "Scaling Secure Delivery Across the Organization" - copy left, the supplied
 * DevOps lifecycle diagram on the right.
 *
 * ── WHAT THIS REPLACED ──
 * The right column used to be a hand-built orbit: a CSS/SVG arc, a dark Jira core
 * circle, and five stage tiles nudged along the curve. That is gone. The supplied
 * artwork carries the same information with REAL product marks (GitHub, Bitbucket,
 * Docker, Kubernetes, JFrog, Slack, Teams, Confluence, Opsgenie), which the icon
 * registry has no glyphs for and which we were deliberately not faking.
 *
 * ── WHY THE STAGE LIST IS STILL HERE ──
 * The diagram is a single image, so everything inside it - the stage names, the tool
 * names - is invisible to a screen reader, to search, and to anyone at a width where
 * an 869x907 vector shrinks below legibility. The text list below `ml` is not a
 * fallback bolted on; it is where that content actually lives. Above `ml` the image
 * carries it visually and the list is hidden; below `ml` the image is hidden and the
 * list is shown. Exactly one of the two is present at any width, so the content is
 * never duplicated for assistive tech.
 *
 * The image is `aria-hidden` with an empty `alt` for that reason: it is decorative
 * *given* that the list states the same thing in text. If the list is ever removed,
 * this image needs a real description instead.
 *
 * ── SIZING ──
 * The diagram's own stage labels are white and sit on its purple arc, so it must
 * keep its full artwork - no cropping, no `object-cover`. It renders at intrinsic
 * ratio inside a max-width box, which is why `AppImage` gets explicit width/height
 * from the static import rather than `fill`.
 */
export function ScalingSection() {
  return (
    // `bg-soft`, the site's own mid-tone section background. This was a
    // blue-to-lilac wash ending in `#f5f0ff`, and lilac appears nowhere else on
    // the site - the diagram's own purple arc already supplies that hue, so the
    // background was competing with the artwork rather than seating it.
    <section className="overflow-hidden border-y border-line-faint bg-soft py-12 lg:py-16">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          {/* ── Copy ── */}
          <div
            className={cn(reveal('left'), 'text-left md:text-left')}
            {...revealAttrs()}
          >
            <h2 className="text-[clamp(28px,3.2vw,42px)] font-normal leading-[1.1] tracking-[-0.03em] text-title">
              {DEVSECOPS_ORBIT_CONTENT.headingLead}
              <GradientText>
                {DEVSECOPS_ORBIT_CONTENT.headingHighlight}
              </GradientText>
            </h2>

            {DEVSECOPS_ORBIT_CONTENT.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-4 text-[15.5px] leading-[1.75] text-muted"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* ── Diagram (≥ml) / stage list (<ml) ── */}
          <div
            className={cn(revealAligned('left', 'right'))}
            {...revealAttrs()}
          >
            {/* `-mr-` lets the artwork bleed toward the section edge the way the
                reference does, without widening the Container's track. */}
            <div className="hidden ml:-mr-6 ml:block lg:-mr-10">
              <AppImage
                src={devsecopsOrbitDiagram}
                alt=""
                aria-hidden
                sizes="(min-width: 1280px) 620px, 50vw"
                className="ml-auto block h-[450px] h-auto w-full max-w-[620px]"
              />
            </div>

            <ol className="m-0 flex list-none flex-col gap-3 ml:hidden">
              {DEVSECOPS_ORBIT_STAGES.map((stage) => (
                <li
                  key={stage.id}
                  // Solid white on a visible border. These were `bg-white/85` with
                  // a WHITE border, which worked over the old tinted wash and goes
                  // nearly invisible now the section is `bg-soft` - a white-on-white
                  // card with a white edge has nothing left to define it.
                  className="flex items-center gap-3 rounded-[10px] border border-line-soft bg-white px-4 py-3"
                >
                  <span
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px]',
                      stage.tintClass,
                    )}
                  >
                    <Icon name={stage.icon} size={22} />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[10.5px] font-800 uppercase leading-none tracking-[.16em] text-faint">
                      {stage.label}
                    </span>
                    <span className="mt-1.5 block text-[13.5px] font-600 leading-[1.4] text-title">
                      {stage.tools.join(' · ')}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
