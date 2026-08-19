/* ── Brand ──────────────────────────────────────────────────────────────── */
export { default as logoBlack } from '@/assets/logos/clovity-logo-black.gif';
export { default as logoWhite } from '@/assets/logos/clovity-logo-white.gif';

/* ── Atlassian product lockups ──────────────────────────────────────────── */
/**
 * Official product lockups - icon plus wordmark, 32px tall, supplied as vector.
 *
 * Rendered through `next/image` as `<img src>` rather than inlined as JSX, and that
 * is deliberate: each file carries Figma-exported `clipPath` ids (`clip0_714_22316`
 * and friends) which are NOT unique across the set. Inlining two of them into one
 * document would make the later `clipPath` win for both, and one logo would render
 * clipped by the other's mask. As separate image documents they cannot collide.
 *
 * Widths differ per lockup because the wordmarks differ in length - Jira 83 up to
 * Jira Service Management 372, totalling 1673px across the nine. All share height
 * 32, so the strip sizes on HEIGHT and lets width follow. That total is why the
 * strip cannot be one row: the shell's content track is 1232px at desktop, so the
 * 5/4 split in `ProductFamilySection` is a fitting constraint, not just taste.
 *
 * The set is now COMPLETE - all nine products have an official lockup, so the icon
 * fallback in `ProductBadge` no longer renders anywhere. It is kept on purpose: it
 * is what makes a deleted or renamed file degrade to a composed badge instead of a
 * blank gap.
 */
export { default as logoJira } from '@/assets/logos/atlassian/jira.svg';
export { default as logoConfluence } from '@/assets/logos/atlassian/confluence.svg';
export { default as logoJiraAlign } from '@/assets/logos/atlassian/jira-align.svg';
export { default as logoJiraServiceManagement } from '@/assets/logos/atlassian/jira-service-management.svg';
export { default as logoRovo } from '@/assets/logos/atlassian/rovo.svg';
export { default as logoJiraProductDiscovery } from '@/assets/logos/atlassian/jira-product-discovery.svg';
export { default as logoBitbucket } from '@/assets/logos/atlassian/bitbucket.svg';
export { default as logoCompass } from '@/assets/logos/atlassian/compass.svg';
export { default as logoTrello } from '@/assets/logos/atlassian/trello.svg';

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
 * Currently unreferenced. It was the `/expertise/itsm` hero until that page moved
 * to `itsmServiceDeskBanner`, and before that the cloud-migration section's
 * backdrop (which now paints a flat gradient). Kept because it is the only dark
 * server-room photograph in the repo, which is exactly what a scrimmed hero wants.
 */
export { default as dataCenterBg } from '@/assets/images/home/data-center-bg.jpg';
export { default as publicSectorBg } from '@/assets/images/home/public-sector-bg.png';
export { default as aiPoweredSummary } from '@/assets/images/home/ai-powered-summary.jpg';

/* ── Expertise pages ─────────────────────────────────────────────────────── */
/**
 * `/expertise/itsm` hero banner - a supplied service-desk photograph (two people at
 * a workstation, one on a headset), which is what an ITSM page's hero should show
 * rather than the server room that stood in before it.
 *
 * Downscaled from the supplied 6000x2589 original to 1920x828 at JPEG q82, taking
 * it from 6.2 MB to 118 KB. It is not the 1920x600 the purpose-made resource
 * banners use, so the hero crops it - the top-anchored default keeps both faces and
 * loses only the desk along the bottom edge, so no `imagePosition` override is
 * needed. Re-crop the source to 3.2:1 if that ever stops holding.
 */
export { default as itsmServiceDeskBanner } from '@/assets/images/expertise/itsm-service-desk.jpg';
export { default as dataCenterSupportPhoto } from '@/assets/images/expertise/data-center-support.jpg';
export { default as iconFullMigration } from '@/assets/icons/expertise/full-migration.svg';
export { default as iconPhasedMigration } from '@/assets/icons/expertise/phased-migration.svg';
export { default as iconHybridApproach } from '@/assets/icons/expertise/hybrid-approach.svg';

