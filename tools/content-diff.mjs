/**
 * Content diff: legacy page vs migrated page.
 *
 * The legacy site is not under version control and every file carries the same
 * mtime, so "what changed in the original" cannot be answered from the filesystem.
 * This answers it from the rendered result instead: pull an ordered outline of
 * headings and visible text out of both pages and diff the sequences.
 *
 * Usage: node tools/content-diff.mjs <legacyUrl> <nextUrl>
 */
import { chromium } from 'playwright';

const [, , LEGACY = 'http://localhost:4590/', NEXT = 'http://localhost:3125/'] =
  process.argv;

const EXTRACT = () => {
  const clean = (s) => s.replace(/\s+/g, ' ').trim();
  const out = [];
  const walk = (root) => {
    for (const el of root.querySelectorAll(
      'h1,h2,h3,h4,h5,h6,p,li,button,a,span,b,small,strong,td,th',
    )) {
      // Only leaf-ish nodes, so a wrapper does not repeat its children's text.
      const ownText = clean(
        [...el.childNodes]
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent)
          .join(' '),
      );
      if (!ownText || ownText.length < 2) continue;
      out.push(`${el.tagName.toLowerCase()}: ${ownText}`);
    }
  };
  walk(document.body);
  return out;
};

async function outline(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  // Reveal everything so nothing is missed for being off-screen.
  await page.evaluate(() => {
    document
      .querySelectorAll('[data-reveal], .transition-reveal, .sr, .sr-l, .sr-r')
      .forEach((el) => {
        el.dataset.shown = 'true';
        el.classList.add('in');
      });
  });
  await page.waitForTimeout(1200);
  const rows = await page.evaluate(EXTRACT);
  await page.close();
  return rows;
}

const browser = await chromium.launch();
const [legacy, next] = await Promise.all([
  outline(browser, LEGACY),
  outline(browser, NEXT),
]);
await browser.close();

const legacySet = new Map();
for (const r of legacy) legacySet.set(r, (legacySet.get(r) ?? 0) + 1);
const nextSet = new Map();
for (const r of next) nextSet.set(r, (nextSet.get(r) ?? 0) + 1);

const onlyLegacy = [];
for (const [k, n] of legacySet) {
  const have = nextSet.get(k) ?? 0;
  for (let i = 0; i < n - have; i++) onlyLegacy.push(k);
}
const onlyNext = [];
for (const [k, n] of nextSet) {
  const have = legacySet.get(k) ?? 0;
  for (let i = 0; i < n - have; i++) onlyNext.push(k);
}

console.log(`legacy blocks: ${legacy.length}   next blocks: ${next.length}\n`);
console.log(`=== IN LEGACY, MISSING FROM NEXT (${onlyLegacy.length}) ===`);
for (const r of onlyLegacy) console.log('  - ' + r);
console.log(`\n=== IN NEXT, NOT IN LEGACY (${onlyNext.length}) ===`);
for (const r of onlyNext) console.log('  + ' + r);
