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
  if (context?.state === 'suspended') await context.resume();
  return context;
}
