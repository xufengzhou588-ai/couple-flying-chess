import { TaskEventData } from '../types';
import { getSharedAudioContext, resumeSharedAudioContext } from './audioSession';

let lastSpokenAt = 0;
let activeLocalVoice: AudioBufferSourceNode | null = null;

const LOCAL_VOICE_FORMATS = ['mp3', 'm4a', 'wav', 'ogg'] as const;
const LOCAL_VOICE_VOLUME = 0.9;
const ENABLE_SYSTEM_TTS_FALLBACK = false;
const localVoiceBufferCache = new Map<string, Promise<AudioBuffer | null>>();

function playCueTone(kind: TaskEventData['type']) {
  const context = getSharedAudioContext();
  if (!context) return;
  void resumeSharedAudioContext();

  const now = context.currentTime;
  const gain = context.createGain();
  const oscillator = context.createOscillator();

  oscillator.type = kind === 'trap' ? 'triangle' : 'sine';
  oscillator.frequency.setValueAtTime(kind === 'trap' ? 330 : 520, now);
  oscillator.frequency.exponentialRampToValueAtTime(kind === 'collision' ? 660 : 430, now + 0.18);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.09, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.36);

}

type VoiceMood = 'trap' | 'collision' | 'bold' | 'kiss' | 'blush';
type VoiceGender = 'male' | 'female';

const diceLineIds: Record<string, string> = {
  '这手气，今晚稳了。': 'big-roll',
  '我先往前一点，你慢慢跟上来。': 'big-roll',
  '骰子可能嫉妒我的实力。': 'small-roll',
  '没关系，慢一点也很好玩。': 'small-roll',
  '距离奖励又近了一点。': 'steady',
  '别急，我们慢慢来。': 'steady',
  '今晚这骰子明显站我这边。': 'hot-streak',
  '今天好运好像一直陪着我。': 'hot-streak',
  'That’s how you roll, babe.': 'big-roll',
  'Come on, love. I will wait for you.': 'big-roll',
  'The dice clearly fear my potential.': 'small-roll',
  'It is okay. Slow can be sweet too.': 'small-roll',
  'One step closer to the good part.': 'steady',
  'No rush. The fun is catching up.': 'steady',
  'The dice have excellent taste tonight.': 'hot-streak',
  'Looks like luck is being very kind tonight.': 'hot-streak',
  'Así se tira el dado, amor.': 'big-roll',
  'Ven, amor. Te espero.': 'big-roll',
  'El dado le teme a mi potencial.': 'small-roll',
  'Está bien. Ir lento también tiene encanto.': 'small-roll',
  'Un paso más cerca de lo bueno.': 'steady',
  'Sin prisa. Alcanzarte es parte del juego.': 'steady',
  'El dado tiene muy buen gusto esta noche.': 'hot-streak',
  'Parece que la suerte me está tratando muy bien.': 'hot-streak'
};

function genderForPlayer(playerId: number): VoiceGender {
  return playerId === 0 ? 'male' : 'female';
}

function localVoiceCandidates(locale: TaskEventData['locale'], gender: VoiceGender, clipId: string) {
  return LOCAL_VOICE_FORMATS.map(format => `/audio/voice/${locale}/${gender}/${clipId}.${format}`);
}

async function tryPlayAudioSource(src: string) {
  if (activeLocalVoice) {
    try {
      activeLocalVoice.stop();
    } catch {
      // The source may already have ended.
    }
    activeLocalVoice = null;
  }

  const context = await resumeSharedAudioContext();
  if (!context) return false;

  const buffer = await getLocalVoiceBuffer(context, src);
  if (!buffer) return false;

  const source = context.createBufferSource();
  const gain = context.createGain();

  try {
    source.buffer = buffer;
    gain.gain.value = LOCAL_VOICE_VOLUME;
    source.connect(gain);
    gain.connect(context.destination);
    source.onended = () => {
      if (activeLocalVoice === source) activeLocalVoice = null;
    };
    activeLocalVoice = source;
    source.start();
    return true;
  } catch {
    if (activeLocalVoice === source) {
      activeLocalVoice = null;
    }
    return false;
  }
}

function getLocalVoiceBuffer(context: AudioContext, src: string) {
  const cached = localVoiceBufferCache.get(src);
  if (cached) return cached;

  const promise = fetch(src, { cache: 'force-cache' })
    .then(async response => {
      if (!response.ok) return null;

      const contentType = response.headers.get('content-type') || '';
      if (contentType && !contentType.startsWith('audio/')) return null;

      const arrayBuffer = await response.arrayBuffer();
      return await context.decodeAudioData(arrayBuffer.slice(0));
    })
    .catch(() => null);

  localVoiceBufferCache.set(src, promise);
  return promise;
}

