import { ExpertiseHero } from '@/components/expertise';
import { HeroAccent } from '@/components/common';
import { ATLASSIAN_HERO } from '@/constants/expertise/atlassian';

/**
 * Breadcrumb + heading + subheading - no eyebrow, no CTA row.
 *
 * No `imageTablet`/`imageMobile`: the hero photo is now a bundled static import, so
 * `next/image` builds the responsive srcset itself. Those props existed to pass three
 * hand-sized Unsplash URLs - see the note on `ATLASSIAN_HERO.image`. `ParallaxImage`
 * falls back to `image` when they are omitted, which is exactly what should happen here.
 */
export function HeroSection() {
  return (
    <ExpertiseHero
      breadcrumb={[...ATLASSIAN_HERO.crumbs]}
      heading={
        <>
          {ATLASSIAN_HERO.titleLead}
          <br />
          <HeroAccent>{ATLASSIAN_HERO.titleAccent}</HeroAccent>
        </>
      }
      subheading={ATLASSIAN_HERO.subheading}
      image={ATLASSIAN_HERO.image.src}
      imageAlt={ATLASSIAN_HERO.image.alt}
    />
  );
}
