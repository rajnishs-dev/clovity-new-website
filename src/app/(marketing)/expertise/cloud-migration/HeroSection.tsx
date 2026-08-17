import { ExpertiseHero } from '@/components/expertise';
import { HeroAccent } from '@/components/common';
import { CLOUD_MIGRATION_HERO } from '@/constants/expertise/cloud-migration';

/** Breadcrumb + heading + subheading - no eyebrow, no CTA row (matches the Atlassian page). */
export function HeroSection() {
  return (
    <ExpertiseHero
      breadcrumb={[...CLOUD_MIGRATION_HERO.crumbs]}
      heading={
        <>
          {CLOUD_MIGRATION_HERO.titleLead}
          <br />
          <HeroAccent>{CLOUD_MIGRATION_HERO.titleAccent}</HeroAccent>
        </>
      }
      subheading={CLOUD_MIGRATION_HERO.subheading}
      image={CLOUD_MIGRATION_HERO.image.src}
      imageTablet={CLOUD_MIGRATION_HERO.image.tabletSrc}
      imageMobile={CLOUD_MIGRATION_HERO.image.mobileSrc}
      imageAlt={CLOUD_MIGRATION_HERO.image.alt}
    />
  );
}
