import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : 'playwright');
const url = process.env.PLAYTEST_URL || 'http://127.0.0.1:5180/';
const artifacts = path.resolve('test-artifacts/date-night/illustrations');
await fs.mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.setDefaultTimeout(8000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const modes = [
  ['first-date', 'Play First Date, Again', 'Meet your characters', 'I’m Alex'],
  ['mission', 'Play Secret Mission', 'Deal our missions', 'I’m Alex'],
  ['double-yes', 'Play Double Yes', 'Find our shared yeses', 'I’m Alex'],
  ['heart-dice', 'Play Heart Dice', 'Roll our first cards', 'Roll the cards'],
  ['read-my-mind', 'Play Read My Mind', 'Start guessing', 'I’m Alex'],
  ['wish-auction', 'Play Wish Auction', 'Open the auction', 'I’m Alex'],
  ['date-mystery', 'Play Date Night Mystery', 'Open the first clue', 'I’m Alex'],
  ['after-hours', 'Play The Slow Burn', 'Find our spark', 'I’m Alex'],
];
const report = [];
try {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: width < 400 ? 844 : 900 });
    await page.goto(url);
    assert.equal(await page.locator('.home-game-art svg').count(), 5);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: path.join(artifacts, `home-${width}.png`), fullPage: true });
  }
  for (const [mode, entry, start, reveal] of modes) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);
    await page.getByRole('button', { name: entry, exact: true }).click();
    await page.getByLabel('Player 1', { exact: true }).fill('Alex');
    await page.getByLabel('Player 2', { exact: true }).fill('Sam');
    await page.getByRole('button', { name: start, exact: true }).click();
    await page.getByRole('button', { name: reveal, exact: true }).click();
    const art = page.locator('.paper-card .prompt-art').first();
    const kind = await art.count() ? await art.getAttribute('data-art-kind') : null;
    assert.notEqual(kind, 'undefined', `${mode} never renders an unmapped illustration`);
    if (kind) assert.equal(await art.locator('svg').isVisible(), true);
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: width < 400 ? 844 : 900 });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${mode} at ${width}px`);
      await page.screenshot({ path: path.join(artifacts, `${mode}-${width}.png`), fullPage: true });
    }
    if (mode === 'first-date') {
      await page.getByRole('button', { name: 'Hide & pass to Sam', exact: true }).click();
      await page.getByRole('button', { name: 'I’m Sam', exact: true }).click();
      await page.getByRole('button', { name: 'Hide card & start the scene', exact: true }).click();
      assert.equal(await page.locator('.scene-prompt-art svg').isVisible(), true);
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: width < 400 ? 844 : 900 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        await page.screenshot({ path: path.join(artifacts, `first-date-scene-${width}.png`), fullPage: true });
      }
    }
    report.push({ mode, art: kind, widths: [320, 390, 768, 1440] });
  }
  assert.deepEqual(errors, [], 'No runtime errors');
  await fs.writeFile(path.join(artifacts, 'report.json'), JSON.stringify({ report, errors }, null, 2));
  console.log(JSON.stringify({ report, errors }, null, 2));
} finally { await browser.close(); }
