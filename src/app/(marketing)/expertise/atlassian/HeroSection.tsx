import { ExpertiseHero } from '@/components/expertise';
import { HeroAccent } from '@/components/common';
import { ATLASSIAN_HERO } from '@/constants/expertise/atlassian';

/** Breadcrumb + heading + subheading - no eyebrow, no CTA row. */
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
      imageTablet={ATLASSIAN_HERO.image.tabletSrc}
      imageMobile={ATLASSIAN_HERO.image.mobileSrc}
      imageAlt={ATLASSIAN_HERO.image.alt}
    />
  );
}
