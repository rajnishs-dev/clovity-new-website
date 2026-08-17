/**
 * Expertise-page primitives barrel, mirroring `common/` and `ui/`.
 *
 * These are shared across all 8 `/expertise/*` pages; each page's own
 * sections stay bespoke files under `src/app/(marketing)/expertise/<slug>/`,
 * matching how `about-us`/`careers` compose shared primitives into per-page
 * sections rather than one shared page template.
 */
export { ExpertiseHero, type ExpertiseHeroProps } from './ExpertiseHero';
export { ProcessTimeline, type ProcessTimelineProps } from './ProcessTimeline';
export { ProofQuote, type ProofQuoteProps } from './ProofQuote';
export { MetricStat, type MetricStatProps } from './MetricStat';
