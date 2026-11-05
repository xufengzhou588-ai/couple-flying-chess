import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';
import zxing from '@zxing/library';

const { RGBLuminanceSource, HybridBinarizer, BinaryBitmap, QRCodeReader } = zxing;

function decodeQrDataUrl(dataUrl) {
  const png = PNG.sync.read(Buffer.from(dataUrl.split(',')[1], 'base64'));
  const luminance = new Uint8ClampedArray(png.width * png.height);
  for (let i = 0; i < luminance.length; i += 1) {
    const offset = i * 4;
    luminance[i] = (png.data[offset] + png.data[offset + 1] * 2 + png.data[offset + 2]) / 4;
  }
  const image = new RGBLuminanceSource(luminance, png.width, png.height);
  return new QRCodeReader().decode(new BinaryBitmap(new HybridBinarizer(image))).getText();
}

const modulePath = process.env.PLAYWRIGHT_MODULE;
const { chromium } = await import(modulePath ? pathToFileURL(modulePath).href : 'playwright');
const baseUrl = process.env.REMOTE_TEST_URL || 'http://127.0.0.1:5173/';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const host = await browser.newPage({ viewport: { width: 390, height: 844 } });
const guest = await browser.newPage({ viewport: { width: 390, height: 844 } });
for (const page of [host, guest]) page.setDefaultTimeout(45000);

