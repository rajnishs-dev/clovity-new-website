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
/**
 * `/expertise/atlassian` hero banner - a supplied photograph of three people reviewing
 * work on screen, subject centre-right.
 *
 * ── THIS REPLACED THREE REMOTE UNSPLASH URLS ──
 * `ATLASSIAN_HERO.image` used to hold three `images.unsplash.com` URLs (one per
 * breakpoint, same photo at 1800/1000/640px). Bundling it locally removes a
 * third-party runtime dependency from a hero - an external host that rate-limits or
 * changes an id leaves the page's first screen blank - and lets `next/image` build the
 * responsive srcset from one static import, so the per-breakpoint URLs are no longer
 * needed at all.
 *
 * Downscaled from the supplied 6016x3372 original to 1920x1076 at JPEG q84: 8.6 MB to
 * 162 KB. At 16:9 this is much taller than the banner slot, so `ExpertiseHero` crops it
 * hard - the top-anchored default keeps all three faces and loses the desk along the
 * bottom, which is why no crop-anchor override is needed.
 *
 * `ExpertiseHero`'s scrim is stronger than `BannerHero`'s (.88 to .2 rather than .85 to
 * 0), which is what makes this bright, window-lit frame safe behind white copy.
 */
export { default as atlassianHeroBanner } from '@/assets/images/expertise/atlassian-banner.jpg';

/**
 * `/expertise/cloud-migration` hero banner - a supplied photograph, a laptop and a
 * hand holding a phone with a cloud-transfer diagram between them, subject centre-right
 * and the left half almost empty. That emptiness is ideal here: it is where the copy
 * sits, so the scrim has nothing to fight.
 *
 * Converted from the supplied 1536x768 PNG to JPEG q84: 1.3 MB to 75 KB. NOT upscaled
 * to 1920 - 1536 is the source width.
 *
 * ── THIS ALSO ENDED A SHARED PHOTO ──
 * `CLOUD_MIGRATION_HERO.image` previously held the SAME three Unsplash URLs as
 * `ATLASSIAN_HERO.image` - one photo doing duty as the hero of two different expertise
 * pages, with a comment on each pointing at the other. Both now have their own bundled
 * image, so neither depends on a third-party host and the two pages no longer open on
 * the same picture.
 */
export { default as cloudMigrationHeroBanner } from '@/assets/images/expertise/cloud-migration-banner.jpg';

/**
 * `/expertise/marketplace-apps` hero banner - a supplied DIAGRAM, not a photograph: the
 * Atlassian Platinum Solution Partner badge ringed by six app icon tiles on a near-white
 * lavender field. The left half is empty, which is where the hero copy sits.
 *
 * ── THIS IS THE UNLABELLED VERSION, AND THAT IS WHY IT WORKS ──
 * A first version carried a text caption beside each of the six tiles. It had to go: the
 * hero crops 25% off the bottom at desktop width, which cut two captions off entirely
 * and left the header pill covering a third, and at 390px the whole graphic renders
 * 195px tall so every caption was far too small to read. Captions at the top and bottom
 * extremes of a graphic cannot survive a wide letterbox crop - no crop anchor fixes
 * that. Without them the artwork crops cleanly at any width, because what remains is
 * centred.
 *
 * If a labelled version is ever wanted, it belongs in a section of its own at full size,
 * not behind hero copy.
 *
 * ── JPEG, AFTER MEASURING ──
 * The labelled version was kept as PNG (426 KB) because JPEG's chroma subsampling
 * fringes small text. With the captions gone the only fine detail left is the badge's
 * own wordmark, and JPEG q88 differs from the PNG by a mean of 2.35/255 (0.9%) over the
 * badge region with the lettering clean at 6x zoom - so 412 KB became 56 KB for no
 * visible cost. Re-run that comparison before switching format again.
 */
export { default as marketplaceAppsHeroBanner } from '@/assets/images/expertise/marketplace-apps-banner.jpg';

export { default as itsmServiceDeskBanner } from '@/assets/images/expertise/itsm-service-desk.jpg';

