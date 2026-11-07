import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.MINIGAMES_URL || 'http://127.0.0.1:5180/';
const stages = process.env.MINIGAME_STAGES?.split(',') || ['new', 'together', 'married'];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.setDefaultTimeout(12000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));

const click = name => page.getByRole('button', { name, exact: true }).click();
const noOverflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);

async function start(title, label, stage) {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await click(`Play ${title}`);
  await page.getByLabel('Player 1', { exact: true }).fill('Alex');
  await page.getByLabel('Player 2', { exact: true }).fill('Sam');
  const stageName = { new: 'Just started dating', together: 'Together a while', married: 'Married' }[stage];
  if (title !== 'Chemistry Dice') await page.getByRole('radio', { name: new RegExp(stageName) }).check();
  if (title === 'Chemistry Dice' && stage === 'married') await page.getByRole('radio', { name: /Flirty/ }).check();
  await click(label);
}

try {
  for (const stage of stages) {
    console.log(`Checking ${stage}...`);
    await start('Chemistry Dice', 'Choose our comfort', stage);
    if (stage === 'new') {
      await click('I’m Alex');
      await page.getByRole('button', { name: 'Hand', exact: true }).click();
      await click('Hide & pass to Sam');
      await click('I’m Sam');
      await page.getByRole('button', { name: 'Cheek', exact: true }).click();
      await click('Hide & roll together');
      await page.getByRole('heading', { name: 'No shared spots tonight.' }).waitFor();
      await click('Choose again');
    }
    const chosenParts = stage === 'married' ? ['Neck', 'Lips'] : ['Hand', 'Shoulder'];
    await click('I’m Alex');
    for (const part of chosenParts) await page.getByRole('button', { name: part, exact: true }).click();
    await click('Hide & pass to Sam');
    await click('I’m Sam');
    for (const part of chosenParts) await page.getByRole('button', { name: part, exact: true }).click();
    await click('Hide & roll together');
    for (let round = 0; round < 4; round++) {
      await page.getByRole('button', { name: 'Roll both dice', exact: true }).dispatchEvent('click');
      await page.locator('.chemistry-result').waitFor();
      assert.ok((await page.locator('.chemistry-result > p').innerText()).length > 20);
      assert.ok(chosenParts.includes(await page.locator('.body-map strong').innerText()));
      if (round === 0) {
        const oldPair = await page.locator('.chemistry-pair').textContent();
        await page.getByRole('button', { name: 'Reroll both' }).dispatchEvent('click');
        await page.waitForFunction(previous => {
          const current = document.querySelector('.chemistry-pair');
          return current && current.textContent !== previous;
        }, oldPair);
        assert.notEqual(await page.locator('.chemistry-pair').textContent(), oldPair);
        assert.equal(await page.getByRole('button', { name: 'Reroll both' }).isDisabled(), true);
        await page.getByRole('button', { name: 'Start twenty-second timer' }).click();
        await page.getByRole('button', { name: 'Pause twenty-second timer' }).waitFor();
        await page.setViewportSize({ width: 320, height: 640 });
        await noOverflow();
        await page.setViewportSize({ width: 390, height: 844 });
      }
      await noOverflow();
      await click(round === 0 ? 'Pass this move' : round === 3 ? 'Finish our round' : 'Next roll');
    }
    assert.equal(await page.locator('.dice-favorites button').count(), 3, 'Passed move stays off the favorites list');
    await page.locator('.dice-favorites button').first().click();
    await page.getByText('Nothing from this round is saved.').waitFor();
    console.log(`Chemistry Dice ${stage}: mutual body-part choices, four rolls, reroll, timer, favorite`);

    await start('Sketch Our Date', 'Start our sketches', stage);
    for (let round = 0; round < 3; round++) {
      const artist = round % 2 ? 'Sam' : 'Alex';
      const guesser = round % 2 ? 'Alex' : 'Sam';
      await click(`I’m ${artist}`);
      const title = await page.locator('.sketch-secret strong').innerText();
      await click('Start sketching');
      const canvas = page.locator('canvas');
      if (round === 0) {
        await page.setViewportSize({ width: 320, height: 640 });
        await noOverflow();
        await page.setViewportSize({ width: 390, height: 844 });
      }
      const before = await canvas.evaluate(element => element.toDataURL());
      const box = await canvas.boundingBox();
      assert.ok(box);
      await page.mouse.move(box.x + 35, box.y + 35);
      await page.mouse.down();
      await page.mouse.move(box.x + 120, box.y + 90, { steps: 6 });
      await page.mouse.up();
      const after = await canvas.evaluate(element => element.toDataURL());
      assert.notEqual(after, before, 'Pointer drawing changes the canvas');
      await click(`Hide the answer & pass to ${guesser}`);
      await click(`I’m ${guesser}`);
      assert.equal(await page.locator('.sketch-result').isVisible(), true);
      await page.getByRole('button', { name: title, exact: true }).click();
      await page.getByText(title, { exact: true }).last().waitFor();
      await noOverflow();
      await click(round === 2 ? 'See our date sketches' : 'Draw the next date');
    }
    assert.equal(await page.locator('.sketch-gallery button').count(), 3);
    await page.locator('.sketch-gallery button').first().click();
    await page.getByText('Sketches stay on this device and disappear when you leave or reload.').waitFor();
    console.log(`Sketch Our Date ${stage}: three drawings, private handoff, guessing, favorite`);
  }

  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await noOverflow();
  assert.deepEqual(errors, []);
  console.log('Interactive mini-games passed at 390px and 320px without page errors');
} finally {
  await browser.close();
}
