import { ExpertiseHero } from '@/components/expertise';
import { HeroAccent } from '@/components/common';
import { MARKETPLACE_APPS_HERO } from '@/constants/expertise/marketplace-apps';

/**
 * No `imageTablet`/`imageMobile`: the hero graphic is a bundled static import, so
 * `next/image` builds the responsive srcset itself and `ParallaxImage` falls back to
 * `image`. See the note on `MARKETPLACE_APPS_HERO.image`.
 */
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
      imageAlt={MARKETPLACE_APPS_HERO.image.alt}
    />
  );
}
