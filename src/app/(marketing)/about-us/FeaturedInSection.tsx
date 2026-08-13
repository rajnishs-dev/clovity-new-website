import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { AppImage, Container, LABEL_CLASS } from '@/components/ui';
import { ABOUT_PRESS_LABEL, ABOUT_PRESS_LOGOS } from '@/constants/about';

/**
 * Not a `<Section>`: padding is asymmetric (bottom zeroed) because the
 * mission quote below supplies the gap, and `Section`'s tokens are symmetric.
 *
 * Logos are greyscale at 75% opacity, full colour on hover - keeps six
 * differently-coloured mastheads from competing with the section.
 *
 * No `sizes` prop: these are fixed 130x50 boxes, so Next emits a 1x/2x
 * srcset instead of one entry per configured width.
 */
export function FeaturedInSection() {
  return (
    <section className="bg-white pb-0 pt-14 sm:pb-0 sm:pt-16">
      <Container>
        <p
          className={cn(LABEL_CLASS, 'mb-8 block text-center', revealAligned('center'))}
          {...revealAttrs()}
        >
          {ABOUT_PRESS_LABEL}
        </p>

        <div
          className={cn(
            'flex flex-wrap items-center justify-center gap-3.5',
            revealAligned('center'),
          )}
          {...revealAttrs()}
        >
          {ABOUT_PRESS_LOGOS.map((logo) => (
            <span
              key={logo.id}
              className={cn(
                'group flex h-[78px] items-center justify-center rounded-[10px] border border-line-soft bg-soft px-[22px] py-4',
                '[transition:transform_.25s,box-shadow_.25s,border-color_.25s]',
                'hover:-translate-y-[3px] hover:border-brand-200 hover:shadow-[0_12px_26px_rgba(15,23,42,.08)]',
              )}
            >
              <AppImage
                src={logo.image.src}
                alt={logo.image.alt}
                className="max-h-[50px] max-w-[130px] object-contain opacity-75 grayscale [transition:filter_.25s,opacity_.25s] group-hover:opacity-100 group-hover:grayscale-0"
                {...(logo.image.width && logo.image.height
                  ? { width: logo.image.width, height: logo.image.height }
                  : {})}
              />
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
