import { getSharedAudioContext, resumeSharedAudioContext } from './audioSession';

function createNoiseBuffer(context: AudioContext, duration: number) {
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function scheduleClack(
  context: AudioContext,
  destination: AudioNode,
  noise: AudioBuffer,
  start: number,
  volume: number,
  pitch: number
) {
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = noise;
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(pitch, start);
  filter.Q.value = 1.6;
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.055);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(start);
  source.stop(start + 0.07);
}

export function playDiceSequence() {
  const context = getSharedAudioContext();
  if (!context) return;
  void resumeSharedAudioContext();

  const master = context.createGain();
  const noise = createNoiseBuffer(context, 0.08);
  master.gain.value = 0.28;
  master.connect(context.destination);

  const now = context.currentTime + 0.015;
  [0, 0.1, 0.19, 0.29, 0.38, 0.5, 0.62, 0.74, 0.84].forEach((offset, index) => {
    scheduleClack(context, master, noise, now + offset, 0.18 - index * 0.009, 1050 + Math.random() * 1500);
  });

  const impactAt = now + 1;
  const thump = context.createOscillator();
  const thumpGain = context.createGain();
  thump.type = 'sine';
  thump.frequency.setValueAtTime(115, impactAt);
  thump.frequency.exponentialRampToValueAtTime(48, impactAt + 0.14);
  thumpGain.gain.setValueAtTime(0.22, impactAt);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, impactAt + 0.2);
  thump.connect(thumpGain);
  thumpGain.connect(master);
  thump.start(impactAt);
  thump.stop(impactAt + 0.22);
  scheduleClack(context, master, noise, impactAt, 0.34, 1850);
  scheduleClack(context, master, noise, impactAt + 0.045, 0.18, 2650);

}
