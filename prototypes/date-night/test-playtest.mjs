import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Use an existing Playwright installation; the app itself has no new dependency.
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
const report = { viewports: [], flows: [], errors };
const click = name => page.getByRole('button', { name, exact: true }).click();
const heading = text => page.waitForFunction(expected => document.querySelector('main h1')?.textContent?.replace(/\s/g, '') === expected.replace(/\s/g, ''), text);
const overflowCheck = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'No horizontal overflow');
const snap = name => page.screenshot({ path: path.join(artifactDir, `${name}.png`), fullPage: true });

async function start(mode, vibe = 'playful') {
  await page.goto(url);
  await click(mode === 'first-date' ? 'Play First Date, Again' : mode === 'mission' ? 'Play Secret Mission' : 'Play Double Yes');
  await page.getByLabel('Player 1', { exact: true }).fill('Alex');
  await page.getByLabel('Player 2', { exact: true }).fill('Sam');
  await page.getByRole('radio', { name: vibe === 'playful' ? /Playful/ : /Flirty/ }).check();
  await page.getByRole('button', { name: mode === 'first-date' ? 'Meet your characters' : mode === 'mission' ? 'Deal our missions' : 'Find our shared yeses', exact: true }).click();
}

try {
  for (const [width, height] of [[320, 640], [360, 800], [390, 844], [768, 1024], [1024, 768], [1280, 800], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.goto(url);
    await heading('Same person.New butterflies.');
    await overflowCheck();
    await snap(`home-${width}`);
    report.viewports.push(`${width}×${height}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  for (const branch of ['missed', 'birthday']) {
    await start('first-date', branch === 'birthday' ? 'flirty' : 'playful');
    assert.equal(await page.getByText(rolesSecret()).count(), 0, 'Secrets are absent before reveal');
    await click('I’m Alex');
    await heading('The bartender');
    assert.equal(await page.getByText(/Find one unexpected thing you have in common/).count(), 0, 'Partner secret absent');
    // Simulate a browser visibility change: an open private card must re-cover.
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
    await heading('Pass the phoneto Alex.');
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    await click('I’m Alex');
    await click('Hide & pass to Sam');
    assert.equal(await page.getByRole('heading', { name: 'The bartender', exact: true }).count(), 0);
    await click('I’m Sam');
    await click('Hide card & start the scene');
    await heading('Give them a reason to stay.');
    await overflowCheck();
    const before = await page.locator('blockquote').innerText();
    await click('Try another line');
    assert.notEqual(await page.locator('blockquote').innerText(), before);
    await page.locator('summary').click();
    if (branch === 'missed') assert.match(await page.locator('.reply-hint p').innerText(), /extra syrup/, 'Alternate opener gets its own matching comeback');
    await snap(`scene-${branch}-390`);
    await click('Leave game');
    assert.equal(await page.getByRole('dialog').isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.getByRole('dialog').isVisible(), false);
    await heading('Give them a reason to stay.');
    await click('Next beat');
    await click('Bring on the twist');
    await page.getByRole('button', { name: branch === 'missed' ? /The missed connection/ : /The birthday coincidence/ }).click();
    await heading(branch === 'missed' ? 'Wait. We’ve matched before.' : 'Two birthdays. Zero plans.');
    if (branch === 'missed') {
      for (const [width, height] of [[320, 640], [768, 1024], [1440, 900]]) {
        await page.setViewportSize({ width, height });
        await overflowCheck();
        await snap(`scene-${width}`);
      }
      await page.setViewportSize({ width: 390, height: 844 });
    }
    await click('Next beat');
    await click('Finish the scene');
    await heading('Still you. A little unexpected.');
    await click('Play again & swap roles');
    await heading('Pass the phoneto Sam.');
    report.flows.push(`First Date: ${branch} branch, role privacy, tab hide, line swap, dialog Escape, ending, swapped replay`);
  }

  await start('mission', 'flirty');
  await click('I’m Alex');
  const oldMission = await page.locator('.mission-task').innerText();
  await click('Deal me something else');
  const firstMission = await page.locator('.mission-task').innerText();
  assert.notEqual(firstMission, oldMission, 'Reroll changes the mission');
  await click('Hide & pass to Sam');
  assert.equal(await page.getByText(firstMission, { exact: true }).count(), 0);
  await click('I’m Sam');
  const secondMission = await page.locator('.mission-task').innerText();
  assert.notEqual(firstMission, secondMission, 'Partners get different missions');
  await click('Hide & begin our missions');
  assert.equal(await page.getByText(firstMission, { exact: true }).count(), 0);
  assert.equal(await page.getByText(secondMission, { exact: true }).count(), 0);
  await click('Start timer');
  await page.waitForFunction(() => document.querySelector('.timer-digits')?.textContent !== '5:00');
  await click('Pause timer');
  const paused = await page.locator('.timer-digits').innerText();
  await page.waitForTimeout(1100);
  assert.equal(await page.locator('.timer-digits').innerText(), paused);
  await snap('mission-active-390');
  await click('Alex’s private peek');
  await heading('Pass the phoneto Alex.');
  await click('I’m Alex');
  assert.equal(await page.locator('.mission-task').innerText(), firstMission);
  await click('Hide & return to our game');
  await click('Reveal our missions');
  await heading('So that’s what you were up to.');
  await page.getByText('Alex’s mission', { exact: true }).click();
  await page.getByText('Sam’s mission', { exact: true }).click();
  assert.equal(await page.getByText(firstMission, { exact: true }).count(), 1);
  await click('Play another round');
  await heading('Pass the phoneto Alex.');
  report.flows.push('Secret Mission: distinct deal, reroll, handoff, paused timer, private peek, both reveals, replay');

  for (const strategy of ['all-yes', 'mixed', 'no-match']) {
    await start('double-yes', 'flirty');
    const picks = [new Set(), new Set()];
    const dealt = [];
    for (let player = 0; player < 2; player++) {
      await click(player === 0 ? 'I’m Alex' : 'I’m Sam');
      for (let i = 0; i < 8; i++) {
        const ideaId = await page.locator('[data-idea-id]').getAttribute('data-idea-id');
        if (player === 0) dealt.push(ideaId);
        const yes = strategy === 'all-yes' || (strategy === 'mixed' && (player === 0 ? i % 2 === 0 : i >= 2 && i <= 5));
        if (yes) picks[player].add(ideaId);
        if (i === 2 && player === 0 && strategy === 'mixed') { await overflowCheck(); await snap('double-yes-pick-390'); }
        await click(yes ? 'Sounds fun' : 'Not tonight');
      }
      if (player === 0) {
        await heading('Pass the phoneto Sam.');
        assert.equal(await page.locator('[data-idea-id]').count(), 0, 'No previous card is visible in handoff');
      }
    }
    assert.equal(new Set(dealt).size, 8, 'No duplicate cards within a deck');
    const expected = [...picks[0]].filter(id => picks[1].has(id));
    const actual = await page.locator('[data-match-id]').evaluateAll(nodes => nodes.map(n => n.dataset.matchId));
    assert.deepEqual(actual, expected, 'Only mutual positive choices are exposed');
    await snap(`double-yes-${strategy}-390`);
    if (expected.length) {
      await page.locator('[data-match-id]').first().click();
      assert.equal(await page.locator('.date-steps li').count(), 3);
      await click('We tried it');
      await heading('That one was yours.');
    } else await heading('Different moods.Still a good team.');
    report.flows.push(`Double Yes: ${strategy}, private handoff, exact intersection (${expected.length}), ${expected.length ? 'date plan and ending' : 'empty-state recovery'}`);
  }

  // Long names and narrow layouts must not break privacy screens or the exit dialog.
  await page.goto(url);
  await click('Play Secret Mission');
  await page.getByLabel('Player 1', { exact: true }).fill('Alexandria-Alexandria-XYZ');
  await page.getByLabel('Player 2', { exact: true }).fill('Alexandria-Alexandria-XYZ');
  await click('Deal our missions');
  await page.setViewportSize({ width: 320, height: 640 });
  await overflowCheck();
  await page.getByRole('button', { name: /^I’m Alexandria/ }).click();
  await overflowCheck();
  await snap('private-long-name-320');
  await click('Leave game');
  await overflowCheck();
  await click('Leave this round');
  await heading('Same person.New butterflies.');
  assert.deepEqual(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })), { local: 0, session: 0 }, 'Private picks are not persisted');
  await page.reload();
  await heading('Same person.New butterflies.');
  report.flows.push('Long identical names, 320px private card, leave and reload clearing, no browser storage');
  assert.deepEqual(errors, [], 'No browser runtime errors');
  await fs.writeFile(path.join(artifactDir, 'qa-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}

function rolesSecret() { return 'Find out what makes this stranger lose track of time. Work their answer into your invitation at the end.'; }
