import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { GradientText, Icon, Section, SectionHeader } from '@/components/ui';
import { ITSM_APPROACH_CONTENT, ITSM_PHASES } from '@/constants/itsm';

/**
 * "From First Blueprint to Steady State" - six phases on one connected rail.
 *
 * NOT six cards. The phases are sequential, and six bordered boxes in a grid read as
 * six options to choose from. So they sit on a single dashed spine with a bright
 * segment travelling along it - the same device as the home page's cloud-migration
 * flow, which is where this site already says "these steps happen in this order".
 *
 * ── THE GRADIENT DEF IS LOCAL ──
 * The home page's spine strokes `url(#pulseGrad)`, defined by `SvgGradientDefs` in
 * `_home/`. That component is not mounted on this route, and an SVG paint server
 * referenced but not present renders as NOTHING - a silently invisible line. So the
 * gradient is declared inside this section's own `<defs>` under a page-scoped id.
 *
 * Below 1020px the spine hides and the phases become a two-up grid, matching the
 * cloud-migration flow's own breakpoint: a six-node horizontal rail at tablet width
 * gives each node ~110px, which no label survives.
 */

/** Hand-tuned so the curve's crests land between the six phase chips. */
const RAIL_PATH =
  'M8 26 C 90 6, 160 46, 250 26 S 400 6, 490 26 S 640 46, 730 26 S 850 6, 932 26';

const GRADIENT_ID = 'itsmRailGrad';

export function ApproachSection() {
  return (
    <Section padding="tight" className="bg-white">
      <SectionHeader
        heading={
          <>
            {ITSM_APPROACH_CONTENT.headingLead}
            <GradientText>
              {ITSM_APPROACH_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        subheading={ITSM_APPROACH_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-12 max-w-[720px] md:text-center"
      />

      <div className={cn('relative', revealAligned('left'))} {...revealAttrs()}>
        <svg
          viewBox="0 0 940 52"
          preserveAspectRatio="none"
          aria-hidden
          className="absolute left-0 top-[18px] z-0 h-[52px] w-full overflow-visible to-1020:hidden"
        >
          <defs>
            <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="60%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#f2642a" />
            </linearGradient>
          </defs>
          <path
            d={RAIL_PATH}
            fill="none"
            stroke="#d3e0fa"
            strokeWidth="2.2"
            strokeDasharray="6 8"
            strokeLinecap="round"
          />
          <path
            d={RAIL_PATH}
            fill="none"
            stroke={`url(#${GRADIENT_ID})`}
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeDasharray="46 1000"
            className="animate-mf-line [stroke-dashoffset:46] motion-reduce:animate-none"
          />
        </svg>

        <ol className="relative z-[1] m-0 grid list-none grid-cols-6 gap-3 to-1020:grid-cols-2 to-1020:gap-7 to-480:grid-cols-1">
          {ITSM_PHASES.map((phase) => (
            <li key={phase.id} className="text-center to-1020:text-left">
              <span
                className={cn(
                  'mx-auto mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-[50%] border border-[#dbe7ff] bg-white shadow-[0_4px_12px_rgba(37,99,235,.12)] to-1020:mx-0',
                  phase.iconChipClass,
                )}
              >
                <Icon name={phase.icon} size={24} />
              </span>

              {/* The ordinal is a real text node here, not the watermark numeral a
                  card used - on a rail the reader needs the sequence stated, and
                  there is no card corner for a watermark to sit in. */}
              <span className="mb-1 block text-[11.5px] font-800 uppercase tracking-[.12em] text-faint">
                Phase {phase.ordinal}
              </span>
              <b className="mb-1.5 block text-[16px] font-500 tracking-[-.01em] text-title">
                {phase.title}
              </b>
              <p className="m-0 text-[13.5px] leading-[1.6] text-[#64748b]">
                {phase.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
