type MotionWithPermission = typeof DeviceMotionEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

export async function requestShakePermission(): Promise<boolean> {
  const motion = window.DeviceMotionEvent as MotionWithPermission | undefined;
  if (!motion) return false;
  if (typeof motion.requestPermission !== 'function') return true;
  try {
    return await motion.requestPermission() === 'granted';
  } catch {
    return false;
  }
}

export function listenForShake(onShake: () => void): () => void {
  let firstPeak = 0;
  let lastPeak = 0;
  let peakCount = 0;
  let gravity: [number, number, number] | null = null;
  let active = true;
  const onMotion = (event: DeviceMotionEvent) => {
    if (!active) return;
    const acceleration = event.acceleration;
    let force = 0;
    if (acceleration?.x != null && acceleration.y != null && acceleration.z != null) {
      force = Math.hypot(acceleration.x, acceleration.y, acceleration.z);
    } else {
      const raw = event.accelerationIncludingGravity;
      if (raw?.x == null || raw.y == null || raw.z == null) return;
      const vector: [number, number, number] = [raw.x, raw.y, raw.z];
      if (!gravity) { gravity = vector; return; }
      gravity = gravity.map((value, index) => value * 0.85 + vector[index] * 0.15) as [number, number, number];
      force = Math.hypot(...vector.map((value, index) => value - gravity![index]));
    }
    if (force < 10) return;
    const now = Date.now();
    if (now - lastPeak < 180) return;
    lastPeak = now;
    if (now - firstPeak > 1200) { firstPeak = now; peakCount = 0; }
    peakCount += 1;
    if (peakCount >= 2) {
      active = false;
      window.removeEventListener('devicemotion', onMotion);
      onShake();
    }
  };
  window.addEventListener('devicemotion', onMotion);
  return () => {
    active = false;
    window.removeEventListener('devicemotion', onMotion);
  };
}
