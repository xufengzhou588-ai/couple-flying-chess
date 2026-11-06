let sharedContext: AudioContext | null = null;

function getAudioContextConstructor() {
  return (
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  );
}

export function getSharedAudioContext() {
  if (sharedContext?.state === 'closed') sharedContext = null;
  if (sharedContext) return sharedContext;

  const AudioContextConstructor = getAudioContextConstructor();
  if (!AudioContextConstructor) return null;

  sharedContext = new AudioContextConstructor();
  return sharedContext;
}

export async function resumeSharedAudioContext() {
  const context = getSharedAudioContext();
  if (!context) return null;

  if (context.state !== 'running') {
    try {
      // WebKit can leave resume() pending after an iOS interruption. Let callers
      // try their media/TTS fallback instead of reporting silent Web Audio as played.
      let timeoutId: number | undefined;
      try {
        await Promise.race([
          context.resume(),
          new Promise<void>(resolve => {
            timeoutId = window.setTimeout(resolve, 800);
          })
        ]);
      } finally {
        if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      }
    } catch {
      return null;
    }
  }

  return context.state === 'running' ? context : null;
}

export async function unlockSharedAudioContext() {
  const context = await resumeSharedAudioContext();
  if (!context || context.state !== 'running') return context;

  const source = context.createBufferSource();
  const gain = context.createGain();
  source.buffer = context.createBuffer(1, 1, context.sampleRate);
  gain.gain.value = 0.0001;
  source.connect(gain);
  gain.connect(context.destination);

  try {
    source.start();
    source.stop(context.currentTime + 0.01);
  } catch {
    // iOS can throw if the unlock pulse races with a previous gesture.
  }

  return context;
}
