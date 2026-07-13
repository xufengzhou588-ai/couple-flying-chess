import WebSocket from 'ws';

const debugPort = 9223;
const appUrl = 'http://127.0.0.1:5179/';

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
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
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

async function wait(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true
});
await wait(800);

const savedState = {
  view: 'game',
  locale: 'en',
  turn: 0,
  players: [
    { id: 0, color: '#4fb3ff', role: 'male', step: 46, themeId: 'spark' },
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
await wait(1200);
await evaluate('Math.random = () => 0.4');

const initial = await evaluate(`({
  hasDice: !!document.querySelector('.scene'),
  hasHisTurn: document.body.innerText.includes('His turn'),
  width: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth
})`);

await evaluate(`document.querySelector('.scene')?.click()`);
await wait(3200);

const finish = await evaluate(`({
  text: document.body.innerText,
  rewardChoices: [...document.querySelectorAll('button')].filter(button =>
    ['Winner’s Kiss', 'Five-Star Service', 'Next Date Draft Pick', 'Favorite Place', 'Tonight’s Wish']
      .some(label => button.innerText.includes(label))
  ).length,
  width: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  height: document.documentElement.scrollHeight,
  clientHeight: document.documentElement.clientHeight
})`);

await evaluate(`{
  const button = [...document.querySelectorAll('button')].find(item =>
    ['Winner’s Kiss', 'Five-Star Service', 'Next Date Draft Pick', 'Favorite Place', 'Tonight’s Wish']
      .some(label => item.innerText.includes(label))
  );
  button?.click();
}`);
await wait(150);

const intensity = await evaluate(`({
  hasFull: document.body.innerText.includes('Full Version'),
  hasGentle: document.body.innerText.includes('Gentle Version')
})`);

await evaluate(`{
  const button = [...document.querySelectorAll('button')].find(item => item.innerText.includes('Full Version'));
  button?.click();
}`);
await wait(150);

const confirmed = await evaluate(`({
  confirmed: document.body.innerText.includes('Tonight’s reward is locked in'),
  replay: document.body.innerText.includes('Play Again After')
})`);

const reactionState = {
  ...savedState,
  players: savedState.players.map(player => ({ ...player, step: 0 })),
  turn: 0
};
await evaluate(`localStorage.setItem('couple-flying-chess-v3', ${JSON.stringify(JSON.stringify(reactionState))})`);
await send('Page.reload', { ignoreCache: true });
await wait(1000);
await evaluate('Math.random = () => 0.99');
await evaluate(`document.querySelector('.scene')?.click()`);
await wait(1250);
const highRoll = await evaluate(`({
  line: document.body.innerText.includes('That’s how you roll, babe.'),
  celebrateClass: !!document.querySelector('.character-celebrate')
})`);

const streakState = {
  ...savedState,
  players: savedState.players.map(player => ({ ...player, step: 0 })),
  boardMap: Array(49).fill('blank'),
  turn: 0
};
await evaluate(`localStorage.setItem('couple-flying-chess-v3', ${JSON.stringify(JSON.stringify(streakState))})`);
await send('Page.reload', { ignoreCache: true });
await wait(1000);
await evaluate('Math.random = () => 0.99');
await evaluate(`document.querySelector('.scene')?.click()`);
await wait(4300);
await evaluate('Math.random = () => 0.4');
await evaluate(`document.querySelector('.scene')?.click()`);
await wait(3900);
await evaluate('Math.random = () => 0.99');
await evaluate(`document.querySelector('.scene')?.click()`);
await wait(1250);
const hotStreak = await evaluate(`({
  title: document.body.innerText.includes('2 big rolls. Hot streak!'),
  line: document.body.innerText.includes('The dice have excellent taste tonight.')
})`);

const milestoneState = {
  ...savedState,
  players: savedState.players.map(player => ({ ...player, step: player.id === 0 ? 10 : 0 })),
  turn: 0
};
await evaluate(`localStorage.setItem('couple-flying-chess-v3', ${JSON.stringify(JSON.stringify(milestoneState))})`);
await send('Page.reload', { ignoreCache: true });
await wait(1000);
await evaluate('Math.random = () => 0.4');
await evaluate(`document.querySelector('.scene')?.click()`);
await wait(2600);
const milestoneVisible = await evaluate(`document.body.innerText.includes('First unlock')`);
await wait(2200);
const milestoneResolved = await evaluate(`document.body.innerText.includes('Her turn')`);

const bonusBoard = Array(49).fill('blank');
bonusBoard[24] = 'lucky';
const bonusState = {
  ...savedState,
  players: savedState.players.map(player => ({ ...player, step: player.id === 0 ? 22 : 0 })),
  boardMap: bonusBoard,
  turn: 0
};
await evaluate(`localStorage.setItem('couple-flying-chess-v3', ${JSON.stringify(JSON.stringify(bonusState))})`);
await send('Page.reload', { ignoreCache: true });
await wait(1000);
await evaluate('Math.random = () => 0.4');
await evaluate(`document.querySelector('.scene')?.click()`);
await wait(5300);
const bonusFront = await evaluate(`!!document.querySelector('.flip-card-front')`);
await evaluate(`document.querySelector('.flip-card-front')?.click()`);
await wait(900);
const taskBonus = await evaluate(`({
  hasBonus: document.body.innerText.includes('Chemistry bonus: add 10 seconds'),
  hasAccept: document.body.innerText.includes('I’m In'),
  frontWasVisible: ${JSON.stringify(false)},
  cardFlipped: document.querySelector('.flip-card-inner')?.classList.contains('flipped') || false
})`);
taskBonus.frontWasVisible = bonusFront;

const previewState = {
  ...savedState,
  players: savedState.players.map(player => ({ ...player, step: player.id === 0 ? 34 : 0 })),
  turn: 0
};
await evaluate(`localStorage.setItem('couple-flying-chess-v3', ${JSON.stringify(JSON.stringify(previewState))})`);
await send('Page.reload', { ignoreCache: true });
await wait(1000);
await evaluate('Math.random = () => 0.4');
await evaluate(`document.querySelector('.scene')?.click()`);
await wait(2550);
const rewardPreview = await evaluate(`({
  hasPreview: document.body.innerText.includes('Sneak peek:'),
  namesReward: ['Winner’s Kiss', 'Five-Star Service', 'Next Date Draft Pick', 'Favorite Place', 'Tonight’s Wish']
    .some(label => document.body.innerText.includes(label))
})`);

console.log(
  JSON.stringify(
    {
      initial,
      finish: {
        finalChoice: finish.text.includes('Final Choice'),
        maleWinnerVisible:
          finish.text.toLowerCase().includes('tonight’s winner') && finish.text.includes('Him'),
        headingText: finish.text
          .split('\n')
          .map(line => line.trim())
          .filter(Boolean)
          .filter(line => /Winner|Him|Final Choice|reward/i.test(line)),
        rewardChoices: finish.rewardChoices,
        noOverflow:
          finish.width === finish.clientWidth && finish.height === finish.clientHeight
      },
      intensity,
      confirmed,
      highRoll,
      hotStreak,
      milestone: {
        visibleBeforeLandingResolved: milestoneVisible,
        turnAdvancedAfterCelebration: milestoneResolved
      },
      taskBonus,
      rewardPreview
    },
    null,
    2
  )
);

socket.close();