async function playLocalVoiceClip(
  locale: TaskEventData['locale'],
  playerId: number,
  clipId: string
) {
  const now = Date.now();
  if (now - lastSpokenAt < 900) return true;

  for (const src of localVoiceCandidates(locale, genderForPlayer(playerId), clipId)) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    const didPlay = await tryPlayAudioSource(src);
    if (didPlay) {
      lastSpokenAt = now;
      return true;
    }
  }

  return false;
}

function moodForTask(taskData: TaskEventData): VoiceMood {
  const text = taskData.task.toLowerCase();

  if (taskData.type === 'trap') return 'trap';
  if (taskData.type === 'collision') return 'collision';
  if (
    text.includes('private area') ||
    text.includes('私处') ||
    text.includes('nipple') ||
    text.includes('胸尖') ||
    text.includes('suck') ||
    text.includes('轻吸') ||
    text.includes('含住') ||
    text.includes('私密花园') ||
    text.includes('after-dark')
  ) {
    return 'bold';
  }
  if (
    text.includes('blindfold') ||
    text.includes('blind box') ||
    text.includes('touch guessing') ||
    text.includes('feather') ||
    text.includes('ice cube') ||
    text.includes('warm towel') ||
    text.includes('盲眼') ||
    text.includes('眼罩') ||
    text.includes('触觉') ||
    text.includes('羽毛') ||
    text.includes('冰块') ||
    text.includes('热毛巾') ||
    text.includes('kiss') ||
    text.includes('亲吻') ||
    text.includes('吻') ||
    text.includes('secret') ||
    text.includes('秘密') ||
    text.includes('禁区') ||
    text.includes('心跳')
  ) {
    return 'kiss';
  }

  return 'blush';
}

function lineForTask(taskData: TaskEventData) {
  const mood = moodForTask(taskData);
  const isMale = taskData.initiatorPlayerId === 0;

  if (taskData.locale === 'zh') {
    const maleLines: Record<VoiceMood, string> = {
      trap: '有点刺激。来吧，我接了。',
      collision: '抓到你了，别想跑。',
      bold: '这张够大胆。我喜欢。',
      kiss: '靠近点，让我来。',
      blush: '好吧，你成功让我心动了。'
    };
    const femaleLines: Record<VoiceMood, string> = {
      trap: '这张有点坏，不过我陪你。',
      collision: '被我抓到啦，靠近一点。',
      bold: '嗯，这张有点大胆，我们慢慢来。',
      kiss: '再靠近一点，好吗。',
      blush: '你这样，我真的会脸红。'
    };
    return isMale ? maleLines[mood] : femaleLines[mood];
  }

  if (taskData.locale === 'es') {
    const maleLines: Record<VoiceMood, string> = {
      trap: 'Esto se puso interesante. Voy.',
      collision: 'Te alcancé, no te me escapes.',
      bold: 'Este reto tiene carácter. Me gusta.',
      kiss: 'Ven un poco más cerca.',
      blush: 'Bien. Ahora sí me hiciste sonreír.'
    };
    const femaleLines: Record<VoiceMood, string> = {
      trap: 'Mmm... este reto tiene algo travieso. Yo te acompaño.',
      collision: 'Te alcancé... acércate un poquito.',
      bold: 'Este reto es atrevido... vamos despacio.',
      kiss: 'Acércate un poquito... ¿sí?',
      blush: 'Me estás haciendo sonrojar... de verdad.'
    };
    return isMale ? maleLines[mood] : femaleLines[mood];
  }

  const maleLines: Record<VoiceMood, string> = {
    trap: 'Well, that escalated quickly. I am in.',
    collision: 'Caught you, troublemaker.',
    bold: 'That is bold. Good thing I like a challenge.',
    kiss: 'Come here, heartbreaker.',
    blush: 'Okay, you win. I am definitely blushing.'
  };
  const femaleLines: Record<VoiceMood, string> = {
    trap: 'This one is a little naughty. I am with you.',
    collision: 'I caught you. Come a little closer.',
    bold: 'This one is bold. We can take it slow.',
    kiss: 'Come a little closer, okay?',
    blush: 'You are making me blush for real.'
  };
  return isMale ? maleLines[mood] : femaleLines[mood];
}

