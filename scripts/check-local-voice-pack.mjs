import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const formats = ['mp3', 'm4a', 'wav', 'ogg'];
const locales = ['zh', 'en', 'es'];
const genders = ['male', 'female'];
const clips = [
  'task-trap',
  'task-collision',
  'task-bold',
  'task-kiss',
  'task-blush',
  'dice-big-roll',
  'dice-small-roll',
  'dice-steady',
  'dice-hot-streak',
  'dice-taunt-1',
  'dice-taunt-2'
];

const missing = [];
const present = [];
const invalid = [];
const canDecodeWithAfinfo = process.platform === 'darwin' && existsSync('/usr/bin/afinfo');

for (const locale of locales) {
  for (const gender of genders) {
    for (const clip of clips) {
      const basePath = join('public', 'audio', 'voice', locale, gender, clip);
      const found = formats
        .map(format => `${basePath}.${format}`)
        .find(relativePath => existsSync(join(root, relativePath)));

      if (!found) {
        missing.push(`${basePath}.mp3`);
        continue;
      }

      present.push(found);
      if (statSync(join(root, found)).size < 1024) {
        invalid.push(`${found} is too small to be a valid voice clip`);
        continue;
      }

      if (canDecodeWithAfinfo) {
        const probe = spawnSync('/usr/bin/afinfo', ['-r', join(root, found)], { encoding: 'utf8' });
        const duration = Number(probe.stdout.match(/estimated duration:\s+([\d.]+)/)?.[1]);
        if (probe.status !== 0 || !Number.isFinite(duration) || duration <= 0.2 || duration >= 20) {
          invalid.push(`${found} could not be decoded or has an invalid duration`);
        }
      }
    }
  }
}

if (present.length) {
  console.log(`Found ${present.length} local voice files:`);
  for (const item of present) console.log(`  ✓ ${item}`);
}

if (missing.length || invalid.length) {
  console.log(`\nMissing ${missing.length} local voice files:`);
  for (const item of missing) console.log(`  - ${item}`);
  if (invalid.length) {
    console.log(`\nInvalid ${invalid.length} local voice files:`);
    for (const item of invalid) console.log(`  - ${item}`);
  }
  process.exitCode = 1;
} else {
  console.log(`\nVoice pack complete. All ${present.length} local human voice clips are present${canDecodeWithAfinfo ? ', decodable,' : ''} and within the expected duration range.`);
}
