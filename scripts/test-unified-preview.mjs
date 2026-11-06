import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.UNIFIED_PREVIEW_URL || 'http://127.0.0.1:5181/';
const gamesUrl = new URL('/games/', baseUrl).toString();
const modes = [
  ['The Slow Burn', 'Find our spark'],
  ['Secret Mission', 'Deal our missions'],
  ['Double Yes', 'Find our shared yeses'],
  ['First Date, Again', 'Meet your characters'],
  ['Heart Dice', 'Roll our first cards'],
  ['Read My Mind', 'Start guessing'],
  ['Wish Auction', 'Open the auction'],
  ['Date Night Mystery', 'Open the first clue']
];

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.setDefaultTimeout(20000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));

try {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await page.getByRole('button', { name: /Date Night Games/ }).click();
  await page.waitForURL(gamesUrl);
  assert.equal(await page.getByRole('button', { name: /^Play / }).count(), 8);
  assert.equal(await page.getByRole('link', { name: 'Play Flight Chess' }).count(), 1);
  await page.getByRole('link', { name: 'Back to Flight Chess' }).click();
  await page.waitForURL(baseUrl);
  console.log('Board ↔ games navigation passed');

  for (const [title, startLabel] of modes) {
    await page.goto(gamesUrl, { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: `Play ${title}`, exact: true }).click();
    await page.getByRole('heading', { name: title, exact: true }).waitFor();
    await page.getByLabel('Player 1', { exact: true }).fill('Alex');
    await page.getByLabel('Player 2', { exact: true }).fill('Sam');
    await page.getByRole('button', { name: startLabel, exact: true }).click();
    await page.locator('.setup-form').waitFor({ state: 'detached' });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${title} has no horizontal overflow`);
    console.log(`${title} opens and starts`);
  }

  assert.deepEqual(errors, [], 'No page errors in integrated flows');
} finally {
  await browser.close();
}
