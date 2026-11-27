import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.UNIFIED_PREVIEW_URL || 'http://127.0.0.1:5181/';
const gamesUrl = new URL('/games/index.html', baseUrl).toString();
const modes = [
  ['The Slow Burn', 'Find our spark'],
  ['Chemistry Dice', 'Choose our comfort'],
  ['Sketch Our Date', 'Start our sketches'],
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
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: width === 320 ? 640 : 844 });
    const layout = await page.evaluate(() => {
      const home = document.querySelector('.home-view');
      const games = document.querySelector('.home-games');
      const stats = document.querySelector('.home-stats');
      const tiles = [...document.querySelectorAll('.home-game-tile')];
      const rect = element => element.getBoundingClientRect();
      return {
        tileCount: tiles.length,
        gamesAboveStats: rect(games).bottom <= rect(stats).top,
        tilesInsideGames: tiles.every(tile => rect(tile).top >= rect(games).top && rect(tile).bottom <= rect(games).bottom),
        scrollable: home.scrollHeight > home.clientHeight,
        noHorizontalOverflow: home.scrollWidth <= home.clientWidth
      };
    });
    assert.equal(layout.tileCount, 4, `${width}px: four individual mini-game entries`);
    assert.equal(layout.gamesAboveStats && layout.tilesInsideGames, true, `${width}px: game shelf does not overlap other sections`);
    assert.equal(layout.scrollable && layout.noHorizontalOverflow, true, `${width}px: home scrolls vertically without horizontal clipping`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: /The Slow Burn/ }).click();
  await page.waitForURL(url => url.pathname === '/games/index.html' && url.searchParams.get('game') === 'after-hours');
  await page.getByRole('heading', { name: 'The Slow Burn', exact: true }).waitFor();
  await page.locator('.exit-link').getByText('All games').click();
  await page.getByRole('heading', { name: 'Choose our game' }).waitFor();
  await page.getByRole('link', { name: 'Back to Flight Chess' }).click();
  await page.waitForURL(baseUrl);
  await page.getByRole('button', { name: /See all/ }).click();
  await page.waitForURL(url => url.pathname === '/games/index.html' && url.searchParams.get('lang') === 'en');
  await page.getByRole('button', { name: 'Turn on date-night music' }).click();
  await page.getByRole('button', { name: 'Turn off date-night music' }).waitFor();
  await page.getByRole('button', { name: 'Turn off date-night music' }).click();
  for (const locale of ['en', 'zh', 'es']) {
    for (const gender of ['male', 'female']) {
      const response = await page.request.get(new URL(`/audio/voice/${locale}/${gender}/mini-start.mp3`, baseUrl).toString());
      assert.equal(response.status(), 200, `${locale} ${gender} mini voice is bundled`);
    }
  }
  assert.equal(await page.getByRole('button', { name: /^Play / }).count(), 4);
  assert.equal(await page.getByRole('link', { name: 'Play Flight Chess' }).count(), 0, 'The games catalog has no duplicate board tile that only opens its home');
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