function voiceScore(voice: SpeechSynthesisVoice, preferredNames: string[], locale: TaskEventData['locale']) {
  const name = voice.name.toLowerCase();
  const lang = voice.lang.toLowerCase();
  const languagePrefix = locale === 'zh' ? 'zh' : 'en';

  if (!lang.startsWith(languagePrefix)) return -1;

  let score = 0;
  if (preferredNames.some(item => name.includes(item))) score += 40;
  if (name.includes('siri') || name.includes('premium') || name.includes('enhanced')) score += 18;
  if (name.includes('natural') || name.includes('neural')) score += 18;
  if (voice.localService) score += 4;
  if (name.includes('compact')) score -= 20;

  return score;
}

function selectBestVoice(
  voices: SpeechSynthesisVoice[],
  preferredNames: string[],
  locale: TaskEventData['locale']
) {
  return voices
    .map(voice => ({ voice, score: voiceScore(voice, preferredNames, locale) }))
    .filter(item => item.score >= 0)
    .sort((a, b) => b.score - a.score)[0]?.voice || null;
}

function speakLine(line: string, playerId: number, locale: TaskEventData['locale'], didRetry = false) {
  if (!('speechSynthesis' in window)) return;

  const now = Date.now();
  if (now - lastSpokenAt < 900) return;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length && !didRetry) {
    window.setTimeout(() => speakLine(line, playerId, locale, true), 160);
    return;
  }

  lastSpokenAt = now;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(line);
  const preferredNames =
    locale === 'zh'
      ? playerId === 0
        ? ['yunyang', 'kangkang', 'male', '男']
        : ['tingting', 'huihui', 'xiaoxiao', 'yaoyao', 'meijia', 'mei-jia', 'female', '女']
      : playerId === 0
        ? ['alex', 'daniel', 'arthur', 'david', 'mark', 'guy', 'fred', 'rishi']
        : ['samantha', 'karen', 'moira', 'zira', 'victoria', 'fiona', 'ava', 'serena', 'allison', 'susan'];
  const selectedVoice = selectBestVoice(voices, preferredNames, locale);
  const isFemale = playerId === 1;

  utterance.voice = selectedVoice;
  utterance.lang = locale === 'zh' ? 'zh-CN' : locale === 'es' ? 'es-US' : 'en-US';
  utterance.rate = locale === 'zh' ? (isFemale ? 0.82 : 0.86) : locale === 'es' ? (isFemale ? 0.88 : 0.9) : (isFemale ? 0.9 : 0.92);
  utterance.pitch = isFemale ? 1.03 : 0.92;
  utterance.volume = isFemale ? 0.68 : 0.72;
  window.speechSynthesis.speak(utterance);
}

export function unlockCharacterVoice(locale: TaskEventData['locale']) {
  void resumeSharedAudioContext();
  if (!ENABLE_SYSTEM_TTS_FALLBACK || !('speechSynthesis' in window)) return;

  window.speechSynthesis.resume();
  const primer = new SpeechSynthesisUtterance('');
  primer.lang = locale === 'zh' ? 'zh-CN' : locale === 'es' ? 'es-US' : 'en-US';
  primer.volume = 0.01;
  window.speechSynthesis.speak(primer);
}

export function playCharacterVoice(taskData: TaskEventData) {
  playCueTone(taskData.type);
  const mood = moodForTask(taskData);
  void playLocalVoiceClip(
    taskData.locale,
    taskData.initiatorPlayerId,
    `task-${mood}`
  ).then(didPlayLocalVoice => {
    if (!didPlayLocalVoice && ENABLE_SYSTEM_TTS_FALLBACK) {
      speakLine(lineForTask(taskData), taskData.initiatorPlayerId, taskData.locale);
    }
  });
}

export function playDiceReactionVoice(line: string, playerId: number, locale: TaskEventData['locale']) {
  if (locale === 'zh') {
    playCueTone('lucky');
  }
  const clipId = diceLineIds[line] ? `dice-${diceLineIds[line]}` : null;
  if (!clipId) {
    if (ENABLE_SYSTEM_TTS_FALLBACK) {
      speakLine(line, playerId, locale);
    }
    return;
  }

  void playLocalVoiceClip(locale, playerId, clipId).then(didPlayLocalVoice => {
    if (!didPlayLocalVoice && ENABLE_SYSTEM_TTS_FALLBACK) {
      speakLine(line, playerId, locale);
    }
  });
}

export function stopCharacterVoice() {
  if (activeLocalVoice) {
    try {
      activeLocalVoice.stop();
    } catch {
      // The source may already have ended.
    }
    activeLocalVoice = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
