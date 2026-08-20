import { cn } from '@/lib/cn';
import { reveal, revealAligned, revealAttrs } from '@/lib/reveal';
import { Icon } from '@/components/ui/Icon';
import {
  Container,
  GradientText,
  HEADING_CLASS,
  SUBHEADING_CLASS,
} from '@/components/ui';
import { ITSM_JSM_CAPABILITIES, ITSM_JSM_CONTENT } from '@/constants/itsm';

/**
 * "Why We Build On Jira Service Management" - four capabilities as a spec list.
 *
 * NOT cards. These are four facts about one product, and four bordered boxes imply
 * four separable things. So the section is a two-column editorial layout instead: the
 * heading block holds the left rail (sticky from `lg`, where the list is long enough
 * for the heading to scroll out of view otherwise), and the capabilities are rows
 * divided by hairlines, each led by a large ghosted numeral.
 *
 * The numeral is `aria-hidden` and derived from the index rather than stored on the
 * data: unlike `DeliveryPhase.ordinal`, this is a reading aid for a list whose order
 * carries no meaning, so it must not survive into the accessible name.
 *
 * Not a `<Section>` because the left rail needs `items-start` on the grid and its own
 * sticky offset, which the shared Container-inside-Section shape does not give.
 */
export function JsmSection() {
  return (
    // `#eaf8ff`, the site's tinted section band. This has flipped twice: it was
    // `#eaf8ff`, briefly `bg-soft` while the expertise pages ran on a near-white
    // second tone, and is now back to the tint. Anything reasoning about how close
    // this background is to white - see the divider note further down - has to be
    // re-read whenever that flips.
    <section className="bg-[#eaf8ff] py-12 lg:py-16">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,400px)_1fr] lg:gap-16">
          <div
            className={cn(
              'lg:sticky lg:top-28',
              reveal('left'),
              'text-left md:text-left',
            )}
            {...revealAttrs()}
          >
            <h2 className={HEADING_CLASS}>
              {ITSM_JSM_CONTENT.headingLead}
              <GradientText>{ITSM_JSM_CONTENT.headingHighlight}</GradientText>
            </h2>
            <p className={cn(SUBHEADING_CLASS, 'mt-4')}>
              {ITSM_JSM_CONTENT.subheading}
            </p>
          </div>

          <ol
            className={cn('m-0 list-none', revealAligned('left', 'right'))}
            {...revealAttrs()}
          >
            {ITSM_JSM_CAPABILITIES.map((capability, index) => (
              <li
                key={capability.id}
                className={cn(
                  'grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 py-7',
                  // Hairlines between rows only. The last row has no rule under it,
                  // so the list ends rather than looking cut off.
                  //
                  // `border-line` and not `border-white/70`: a translucent WHITE
                  // rule only reads against a tint, and this section is now
                  // `bg-soft`, which is within a couple of percent of white - the
                  // dividers had effectively disappeared.
                  index > 0 && 'border-t border-line',
                  index === 0 && 'pt-0 lg:pt-1',
                )}
              >
                <span
                  aria-hidden
                  className="select-none font-display text-[34px] font-500 leading-none text-title"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="min-w-0">
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center',
                        capability.iconChipClass,
                      )}
                    >
                      <Icon name={capability.icon} size={28} />
                    </span>
                    <b className="text-[20px] font-500 leading-[1.25] tracking-[-.01em] text-title">
                      {capability.title}
                    </b>
                  </div>
                  <p className="m-0 text-[15px] leading-[1.75] text-muted">
                    {capability.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
