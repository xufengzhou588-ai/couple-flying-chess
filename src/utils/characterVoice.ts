import { TaskEventData } from '../types';
import { getSharedAudioContext, resumeSharedAudioContext } from './audioSession';

let lastSpokenAt = 0;

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
      trap: '哎呀，这张有点坏哦。',
      collision: '被我抓到了吧。',
      bold: '嗯，这张我可不会装害羞。',
      kiss: '再靠近一点嘛。',
      blush: '讨厌，你把我弄脸红了。'
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
    trap: 'Oh, this card woke up and chose chaos.',
    collision: 'Got you, handsome. No refunds.',
    bold: 'Well, look who is feeling brave tonight.',
    kiss: 'Come closer. I promise to be mostly good.',
    blush: 'Cute. You really thought I would not blush.'
  };
  return isMale ? maleLines[mood] : femaleLines[mood];
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
        : ['tingting', 'huihui', 'female', '女']
      : playerId === 0
        ? ['alex', 'daniel', 'arthur', 'david', 'mark', 'guy', 'fred', 'rishi']
        : ['samantha', 'karen', 'moira', 'zira', 'victoria', 'fiona', 'ava', 'serena'];
  const preferredVoice = voices.find(voice => {
    const name = voice.name.toLowerCase();
    const languageMatches = voice.lang.toLowerCase().startsWith(locale === 'zh' ? 'zh' : 'en');
    return languageMatches && preferredNames.some(item => name.includes(item));
  });
  const languageFallback = voices.find(voice =>
    voice.lang.toLowerCase().startsWith(locale === 'zh' ? 'zh' : 'en')
  );

  utterance.voice = preferredVoice || languageFallback || null;
  utterance.lang = locale === 'zh' ? 'zh-CN' : 'en-US';
  utterance.rate = playerId === 0 ? 0.84 : 0.88;
  utterance.pitch = preferredVoice ? 1 : playerId === 0 ? 0.72 : 1.22;
  utterance.volume = 0.72;
  window.speechSynthesis.speak(utterance);
}

export function unlockCharacterVoice(locale: TaskEventData['locale']) {
  void resumeSharedAudioContext();
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.resume();
  const primer = new SpeechSynthesisUtterance('');
  primer.lang = locale === 'zh' ? 'zh-CN' : 'en-US';
  primer.volume = 0.01;
  window.speechSynthesis.speak(primer);
}

export function playCharacterVoice(taskData: TaskEventData) {
  playCueTone(taskData.type);
  speakLine(lineForTask(taskData), taskData.initiatorPlayerId, taskData.locale);
}

export function playDiceReactionVoice(line: string, playerId: number, locale: TaskEventData['locale']) {
  if (locale === 'zh') {
    playCueTone('lucky');
  }
  speakLine(line, playerId, locale);
}

export function stopCharacterVoice() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
