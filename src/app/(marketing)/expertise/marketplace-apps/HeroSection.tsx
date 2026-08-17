import { ExpertiseHero } from '@/components/expertise';
import { HeroAccent } from '@/components/common';
import { MARKETPLACE_APPS_HERO } from '@/constants/expertise/marketplace-apps';

export function HeroSection() {
  return (
    <ExpertiseHero
      breadcrumb={[...MARKETPLACE_APPS_HERO.crumbs]}
      heading={
        <>
          {MARKETPLACE_APPS_HERO.titleLead}
          <br />
          <HeroAccent>{MARKETPLACE_APPS_HERO.titleAccent}</HeroAccent>
        </>
      }
      subheading={MARKETPLACE_APPS_HERO.subheading}
      image={MARKETPLACE_APPS_HERO.image.src}
      imageTablet={MARKETPLACE_APPS_HERO.image.tabletSrc}
      imageMobile={MARKETPLACE_APPS_HERO.image.mobileSrc}
      imageAlt={MARKETPLACE_APPS_HERO.image.alt}
    />
  );
}
