/**
 * Icon conversion check.
 *
 * Answers three questions the eye cannot answer reliably across ~100 icons:
 *   1. Is any `<i>` element left? (a missed Font Awesome call site)
 *   2. Does every rendered icon have a non-zero box? (an icon that is in the DOM
 *      but collapsed is exactly the bug that started this work)
 *   3. Do the header panels actually show their chips now?
 *
 * Usage: node tools/verify-icons.mjs [origin]
 */
import { chromium } from 'playwright';

const ORIGIN = process.argv[2] ?? 'http://localhost:3116';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(ORIGIN, { waitUntil: 'networkidle' });

/** Every SVG icon that is laid out, plus any leftover webfont <i>. */
const audit = async (label) =>
  page.evaluate((label) => {
    const laidOut = (el) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    };
    // `checkVisibility` is the only reliable test here: an SVG has no
    // `offsetParent`, so the usual `offsetParent !== null` trick reports every icon
    // as shown - including the ones inside a closed panel.
    const shown = (el) =>
      el.checkVisibility({
        contentVisibilityAuto: true,
        opacityProperty: true,
        visibilityProperty: true,
      });
    const all = [...document.querySelectorAll('svg')];
    const collapsed = all.filter((el) => shown(el) && !laidOut(el));
    return {
      label,
      leftoverIElements: document.querySelectorAll('i').length,
      visibleSvgIcons: all.filter(laidOut).length,
      collapsedButShown: collapsed.length,
      collapsedDetail: collapsed
        .slice(0, 5)
        .map((el) => el.getAttribute('class') ?? '(no class)'),
    };
  }, label);

/**
 * Every laid-out icon, smallest first.
 *
 * This exists because of a real bug: the brand glyphs derived `width` from `height`
 * in JS, `Icon` defaults `size` to `1em`, and `parseFloat('1em') === 1` - so every
 * brand mark rendered as a 1×1 dot while still passing a "does it have a non-zero
 * box" check. Anything under ~6px here is almost certainly that failure mode again.
 */
const smallest = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('svg')) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0 && r.width < 40) {
      out.push({
        box: `${r.width.toFixed(1)}x${r.height.toFixed(1)}`,
        min: Math.min(r.width, r.height),
        near: el.closest('[class]')?.getAttribute('class')?.slice(0, 40) ?? '',
      });
    }
  }
  return out.sort((a, b) => a.min - b.min).slice(0, 8);
});
console.log('SMALLEST RENDERED ICONS (watch for ~1px):');
for (const s of smallest) console.log(`  ${s.box}  ${s.near}`);

const rows = [await audit('closed header')];

// Open each header panel and measure its chips.
const triggers = await page.$$('header button[aria-haspopup="true"]');
for (let i = 0; i < triggers.length; i++) {
  const name = (await triggers[i].innerText()).trim();
  await triggers[i].hover();
  await page.waitForTimeout(450);

  const chips = await page.evaluate(() => {
    const panel = [...document.querySelectorAll('[id^="mega-panel-"]')].find(
      (p) => p.getBoundingClientRect().height > 0,
    );
    if (!panel) return null;
    const rows = [...panel.querySelectorAll('a')]
      .map((a) => {
        const chip = a.querySelector('span > svg');
        if (!chip) return null;
        const r = chip.getBoundingClientRect();
        const box = chip.parentElement.getBoundingClientRect();
        return {
          link: a.querySelector('div')?.innerText?.split('\n')[0]?.trim() ?? '?',
          glyph: `${r.width.toFixed(0)}x${r.height.toFixed(0)}`,
          chip: `${box.width.toFixed(0)}x${box.height.toFixed(0)}`,
        };
      })
      .filter(Boolean);
    return { panel: panel.id, chips: rows };
  });

  rows.push(await audit(`${name} open`));
  console.log(`\n--- ${name} ---`);
  if (!chips) console.log('  no visible panel');
  else for (const c of chips.chips) console.log(`  ${c.chip} chip / ${c.glyph} glyph  ${c.link}`);

  await page.mouse.move(700, 850);
  await page.waitForTimeout(350);
}

console.log('\nAUDIT');
for (const r of rows) console.log('  ' + JSON.stringify(r));

// Shoot the header with a panel open, for the eyeball check.
const expertise = (await page.$$('header button[aria-haspopup="true"]'))[0];
if (expertise) {
  await expertise.hover();
  await page.waitForTimeout(600);
}
await page.screenshot({
  path: 'tools/_icons-header.png',
  clip: { x: 0, y: 0, width: 1440, height: 620 },
});
await browser.close();
