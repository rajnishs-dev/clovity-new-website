/**
 * Computed-style snapshotter and differ.
 *
 * WHY THIS EXISTS
 * The custom stylesheets (theme.css / home.css / migration.css) were the pixel
 * contract for this migration. Converting them into Tailwind utilities removes
 * that contract, and a class-name diff can no longer detect drift - the class
 * names are the thing being replaced.
 *
 * So instead we compare what the browser actually computes. Every element is
 * keyed by its position in the DOM tree (`body:0>div:1>section:2>…`), not by its
 * classes, so a class-only refactor keeps the same keys. Any property whose
 * computed value changes shows up as a diff.
 *
 * Pseudo-elements are captured too: a large share of this design lives in
 * ::before / ::after (gradient underlines, dot grids, hover floods, the mega-menu
 * arrow), and those would otherwise be a blind spot.
 *
 * USAGE
 *   node tools/style-snapshot.mjs capture <url> <out.json>
 *   node tools/style-snapshot.mjs diff <before.json> <after.json>
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

/** Viewports chosen to straddle every breakpoint the legacy CSS used. */
const VIEWPORTS = [
  { name: 'desktop-1440', width: 1440, height: 1000 },
  { name: 'laptop-1100', width: 1100, height: 900 },
  { name: 'tablet-820', width: 820, height: 900 },
  { name: 'mobile-390', width: 390, height: 844 },
];

/**
 * Properties that can move a pixel. Deliberately excludes values that
 * legitimately differ between runs (image content-box sizes mid-load) and
 * anything GSAP writes as an inline style.
 */
const TRACKED = [
  'display',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'float',
  'clear',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderTopStyle',
  'borderRightStyle',
  'borderBottomStyle',
  'borderLeftStyle',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'backgroundColor',
  'backgroundImage',
  'backgroundSize',
  'backgroundPosition',
  'backgroundRepeat',
  'backgroundClip',
  'backgroundAttachment',
  'color',
  'opacity',
  'visibility',
  'mixBlendMode',
  'isolation',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'lineHeight',
  'letterSpacing',
  'textAlign',
  'textTransform',
  'textDecorationLine',
  'textShadow',
  'whiteSpace',
  'wordBreak',
  'overflowWrap',
  'textOverflow',
  'boxShadow',
  'transform',
  'transformOrigin',
  'filter',
  'backdropFilter',
  'maskImage',
  'clipPath',
  'flexDirection',
  'flexWrap',
  'flexGrow',
  'flexShrink',
  'flexBasis',
  'alignItems',
  'alignSelf',
  'justifyContent',
  'order',
  'rowGap',
  'columnGap',
  'gridTemplateColumns',
  'gridTemplateRows',
  'gridColumnStart',
  'gridColumnEnd',
  'gridRowStart',
  'gridRowEnd',
  'gridAutoRows',
  'overflowX',
  'overflowY',
  'zIndex',
  'objectFit',
  'objectPosition',
  'aspectRatio',
  'boxSizing',
  'cursor',
  'pointerEvents',
  'listStyleType',
  'transitionProperty',
  'transitionDuration',
  'transitionTimingFunction',
  'transitionDelay',
  'animationName',
  'animationDuration',
  'animationTimingFunction',
  'animationDelay',
  'animationIterationCount',
  'animationFillMode',
  'animationPlayState',
  'scrollBehavior',
  'scrollMarginTop',
  'scrollSnapAlign',
  'scrollSnapType',
  'content',
  'strokeWidth',
  'stroke',
  'fill',
  'strokeDasharray',
  'strokeDashoffset',
  'webkitLineClamp',
  'webkitBoxOrient',
  'webkitTextFillColor',
];

/** Runs inside the page. Walks the DOM and records styles keyed by tree path. */
function collect(tracked) {
  /** Stable key: tag + index among same-tag siblings, joined by '>'. */
  function pathOf(el) {
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && node !== document.documentElement) {
      const parent = node.parentElement;
      let index = 0;
      if (parent) {
        for (const sibling of parent.children) {
          if (sibling === node) break;
          if (sibling.tagName === node.tagName) index += 1;
        }
      }
      parts.unshift(`${node.tagName.toLowerCase()}:${index}`);
      node = parent;
    }
    return parts.join('>');
  }

  function read(el, pseudo) {
    const cs = getComputedStyle(el, pseudo || undefined);
    // Skip pseudo-elements that are never generated.
    if (pseudo) {
      const content = cs.content;
      if (!content || content === 'none' || content === 'normal') return null;
    }
    const out = {};
    for (const prop of tracked) {
      const value = cs[prop];
      if (value !== undefined && value !== null && value !== '') {
        out[prop] = String(value);
      }
    }
    return out;
  }

  const result = {};
  for (const el of document.querySelectorAll('body, body *')) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'script' || tag === 'template' || tag === 'noscript') continue;

    const key = pathOf(el);
    const entry = {
      tag,
      classes:
        el.className && typeof el.className === 'string' ? el.className : '',
      base: read(el, null),
    };
    const before = read(el, '::before');
    if (before) entry.before = before;
    const after = read(el, '::after');
    if (after) entry.after = after;
    result[key] = entry;
  }
  return result;
}

