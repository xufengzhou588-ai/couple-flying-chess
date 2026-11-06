import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : 'playwright');
const url = process.env.PLAYTEST_URL || 'http://127.0.0.1:5180/';
const artifactDir = path.resolve('test-artifacts/date-night');
await fs.mkdir(artifactDir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.setDefaultTimeout(8000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const report = [];
const click = name => page.getByRole('button', { name, exact: true }).click();
const noOverflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'No horizontal overflow');
const stageLabels = { new: 'Just started dating', together: 'Together a while', married: 'Married' };
const startLabels = { mission: 'Deal our missions', 'double-yes': 'Find our shared yeses', 'heart-dice': 'Roll our first cards', 'read-my-mind': 'Start guessing', 'wish-auction': 'Open the auction', 'date-mystery': 'Open the first clue' };
const gameLabels = { mission: 'Secret Mission', 'double-yes': 'Double Yes', 'heart-dice': 'Heart Dice', 'read-my-mind': 'Read My Mind', 'wish-auction': 'Wish Auction', 'date-mystery': 'Date Night Mystery' };
async function start(mode, stage) {
  await page.goto(url);
  await click(`Play ${gameLabels[mode]}`);
  await page.getByLabel('Player 1', { exact: true }).fill('Alex');
  await page.getByLabel('Player 2', { exact: true }).fill('Sam');
  await page.getByRole('radio', { name: new RegExp(stageLabels[stage]) }).check();
  await page.getByRole('radio', { name: /Flirty/ }).check();
  await click(startLabels[mode]);
}
async function reveal(name) { await click(`I’m ${name}`); }
async function firstOption() { await page.locator('.option-list .button').first().click(); }

try {
  for (const stage of ['new', 'together', 'married']) {
    await start('heart-dice', stage);
    for (let i = 0; i < 4; i++) {
      await click('Roll the cards');
      assert.ok((await page.locator('.mini-paper > p').innerText()).length > 10);
      if (i === 0) {
        const old = await page.locator('.twist-card strong').innerText();
        await click('Reroll twist');
        assert.notEqual(await page.locator('.twist-card strong').innerText(), old);
        assert.equal(await page.getByRole('button', { name: 'Reroll twist' }).isDisabled(), true);
      }
      await noOverflow();
      if (i === 0 && stage === 'new') await page.screenshot({ path: path.join(artifactDir, 'heart-dice.png'), fullPage: true });
      await click(i === 3 ? 'Finish our round' : 'Next roll');
    }
    await page.getByRole('heading', { name: 'Keep the good part going.' }).waitFor();
    report.push(`Heart Dice ${stage}: 4 rolls, reroll, ending`);

    await start('read-my-mind', stage);
    for (let i = 0; i < 4; i++) {
      await reveal(i % 2 === 0 ? 'Alex' : 'Sam');
      await firstOption();
      assert.equal(await page.locator('.answer-reveal').count(), 0, 'Answer is hidden during handoff');
      await reveal(i % 2 === 0 ? 'Sam' : 'Alex');
      await page.locator('.option-list .button').nth(i % 2).click();
      await page.locator('.answer-reveal').waitFor();
      await noOverflow();
      if (i === 0 && stage === 'together') await page.screenshot({ path: path.join(artifactDir, 'read-my-mind.png'), fullPage: true });
      await click(i === 3 ? 'See our ending' : 'Next question');
    }
    await page.getByRole('heading', { name: 'Still learning you.' }).waitFor();
    report.push(`Read My Mind ${stage}: private answers and guesses, 4 reveals`);

    await start('wish-auction', stage);
    for (let i = 0; i < 4; i++) {
      await reveal('Alex');
      await click(i === 0 ? 'Pass' : '1 token · Sounds good');
      await reveal('Sam');
      await click('1 token · Sounds good');
      if (i === 0) {
        await page.getByText('No tokens spent. Passing is a valid choice.').waitFor();
        await click('Next wish');
      } else {
        assert.equal(await page.locator('.answer-reveal').count(), 1);
        await noOverflow();
        if (i === 1 && stage === 'married') await page.screenshot({ path: path.join(artifactDir, 'wish-auction.png'), fullPage: true });
        await firstOption();
      }
    }
    await page.getByRole('heading', { name: 'The best bids were mutual.' }).waitFor();
    assert.equal(await page.locator('.wish-shortlist li').count(), 3);
    report.push(`Wish Auction ${stage}: pass without spend, 3 mutual bids, shortlist`);

    await start('date-mystery', stage);
    const answers = stage === 'new' ? [1, 0, 1] : [1, 1, 2];
    for (let i = 0; i < 3; i++) {
      await reveal('Alex');
      await page.locator('.mini-paper > p').waitFor();
      await click('Hide & pass to Sam');
      await reveal('Sam');
      await click('Hide & solve together');
      await page.locator('.option-list .button').nth((answers[i] + 1) % 3).click();
      await page.locator('.mystery-hint').waitFor();
      await page.locator('.option-list .button').nth(answers[i]).click();
      await page.getByText('THE STORY CONTINUES').waitFor();
      await noOverflow();
      if (i === 0 && stage === 'new') await page.screenshot({ path: path.join(artifactDir, 'date-mystery.png'), fullPage: true });
      await click(i === 2 ? 'Finish our mystery' : 'Open the next clue');
    }
    await page.getByRole('heading', { name: 'You found your way.' }).waitFor();
    report.push(`Date Night Mystery ${stage}: clue handoffs, wrong-answer hint, 3 solutions`);

    await start('mission', stage);
    await reveal('Alex');
    const task = await page.locator('.mission-task').innerText();
    assert.match(task, stage === 'new' ? /interest|next-date/ : stage === 'together' ? /early date|inside joke|as if you had not seen/ : /ordinary thing|familiar evening/);
    report.push(`Secret Mission ${stage}: relationship-specific assignment dealt`);

    await start('double-yes', stage);
    await reveal('Alex');
    const expectedPrefix = { new: 'new-', together: 'together-', married: 'married-' }[stage];
    const cardIds = [];
    for (let i = 0; i < 8; i++) {
      cardIds.push(await page.locator('[data-idea-id]').getAttribute('data-idea-id'));
      await click('Not tonight');
    }
    assert.equal(cardIds.filter(id => id.startsWith(expectedPrefix)).length, 2, 'Two tailored ideas in Flirty deck');
    report.push(`Double Yes ${stage}: 2 tailored cards in an 8-card deck`);
  }
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(url);
  await noOverflow();
  await click('Play Date Night Mystery');
  await noOverflow();
  assert.deepEqual(errors, []);
  await fs.writeFile(path.join(artifactDir, 'more-games-report.json'), JSON.stringify({ flows: report, errors }, null, 2));
  console.log(JSON.stringify({ flows: report, errors }, null, 2));
} finally { await browser.close(); }
