import { cn } from '@/lib/cn';
import { reveal, revealAligned, revealAttrs } from '@/lib/reveal';
import { Icon, Section } from '@/components/ui';
import { AppImage } from '@/components/ui/Image';
import {
  DEVSECOPS_PRODUCTS,
  DEVSECOPS_PRODUCTS_CONTENT,
} from '@/constants/devsecops';

/**
 * The Atlassian product-family strip - nine products as tile-plus-name pairs.
 *
 * A capability showcase, not a partner-endorsement wall: the point is the breadth of
 * surface we work across, so the products sit flush on a soft wash with no cards, no
 * borders and no hover lift. Anything heavier turns nine small items into nine
 * competing boxes.
 *
 * ── THE 5/4 SPLIT IS EXPLICIT, NOT LEFT TO `flex-wrap` ──
 * One wrapping row does not produce a balanced strip: "Jira Service Management" and
 * "Jira Product Discovery" are three times the width of "Rovo", so natural wrapping
 * lands 7-then-2 at desktop with a lopsided orphan row. Slicing the list into a row
 * of five and a row of four, each independently centred, is what gives the reference
 * its balance - and each row still wraps on its own at narrow widths.
 *
 * A `grid-cols-5` would not fix it either: it forces equal columns, so the short
 * names get the same track as the long ones and the row fills with air.
 *
 * ── ALL NINE ARE OFFICIAL LOCKUPS ──
 * Each product renders its own icon-plus-wordmark SVG at 32px height. The composed
 * fallback below (tinted tile + product name in the site's own face) is therefore
 * dead in practice, and kept only so a deleted or renamed logo file degrades to a
 * readable badge instead of a blank gap.
 *
 * A lockup already contains its wordmark, so `name` is NOT printed beside it - that
 * would set the product name twice. The name travels as the image's alt text
 * instead, which is also why these images are not `aria-hidden`.
 */
/**
 * The list split into a row of five and a row of four.
 *
 * Derived here rather than stored as two arrays in the constants file, so the data
 * stays one ordered list and the 5/4 arrangement remains a layout decision. Changing
 * the split is one number.
 */
const FIRST_ROW_COUNT = 5;
const PRODUCT_ROWS = [
  DEVSECOPS_PRODUCTS.slice(0, FIRST_ROW_COUNT),
  DEVSECOPS_PRODUCTS.slice(FIRST_ROW_COUNT),
];

export function ProductFamilySection() {
  return (
    <Section
      padding="tight"
      // Flat `bg-soft`. An earlier version washed this band cream-to-blue
      // (`#fffaf0` → `#f5f9ff`), which was the only warm section background
      // anywhere on the site. A flat tone is what lets nine saturated product
      // marks supply all the colour, which is the point of the strip - and at
      // `#f8fafc` the lockups still sit on what is effectively white, so none of
      // them needs a tile behind it.
      className="border-b border-line-faint bg-soft"
    >
      <div
        className={cn(
          'mx-auto mb-9 max-w-[620px] text-center',
          reveal(),
          'md:text-center',
        )}
        {...revealAttrs()}
      >
        <p className="m-0 text-[clamp(19px,2.1vw,25px)] font-500 leading-[1.35] tracking-[-.02em] text-title">
          {DEVSECOPS_PRODUCTS_CONTENT.heading}
        </p>
      </div>

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
                      ? { width: product.logo.width, height: product.logo.height }
                      : {})}
                    className="block h-8 w-auto"
                  />
                </li>
              ) : (
                <li key={product.id} className="flex items-center gap-2">
                  {/* Solid fill with a white glyph, matching how Atlassian's own
                      product icons are built - a pale tile with a coloured glyph
                      read as a lesser tier beside the real lockups. Same 32px box
                      and same 8px radius as theirs. */}
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]',
                      product.tintClass,
                    )}
                  >
                    <Icon name={product.icon} size={19} />
                  </span>
                  {/* 21px, not 16px: the lockups' wordmarks fill most of their 32px
                      height, so a 16px name beside a 32px tile made the composed
                      products look half-sized next to the real ones. */}
                  <span className="whitespace-nowrap text-[21px] font-normal leading-none tracking-[-.02em] text-[#1e1f21]">
                    {product.name}
                  </span>
                </li>
              ),
            )}
          </ul>
        ))}
      </div>

      <p
        className={cn(
          'mx-auto mt-8 max-w-[640px] text-center text-[12px] leading-[1.6] text-faint',
          reveal('up', 100),
          'md:text-center',
        )}
        {...revealAttrs()}
      >
        {DEVSECOPS_PRODUCTS_CONTENT.note}
      </p>
    </Section>
  );
}
