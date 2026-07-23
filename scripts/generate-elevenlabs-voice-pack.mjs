import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

function loadLocalEnvFile() {
  const envPath = join(process.cwd(), '.env.voice');
  if (!existsSync(envPath)) return;

  const content = readFileSync(envPath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const index = line.indexOf('=');
    if (index === -1) continue;

    const key = line.slice(0, index).trim();
    const value = line
      .slice(index + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');

    if (!process.env[key]) process.env[key] = value;
  }
}

loadLocalEnvFile();

const apiKey = process.env.ELEVENLABS_API_KEY;
const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const scope = process.env.VOICE_PACK_SCOPE || 'zh:female';
const outputFormat = process.env.ELEVENLABS_OUTPUT_FORMAT || 'mp3_44100_128';

const voiceIds = {
  'zh:male': process.env.ELEVENLABS_VOICE_ID_ZH_MALE || process.env.ELEVENLABS_VOICE_ID_MALE || process.env.ELEVENLABS_VOICE_ID,
  'zh:female': process.env.ELEVENLABS_VOICE_ID_ZH_FEMALE || process.env.ELEVENLABS_VOICE_ID_FEMALE || process.env.ELEVENLABS_VOICE_ID,
  'en:male': process.env.ELEVENLABS_VOICE_ID_EN_MALE || process.env.ELEVENLABS_VOICE_ID_MALE || process.env.ELEVENLABS_VOICE_ID,
  'en:female': process.env.ELEVENLABS_VOICE_ID_EN_FEMALE || process.env.ELEVENLABS_VOICE_ID_FEMALE || process.env.ELEVENLABS_VOICE_ID
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
  },
  'en:male': {
    'task-trap': 'Well, that escalated quickly. I am in.',
    'task-collision': 'Caught you, troublemaker.',
    'task-bold': 'That is bold. Good thing I like a challenge.',
    'task-kiss': 'Come here, heartbreaker.',
    'task-blush': 'Okay, you win. I am definitely blushing.',
    'dice-big-roll': 'That’s how you roll, babe.',
    'dice-small-roll': 'The dice clearly fear my potential.',
    'dice-steady': 'One step closer to the good part.',
    'dice-hot-streak': 'The dice have excellent taste tonight.'
  },
  'en:female': {
    'task-trap': 'This one is a little naughty. I am with you.',
    'task-collision': 'I caught you. Come a little closer.',
    'task-bold': 'This one is bold. We can take it slow.',
    'task-kiss': 'Come a little closer, okay?',
    'task-blush': 'You are making me blush for real.',
    'dice-big-roll': 'Come on, love. I will wait for you.',
    'dice-small-roll': 'It is okay. Slow can be sweet too.',
    'dice-steady': 'No rush. The fun is catching up.',
    'dice-hot-streak': 'Looks like luck is being very kind tonight.'
  }
};

function parseScopes(value) {
  if (value === 'all') return Object.keys(lines);
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

async function listVoices() {
  const response = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: {
      'xi-api-key': apiKey
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Cannot list ElevenLabs voices: ${response.status} ${body}`);
  }

  const data = await response.json();
  console.log('Available ElevenLabs voices:');
  for (const voice of data.voices || []) {
    const labels = voice.labels
      ? Object.entries(voice.labels).map(([key, value]) => `${key}:${value}`).join(', ')
      : '';
    console.log(`  ${voice.name}  ${voice.voice_id}${labels ? `  (${labels})` : ''}`);
  }
}

async function generateClip(voiceId, text, relativeOutputPath) {
  const url = new URL(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`);
  url.searchParams.set('output_format', outputFormat);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.58,
        similarity_boost: 0.78,
        style: 0.24,
        use_speaker_boost: true
      }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Cannot generate ${relativeOutputPath}: ${response.status} ${body}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const outputPath = join(process.cwd(), relativeOutputPath);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, buffer);
  console.log(`Generated ${relativeOutputPath}`);
}

if (!apiKey) {
  console.error('Missing ELEVENLABS_API_KEY.');
  console.error('Set it only in your terminal session, for example:');
  console.error('  export ELEVENLABS_API_KEY=\"paste_your_key_here\"');
  console.error('Or create a local .env.voice file. It is ignored by git.');
  process.exit(1);
}

if (process.env.ELEVENLABS_LIST_VOICES === '1') {
  await listVoices();
  process.exit(0);
}

const selectedScopes = parseScopes(scope);

for (const item of selectedScopes) {
  if (!lines[item]) {
    throw new Error(`Unsupported VOICE_PACK_SCOPE item: ${item}`);
  }

  const voiceId = voiceIds[item];
  if (!voiceId) {
    throw new Error(`Missing voice id for ${item}. Set ELEVENLABS_VOICE_ID or ELEVENLABS_VOICE_ID_${item.replace(':', '_').toUpperCase()}.`);
  }

  const [locale, gender] = item.split(':');
  for (const [clipId, text] of Object.entries(lines[item])) {
    await generateClip(
      voiceId,
      text,
      join('public', 'audio', 'voice', locale, gender, `${clipId}.mp3`)
    );
  }
}

console.log('\nDone. Run npm run voice:check to verify the local voice pack.');
