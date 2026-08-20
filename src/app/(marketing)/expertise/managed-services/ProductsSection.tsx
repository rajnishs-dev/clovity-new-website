import { cn } from '@/lib/cn';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { GradientText, Icon, Section, SectionHeader } from '@/components/ui';
import { AppImage } from '@/components/ui/Image';
import { MS_PRODUCTS, MS_PRODUCTS_CONTENT } from '@/constants/managed-services';

/**
 * The Atlassian product strip - nine products as official lockups.
 *
 * Same treatment and same reasoning as the DevSecOps page's strip: the point is the
 * breadth of surface we administer, so the lockups sit flush on a flat tone with no
 * cards, borders or hover lift. Anything heavier turns nine small items into nine
 * competing boxes.
 *
 * ── THE 5/4 SPLIT IS EXPLICIT, NOT LEFT TO `flex-wrap` ──
 * The nine lockups total 1673px at 32px height against a 1232px content track, and
 * their widths are wildly uneven - "Jira Service Management" is 372px against Jira's
 * 83px. Natural wrapping therefore lands 7-then-2 with a lopsided orphan row. Slicing
 * into a row of five and a row of four, each independently centred, is what balances
 * it; each row still wraps on its own at narrow widths.
 *
 * `grid-cols-5` would not fix it either: equal columns give the short names the same
 * track as the long ones and the row fills with air.
 *
 * ── A LOCKUP ALREADY CONTAINS ITS WORDMARK ──
 * So `name` is not printed beside it - that would set the product name twice. The name
 * travels as the image's alt text, which is why these images are not `aria-hidden`.
 *
 * The composed fallback below (tinted tile plus the name in the site's own face) is
 * dead in practice, since all nine have lockups. It is kept on purpose: it is what
 * makes a deleted or renamed logo file degrade to a readable badge instead of a blank
 * gap.
 */

/** Split into a row of five and a row of four. Changing the split is one number. */
const FIRST_ROW_COUNT = 5;
const PRODUCT_ROWS = [
  MS_PRODUCTS.slice(0, FIRST_ROW_COUNT),
  MS_PRODUCTS.slice(FIRST_ROW_COUNT),
];

export function ProductsSection() {
  return (
    <Section
      padding="tight"
      className="border-b border-line-faint bg-[#eaf8ff]"
    >
      <SectionHeader
        heading={
          <>
            {MS_PRODUCTS_CONTENT.headingLead}
            <GradientText>{MS_PRODUCTS_CONTENT.headingHighlight}</GradientText>
          </>
        }
        className="mx-auto mb-10 max-w-[720px] md:text-center"
      />

      <div
        className={cn('flex flex-col gap-x-9 gap-y-6', revealAligned('center'))}
        {...revealAttrs()}
      >
        {PRODUCT_ROWS.map((row, rowIndex) => (
          <ul
            key={rowIndex}
            className="m-0 flex list-none flex-wrap items-center justify-center gap-x-9 gap-y-6"
          >
            {row.map((product) =>
              product.logo ? (
                <li key={product.id} className="flex items-center">
                  {/* Sized on HEIGHT with width auto, because each lockup is a
                      different width for the same 32px height. No `sizes` prop: at a
                      fixed 32px box Next emits a 1x/2x srcset rather than one
                      candidate per configured width. */}
                  <AppImage
                    src={product.logo.src}
                    alt={product.logo.alt}
                    {...(product.logo.width && product.logo.height
                      ? {
                          width: product.logo.width,
                          height: product.logo.height,
                        }
                      : {})}
                    className="block h-8 w-auto"
                  />
                </li>
              ) : (
                <li key={product.id} className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg',
                      product.tintClass,
                    )}
                  >
                    <Icon name={product.icon} size={17} />
                  </span>
                  <span className="text-[21px] font-500 tracking-[-.01em] text-title">
                    {product.name}
                  </span>
                </li>
              ),
            )}
          </ul>
        ))}
      </div>
    </Section>
  );
}
