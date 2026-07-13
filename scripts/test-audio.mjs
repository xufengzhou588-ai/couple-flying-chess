import WebSocket from 'ws';

const debugPort = 9224;
const appUrl = 'http://127.0.0.1:5180/';
const target = await fetch(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent(appUrl)}`, {
  method: 'PUT'
}).then(response => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);

await new Promise((resolve, reject) => {
  socket.once('open', resolve);
  socket.once('error', reject);
});

let commandId = 0;
const pending = new Map();
socket.on('message', raw => {
  const message = JSON.parse(raw.toString());
  if (!message.id || !pending.has(message.id)) return;
  const callbacks = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) callbacks.reject(new Error(message.error.message));
  else callbacks.resolve(message.result);
});

function send(method, params = {}) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true
});
await wait(900);

const savedState = {
  view: 'game',
  locale: 'en',
  turn: 0,
  players: [
    { id: 0, color: '#4fb3ff', role: 'male', step: 0, themeId: 'spark' },
    { id: 1, color: '#ff4f7f', role: 'female', step: 0, themeId: 'spark' }
  ],
  themes: [],
  boardMap: Array(49).fill('blank'),
  pathCoords: [],
  isRolling: false,
  finalRewardIds: ['slow-kiss', 'massage', 'date-choice', 'body-choice', 'private-wish']
};

await evaluate(`localStorage.setItem('couple-flying-chess-v3', ${JSON.stringify(JSON.stringify(savedState))})`);
await send('Page.reload', { ignoreCache: true });
await wait(900);

await evaluate(`{
  window.__spoken = [];
  const originalSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
  window.speechSynthesis.speak = utterance => {
    window.__spoken.push({
      text: utterance.text,
      lang: utterance.lang,
      pitch: utterance.pitch,
      rate: utterance.rate
    });
    try { originalSpeak(utterance); } catch {}
  };
}`);

const gameSoundButton = await evaluate(`({
  exists: !!document.querySelector('[aria-label="Turn on date-night music"]'),
  top: document.querySelector('[aria-label="Turn on date-night music"]')?.getBoundingClientRect().top,
  right: document.querySelector('[aria-label="Turn on date-night music"]')?.getBoundingClientRect().right,
  viewportWidth: innerWidth
})`);

await send('Input.dispatchMouseEvent', {
  type: 'mousePressed',
  x: 355,
  y: 114,
  button: 'left',
  clickCount: 1
});
await send('Input.dispatchMouseEvent', {
  type: 'mouseReleased',
  x: 355,
  y: 114,
  button: 'left',
  clickCount: 1
});
await wait(450);
const musicStarted = await evaluate(`!!document.querySelector('[aria-label="Turn off date-night music"]')`);

await evaluate('Math.random = () => 0.99');
await evaluate(`document.querySelector('.scene')?.click()`);
await wait(1300);
const maleDiceVoice = await evaluate(`window.__spoken.filter(item => item.text).at(-1) || null`);

const femaleState = {
  ...savedState,
  turn: 1
};
await evaluate(`localStorage.setItem('couple-flying-chess-v3', ${JSON.stringify(JSON.stringify(femaleState))})`);
await send('Page.reload', { ignoreCache: true });
await wait(900);
await evaluate(`{
  window.__spoken = [];
  window.speechSynthesis.speak = utterance => window.__spoken.push({
    text: utterance.text,
    lang: utterance.lang,
    pitch: utterance.pitch,
    rate: utterance.rate
  });
  Math.random = () => 0.99;
}`);
await evaluate(`document.querySelector('.scene')?.click()`);
await wait(1300);
const femaleDiceVoice = await evaluate(`window.__spoken.filter(item => item.text).at(-1) || null`);

console.log(
  JSON.stringify(
    {
      gameSoundButton,
      musicStarted,
      maleDiceVoice,
      femaleDiceVoice,
      rolesDiffer:
        !!maleDiceVoice &&
        !!femaleDiceVoice &&
        maleDiceVoice.pitch < femaleDiceVoice.pitch &&
        maleDiceVoice.text !== femaleDiceVoice.text
    },
    null,
    2
  )
);

socket.close();
