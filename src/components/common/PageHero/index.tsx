import type { ReactNode } from 'react';

/**
 * The `.accent` span inside a hero headline - the emphasised half of the claim.
 *
 * This file is named `PageHero` because it used to also export the dark
 * parallax `PageHero` component, removed once its last caller migrated to `BannerHero`.
 */
export function HeroAccent({ children }: { children: ReactNode }) {
  return <span className="text-[#93c5fd]">{children}</span>;
}
