import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';

const scope = process.env.VOICE_PACK_SCOPE || 'zh';

const voiceConfig = {
  'zh:female': {
    voice: 'zh-CN-XiaoxiaoNeural',
    rate: '-8%',
    pitch: '-2Hz'
  },
  'zh:male': {
    voice: 'zh-CN-YunxiNeural',
    rate: '-5%',
    pitch: '-1Hz'
  }
};

const lines = {
  'zh:male': {
    'task-trap': '有点刺激。来吧，我接了。',
    'task-collision': '抓到你了，别想跑。',
    'task-bold': '这张够大胆。我喜欢。',
    'task-kiss': '靠近点，让我来。',
    'task-blush': '好吧，你成功让我心动了。',
    'dice-big-roll': '这手气，今晚稳了。',
    'dice-small-roll': '骰子可能嫉妒我的实力。',
    'dice-steady': '距离奖励又近了一点。',
    'dice-hot-streak': '今晚这骰子明显站我这边。'
  },
  'zh:female': {
    'task-trap': '这张有点坏，不过我陪你。',
    'task-collision': '被我抓到啦，靠近一点。',
    'task-bold': '嗯，这张有点大胆，我们慢慢来。',
    'task-kiss': '再靠近一点，好吗。',
    'task-blush': '你这样，我真的会脸红。',
    'dice-big-roll': '我先往前一点，你慢慢跟上来。',
    'dice-small-roll': '没关系，慢一点也很好玩。',
    'dice-steady': '别急，我们慢慢来。',
    'dice-hot-streak': '今天好运好像一直陪着我。'
  }
};

function parseScopes(value) {
  if (value === 'zh') return ['zh:female', 'zh:male'];
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stderr = '';
    child.stderr.on('data', chunk => {
      stderr += chunk.toString();
    });
    child.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with ${code}: ${stderr}`));
    });
  });
}

for (const item of parseScopes(scope)) {
  if (!lines[item]) throw new Error(`Unsupported VOICE_PACK_SCOPE item: ${item}`);
  const [locale, gender] = item.split(':');
  const config = voiceConfig[item];

  for (const [clipId, text] of Object.entries(lines[item])) {
    const outputPath = join('public', 'audio', 'voice', locale, gender, `${clipId}.mp3`);
    await mkdir(dirname(outputPath), { recursive: true });
    await run('python3', [
      '-m',
      'edge_tts',
      '--voice',
      config.voice,
      `--rate=${config.rate}`,
      `--pitch=${config.pitch}`,
      '--text',
      text,
      '--write-media',
      outputPath
    ]);
    console.log(`Generated ${outputPath}`);
  }
}

console.log('\nDone. Run npm run voice:check to verify the local voice pack.');
