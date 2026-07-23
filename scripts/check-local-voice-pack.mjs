import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const formats = ['mp3', 'm4a', 'wav', 'ogg'];
const locales = ['zh', 'en'];
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
  'dice-hot-streak'
];

const missing = [];
const present = [];

for (const locale of locales) {
  for (const gender of genders) {
    for (const clip of clips) {
      const basePath = join('public', 'audio', 'voice', locale, gender, clip);
      const found = formats
        .map(format => `${basePath}.${format}`)
        .find(relativePath => existsSync(join(root, relativePath)));

      if (found) present.push(found);
      else missing.push(`${basePath}.mp3`);
    }
  }
}

if (present.length) {
  console.log(`Found ${present.length} local voice files:`);
  for (const item of present) console.log(`  ✓ ${item}`);
}

if (missing.length) {
  console.log(`\nMissing ${missing.length} local voice files:`);
  for (const item of missing) console.log(`  - ${item}`);
  process.exitCode = 1;
} else {
  console.log('\nVoice pack complete. All local human voice clips are ready.');
}