/* ── Resource hero banners ───────────────────────────────────────────────── */
export { default as blogHeroBanner } from '@/assets/images/resources/desktop/blog-banner.png';
export { default as blogHeroBannerTablet } from '@/assets/images/resources/tablet/blog-banner-tab.png';
export { default as blogHeroBannerMobile } from '@/assets/images/resources/mobile/blog-banner-mobile.png';

export { default as caseStudyHeroBanner } from '@/assets/images/resources/desktop/case-study-banner.png';
export { default as caseStudyHeroBannerTablet } from '@/assets/images/resources/tablet/case-study-banner-tab.png';
export { default as caseStudyHeroBannerMobile } from '@/assets/images/resources/mobile/case-study-banner-mobile.png';

export { default as eventsHeroBanner } from '@/assets/images/resources/desktop/events-banner.png';
export { default as eventsHeroBannerTablet } from '@/assets/images/resources/tablet/events-banner-tab.png';
export { default as eventsHeroBannerMobile } from '@/assets/images/resources/mobile/events-banner-mobile.png';

export { default as webinarHeroBanner } from '@/assets/images/resources/desktop/webinar-banner.png';
export { default as webinarHeroBannerTablet } from '@/assets/images/resources/tablet/webinar-banner-tab.png';
export { default as webinarHeroBannerMobile } from '@/assets/images/resources/mobile/webinar-banner-mobile.png';

export { default as newsHeroBanner } from '@/assets/images/resources/desktop/news-banner.png';
export { default as newsHeroBannerTablet } from '@/assets/images/resources/tablet/news-banner-tab.png';
export { default as newsHeroBannerMobile } from '@/assets/images/resources/mobile/news-banner-mobile.png';

/** Case-study page's "Start Your Transformation" split CTA. */
export { default as caseStudyCtaPhoto } from '@/assets/images/resources/start-your-transformation.png';

/** Events page's "Partner With Us" split CTA. */
export { default as eventsCtaPhoto } from '@/assets/images/resources/Partner-With-Us.png';

/* ── Discover hero banners ───────────────────────────────────────────────── */
export { default as aboutHeroBanner } from '@/assets/images/discover/desktop/about-us-banner.png';
export { default as aboutHeroBannerTablet } from '@/assets/images/discover/tablet/about-us-banner-tab.png';
export { default as aboutHeroBannerMobile } from '@/assets/images/discover/mobile/about-us-banner-mobile.png';

export { default as careerHeroBanner } from '@/assets/images/discover/desktop/careers-banner.png';
export { default as careerHeroBannerTablet } from '@/assets/images/discover/tablet/careers-banner-tab.png';
export { default as careerHeroBannerMobile } from '@/assets/images/discover/mobile/careers-banner-mobile.png';

export { default as contactHeroBanner } from '@/assets/images/discover/desktop/contact-banner.png';
export { default as contactHeroBannerTablet } from '@/assets/images/discover/tablet/contact-banner-tab.png';
export { default as contactHeroBannerMobile } from '@/assets/images/discover/mobile/contact-banner-mobile.png';

export { default as privacyHeroBanner } from '@/assets/images/privacy-policy-banner.png';
export { default as termsHeroBanner } from '@/assets/images/terms-condition.jpg';

/* ── Expertise hero banners ──────────────────────────────────────────────── */
/**
 * `/expertise/devsecops` hero banner - a supplied dark-navy HUD graphic, its lit
 * ring of delivery icons sitting in the RIGHT half of the frame. That placement is
 * why it works here: `BannerHero`'s scrim is darkest on the left, which is where the
 * copy sits, so the artwork and the text never compete.
 *
 * Downscaled from the supplied 6000x2000 original to 1920x640 at JPEG q82, taking it
 * from 2.3 MB to 57 KB. At 3:1 it is close enough to the 1920x600 the purpose-made
 * resource banners use that the shared top-anchored crop is correct - so unlike its
 * predecessor this needs no `imagePosition` override.
 *
 * It replaced the home page's portrait `secure-by-design.jpg`, which was only ever
 * a stand-in: reused across two pages, 2220x3245, and dependent on a crop-anchor
 * override to show anything but out-of-focus ceiling.
 */
export { default as devsecopsHeroBanner } from '@/assets/images/expertise/devsecops-banner.jpg';

