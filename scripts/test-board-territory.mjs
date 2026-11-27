import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const url = process.env.BOARD_TEST_URL || 'http://127.0.0.1:5181/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const cases = [
  { name: 'her pink square', turn: 1, male: 0, female: 0, executor: 0, source: 'wine', type: 'lucky', landing: 1 },
  { name: 'her gold square', turn: 1, male: 0, female: 1, executor: 1, source: 'spark', type: 'trap', landing: 2 },
  { name: 'his pink square', turn: 0, male: 0, female: 0, executor: 0, source: 'wine', type: 'trap', landing: 1 },
  { name: 'his gold square', turn: 0, male: 1, female: 0, executor: 1, source: 'spark', type: 'lucky', landing: 2 },
  { name: 'six-sided die', turn: 0, male: 0, female: 0, executor: 0, source: 'wine', type: 'trap', landing: 6, random: 0.99 },
  { name: 'he captures her', turn: 0, male: 0, female: 1, executor: 1, source: 'spark', type: 'collision', landing: 1 },
  { name: 'she captures him', turn: 1, male: 1, female: 0, executor: 0, source: 'wine', type: 'collision', landing: 1 }
];

try {
  for (const scenario of cases) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const state = {
      view: 'game', locale: 'en', turn: scenario.turn,
      players: [
        { id: 0, role: 'male', color: '#4fb3ff', step: scenario.male, themeId: 'spark' },
        { id: 1, role: 'female', color: '#ff4f7f', step: scenario.female, themeId: 'wine' }
      ],
      themes: [], boardMap: [], pathCoords: [], isRolling: false,
      activeTask: null, winnerId: null, lastDiceRoll: null,
      finalRewardIds: ['slow-kiss', 'massage', 'date-choice']
    };
    await context.addInitScript(({ saved, random }) => {
      localStorage.setItem('couple-flying-chess-v3', JSON.stringify(saved));
      Math.random = () => random;
    }, { saved: state, random: scenario.random ?? 0 });
    const page = await context.newPage();
    await page.goto(url);
    assert.equal(await page.locator('svg.board-route text').count(), 47, 'All playable spaces have visible numbers');
    await page.locator('.dice-action').click();
    await page.waitForFunction(() => {
      const saved = JSON.parse(localStorage.getItem('couple-flying-chess-v3') || '{}');
      return saved.activeTask?.type;
    }, null, { timeout: 12000 });
    const landed = await page.evaluate(() => JSON.parse(localStorage.getItem('couple-flying-chess-v3')));
    assert.equal(landed.players[scenario.turn].step, scenario.landing, `${scenario.name}: landing position`);
    assert.equal(landed.activeTask.type, scenario.type, `${scenario.name}: event type`);
    assert.equal(landed.activeTask.executorPlayerId, scenario.executor, `${scenario.name}: correct partner performs the task`);
    assert.equal(landed.activeTask.taskSourceId, scenario.source, `${scenario.name}: task comes from the square owner's deck`);
    if (scenario.type === 'collision') {
      assert.equal(landed.players[scenario.executor].step, 0, 'Capture returns the opponent to Start before the challenge is answered');
      await page.locator('.flip-card-front').click();
      await page.getByRole('button', { name: 'Skip this extra dare' }).click();
      await page.waitForFunction(() => JSON.parse(localStorage.getItem('couple-flying-chess-v3') || '{}').activeTask === null);
      assert.equal((await page.evaluate(() => JSON.parse(localStorage.getItem('couple-flying-chess-v3')))).players[scenario.executor].step, 0, 'Skipping the extra challenge does not undo the capture');
    }
    console.log(`${scenario.name}: passed`);
    await context.close();
  }
} finally {
  await browser.close();
}
