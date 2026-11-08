import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.MINIGAMES_URL || 'http://127.0.0.1:5180/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const modes = ['after-hours', 'heart-dice', 'sketch-date', 'date-mystery'];

async function handoff(page) {
  if (await page.locator('.handoff .button').count()) await page.locator('.handoff .button').click();
}
async function noOverflow(page, label) {
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${label} overflows`);
}
async function start(page, locale, mode) {
  await page.goto(`${base}?lang=${locale}`, { waitUntil: 'domcontentloaded' });
  await page.locator(`.catalog-card-${mode}`).click();
  await page.locator('.setup-form button[type="submit"]').click();
  await handoff(page);
  await noOverflow(page, `${locale} ${mode} first card`);
}
async function playSlowBurn(page) {
  for (const owner of [0, 1]) {
    for (let i = 0; i < 3; i++) {
      await page.locator('.after-hours-votes .button-primary').click();
    }
    await handoff(page);
    await page.locator('.private-screen .button-primary').click();
    if (owner === 0) await handoff(page);
  }
  await page.locator('.after-hours-match-list button').first().click();
  for (let i = 0; i < 2; i++) await page.locator('.after-hours-screen .button-primary').click();
  await page.locator('.after-hours-finish .button-primary').click();
  await page.locator('.ending').waitFor();
}
async function playDice(page) {
  for (const owner of [0, 1]) {
    await page.locator('.body-picks button').nth(0).click();
    await page.locator('.body-picks button').nth(1).click();
    await page.locator('.private-screen .button-primary').click();
    if (owner === 0) await handoff(page);
  }
  for (let i = 0; i < 4; i++) {
    await page.locator('.heart-dice-screen .button-primary').click();
    await page.locator('.chemistry-result').waitFor();
    await page.locator('.heart-dice-screen .button-primary').last().click();
  }
  await page.locator('.dice-favorites > button').first().click();
  await page.locator('.ending').waitFor();
}
async function playSketch(page) {
  for (let i = 0; i < 3; i++) {
    const answer = await page.locator('.sketch-secret strong').innerText();
    await page.locator('.private-screen .button-primary').click();
    await page.locator('.sketch-screen .button-primary').click();
    await handoff(page);
    await page.locator('.option-list button').filter({ hasText: answer }).click();
    await page.locator('.sketch-screen .button-primary').click();
    if (i < 2) await handoff(page);
  }
  await page.locator('.sketch-gallery button').first().click();
  await page.locator('.ending').waitFor();
}
async function playMystery(page) {
  const answers = [1, 0, 1];
  for (let i = 0; i < 3; i++) {
    await page.locator('.private-screen .button-primary').click();
    await handoff(page);
    await page.locator('.private-screen .button-primary').click();
    await page.locator('.option-list button').nth((answers[i] + 1) % 3).click();
    await page.locator('.mystery-hint').waitFor();
    await page.locator('.option-list button').nth(answers[i]).click();
    await page.locator('.mini-game .button-primary').click();
    if (i < 2) await handoff(page);
  }
  await page.locator('.ending').waitFor();
}

try {
  for (const locale of ['en', 'zh', 'es']) {
    for (const mode of modes) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      page.setDefaultTimeout(20000);
      const missing = [];
      const errors = [];
      page.on('console', message => { if (message.text().includes('Missing') && message.text().includes('mini-game translation')) missing.push(message.text()); });
      page.on('pageerror', error => errors.push(error.message));
      await start(page, locale, mode);
      if (mode === 'after-hours') await playSlowBurn(page);
      if (mode === 'heart-dice') await playDice(page);
      if (mode === 'sketch-date') await playSketch(page);
      if (mode === 'date-mystery') await playMystery(page);
      await noOverflow(page, `${locale} ${mode} ending`);
      assert.deepEqual([...new Set(missing)], [], `${locale} ${mode} has untranslated lines`);
      assert.deepEqual(errors, [], `${locale} ${mode} has page errors`);
      console.log(`${locale} ${mode}: full round passed`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
