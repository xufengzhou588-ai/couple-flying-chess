import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';

const voices = {
  'en:male': 'en-US-GuyNeural', 'en:female': 'en-US-JennyNeural',
  'zh:male': 'zh-CN-YunxiNeural', 'zh:female': 'zh-CN-XiaoxiaoNeural',
  'es:male': 'es-US-AlonsoNeural', 'es:female': 'es-US-PalomaNeural'
};

const lines = {
  'en:male': ['All right. Tonight, let’s see what we find together.', 'Your turn. Take your time. I’m right here.', 'Let’s see where those dice take us.', 'Okay, now you’ve got my attention.', 'We make a pretty good team.'],
  'en:female': ['Ready when you are. Let’s make tonight a little more fun.', 'Your turn. I’m curious what you’ll choose.', 'Go on, roll. I might like the answer.', 'Oh, I like where this is going.', 'See? We figured it out together.'],
  'zh:male': ['今晚就咱俩。来，看看会玩出什么花样。', '到你啦。别急，我等你。', '来，掷一下，看看会碰上什么。', '哦？这个我喜欢。', '你看，咱俩还挺有默契。'],
  'zh:female': ['今晚只管开心。来，选一个玩吧。', '到你啦，我想看看你会怎么选。', '来，掷骰子。让我猜猜会是什么。', '诶，这个有点意思。', '猜对啦！我们还挺会配合。'],
  'es:male': ['¿Listos? Veamos qué nos trae esta noche.', 'Te toca. Tómate tu tiempo. Aquí estoy.', 'A ver adónde nos llevan estos dados.', 'Ahora sí tienes toda mi atención.', 'Hacemos buen equipo.'],
  'es:female': ['Cuando tú quieras. Vamos a divertirnos un poco esta noche.', 'Te toca. Tengo curiosidad por ver qué eliges.', 'Anda, lánzalos. Puede que me guste el resultado.', 'Uy, me gusta cómo va esto.', '¿Ves? Lo resolvimos juntos.']
};
const ids = ['mini-start', 'mini-turn', 'mini-roll', 'mini-spark', 'mini-solved'];

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('python3', ['-m', 'edge_tts', ...args], { stdio: ['ignore', 'ignore', 'pipe'] });
    let error = '';
    child.stderr.on('data', chunk => { error += chunk.toString(); });
    child.on('close', code => code === 0 ? resolve() : reject(new Error(`edge_tts exited ${code}: ${error}`)));
  });
}

for (const [key, voice] of Object.entries(voices)) {
  const [locale, gender] = key.split(':');
  if (process.env.MINI_VOICE_LOCALE && process.env.MINI_VOICE_LOCALE !== locale) continue;
  for (const [index, text] of lines[key].entries()) {
    const output = join('public', 'audio', 'voice', locale, gender, `${ids[index]}.mp3`);
    await mkdir(dirname(output), { recursive: true });
    const rate = locale === 'zh' ? (gender === 'female' ? '-8%' : '-5%') : '-5%';
    const pitch = locale === 'zh' ? (gender === 'female' ? '-2Hz' : '-1Hz') : '-1Hz';
    await run(['--voice', voice, `--rate=${rate}`, `--pitch=${pitch}`, '--text', text, '--write-media', output]);
    console.log(output);
  }
}
