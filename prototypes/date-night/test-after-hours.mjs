import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : 'playwright');
const url = process.env.PLAYTEST_URL || 'http://127.0.0.1:5180/';
const artifacts = path.resolve('test-artifacts/date-night/after-hours');
await fs.mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.setDefaultTimeout(12000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));

async function capture(name) {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${name}: no horizontal overflow at ${width}px`);
    await page.screenshot({ path: path.join(artifacts, `${name}-${width}.png`), fullPage: true });
  }
  await page.setViewportSize({ width: 390, height: 844 });
}

try {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(url);
  assert.equal(await page.locator('.catalog-card').count(), 4);
  assert.equal(await page.evaluate(() => document.querySelector('.catalog-card:last-child').getBoundingClientRect().bottom < innerHeight), true, 'All four game choices fit on a small iPhone screen');
  await page.evaluate(() => document.getElementById('root').scrollTo({ top: 9999 }));
  assert.equal(await page.evaluate(() => document.getElementById('root').scrollTop > 0 && document.querySelector('.board-feature').getBoundingClientRect().bottom < innerHeight), true, 'The home screen scrolls to Flight Chess inside the app');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url);
  await page.getByRole('button', { name: 'Play The Slow Burn' }).click();
  await page.getByLabel('Player 1', { exact: true }).fill('Alex');
  await page.getByLabel('Player 2', { exact: true }).fill('Sam');
  assert.equal(await page.getByRole('radio', { name: /Flirty/ }).isChecked(), true);
  await page.getByRole('button', { name: 'Find our spark' }).click();
  await page.getByRole('button', { name: 'I’m Alex' }).click();
  for (const [move, vote] of [['words', 'Yes, tonight'], ['gaze', 'Maybe, ask me'], ['closer', 'Pass for now']]) {
    assert.equal(await page.locator('[data-move-id]').getAttribute('data-move-id'), move);
    await page.getByRole('button', { name: vote }).click();
  }
  await page.getByLabel('Your private detail').fill('the way you laughed at dinner');
  await page.getByRole('button', { name: 'Hide & pass to Sam' }).click();
  assert.equal(await page.locator('[data-move-id]').count(), 0, 'Private card is hidden on handoff');
  await page.getByRole('button', { name: 'I’m Sam' }).click();
  for (const vote of ['Yes, tonight', 'Pass for now', 'Yes, tonight']) await page.getByRole('button', { name: vote }).click();
  await page.getByLabel('Your private detail').fill('your very bad joke');
  await page.getByRole('button', { name: 'Hide & reveal our sparks' }).click();
  assert.deepEqual(await page.locator('[data-match-move]').evaluateAll(nodes => nodes.map(node => node.dataset.matchMove)), ['words'], 'Only mutually open move is revealed');
  await capture('mutual-reveal');
  await page.locator('[data-match-move="words"]').click();
  assert.match(await page.locator('.after-hours-scene').innerText(), /date is ending/i);
  await page.getByRole('button', { name: 'We’re ready' }).click();
  assert.match(await page.locator('.after-hours-scene').innerText(), /play it cool/i);
  assert.match(await page.locator('.after-hours-scene').innerText(), /laughed at dinner/i);
  await capture('scene');
  await page.getByRole('button', { name: 'Your turn to respond' }).click();
  assert.match(await page.locator('.after-hours-scene').innerText(), /very bad joke/i);
  await page.getByRole('button', { name: 'Linger here' }).click();
  assert.match(await page.locator('h1').innerText(), /Stay with that feeling/);
  await page.getByRole('button', { name: 'Play a new scene' }).click();
  await page.getByRole('button', { name: 'I’m Alex' }).click();
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Pass for now' }).click();
  await page.getByRole('button', { name: 'I’m Sam' }).click();
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Pass for now' }).click();
  assert.equal(await page.locator('[data-match-move]').count(), 0, 'No private answer leaks when no cue matches');
  assert.match(await page.locator('h1').innerText(), /Tonight can stay\s+easy/);
  await page.getByRole('button', { name: 'Choose another game' }).click();
  await page.getByRole('button', { name: 'Play The Slow Burn' }).click();
  await page.getByLabel('Player 1', { exact: true }).fill('Alex');
  await page.getByLabel('Player 2', { exact: true }).fill('Sam');
  await page.getByRole('radio', { name: /Married/ }).check({ force: true });
  await page.getByRole('radio', { name: /Flirty/ }).check({ force: true });
  await page.getByRole('button', { name: 'Find our spark' }).click();
  for (const [owner, name] of [[0, 'Alex'], [1, 'Sam']]) {
    await page.getByRole('button', { name: `I’m ${name}` }).click();
    assert.equal(await page.locator('[data-move-id]').first().getAttribute('data-move-id'), 'slow-kiss', 'Married flirty has its own deck');
    assert.equal(await page.locator('.after-hours-choice [data-art-kind="bedroom-0"]').count(), 1, 'Bedroom illustration matches the first move');
    await page.getByRole('button', { name: 'Yes, tonight' }).click();
    for (let i = 1; i < 6; i++) await page.getByRole('button', { name: 'Pass for now' }).click();
    await page.getByRole('button', { name: owner === 0 ? 'Hide & pass to Sam' : 'Hide & reveal our sparks' }).click();
  }
  assert.deepEqual(await page.locator('[data-match-move]').evaluateAll(nodes => nodes.map(node => node.dataset.matchMove)), ['slow-kiss']);
  await page.locator('[data-match-move="slow-kiss"]').click();
  assert.match(await page.locator('.after-hours-scene').innerText(), /bedroom door is closed/i);
  await page.getByRole('button', { name: 'We’re ready' }).click();
  assert.match(await page.locator('.after-hours-scene').innerText(), /nowhere else to be/i);
  await page.getByRole('button', { name: 'Your turn to respond' }).click();
  assert.match(await page.locator('.after-hours-scene').innerText(), /Slow is exactly what I want/i);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ result: 'passed', checks: ['four visible games and touch scroller at 320px', 'private handoff', 'mutual-only reveal', 'married flirty bedroom deck', 'matching bedroom art', 'three-beat scene', 'replay', 'no-match privacy', '320–1440px overflow', 'no runtime errors'] }));
} finally {
  await browser.close();
}
