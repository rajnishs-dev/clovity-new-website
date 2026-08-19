import { cn } from '@/lib/cn';
import { reveal, revealAttrs } from '@/lib/reveal';
import { ArrowIcon, Icon } from '@/components/ui/Icon';
import { buttonClass } from '@/components/ui/Button';
import { SmartLink } from '@/components/ui/Link';
import { GradientText, Section, SectionHeader } from '@/components/ui';
import { AI_PRODUCTS, AI_PRODUCTS_CONTENT } from '@/constants/ai';

/**
 * "Smarter Jira, JSM and Confluence" - what AI does in each product, plus Rovo.
 *
 * A four-up card grid, which is the one shape on this page that maps to the products themselves
 * rather than to an argument: four Atlassian surfaces, four cards, no hierarchy between them.
 *
 * ── ROVO IS IN THE GRID, NOT OPPOSITE IT ──
 * Rovo is Atlassian's own AI and the obvious "why would we need you" objection on this page, so
 * it sits as the fourth peer card rather than being handled defensively somewhere else. The copy
 * enables it instead of competing with it, and the FAQ answers the objection head-on. Putting it
 * in a "vs" layout would invent a fight with the vendor whose platform this practice is built on.
 *
 * The product marks come from the icon registry - `jira`, `confluence` and `headset` for JSM,
 * `robot` for Rovo. Rovo has no brand glyph in the registry and one is not invented for it: the
 * registry's own rule is that a functional icon is preferable to a hand-drawn approximation of
 * another company's trademark. See the note on `ProductBadge` in `types/content.ts`.
 */
export function ProductsSection() {
  return (
    <Section padding="tight" className="border-b border-line-faint bg-soft">
      <SectionHeader
        heading={
          <>
            {AI_PRODUCTS_CONTENT.headingLead}
            <GradientText>{AI_PRODUCTS_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={AI_PRODUCTS_CONTENT.subheading}
        subheadingClassName="mt-3"
        className="mx-auto mb-10 max-w-[740px] md:text-center"
      />

      <ul
        className={cn(
          'm-0 grid list-none gap-5 ml:grid-cols-4 to-900:grid-cols-2 to-560:grid-cols-1',
          reveal(),
          'md:text-left',
        )}
        {...revealAttrs()}
      >
        {AI_PRODUCTS.map((product) => (
          <li
            key={product.id}
            className={cn(
              'flex flex-col rounded-[10px] border border-line-soft bg-white px-6 py-6',
              '[transition:transform_.3s_cubic-bezier(.34,1.56,.64,1),box-shadow_.3s_ease,border-color_.3s_ease]',
              'hover:-translate-y-[5px] hover:border-brand-200 hover:shadow-lift-soft',
            )}
          >
            <span
              className={cn(
                'mb-4 flex h-[46px] w-[46px] items-center justify-center rounded-[13px]',
                product.iconChipClass,
              )}
            >
              <Icon name={product.icon} size={22} />
            </span>
            <b className="mb-2 block text-[16.5px] font-600 leading-[1.3] tracking-[-.01em] text-title">
              {product.title}
            </b>
            <p className="m-0 text-[14px] leading-[1.65] text-muted">
              {product.description}
            </p>
          </li>
        ))}
      </ul>

      <div
        className={cn('mt-9 text-center', reveal('up', 150), 'md:text-center')}
        {...revealAttrs()}
      >
        <SmartLink
          href={AI_PRODUCTS_CONTENT.ctaHref}
          className={buttonClass('secondary')}
        >
          {AI_PRODUCTS_CONTENT.ctaLabel} <ArrowIcon />
        </SmartLink>
      </div>
    </Section>
  );
}
