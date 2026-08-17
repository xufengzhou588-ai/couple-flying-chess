const enabled = (value: string | undefined) => value?.trim().toLowerCase() === 'true';

export const releaseFeatures = {
  premium: enabled(import.meta.env.VITE_ENABLE_PREMIUM),
  remoteVideo: enabled(import.meta.env.VITE_ENABLE_REMOTE_VIDEO)
} as const;

export const releaseTier = releaseFeatures.premium ? 'paid' : 'free';
