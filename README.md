# Clovity Website - Next.js Migration

Migration of the static `clovity-website-updated` site to an enterprise Next.js
App Router application. This is a **migration, not a redesign** - the rendered
output is intended to be pixel-identical to the original.

**Status: Phase 1 complete.** Foundation + home page (`/`) are migrated,
verified and building clean. 19 interior pages remain - see
[Remaining work](#remaining-work).

---

## Quick start

```bash
npm install
cp .env.example .env.local     # optional; every value has a working default
npm run dev                    # http://localhost:3000
```

| Script                 | What it does                                     |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Dev server (Turbopack)                           |
| `npm run build`        | Production build                                 |
| `npm start`            | Serve the production build                       |
| `npm run typecheck`    | `tsc --noEmit`, strict mode                       |
| `npm run lint`         | ESLint (Next 16 removed `next lint`)              |
| `npm run format`       | Prettier write                                    |
| `npm run verify`       | typecheck → lint → build. Use this before a PR.  |

---

## Stack

| Concern     | Choice                        | Note                                        |
| ----------- | ----------------------------- | ------------------------------------------- |
| Framework   | Next.js 16.3 (App Router)     | Turbopack for dev and build                 |
| Language    | TypeScript 5.9, strict        | `noUncheckedIndexedAccess` on               |
| Styling     | **Tailwind CSS 3.4**          | v3 on purpose - see [Decision 1](#1-tailwind-3-not-4) |
| State       | Redux Toolkit 2 + redux-persist | 6 slices, narrow persistence              |
| Forms       | React Hook Form 7 + Zod 4     | Schemas shared with the future API          |
| HTTP        | Axios 1.19                    | Interceptors + normalised result envelope   |
| Icons       | Lucide + 9 inline brand SVGs  | see [Decision 2](#2-lucide-everywhere-font-awesome-is-gone) |
| Animation   | GSAP 3.15 + ScrollTrigger     | Scoped to `gsap.context()`                  |
| Motion      | Framer Motion 12              | Installed for interior-page work            |
| Fonts       | `next/font` - Space Grotesk   | Self-hosted, 300–700                        |

---

## Architecture

Eleven directories. A page's own sections live WITH the page; everything shared
lives under `components/`; everything fetched lives under `data/`.

```
src/
├── app/                        App Router - routes, and each route's own sections
│   ├── layout.tsx              Root: fonts, stylesheet order, JSON-LD, StoreProvider
│   ├── loading.tsx  error.tsx  not-found.tsx
│   ├── robots.ts  sitemap.ts  manifest.ts
│   ├── api/revalidate/         Strapi publish webhook
│   └── (marketing)/
│       ├── page.tsx            Home page
│       ├── _home/              its 17 sections (`_` = never a route)
│       ├── about-us/           page.tsx + its 10 sections
│       ├── careers/            page.tsx + its 8 sections
│       ├── contact/            page.tsx + its 4 sections + actions.ts
│       ├── blog/               page.tsx + [slug]/page.tsx
│       ├── news/  events/  webinars/  case-study/    same shape
│       └── HomeNavState.tsx    Declares the active nav entry
│
├── components/                 Shared UI only. Never fetches.
│   ├── ui/                     31 primitives (Button, Card, Modal, Tabs, Icon, …)
│   ├── common/                 Logo, CTA, Newsletter, Search, PageHero, Resources, …
│   └── layout/                 Header, Navbar (+ MegaPanel), MobileMenu, Footer
│
├── api/                        The ONLY place HTTP happens
│   ├── cms.ts                  Strapi client + every endpoint + every call
│   ├── cms.types.ts            Strapi wire shapes
│   ├── cms.mappers.ts          Strapi shapes → types/content
│   ├── cms.richtext.ts         Strapi richtext (HTML) → ContentBlock[]
│   └── cms.hooks.ts            Browser-side refetch hooks
│
├── data/                       One loader per page: CMS first, bundled fallback
│   ├── home.ts  about.ts  careers.ts  contact.ts
│   └── blog.ts  news.ts  events.ts  webinars.ts  case-study.ts
│
├── constants/                  Static content + app config
│   ├── media.ts                Every bundled image import, in one place
│   ├── home.ts  about.ts  careers.ts  contact.ts  content.ts  clients.ts
│   └── routes.ts  site.ts  navigation.ts  env.ts  fonts.ts
│
├── store/                      Redux: index · provider · hooks · storage · slices/ (6)
├── hooks/                      14 hooks - each replaces a legacy inline script
├── lib/                        cn · seo · schema · validation · format · image · link · a11y · slug
├── types/                      api · common · content · icon · navigation · seo
├── styles/                     globals.css
└── assets/images/              50 media files (videos in public/assets/videos)
```

### The layers, and why they are separate

- **Static UI** - `components/` never fetches. Sections take data as props.
- **Page sections** - live in the route folder that renders them. If a second page
  needs one, it moves to `components/common/` (that is why `ClientMarquee` is there).
- **Data** - `data/*.ts` is the only place a page's data is resolved. Each loader
  reads Strapi and falls back to `constants/`.
- **API** - `api/cms.ts` is the only place HTTP happens, and `CMS_ENDPOINTS` in it is
  the only place a CMS route is written down.
- **Content** - `constants/` holds the extracted copy, typed identically to the CMS
  responses, so a section cannot tell which one it got.
- **State** - `store/` holds only genuinely shared, cross-component state.

That separation is what makes the backend swap a config change rather than a
refactor. See [Backend integration](#backend-integration).

---

## Migration decisions

Each of these is a judgement call worth knowing about before you touch the code.

### 1. Tailwind 3, not 4

The legacy site was authored against the Tailwind **v3** Play CDN. v4 changes
preflight defaults that this design depends on:

- default border colour `gray-200` → `currentColor` (every bare `border` shifts)
- `shadow-sm` / `shadow` renamed one step down the scale
- a different default font stack on `html`

Verified in the built CSS: `*,:before,:after{box-sizing:border-box;border:0 solid #e5e7eb}`.
That `#e5e7eb` is the v3 default the markup was written against.

`tailwind.config.ts` is a 1:1 port of the legacy `assets/js/tailwind-config.js`,
including the non-standard `font-500 … font-900` utilities the markup uses
throughout, and `fontFamily.sans` - which is how the whole site gets Space
Grotesk, since v3's preflight puts it on `html`.

**Watch out:** the legacy config extends weights 500–900 only. `font-300` and
`font-400` generate no CSS. Use `font-light` / `font-normal`.

### 2. Lucide everywhere; Font Awesome is gone

Originally Font Awesome was kept, self-hosted at the legacy 6.5.1, because
pixel-identical output and "use Lucide" conflict - Lucide has no Atlassian, Jira
or Confluence mark, and swapping glyph shapes is a visible redesign. That call was
later reversed on request, and the webfont was removed entirely.

**Icons are now SVG components.** This matters beyond preference: a webfont glyph's
box depends on the font loading, a `content` declaration surviving minification, and
a `font-family` cascade the app does not control. An SVG has intrinsic geometry.

Three parts:

- **[types/icon.ts](src/types/icon.ts)** declares `IconName`, a closed union of ~60
  semantic names (`mail`, not `envelope`; `close`, not `xmark`). It lives in `types/`
  so content models can name an icon without importing from `components/`.
- **[Icon/registry.ts](src/components/ui/Icon/registry.ts)** maps each name to a
  glyph and asserts `satisfies Record<IconName, Glyph>`, so a declared name can never
  lack an implementation. Content keeps naming icons with **strings**, which is what
  the phase-2 CMS can store in Postgres - a component is not a database value.
- **[Icon/brands.tsx](src/components/ui/Icon/brands.tsx)** holds the nine marks
  Lucide cannot supply. Note that Lucide 1.28 ships **no brand icons at all** -
  `Linkedin`, `Github`, `Youtube`, `Slack` and `Twitter` were all removed upstream
  over trademark concerns. Path data is Font Awesome Free (CC BY 4.0, attributed in
  the file), normalised onto Lucide's 24×24 grid.

The win over the FA class strings: `"fa-solid fa-clod-arrow-up"` was a silent no-op.
A bad `IconName` is a compile error.

**Watch out:** `Icon`'s `size` defaults to `1em` so the ~100 call sites that sized
icons with `text-[11px]` / `fontSize` keep working untouched. Anything computing a
dimension from `size` must therefore handle CSS lengths, not just numbers - see the
1×1-pixel bug in [Bugs this surfaced](#bugs-this-conversion-surfaced).

### 3. Zero custom CSS - everything is Tailwind

There is **one** stylesheet in the project: [globals.css](src/styles/globals.css),
112 lines, almost all comments. `theme.css`, `pages/home.css` and `migration.css`
are gone. ~1,750 lines of hand-written CSS became:

- **Tailwind theme tokens** - 12 breakpoints (min *and* max width), 15 keyframes
  and their animations, colour tokens replacing the `:root` custom properties,
  four custom easings, shadow and gradient tokens. See
  [tailwind.config.ts](tailwind.config.ts).
- **Utilities on the element** - including `before:`/`after:` for the gradient
  underlines, dot grids and hover floods, and arbitrary properties
  (`[transition:…]`, `[mask-image:…]`, `[scrollbar-width:none]`) for the handful of
  properties Tailwind ships no utility for.
- **Component-owned strings** - `HEADING_CLASS`, `buttonClass()`, `chipClass()`,
  `reveal()`. Repeated combinations live in exactly one place.

Four things legitimately remain CSS, and `globals.css` says which reason applies
to each: Tailwind's own `@tailwind` directives; `p { font-size }` (an element
default with no per-element home); `::-webkit-scrollbar` (a pseudo-element on the
scrolling root, unreachable from any class); and the `:focus-visible` ring plus
the global `prefers-reduced-motion` clamp, which must apply to every element
including third-party markup.

**What this bought beyond style:** the old arrangement had custom CSS silently
overriding Tailwind classes in the markup, because the stylesheets loaded later.
Removing it surfaced three latent bugs - see [Bugs this surfaced](#bugs-this-conversion-surfaced).

### 4. One stylesheet

There is a single CSS import in `app/layout.tsx`. This entry used to document a
load-order rule - Font Awesome had to be imported *before* `globals.css`, because
`.fa-solid`'s single-class rules tie on specificity with utilities like `flex` and
whichever sheet loaded second won.

That whole class of problem disappeared with the webfont (Decision 2). An SVG icon
carries no competing `display`, `line-height` or `font-family` declarations, so
there is no cascade race to reason about and no import order to preserve.

### 5. Inline event handlers became CSS

The legacy markup set hover styles with `onmouseover` / `onmouseout` attributes
plus inline `style`. Because inline styles beat classes, Tailwind `hover:`
variants could not override them. Those rules moved to `migration.css`
(`.footer-social`, `.footer-legal-link`) with **the same timing functions and
durations** as the Tailwind classes the elements originally carried
(150ms, `cubic-bezier(.4,0,.2,1)`).

### 6. Header and footer are not in the route-group layout

The home page's header is a transparent pill over a full-bleed dark hero;
interior pages get the solid white bar. The footer's `.footer-overlap` padding
only applies where the final CTA card tucks into it. Hoisting either into
`(marketing)/layout.tsx` would force one treatment onto the other, so each page
composes its own chrome - as the legacy per-page HTML did.

### 7. Hero entrance is CSS, not GSAP

The original faded the hero copy in via a GSAP timeline in an inline script. A
React effect cannot reproduce that without a visible flicker: the
server-rendered headline paints first, and the effect - even `useLayoutEffect` -
runs only after hydration, so the text would appear, blink out, then fade in.

The `heroRise` keyframes in `home.css` reproduce the exact same motion
(h1: 0.4s delay / 0.55s / 20px; sub: 0.75s delay / 0.4s / 14px;
`power2.out` = `cubic-bezier(.215,.61,.355,1)`) starting at first paint.
`animation-fill-mode: both` replaces the original's 2s "safety net" timeout.

All **below-the-fold** animation is still GSAP + ScrollTrigger, with the original
`from`/`to` values unchanged.

### 8. Deliberate deviations from the original

Four places where the original's own behaviour was inconsistent:

| What | Original | Here | Why |
| ---- | -------- | ---- | --- |
| Hamburger bar 3 | ships at `w-6` (24px), but `closeMobileMenu()` set it to 16px | stays 24px | The close handler contradicted the initial render. First paint is the contract. |
| Counters | animated **twice** - `setInterval` in `site.js` and a GSAP ScrollTrigger, both writing the same node | one rAF implementation (`useCountUp`) | Two writers fighting is a bug, not a feature. |
| Pulse sphere dots | `Math.random()` per reload | deterministic hash of the index | Random breaks SSR determinism; the visual scatter is identical. |
| `#tagline` | rendered as a `<div>` | `<h2 id="tagline">` | The section had no heading in the outline. Same id, so styling is unchanged. |

Plus two requested changes that are **visual**, not just structural - the only two
places the header does not match the original pixel for pixel:

| What | Original | Here | Why |
| ---- | -------- | ---- | --- |
| Mega-menu icon chips | every link ships an icon in the markup, then `theme.css` hides them all with `.mega-icon { display: none }` and makes `.mega-item` a block | shown, as a 36px chip in a flex row | Requested. The chip design is not invented - an earlier revision of `theme.css` styled `.mega-icon` as a 42px rounded square inverting on hover; that is reproduced at the size the current tighter row padding allows. Titles in the narrowest column now wrap to two lines. |
| Active nav link colour | `.nav-link.active` recolours the label to `#1d4ed8` | label keeps the same colour as its siblings; the underline alone marks the page | Requested. Over the dark hero the recolour read as a permanently hovered item. `aria-current="page"` was added so the state still reaches assistive tech. |

Everything else - logo fallback `<span>`s behind `onerror`, the commented-out
hero "ask box" - was `display:none` or commented out in the original and is
simply absent.

**Note on the two legacy copies.** There are two `clovity-website-updated/`
directories on disk. `Nextjs/clovity-website-updated/` (12 HTML files, theme.css
~27 KB) is the one this port is built against. The copy one level up
(`New-Clovity-website/clovity-website-updated/`, 1 HTML file, theme.css ~22 KB) is
an older partial snapshot and its CSS differs - `.mega-icon` is fully styled there
rather than hidden. Verify against the inner copy.

---

## Performance

Measured on the production build of `/`.

| Change | Effect |
| ------ | ------ |
| Removed 4 CDN dependencies (Tailwind CDN, Font Awesome, GSAP, Lucide UMD) | 4 fewer cross-origin round trips; no runtime CSS generation |
| Dropped the Font Awesome webfont entirely (Decision 2) | ~1.4 MB package and 4 font files gone; icons no longer block on a font load |
| `next/font` self-hosting Space Grotesk | Removes 2 preconnects + a render-blocking `<link>`; no swap-induced layout shift |
| Trimmed `deviceSizes`/`imageSizes`; dropped `sizes` on fixed-size images | **HTML 404KB → 238KB (−41%)**. Marquee logos went from 25 srcset candidates each to 2. |
| Static imports for all bundled images | Intrinsic width/height → no CLS; content-hashed → immutable caching |
| AVIF → WebP → original | Modern formats with automatic fallback |
| `preload="metadata"` on the hero video | The original defaulted to `auto`, pulling megabytes before any scroll |
| Card rails and marquee server-rendered | Were `innerHTML`-injected, so invisible to crawlers and JS-off visitors |
| Server Components by default | Only 12 of 40 components ship JS. Footer, hero, results wrapper, marketplace, migration are server-only. |
| `gsap.context()` + cleanup | ScrollTriggers no longer leak across client-side navigation |
| Canvas paused off-screen via IntersectionObserver | The original ran the rAF loop forever |
| `prefetch={false}` on 17 footer links | No prefetch burst for routes nobody clicked |
| All 5 routes prerendered static | Served from cache, zero server work |

**Verified:** 325 distinct image requests → all HTTP 200.

⚠️ **`images.qualities` gotcha:** Next 16 rejects any `q` not listed in
`next.config.ts` with a **400**. A component passing an unlisted `quality` fails
silently at build and 400s at runtime. Allowed here: `[75, 90]`.

---

## SEO

- `lib/seo.ts` - `buildMetadata()` produces canonical, OG, Twitter and robots
  directives from one small input. Every page uses it, so none can ship without
  a canonical or OG image.
- `lib/schema.ts` - Organization, WebSite, BreadcrumbList, FAQPage, Article,
  Service builders. Organization + WebSite are emitted once in the root layout as
  an `@graph`; verified as valid JSON in the rendered HTML.
- `components/common/JsonLd` escapes `<` to `<`, closing the standard
  JSON-LD injection vector.
- `app/sitemap.ts` - the static routes from `constants/routes.ts`, plus every CMS
  detail page with its own `lastModified`.
- `app/robots.ts` - fully disallows preview deploys when
  `NEXT_PUBLIC_ALLOW_INDEXING=false`, so a preview URL never competes with
  production in search.
- `next.config.ts` - 301s for all 12 legacy `.html` URLs, so inbound links and
  existing search results survive the migration.
- `Breadcrumb` emits the visible trail and its JSON-LD from one array, so they
  cannot drift.

---

## Accessibility

Added during migration (the original had none of it):

- Skip-to-content link; `<main id="main-content">`; landmark `aria-label`s
- Mega menus: real `<button>` triggers with `aria-expanded` / `aria-controls`,
  click + Enter + Space + Escape, and close-on-focus-out
- Mobile drawer: `role="dialog"`, focus trap, focus return to the toggle,
  `inert` when closed (it previously stayed tabbable at `translateX(100%)`)
- Field-notes tabs: full WAI-ARIA tablist with roving tabindex and Home/End
- Card rails: `aria-roledescription="carousel"`, labelled arrows, `aria-current`
  dots
- The hover-reveal cards previously exposed an unlabelled image link - the title
  now comes through `aria-label`
- Star ratings announce the actual score instead of five silent glyphs
- Marquee duplicate is `aria-hidden`, so 23 logos are read once, not 46
- `:focus-visible` rings only - default and `:hover` appearance untouched
- Verified outline: exactly 1 `<h1>`, 11 `<h2>`, 9 `<h3>`
- All 13 external links carry `target="_blank" rel="noopener noreferrer"`

Screen-reader note: the public-sector card stack deliberately does **not**
`aria-hidden` the panel behind. The rotation is decorative; hiding half the
section's content to mirror a z-order would remove real information.

---

## Backend integration

The backend is Strapi (`clovity-admin`). There is no other one - the Express API this
repo was originally scaffolded against was never built, and its `services/` layer was
removed. Form submissions go through Server Actions; everything else reads Strapi.

The seam is `data/*.ts`:

```ts
export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  return withCmsFallback(() => getBlogs(), getAllBlogPosts());
});
```

`withCmsFallback` calls Strapi and returns the bundled static content when the CMS is
not configured, **the request fails, or the result is empty**. The fallbacks in the
data files and the CMS responses are the *same TypeScript type*, so a section cannot
tell which one it got.

Every CMS route is in `CMS_ENDPOINTS` in `api/cms.ts`. Two of them are not guessable:
`news` pluralises to `newses`, and the case studies the site renders come from the
`jsm-resource` collection, not `case-study`.

**Freshness** is two mechanisms, and the slower one is the safety net:

1. `POST /api/revalidate` - a Strapi webhook that rebuilds the affected listing page
   the moment an editor publishes.
2. `export const revalidate` on each page (5 min About/Careers, 1 h Contact and every
   resource page), which covers the webhook being misconfigured or blocked.

Detail pages are prerendered from the slugs the listing can reach; `dynamicParams`
renders anything outside that set on first request. `lib/slug.ts` skips the handful of
CMS slugs a filesystem path cannot hold, and logs which.

---

## Verification

```
npm run verify        # typecheck -> lint -> build
```

| Check | Result |
| ----- | ------ |
| `tsc --noEmit` (strict) | clean |
| `eslint .` | clean, 0 warnings |
| `prettier --check` | clean |
| `next build` | 5/5 routes prerendered static |
| **Section geometry vs the real legacy site** | **22/22 boxes exact (11 sections × 2 viewports)** |
| 325 distinct image requests | all 200 |
| Font chain (`html` → `--font-space-grotesk` → self-hosted woff2) | ✅ |
| 14 legacy card date strings | reproduce byte-for-byte |

### Style-parity tooling

Once the custom CSS was gone, a class-name diff could no longer detect drift - the
class names *were* the thing being replaced. So there are two tools in
[tools/](tools/):

**`style-snapshot.mjs`** - walks the DOM in a headless Chromium at four viewports
(1440 / 1100 / 820 / 390), recording ~130 computed properties per element
*including* `::before` and `::after`, keyed by **DOM tree position** rather than by
class. A class-only refactor keeps the same keys, so any changed property surfaces.

```bash
node tools/style-snapshot.mjs capture http://localhost:3000/ .style-baseline/before.json
node tools/style-snapshot.mjs diff .style-baseline/before.json .style-baseline/after.json
```

It was validated before being trusted: **0 false positives** across 924 elements ×
4 viewports, and it does catch a deliberately injected 5px/colour change. Getting
there required freezing all animations at frame 0, and excluding properties an
animation *produces* (its declaration is still compared).

**`style-triage.mjs`** - groups the diff by property and value-pair, because a
conversion this size fails in patterns, not one-offs. One wrong token repeated
across forty components shows up as a single high-count row. This is what took the
diff from 6,937 → 788.

**`visual-compare.mjs`** - the check that actually settled things. Serves the
untouched `clovity-website-updated/` HTML on a local port, screenshots every
section from both it and the migrated app, and reports box deltas.

**`serve-legacy.mjs`** - a dependency-free static server for the legacy site, on
port 4590. Needed because the legacy HTML links its CSS with an absolute path
(`/assets/css/theme.css`), which resolves to the filesystem root over `file://` and
silently 404s. Loading the original without it produces a page that *looks* rendered
but has no `theme.css` applied - an easy way to draw the wrong conclusion.

**`verify-icons.mjs`** - audits every rendered icon on a page: leftover `<i>`
elements, icons with a zero box, the smallest rendered sizes, and the header panel
chips. The size report exists because a brand glyph once rendered at 1×1 pixel while
passing a naive non-zero-box check; anything reported under ~6px is suspect.

```bash
node tools/verify-icons.mjs http://localhost:3000
```

```bash
node tools/visual-compare.mjs http://localhost:3000/ .visual
```

Comparing against the **real original** rather than an intermediate build is what
caught the CDN-ordering mistake described below.

### Bugs this conversion surfaced

Seven real defects. Five were pre-existing and invisible until the custom CSS was
removed; the last one is mine, introduced by the icon conversion and caught by
measuring rendered icon boxes rather than trusting a screenshot:

| Bug | Cause | Impact |
| --- | ----- | ------ |
| `src/lib/` missing from Tailwind `content` | Per-directory glob list omitted `lib`, `hooks`, `utils` | **Every** class built in `lib/reveal.ts` generated no CSS. Scroll-reveal was inert. Tailwind cannot warn about this. |
| Font Awesome overriding utilities | FA loaded after Tailwind; `.fa-solid` ties with `flex` on specificity | Icon chips fell back to `inline-block`, collapsing their boxes |
| `transition-[opacity,transform]` | Arbitrary multi-property value emitted nothing | `transition-property` silently fell back to `all` |
| `btn-white` lost its 2px border | The home page's `.btn-white` never reset the shared rule's border, so it applied | CTA button 4px shorter and narrower |
| Stat grid mobile dividers | Four overlapping `nth-child` rules across two media queries were not ported | Results section 12px too tall at ≤480px |
| Nested unnamed Tailwind `group`s in the header | `group-hover:` compiles to `.group:hover &`, matching **any** hovered ancestor with the class. The nav-item wrapper and each mega item both used bare `group` | Hovering a nav trigger put every chip and arrow in the open panel into its hover state at once. Fixed with named `group/nav` and `group/mega` |
| Brand marks rendered 1×1 pixel | Mine, introduced during the Lucide conversion: `brands.tsx` derived `width` from `height` in JS, and `Icon` defaults `size` to `1em` - `parseFloat('1em')` is `1` | Every brand glyph was a one-pixel dot, while still passing a naive "non-zero box" check. Fixed by normalising the marks onto a 24×24 viewBox so `size` can be any CSS length |

And one mistake I made and then caught: I assumed the legacy stylesheet would beat
the utilities in its own markup and changed two section backgrounds to white.
Screenshotting the real original showed they are `#eaf8ff` - the **Tailwind Play
CDN injects its `<style>` after the page's inline `<style>`**, so the utility wins
there. Reverted. Worth knowing for the remaining 19 pages: in the legacy site,
a Tailwind class in the markup beats the hand-written CSS.

---

## Remaining work

**Asset gap:** the legacy site has no favicon or app icon, and the only brand
marks available are two animated GIFs. `layout.tsx` and `manifest.ts` are
deliberately left without icon references (pointing at non-existent files would
put 404s in every page head). Drop `favicon.ico`, `apple-touch-icon.png`,
`icon-192.png`, `icon-512.png` into `public/` and wire them up - both files carry
a `TO COMPLETE` comment. Same for `/assets/og/clovity-og.png`, the OG card image.

**19 pages remaining**, in suggested order - interior pages share a header/footer
treatment, so `about-us` first establishes the pattern the rest reuse:

| Batch | Pages |
| ----- | ----- |
| Interior shell | `about-us`, `contact`, `careers` |
| Expertise (8) | `atlassian`, `ai`, `itsm`, `devsecops`, `cloud-migration`, `managed-services`, `workforce`, `marketplace-apps` |
| Resource indexes | `blog`, `case-study`, `events`, `webinars`, `news` |
| Detail templates | `blog-detail`, `news-detail`, `webinar-detail` |

Per page, the process that worked here: read the source HTML → port its
page-scoped `<style>` into `styles/pages/<page>.css` → extract copy into
`constants/` → compose from `components/ui` + `components/sections` → add
`buildMetadata()` + JSON-LD → run the class-token diff against the original.

Reusable pieces already built and waiting: the full `ui/` kit,
`components/sections/` (empty, for shared interior sections),
`Breadcrumb`, `Pagination`, `EmptyState`, `Modal`, `Drawer`, `Accordion`,
`Tabs`, `Tooltip`, and the `contactSlice` + validation schemas for the contact
and careers forms.

---

## Conventions

- **Never edit `styles/theme.css`.** It is the verbatim pixel contract. Put
  additions in `styles/migration.css`.
- Import UI from the barrel: `@/components/ui`.
- All links go through `SmartLink`; all images through `AppImage` / `CoverImage`.
  ESLint enforces this (`no-html-link-for-pages`, `no-img-element` as errors).
- Pass `sizes` only to **fluid** images. Fixed-size images must omit it - see the
  note in `components/ui/Image`.
- Routes come from `config/ROUTES`, never inline strings.
- Server Component by default; add `'use client'` only for state, effects,
  refs or browser APIs.
- Content is data in `constants/`, typed to match the future API.