async function capture(url, outPath) {
  const browser = await chromium.launch();
  const snapshot = { url, viewports: {} };

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
      // Freeze motion so animated inline transforms cannot pollute the snapshot.
      reducedMotion: 'reduce',
    });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90_000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(700);

    /**
     * Freeze every running animation at frame 0.
     *
     * `reducedMotion: 'reduce'` only stops animations the CSS itself guards
     * behind the media query - the marquee and the Pulse sphere are not guarded,
     * so their `transform` advanced between runs and produced false positives.
     * Rewinding and pausing makes the sampled frame deterministic while leaving
     * the declared animation-name / duration / timing-function intact, which is
     * what we actually want to compare.
     */
    await page.evaluate(() => {
      for (const animation of document.getAnimations()) {
        animation.currentTime = 0;
        animation.pause();
      }
    });
    await page.waitForTimeout(120);

    snapshot.viewports[vp.name] = await page.evaluate(collect, tracked());
    await page.close();
  }

  await browser.close();
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(snapshot), 'utf8');

  const counts = Object.entries(snapshot.viewports)
    .map(([k, v]) => `${k}: ${Object.keys(v).length} elements`)
    .join('\n  ');
  console.log(`Captured ${url}\n  ${counts}\n-> ${outPath}`);
}

function tracked() {
  return TRACKED;
}

/**
 * Properties whose value is *produced* by a running animation, so their
 * instantaneous value is a sampled frame rather than a style contract. The
 * animation's declaration (name, duration, timing function, iteration count,
 * fill mode) is still compared - that is the part that must not change.
 */
const ANIMATED_OUTPUT_PROPS = new Set([
  'transform',
  'opacity',
  'strokeDashoffset',
  'boxShadow',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
]);

function isAnimating(layer) {
  const name = layer.animationName;
  return Boolean(name) && name !== 'none';
}

/** Values that are equivalent but stringify differently run to run. */
/**
 * Tailwind's shadow utilities always emit
 *   --tw-ring-offset-shadow, --tw-ring-shadow, --tw-shadow
 * which computes to two fully transparent, zero-size shadows in front of the real
 * one. They paint nothing, so they are stripped before comparing - otherwise every
 * shadowed element reports a diff and a genuine shadow change is invisible.
 */
const INERT_SHADOW =
  /^rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)\s+0px\s+0px\s+0px\s+0px$/;

function stripInertShadows(value) {
  return (
    String(value)
      // Split on commas that are not inside parentheses (colours contain commas).
      .split(/,(?![^(]*\))/)
      .map((part) => part.trim())
      .filter((part) => part.length > 0 && !INERT_SHADOW.test(part))
      .join(', ')
  );
}

function normalize(prop, value) {
  if (prop === 'boxShadow') return stripInertShadows(value);
  let v = String(value).trim();
  v = v.replace(
    /rgba?\(\s*([^)]+?)\s*\)/g,
    (_, inner) =>
      `rgb(${inner
        .split(/[\s,/]+/)
        .filter(Boolean)
        .join(',')})`,
  );
  if (/^-?\d+\.\d+px$/.test(v)) {
    v = `${Math.round(Number.parseFloat(v) * 10) / 10}px`;
  }
  return v;
}

function diff(beforePath, afterPath) {
  const before = JSON.parse(readFileSync(beforePath, 'utf8'));
  const after = JSON.parse(readFileSync(afterPath, 'utf8'));

  let totalDiffs = 0;
  let totalMissing = 0;

  for (const vpName of Object.keys(before.viewports)) {
    const b = before.viewports[vpName];
    const a = after.viewports[vpName] ?? {};
    const findings = [];

    for (const [key, bEl] of Object.entries(b)) {
      const aEl = a[key];
      if (!aEl) {
        findings.push({
          key,
          kind: 'MISSING',
          tag: bEl.tag,
          classes: bEl.classes,
        });
        totalMissing += 1;
        continue;
      }
      for (const layer of ['base', 'before', 'after']) {
        const bLayer = bEl[layer];
        if (!bLayer) continue;
        const aLayer = aEl[layer];
        if (!aLayer) {
          findings.push({
            key,
            kind: `LOST-${layer}`,
            tag: bEl.tag,
            classes: bEl.classes,
          });
          totalDiffs += 1;
          continue;
        }
        const animating = isAnimating(bLayer) || isAnimating(aLayer);
        for (const [prop, bVal] of Object.entries(bLayer)) {
          const aVal = aLayer[prop];
          if (aVal === undefined) continue;
          if (animating && ANIMATED_OUTPUT_PROPS.has(prop)) continue;
          if (normalize(prop, bVal) !== normalize(prop, aVal)) {
            findings.push({
              key,
              kind: 'CHANGED',
              layer,
              prop,
              from: bVal,
              to: aVal,
              tag: bEl.tag,
              classes: bEl.classes,
            });
            totalDiffs += 1;
          }
        }
      }
    }

    console.log(`\n=== ${vpName} - ${findings.length} finding(s) ===`);
    for (const f of findings.slice(0, 150)) {
      if (f.kind === 'CHANGED') {
        console.log(
          `  ${f.layer}.${f.prop}\n    at   ${f.key}\n    cls  ${f.classes.slice(0, 110)}\n    was  ${f.from}\n    now  ${f.to}`,
        );
      } else {
        console.log(
          `  ${f.kind}  ${f.key}  <${f.tag} class="${f.classes.slice(0, 90)}">`,
        );
      }
    }
    if (findings.length > 150) console.log(`  … ${findings.length - 150} more`);
  }

  console.log(
    `\n──────── ${totalDiffs} property diff(s), ${totalMissing} missing element(s) ────────`,
  );
  process.exitCode = totalDiffs + totalMissing > 0 ? 1 : 0;
}

const [mode, ...args] = process.argv.slice(2);
if (mode === 'capture') {
  await capture(args[0], args[1]);
} else if (mode === 'diff') {
  diff(args[0], args[1]);
} else {
  console.error(
    'usage:\n  node tools/style-snapshot.mjs capture <url> <out.json>\n  node tools/style-snapshot.mjs diff <before.json> <after.json>',
  );
  process.exit(2);
}
