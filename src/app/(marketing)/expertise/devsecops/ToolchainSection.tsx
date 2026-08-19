import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import {
  GradientText,
  Icon,
  Section,
  SectionHeader,
} from '@/components/ui';
import {
  DEVSECOPS_INTEGRATIONS,
  DEVSECOPS_INTEGRATIONS_CONTENT,
  DEVSECOPS_TOOLCHAIN_CONTENT,
  DEVSECOPS_TOOLCHAIN_LAYERS,
} from '@/constants/devsecops';

/**
 * "We Build Around Your Stack, Not Ours" - the toolchain as a layered stack.
 *
 * Five full-width bands, one per layer, read top to bottom in the order work
 * actually flows. The point the layout makes is that the LAYER is fixed and the
 * product inside it is interchangeable - which is why the tools are chips inside a
 * band rather than the band's title. A logo grid would say the opposite: that the
 * products are the offering.
 *
 * Tool names are plain text chips, not brand marks. `Icon`'s registry has glyphs for
 * a few Atlassian products and nothing for SonarQube, Snyk or Artifactory, and
 * drawing approximations of third-party logos misrepresents them - text never goes
 * stale against a rebrand either.
 *
 * The enterprise-integration band is visually separated (dashed top border, its own
 * intro) because it is a different kind of claim: those are systems we connect the
 * toolchain TO, not layers of the toolchain itself.
 */
export function ToolchainSection() {
  return (
    // White. This was `#eaf8ff`, a tint that appears nowhere else on this page now
    // that the run is white/`bg-soft` only. The layer bands below had to change with
    // it - see the note on their classes.
    <Section padding="tight" className="bg-white">
      <SectionHeader
        heading={
          <>
            {DEVSECOPS_TOOLCHAIN_CONTENT.headingLead}
            <GradientText>
              {DEVSECOPS_TOOLCHAIN_CONTENT.headingHighlight}
            </GradientText>
          </>
        }
        subheading={DEVSECOPS_TOOLCHAIN_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[760px] md:text-center"
      />

      <div
        className={cn('flex flex-col gap-3', revealAligned('left'))}
        {...revealAttrs()}
      >
        {DEVSECOPS_TOOLCHAIN_LAYERS.map((layer) => (
          <div
            key={layer.id}
            className={cn(
              // `bg-soft` on a real hairline, not the old `bg-white/80` on
              // `border-white`. That pairing only read because the section behind it
              // was the `#eaf8ff` tint: on this white section a translucent white
              // band with a white border is invisible, so the layers became one
              // undifferentiated column. Inverting it - faint fill, visible border -
              // keeps each band a distinct object.
              'grid items-center gap-x-6 gap-y-4 rounded-[10px] border border-line-soft bg-soft px-6 py-5',
              'ml:grid-cols-[minmax(0,290px)_1fr]',
              '[transition:background_.25s,border-color_.25s,box-shadow_.25s]',
              'hover:border-[#dbe7ff] hover:bg-white hover:shadow-[0_14px_34px_-16px_rgba(15,23,42,.16)]',
            )}
          >
            <div className="flex items-center gap-3.5">
              <span
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                  layer.iconChipClass,
                )}
              >
                <Icon name={layer.icon} size={32} />
              </span>
              <div className="min-w-0">
                <b className="block text-[16px] font-500 leading-[1.3] tracking-[-.01em] text-title">
                  {layer.name}
                </b>
                <span className="block text-[12.5px] font-500 leading-[1.45] text-muted">
                  {layer.purpose}
                </span>
              </div>
            </div>

            <ul className="m-0 flex list-none flex-wrap gap-2 ml:justify-end">
              {layer.tools.map((tool) => (
                <li
                  key={tool}
                  className="rounded-pill border border-line-soft bg-white px-3.5 py-1.5 text-[13px] font-600 text-[#334155]"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Integration targets - a different kind of claim, so a different band. */}
      <div
        className={cn(
          'mt-8 border-t border-dashed border-brand-200 pt-8',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-center lg:gap-12">
          <div>
            <b className="block text-[18px] font-500 leading-[1.3] tracking-[-.01em] text-title">
              {DEVSECOPS_INTEGRATIONS_CONTENT.title}
            </b>
            <p className="m-0 mt-2.5 text-[14.5px] leading-[1.65] text-muted">
              {DEVSECOPS_INTEGRATIONS_CONTENT.description}
            </p>
          </div>

          <ul className="m-0 flex list-none flex-wrap gap-2.5 lg:justify-end">
            {DEVSECOPS_INTEGRATIONS.map((system) => (
              <li
                key={system}
                className="flex items-center gap-2 rounded-[10px] border border-line-soft bg-white px-3.5 py-2 text-[13px] font-600 text-[#334155]"
              >
                <span className="flex h-4 w-4 shrink-0 items-center justify-center text-brand-600">
                  <Icon name="link" size={14} />
                </span>
                {system}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-[13px] font-500 leading-[1.6] text-faint">
          {DEVSECOPS_TOOLCHAIN_CONTENT.footnote}
        </p>
      </div>
    </Section>
  );
}
