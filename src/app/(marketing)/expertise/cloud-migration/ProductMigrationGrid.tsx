import { Section, SectionHeader } from '@/components/ui/Section';
import { GradientText } from '@/components/ui/Typography';
import { Card, CardIcon } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { revealAligned, revealAttrs } from '@/lib/reveal';
import { cn } from '@/lib/cn';
import {
  CLOUD_MIGRATION_PRODUCTS,
  CLOUD_MIGRATION_PRODUCTS_CONTENT,
} from '@/constants/expertise/cloud-migration';

/**
 * Per-product migration notes (Jira / Confluence / JSM / Bitbucket) - the
 * structural idea behind catworkx's product-specific migration cards,
 * replacing the earlier generic 6-card "what we deliver" grid with
 * something specific to the Atlassian suite instead.
 */
export function ProductMigrationGrid() {
  return (
    <Section>
      <SectionHeader
        label={CLOUD_MIGRATION_PRODUCTS_CONTENT.label}
        className="mx-auto max-w-[680px]"
        heading={
          <>
            {CLOUD_MIGRATION_PRODUCTS_CONTENT.headingLead}
            <GradientText>{CLOUD_MIGRATION_PRODUCTS_CONTENT.headingHighlight}</GradientText>
          </>
        }
        subheading={CLOUD_MIGRATION_PRODUCTS_CONTENT.subheading}
      />
      <div
        className={cn(
          'mt-12 grid grid-cols-2 gap-6 to-640:grid-cols-1',
          revealAligned('left'),
        )}
        {...revealAttrs()}
      >
        {CLOUD_MIGRATION_PRODUCTS.map((product) => (
          <Card key={product.id} as="article" variant="default" className="flex gap-5 p-7">
            <CardIcon className={cn('shrink-0 bg-white', product.iconChipClass)}>
              <Icon name={product.icon} size={26} />
            </CardIcon>
            <div>
              <b className="mb-1.5 block text-[17px] font-500 tracking-[-.01em] text-title">
                {product.name}
              </b>
              <p className="m-0 text-[14px] leading-[1.7] text-muted">{product.note}</p>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
