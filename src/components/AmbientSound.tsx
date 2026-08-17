import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, VolumeX } from 'lucide-react';
import { Translation } from '../i18n';
import { getSharedAudioContext, resumeSharedAudioContext, unlockSharedAudioContext } from '../utils/audioSession';

type AmbientNodes = {
  context: AudioContext;
  master: GainNode;
  scheduler: number;
};

const CHORDS = [
  [220, 261.63, 329.63, 392],
  [174.61, 220, 261.63, 329.63],
  [196, 246.94, 293.66, 369.99],
  [164.81, 207.65, 246.94, 329.63]
];

function createNoiseBuffer(context: AudioContext, duration: number) {
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function createRoomImpulse(context: AudioContext) {
  const duration = 1.8;
  const impulse = context.createBuffer(2, context.sampleRate * duration, context.sampleRate);

  for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.8);
    }
  }

  return impulse;
}

function scheduleTone(
  context: AudioContext,
  output: AudioNode,
  frequency: number,
  start: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'sine'
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.detune.setValueAtTime((Math.random() - 0.5) * 5, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.08, duration * 0.2));
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(output);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
}

function scheduleBrush(
  context: AudioContext,
  output: AudioNode,
  buffer: AudioBuffer,
  start: number,
  volume: number
) {
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  source.buffer = buffer;
  filter.type = 'bandpass';
  filter.frequency.value = 3200;
  filter.Q.value = 0.65;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(output);
  source.start(start);
  source.stop(start + 0.22);
}

function scheduleHeartbeat(context: AudioContext, output: AudioNode, start: number) {
  for (const [index, offset] of [0, 0.17].entries()) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(index === 0 ? 58 : 48, start + offset);
    oscillator.frequency.exponentialRampToValueAtTime(34, start + offset + 0.14);
    gain.gain.setValueAtTime(0.0001, start + offset);
    gain.gain.exponentialRampToValueAtTime(index === 0 ? 0.075 : 0.045, start + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + offset + 0.17);
    oscillator.connect(gain);
    gain.connect(output);
    oscillator.start(start + offset);
    oscillator.stop(start + offset + 0.19);
  }
}

function createAmbientNodes(): AmbientNodes {
  const context = getSharedAudioContext();
  if (!context) throw new Error('Web Audio is not supported in this browser.');
  const master = context.createGain();
  const compressor = context.createDynamicsCompressor();
  const warmth = context.createBiquadFilter();
  const reverb = context.createConvolver();
  const reverbGain = context.createGain();
  const dryGain = context.createGain();
  const brushBuffer = createNoiseBuffer(context, 0.24);

  master.gain.value = 0.42;
  warmth.type = 'lowpass';
  warmth.frequency.value = 4600;
  warmth.Q.value = 0.35;
  compressor.threshold.value = -24;
  compressor.knee.value = 18;
  compressor.ratio.value = 4;
  compressor.attack.value = 0.04;
  compressor.release.value = 0.45;
  reverb.buffer = createRoomImpulse(context);
  reverbGain.gain.value = 0.24;
  dryGain.gain.value = 0.72;

  warmth.connect(dryGain);
  warmth.connect(reverb);
  reverb.connect(reverbGain);
  dryGain.connect(compressor);
  reverbGain.connect(compressor);
  compressor.connect(master);
  master.connect(context.destination);

  let bar = 0;
  let nextBarAt = context.currentTime + 0.08;
  const barDuration = 4.8;

  const scheduleBar = () => {
    while (nextBarAt < context.currentTime + 7) {
      const chord = CHORDS[bar % CHORDS.length];
      const start = nextBarAt;

      chord.forEach((note, index) => {
        scheduleTone(context, warmth, note, start, 4.4, index === 0 ? 0.022 : 0.014, 'sine');
        scheduleTone(context, warmth, note * 2, start + 0.02, 2.8, 0.005, 'triangle');
      });

      scheduleTone(context, warmth, chord[0] / 2, start, 1.15, 0.055, 'sine');
      scheduleTone(context, warmth, chord[0] / 2, start + 2.4, 1.05, 0.038, 'sine');

      [0.6, 1.8, 3, 4.2].forEach((offset, index) => {
        scheduleTone(
          context,
          warmth,
          chord[(index + 1) % chord.length] * 2,
          start + offset,
          0.52,
          0.018,
          'triangle'
        );
      });

      [1.2, 2.4, 3.6].forEach(offset => {
        scheduleBrush(context, warmth, brushBuffer, start + offset, 0.018);
      });

      if (bar % 2 === 1) scheduleHeartbeat(context, warmth, start + 3.72);
      nextBarAt += barDuration;
      bar += 1;
    }
  };

  scheduleBar();
  const scheduler = window.setInterval(scheduleBar, 1600);
  return { context, master, scheduler };
}

export function AmbientSound({ copy, inGame = false }: { copy: Translation; inGame?: boolean }) {
  const [enabled, setEnabled] = useState(false);
  const nodesRef = useRef<AmbientNodes | null>(null);

  useEffect(() => {
    const resumeWhenVisible = () => {
      if (!document.hidden && nodesRef.current) {
        void resumeSharedAudioContext();
      }
    };
    const resumeOnGesture = () => {
      if (nodesRef.current) void resumeSharedAudioContext();
    };

    document.addEventListener('visibilitychange', resumeWhenVisible);
    window.addEventListener('pointerdown', resumeOnGesture, { passive: true });

    return () => {
      document.removeEventListener('visibilitychange', resumeWhenVisible);
      window.removeEventListener('pointerdown', resumeOnGesture);
      if (!nodesRef.current) return;
      window.clearInterval(nodesRef.current.scheduler);
      nodesRef.current.master.disconnect();
    };
  }, []);

  const stop = () => {
    const nodes = nodesRef.current;
    if (!nodes) return;

    window.clearInterval(nodes.scheduler);
    nodes.master.gain.setTargetAtTime(0.0001, nodes.context.currentTime, 0.08);
    window.setTimeout(() => nodes.master.disconnect(), 260);
    nodesRef.current = null;
    setEnabled(false);
  };

  const start = async () => {
    if (nodesRef.current) return;
    await unlockSharedAudioContext();
    const nodes = createAmbientNodes();
    nodesRef.current = nodes;
    setEnabled(true);
  };

  const button = (
    <button
      type="button"
      className={`flex h-9 w-9 items-center justify-center rounded-2xl border transition active:scale-95 ${
        inGame ? 'fixed left-4 bottom-[calc(env(safe-area-inset-bottom)+172px)] z-[80] shadow-2xl backdrop-blur-xl' : ''
      } ${
        enabled
          ? 'border-amber-100/40 bg-amber-100 text-[#2b1305] shadow-[0_0_22px_rgba(251,191,36,0.32)]'
          : 'border-white/15 bg-white/10 text-white/72'
      }`}
      onClick={() => (enabled ? stop() : void start())}
      aria-label={enabled ? copy.soundOn : copy.soundOff}
      title={enabled ? copy.soundOn : copy.soundOff}
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );

  return inGame ? createPortal(button, document.body) : button;
}
