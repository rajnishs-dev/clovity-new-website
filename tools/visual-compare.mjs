/**
 * Side-by-side visual comparison against the original static site.
 *
 * The computed-style diff proves properties match; this proves the page *looks*
 * right, which is the requirement the property diff can only approximate. It
 * serves the untouched legacy HTML from `clovity-website-updated/` and the
 * migrated app, then writes matching screenshots for each section so they can be
 * looked at directly.
 *
 *   node tools/visual-compare.mjs <migratedUrl> <outDir>
 */

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const LEGACY_ROOT = resolve('../clovity-website-updated');
const LEGACY_PORT = 4310;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.ico': 'image/x-icon',
};

/** Minimal static server - no dependency, and enough for a local snapshot. */
function serveLegacy() {
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
      let filePath = join(LEGACY_ROOT, normalize(urlPath));
      // Refuse anything that escapes the served root.
      if (!filePath.startsWith(LEGACY_ROOT)) {
        res.writeHead(403).end('forbidden');
        return;
      }
      if (existsSync(filePath) && statSync(filePath).isDirectory()) {
        filePath = join(filePath, 'index.html');
      }
      if (!existsSync(filePath)) {
        res.writeHead(404).end('not found');
        return;
      }
      const body = await readFile(filePath);
      res.writeHead(200, {
        'Content-Type':
          MIME[extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      });
      res.end(body);
    } catch (error) {
      res.writeHead(500).end(String(error));
    }
  });
  return new Promise((done) => server.listen(LEGACY_PORT, () => done(server)));
}

/** Sections to shoot, keyed by the id both versions share. */
const SECTIONS = [
  'hero',
  'pulse-ai-spotlight',
  'public-sector',
  'ai-delivery',
  'forward-deployed-engineers',
  'cloud-migration',
  'marketplace',
  'results',
  'highlights',
  'recognition',
  'final-cta',
];

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

async function shoot(page, url, label, outDir, vp) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90_000 });
  await page.evaluate(() => document.fonts.ready);
  /**
   * Walk the page so lazy images load and every scroll-reveal fires.
   *
   * The step size and dwell time matter: viewport-sized jumps outran the
   * IntersectionObserver, so elements were scrolled past before their callback
   * ran and stayed at opacity 0 - which looked exactly like a broken conversion.
   * 400px steps with a 120ms dwell give the observer time on every element.
   */
  await page.evaluate(async () => {
    const step = 400;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);

  // Fail loudly if any reveal is still hidden - a blank section in a screenshot
  // is otherwise indistinguishable from a genuine styling regression.
  const hidden = await page.evaluate(
    () =>
      [...document.querySelectorAll('[data-reveal]')].filter(
        (el) => el.dataset.shown !== 'true',
      ).length,
  );
  if (hidden > 0) {
    console.warn(
      `  WARNING (${label}): ${hidden} reveal element(s) still hidden`,
    );
  }
  // Freeze animations so both sides sample the same frame.
  await page.evaluate(() => {
    for (const a of document.getAnimations()) {
      a.currentTime = 0;
      a.pause();
    }
  });

  const results = [];
  for (const id of SECTIONS) {
    const el = await page.$(`#${id}`);
    if (!el) {
      results.push({ id, status: 'MISSING' });
      continue;
    }
    const box = await el.boundingBox();
    await el.screenshot({
      path: join(outDir, `${vp.name}-${id}-${label}.png`),
      timeout: 20_000,
    });
    results.push({
      id,
      status: 'ok',
      width: box ? Math.round(box.width) : null,
      height: box ? Math.round(box.height) : null,
    });
  }
  return results;
}

const [migratedUrl, outDir = '.visual'] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });

const legacyServer = await serveLegacy();
const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const legacy = await shoot(
    page,
    `http://localhost:${LEGACY_PORT}/index.html`,
    'legacy',
    outDir,
    vp,
  );
  const migrated = await shoot(page, migratedUrl, 'migrated', outDir, vp);

  console.log(
    `\n════ ${vp.name} (${vp.width}px) - section box comparison ════`,
  );
  console.log(
    '  section                      legacy WxH        migrated WxH      Δheight',
  );
  for (const [index, l] of legacy.entries()) {
    const m = migrated[index];
    if (l.status !== 'ok' || m?.status !== 'ok') {
      console.log(`  ${l.id.padEnd(28)} ${l.status} / ${m?.status}`);
      continue;
    }
    const delta = (m.height ?? 0) - (l.height ?? 0);
    const flag = Math.abs(delta) > 4 ? '  <-- CHECK' : '';
    console.log(
      `  ${l.id.padEnd(28)} ${String(l.width).padStart(4)}x${String(l.height).padStart(5)}      ${String(m.width).padStart(4)}x${String(m.height).padStart(5)}     ${String(delta).padStart(5)}${flag}`,
    );
  }

  await context.close();
}

await browser.close();
legacyServer.close();
console.log(`\nScreenshots written to ${outDir}/`);
