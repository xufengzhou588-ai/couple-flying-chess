import { unlockSharedAudioContext } from '../../src/utils/audioSession';
import { playMiniGameVoice } from '../../src/utils/characterVoice';
import type { MiniLocale } from './mini-i18n';

export type MiniVoiceClip = 'mini-start' | 'mini-turn' | 'mini-roll' | 'mini-spark' | 'mini-solved';

const fallback: Record<MiniLocale, Record<MiniVoiceClip, string>> = {
  en: { 'mini-start': 'Ready? Let’s play.', 'mini-turn': 'Your turn. Take your time.', 'mini-roll': 'Let’s see where the dice take us.', 'mini-spark': 'Now you’ve got my attention.', 'mini-solved': 'We make a good team.' },
  zh: { 'mini-start': '今晚就咱俩，来玩吧。', 'mini-turn': '到你啦，别急。', 'mini-roll': '来，掷一下。', 'mini-spark': '哦？这个我喜欢。', 'mini-solved': '咱俩还挺有默契。' },
  es: { 'mini-start': '¿Listos? Vamos a jugar.', 'mini-turn': 'Te toca. Tómate tu tiempo.', 'mini-roll': 'A ver adónde nos llevan los dados.', 'mini-spark': 'Ahora sí tienes toda mi atención.', 'mini-solved': 'Hacemos buen equipo.' }
};

export function playMiniVoice(locale: MiniLocale, playerId: number, clip: MiniVoiceClip) {
  playMiniGameVoice(clip, playerId, locale, fallback[locale][clip]);
}

export async function playMiniCue(kind: 'tap' | 'reveal' | 'success' = 'tap') {
  const context = await unlockSharedAudioContext();
  if (!context || context.state !== 'running') return;
  const notes = kind === 'tap' ? [660] : kind === 'success' ? [523, 659, 784] : [392, 523];
  const base = context.currentTime;
  notes.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = base + index * (kind === 'tap' ? 0 : 0.095);
    oscillator.type = kind === 'tap' ? 'sine' : 'triangle';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(kind === 'tap' ? 0.025 : 0.055, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + (kind === 'tap' ? 0.075 : 0.25));
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + (kind === 'tap' ? 0.085 : 0.27));
  });
}