try {
  await host.goto(baseUrl, { waitUntil: 'commit', timeout: 45000 });
  await host.getByRole('button', { name: /邀请另一半/ }).click();
  const roomCode = await host.evaluate(() => document.body.innerText.match(/房间码\s+([A-Z0-9]{6})/)?.[1] || '');
  assert.match(roomCode, /^[A-Z0-9]{6}$/, 'The host generated a six-character room code');

  const loopback = ['127.0.0.1', 'localhost'].includes(new URL(baseUrl).hostname);
  let inviteQr = '';
  if (loopback) {
    assert.equal(await host.getByRole('button', { name: '复制房间码' }).isVisible(), true);
    assert.equal(await host.getByText('二维码邀请', { exact: true }).count(), 0, 'A loopback QR would point the phone at itself');
  } else {
    assert.equal(await host.getByRole('button', { name: '复制邀请链接' }).isVisible(), true);
    await host.getByText('二维码邀请', { exact: true }).waitFor();
    inviteQr = await host.locator('img[alt="二维码邀请"]').getAttribute('src') || '';
    assert.match(inviteQr, /^data:image\/png;base64,/, 'The invite QR is a PNG image');
  }

  await host.locator('.cfc-dialog-card > button[aria-label="关闭"]').click();

  const guestUrl = new URL(baseUrl);
  guestUrl.searchParams.set('room', roomCode);
  if (loopback) {
    await guest.goto(guestUrl.toString(), { waitUntil: 'commit', timeout: 45000 });
  } else {
    await guest.goto(baseUrl, { waitUntil: 'commit', timeout: 45000 });
    await guest.getByRole('button', { name: /加入房间/ }).first().click();
    await guest.getByRole('button', { name: '扫码加入' }).click();
    await guest.getByText(/当前局域网 HTTP 页面无法打开实时相机/).waitFor();
    await guest.locator('input[type="file"][accept="image/*"]').setInputFiles({
      name: 'invite.png',
      mimeType: 'image/png',
      buffer: Buffer.from(inviteQr.split(',')[1], 'base64')
    });
    await guest.waitForURL(guestUrl.toString(), { timeout: 20000 });
  }
  await Promise.all([host, guest].map(page =>
    page.waitForFunction(() => document.body.innerText.includes('对方在线'), null, { timeout: 45000 })
  ));
  await Promise.all([host, guest].map(page => page.getByRole('dialog', { name: '对方已加入，准备开局' }).waitFor()));

  await host.locator('[data-role-player-id="1"]').click();
  await guest.locator('[data-role-player-id="0"]').waitFor({ state: 'visible' });
  await guest.locator('[data-role-player-id="0"]').click();
  assert.equal(await host.locator('[data-role-player-id="1"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await guest.locator('[data-role-player-id="0"]').getAttribute('aria-pressed'), 'true');

  await host.locator('[data-select-deck="1"]').click();
  assert.ok(await host.locator('[data-theme-id]').count() > 0, 'The host can choose a deck for the chosen character');
  await host.locator('[data-theme-id]').first().click();
  await guest.locator('[data-select-deck="0"]').click();
  assert.ok(await guest.locator('[data-theme-id]').count() > 0, 'The guest can choose a deck for the other character');
  await guest.locator('[data-theme-id]').first().click();
  try {
    await host.getByRole('button', { name: '双方准备好，开始游戏' }).waitFor({ state: 'visible', timeout: 20000 });
    await host.waitForFunction(() => {
      const button = [...document.querySelectorAll('button')].find(item => item.textContent?.includes('双方准备好，开始游戏'));
      return button && !button.disabled;
    }, null, { timeout: 20000 });
  } catch (error) {
    console.error('HOST SETUP:', await host.getByRole('dialog', { name: '对方已加入，准备开局' }).innerText());
    console.error('GUEST SETUP:', await guest.getByRole('dialog', { name: '对方已加入，准备开局' }).innerText());
    throw error;
  }
  await host.getByRole('button', { name: '双方准备好，开始游戏' }).click();
  await guest.getByRole('dialog', { name: '对方已加入，准备开局' }).waitFor({ state: 'hidden', timeout: 20000 });
  await guest.locator('.dice-action').waitFor({ timeout: 20000 });
  const firstTurnIsMale = (await host.locator('body').innerText()).includes('男士回合');
  await guest.waitForFunction(firstTurnIsMale
    ? () => document.body.innerText.includes('男士回合')
    : () => document.body.innerText.includes('女士回合'), null, { timeout: 20000 });
  assert.equal(await host.locator('.dice-action').isEnabled(), !firstTurnIsMale, 'The host chose player 1');
  assert.equal(await guest.locator('.dice-action').isEnabled(), firstTurnIsMale, 'The guest chose player 0');

  if (!loopback) {
    const nativeHost = await browser.newPage({ viewport: { width: 390, height: 844 } });
    nativeHost.setDefaultTimeout(60000);
    await nativeHost.addInitScript(() => { window.CapacitorCustomPlatform = { name: 'ios' }; });
    const nativeHostUrl = new URL(baseUrl);
    nativeHostUrl.hostname = '127.0.0.1';
    await nativeHost.goto(nativeHostUrl.toString(), { waitUntil: 'domcontentloaded', timeout: 60000 });
    await nativeHost.getByRole('button', { name: /邀请另一半/ }).click();
    const nativeCode = await nativeHost.evaluate(() => document.body.innerText.match(/房间码\s+([A-Z0-9]{6})/)?.[1] || '');
    const nativeQr = await nativeHost.getByRole('img', { name: '二维码邀请' }).getAttribute('style');
    const nativeDataUrl = nativeQr?.match(/data:image\/png;base64,[A-Za-z0-9+/=]+/)?.[0] || '';
    assert.match(nativeDataUrl, /^data:image\/png;base64,/, 'The native app renders a code-only invite QR');
    assert.equal(decodeQrDataUrl(nativeDataUrl), nativeCode, 'The native QR decodes to its six-character room code');
    await nativeHost.close();
  }

  console.log(JSON.stringify({
    result: 'passed',
    checks: ['six-character invite', loopback ? 'loopback link protection' : 'link QR joins and native code QR decodes', 'two independent clients online', 'host setup opens after partner joins', 'opposite character selection', 'both decks synced', 'host start opens guest board', 'chosen character controls the correct turn']
  }));
} finally {
  await browser.close();
}