/**
 * `/expertise/managed-services` hero banner - a supplied support-desk photograph (two
 * people at a monitor on headsets, network overlay across a city skyline), its subject
 * in the RIGHT half of the frame. That placement is why it works here: `BannerHero`'s
 * scrim is darkest on the left where the copy sits, so subject and text never compete.
 *
 * Downscaled from the supplied 6457x2500 original to 1920x743 at JPEG q84: 3.2 MB to
 * 116 KB. At 2.58:1 this is the CLOSEST of the three banners tried here to the 3.2:1
 * the purpose-made resource banners use, so the hero crops less of it than its
 * predecessors did - and the top-anchored default keeps both faces, which is why no
 * `imagePosition` override is passed.
 *
 * ── THE SOURCE IS LIGHT, AND THE SCRIM IS DOING THE WORK ──
 * Two earlier versions occupied this slot: a dark-navy operator-at-laptop frame, then a
 * light variant of it. This one is light too, which matters because the hero's scrim
 * was built for dark photography - it fades to fully transparent on the right, so the
 * band behind the copy stays dark while the right half reads pale. The white heading's
 * contrast therefore rests on the scrim rather than on the photo. Measured 9.7:1 at
 * 1440. Re-measure if the scrim is ever softened.
 */
export { default as managedServicesHeroBanner } from '@/assets/images/expertise/managed-services-banner.jpg';

/**
 * `/expertise/workforce` hero banner - four colleagues around a laptop at a wooden table,
 * against a pale panelled wall that runs empty across the left third of the frame.
 *
 * A client-supplied photograph, 7070x2070. Downscaled to 1920x562 at JPEG q84 (mozjpeg):
 * 7.8 MB to 127 KB. Not cropped - the full frame is kept, because that empty left third is
 * exactly where the hero sets its copy.
 *
 * ── IT REPLACED A CROP THAT EXISTED ONLY TO DODGE BURNT-IN TEXT ──
 * The slot previously held a 995x500 crop of the legacy site's own workforce banner
 * (`website-t/public/images/banner/workforce/workforce-desktop.jpg`). That file has the
 * headline "Boost productivity through workforce optimization" baked into its pixels across
 * the left half - where this hero renders its own `<h1>` - so the only usable part was the
 * photograph to the right of the text, at a poor 1.99:1. Its tablet and mobile siblings
 * carry the same burnt-in text. This supplied file has none, so the whole frame is usable.
 *
 * ── 3.42:1 FLIPS THE CROP AXIS, AND THAT IS WHY CENTRE IS CORRECT ──
 * At 3.42:1 this is WIDER than the banner slot (about 2.88:1 at 1440), so `object-fit:
 * cover` scales it by height and crops HORIZONTALLY - the opposite of the previous 1.99:1
 * file, which was scaled by width and cropped vertically. So `objectPosition` matters here
 * in the axis it did not before, and the default is what is wanted: `ParallaxImage` sets
 * none, so the browser default `50% 50%` applies and trims about 135px from each side at
 * 1440, keeping all four faces with the empty wall still under the copy.
 *
 * Do NOT pass `imagePosition: 'left'` to "protect" the copy column. It would hold the
 * leftmost pixels, which are the BRIGHTEST part of the wall, and cost contrast rather than
 * buy it. And note `ParallaxImage`'s own doc comment claims a top-anchored `center 0%`
 * default - that is stale; nothing in the component or `AppImage` sets it, and the computed
 * value on this page is `50% 50%`.
 *
 * ── THE COPY RESTS ON THE SCRIM, NOT ON THE PHOTO ──
 * That pale wall means the white text's contrast comes almost entirely from the gradient.
 * Measured at 1440 on the REAL composited background - the page rendered with the hero text
 * and header hidden, so photo plus scrim only - sampling each text box's own pixel rect:
 *
 *     heading  46px, needs 3:1     worst 4.89:1   1.63x the requirement
 *     lead     17px, needs 4.5:1   worst 5.02:1   1.12x the requirement
 *
 * Note the method: measuring the normal render is useless, because the white glyphs sample
 * as 1.00:1 against themselves. Hide the text, then measure.
 *
 * Both pass WCAG AA, but the lead has only about 12% headroom - against 61% for the crop
 * this replaced, which was a darker frame. That is the cost of the better composition, and
 * it is thin enough to matter: widening the copy column, softening the scrim, lightening
 * the type or adding a fourth line of lead copy could each push it under. Re-measure over
 * the actual text boxes, not a fixed band, after any of those. If more headroom is ever
 * needed the cheapest source is a baked left-side vignette on the asset itself - which is
 * how the legacy banner made its own burnt-in white text legible on this same photograph.
 */