/**
 * `/expertise/devsecops` - the DevOps lifecycle orbit, behind the "Scaling Secure
 * Delivery" section.
 *
 * A supplied vector, 869x907, carrying the whole diagram: the purple lifecycle arc,
 * Jira at the centre, and the PLAN / CODE / DEPLOY / OPERATE / COLLABORATE clusters
 * with real product marks (GitHub, Bitbucket, Docker, Kubernetes, JFrog, Slack,
 * Teams, Confluence, Opsgenie). Its stage labels are set in WHITE and sit on top of
 * the arc, so it must not be placed on a light background without that arc behind
 * them.
 *
 * ── ONE TILE WAS REMOVED FROM THE ORIGINAL ──
 * The source embedded one logo as a base64 PNG rather than as vector paths. That
 * bitmap could not be transcribed intact, and a truncated `data:` URI renders as a
 * blank tile, so the raster, its `<pattern>` and the tile that used it were stripped
 * rather than shipped broken. Everything else is the supplied artwork unchanged. To
 * restore it, re-export the SVG with that logo as paths and drop it in here.
 */
export { default as devsecopsOrbitDiagram } from '@/assets/images/services/devops-orbit-diagram.svg';

/* ── About page section photos ───────────────────────────────────────────── */
export { default as aboutWhoWeArePhoto } from '@/assets/images/about-us/Who-We-Are.png';
export { default as aboutWorkWithUsPhoto } from '@/assets/images/about-us/lets-build-together.png';


export { default as officeHqAndChicago } from '@/assets/images/contact/contact.png';
export { default as officeNoida } from '@/assets/images/contact/india-image.jpg';
export { default as officeLosAngeles } from '@/assets/images/contact/us-sales-1.png';
export { default as officeBoulder } from '@/assets/images/contact/us-sales-3.png';
export { default as officeOkemos } from '@/assets/images/contact/us-sales-4.png';
export { default as officeLondon } from '@/assets/images/contact/uk-sales.png';
export { default as officeTokyo } from '@/assets/images/contact/japan-office.png';

/** "Prefer to reach out directly?" side card - ported from `website-t`'s ScheduleDemo widget. */
export { default as contactWorldMap } from '@/assets/images/contact/world-map.svg';

/* ── Marketplace app logos ──────────────────────────────────────────────── */
export { default as appTimeTracking } from '@/assets/apps/mp-time-tracking-logo.png';
export { default as appContentFormatting } from '@/assets/apps/mp-content-formatting-logo.png';
export { default as appDashboardTemplates } from '@/assets/apps/mp-dashboard-templates-logo.png';
export { default as appPulseAi } from '@/assets/apps/mp-pulse-ai-logo.png';

/* ── Results / statistics icons ─────────────────────────────────────────── */
export { default as statEngagements } from '@/assets/stats/enterprise-engagements.svg';
export { default as statCertifiedExperts } from '@/assets/stats/atlassian-certified-experts.svg';
export { default as statAccreditations } from '@/assets/stats/delivery-accreditations.svg';
export { default as statYears } from '@/assets/stats/years-since-2009.svg';
export { default as statOffices } from '@/assets/stats/global-offices.svg';

/* ── Credential badges ──────────────────────────────────────────────────── */
export { default as badgePlatinumPartner } from '@/assets/badges/platinum-solution-partner.png';
export { default as badgeMarketplacePartner } from '@/assets/badges/marketplace-partner.png';
export { default as badgeCloudSpecialization } from '@/assets/badges/atlassian-badge-cloud-amer.svg';
export { default as badgeItsmSpecialization } from '@/assets/badges/atlassian-badge-itsm-amer.svg';

/* ── Editorial card art ─────────────────────────────────────────────────── */
export { default as cardTeam26 } from '@/assets/images/home/artboard-13.png';
export { default as cardPartnerAward } from '@/assets/images/home/partner-award2.jpg';
export { default as cardGovMeetUsAt } from '@/assets/images/home/gov-meet-us-at.png';
export { default as cardForcepoint } from '@/assets/images/home/forcepoint-cloud.jpg';
export { default as cardHashgraph } from '@/assets/images/home/leveraging-atlassian-solutions.jpg';
export { default as cardDsh } from '@/assets/images/home/customer-success-story.jpg';

/* ── 404 page ─────────────────────────────────────────────────────────────── */
export { default as notFoundIllustration } from '@/assets/images/errors/not-found.png';

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
