/**
 * Every bundled image, imported once.
 *
 * Static imports (rather than string paths into /public) buy three things:
 *   • intrinsic width/height, so next/image reserves the box and nothing shifts
 *   • content-hashed filenames, so assets can be cached immutably forever
 *   • a build-time error if a file is renamed or deleted, instead of a 404 found
 *     in production
 *
 * Central so an asset audit is one file, not a grep across forty components.
 * Videos live in /public/assets/videos and are referenced by URL - they must be
 * range-requestable for seeking, which a bundled asset is not.
 */

/* ── Brand ──────────────────────────────────────────────────────────────── */
export { default as logoBlack } from '@/assets/images/clovity-logo-black.gif';
export { default as logoWhite } from '@/assets/images/clovity-logo-white.gif';

/* ── Hero ───────────────────────────────────────────────────────────────── */
export { default as heroVideoPoster } from '@/assets/images/home/home-video-bg.jpg';

/** Served from /public so the browser can range-request while streaming. */
export const HERO_VIDEO_SRC = '/assets/videos/banner-video4.mp4';

/* ── Customer stories (Trusted By) ──────────────────────────────────────── */
export { default as customerEdd } from '@/assets/images/home/edd.png';
export { default as customerCoastGuard } from '@/assets/images/home/coast-guard.png';

/* ── AI Delivery carousel backgrounds ───────────────────────────────────── */
export { default as deliverTailored } from '@/assets/images/home/tailored-for-you.png';
export { default as deliverSecure } from '@/assets/images/home/secure-by-design.jpg';
export { default as deliverVisibility } from '@/assets/images/home/real-time-visibility.png';
export { default as deliverAutomation } from '@/assets/images/home/workflow-automation.png';
export { default as deliverExperts } from '@/assets/images/home/human-experts.png';

/* ── Section background photos ──────────────────────────────────────────── */
/**
 * UNUSED as of the cloud-migration redesign - that section now paints a flat
 * gradient and the original no longer references this photo anywhere. Kept
 * exported (and the asset on disk) rather than deleted, because it is a real brand
 * asset the interior pages still to be migrated may want. Nothing imports it, so it
 * is tree-shaken out of the bundle.
 */
export { default as dataCenterBg } from '@/assets/images/home/data-center-bg.jpg';
export { default as publicSectorBg } from '@/assets/images/home/public-sector-bg.png';
export { default as aiPoweredSummary } from '@/assets/images/home/ai-powered-summary.jpg';

/* ── Marketplace app logos ──────────────────────────────────────────────── */
export { default as appTimeTracking } from '@/assets/images/mp-time-tracking-logo.png';
export { default as appContentFormatting } from '@/assets/images/mp-content-formatting-logo.png';
export { default as appDashboardTemplates } from '@/assets/images/mp-dashboard-templates-logo.png';
export { default as appPulseAi } from '@/assets/images/mp-pulse-ai-logo.png';

/* ── Results / statistics icons ─────────────────────────────────────────── */
export { default as statEngagements } from '@/assets/images/home/enterprise-engagements.svg';
export { default as statCertifiedExperts } from '@/assets/images/home/atlassian-certified-experts.svg';
export { default as statAccreditations } from '@/assets/images/home/delivery-accreditations.svg';
export { default as statYears } from '@/assets/images/home/years-since-2009.svg';
export { default as statOffices } from '@/assets/images/home/global-offices.svg';

/* ── Credential badges ──────────────────────────────────────────────────── */
export { default as badgePlatinumPartner } from '@/assets/images/platinum-solution-partner.png';
export { default as badgeMarketplacePartner } from '@/assets/images/marketplace-partner.png';
export { default as badgeCloudSpecialization } from '@/assets/images/atlassian-badge-cloud-amer.svg';
export { default as badgeItsmSpecialization } from '@/assets/images/atlassian-badge-itsm-amer.svg';

/* ── Editorial card art ─────────────────────────────────────────────────── */
export { default as cardTeam26 } from '@/assets/images/home/artboard-13.png';
export { default as cardPartnerAward } from '@/assets/images/home/partner-award2.jpg';
export { default as cardGovMeetUsAt } from '@/assets/images/home/gov-meet-us-at.png';
export { default as cardForcepoint } from '@/assets/images/home/forcepoint-cloud.jpg';
export { default as cardHashgraph } from '@/assets/images/home/leveraging-atlassian-solutions.jpg';
export { default as cardDsh } from '@/assets/images/home/customer-success-story.jpg';

/**
 * The legacy site's own CDN origins. Kept as constants so the hosts are visible
 * and allow-listed in next.config.ts in one place, and so migrating an asset
 * into /assets later is a one-line change.
 */
export const CDN = {
  s3: 'https://clovity-website.s3.ap-south-1.amazonaws.com/',
  clovityWww: 'https://www.clovity.com/',
  clovityApex: 'https://clovity.com/',
} as const;