export { default as workforceHeroBanner } from '@/assets/images/expertise/workforce-banner.jpg';

/**
 * `/expertise/ai` hero banner - a client-supplied photograph: a bearded man in profile looking
 * up at a wall of translucent data panels, the left third falling away into soft window bokeh.
 *
 * 8064x2304 downscaled to 1920x549 at JPEG q84 (mozjpeg): 1.4 MB to 92 KB. Not cropped - the
 * full frame is kept, because that bokeh on the left is where the hero sets its copy.
 *
 * ── IT REPLACED A CROP OF THE LEGACY GEN-AI BANNER ──
 * The slot previously held a 1160x500 crop of `website-t/public/images/banner/gen-ai/
 * genaibanner.png` - a robot hand and a glowing "AI" hexagon on dark navy - cut to x=760..1920
 * to escape the "Unleash the future of Generative AI" headline baked into its left half, the
 * same problem `workforceHeroBanner` documents. That crop was only 1160px wide with nothing to
 * upscale from, so this supplied file is a straight improvement on resolution as well as
 * composition.
 *
 * ── 3.50:1 MEANS THE CROP IS HORIZONTAL ──
 * Wider than the banner slot (about 2.88:1 at 1440), so `object-fit: cover` scales by height and
 * trims about 135px from each side under the `50% 50%` default - which keeps the man, the panels
 * and enough of the bokeh. No `imagePosition` override. Note this is the opposite axis to the
 * 2.32:1 graphic it replaced, which was scaled by width and cropped vertically.
 *
 * ── CONTRAST WENT FROM COMFORTABLE TO TIGHT, AND THAT IS THE REAL COST ──
 * The old crop was near-black navy behind the copy and measured 17.18:1 / 14.72:1. This frame is
 * bright, so the scrim is doing all the work. Measured on the real composited background at 1440
 * - the page rendered with the hero text and header hidden, then sampling each text box's own
 * pixel rect:
 *
 *     heading  46px, needs 3:1     worst 4.58:1   1.53x the requirement
 *     lead     17px, needs 4.5:1   worst 5.16:1   1.15x the requirement
 *
 * Both clear WCAG AA, but the lead now has roughly 15% headroom where it had 230%. That puts this
 * banner in the same bracket as `workforceHeroBanner` (4.89:1 / 5.02:1): widening the copy column,
 * softening the scrim, lightening the type or adding a fourth line of lead copy could each push it
 * under. Re-measure over the actual text boxes after any of those - measuring the normal render is
 * useless, because the white glyphs sample as 1.00:1 against themselves. Hide the text first.
 */
export { default as aiHeroBanner } from '@/assets/images/expertise/ai-banner.jpg';

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
 * `/expertise/devsecops` hero banner - a supplied mid-blue HUD graphic, its lit ring of
 * delivery icons sitting in the RIGHT half of the frame. That placement is why it works
 * here: `BannerHero`'s scrim is darkest on the left, which is where the copy sits, so
 * the artwork and the text never compete. The left half is a plain blue gradient, which
 * is the easiest thing a scrim can darken cleanly.
 *
 * Converted from the supplied 1536x768 PNG to JPEG q84: 1.3 MB to 83 KB. NOT upscaled
 * to the 1920 the other banners use - 1536 is the source width, and inventing pixels
 * would add bytes without detail.
 *
 * ── THE ASPECT CHANGED, AND THE CROP FOLLOWED ──
 * This replaced a darker 3:1 version of the same composition. At 2:1 the hero now crops
 * more off the bottom than it did at 3:1, so the ring sits lower in frame. The
 * top-anchored default still keeps the whole ring and loses only empty gradient, which
 * is why no `imagePosition` override is passed - but that is a measured outcome of this
 * particular composition, not a general property of 2:1 sources.
 *
 * Two images preceded it here: the 3:1 dark version, and before that the home page's
 * portrait `secure-by-design.jpg`, which was only ever a stand-in - reused across two
 * pages, 2220x3245, and dependent on a crop-anchor override to show anything but
 * out-of-focus ceiling.
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
