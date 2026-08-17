export interface BoardPoint {
  x: number;
  y: number;
  angle: number;
}

interface SpiralSample {
  x: number;
  y: number;
  distance: number;
}

const BOARD_CENTER = 50;
const OUTER_RADIUS = 39;
const TOTAL_ROTATION = Math.PI * 2 * 3.6;
const START_ANGLE = Math.PI / 2;
const BOARD_STEPS = 48;
const SAMPLE_COUNT = 1200;

function createSpiralSamples(): SpiralSample[] {
  const samples: SpiralSample[] = [];
  let distance = 0;

  for (let index = 0; index <= SAMPLE_COUNT; index += 1) {
    const progress = index / SAMPLE_COUNT;
    const radius = OUTER_RADIUS * (1 - progress);
    const angle = START_ANGLE + progress * TOTAL_ROTATION;
    const x = BOARD_CENTER + Math.cos(angle) * radius;
    const y = BOARD_CENTER + Math.sin(angle) * radius;
    const previous = samples[index - 1];

    if (previous) {
      distance += Math.hypot(x - previous.x, y - previous.y);
    }

    samples.push({ x, y, distance });
  }

  return samples;
}

function sampleAtDistance(samples: SpiralSample[], target: number): BoardPoint {
  let low = 0;
  let high = samples.length - 1;

  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (samples[middle].distance < target) low = middle + 1;
    else high = middle;
  }

  const after = samples[low];
  const before = samples[Math.max(0, low - 1)];
  const span = Math.max(after.distance - before.distance, Number.EPSILON);
  const amount = Math.max(0, Math.min(1, (target - before.distance) / span));
  const x = before.x + (after.x - before.x) * amount;
  const y = before.y + (after.y - before.y) * amount;

  return {
    x,
    y,
    angle: Math.atan2(after.y - before.y, after.x - before.x)
  };
}

const spiralSamples = createSpiralSamples();
const totalDistance = spiralSamples[spiralSamples.length - 1].distance;

export const BOARD_POINTS: BoardPoint[] = Array.from(
  { length: BOARD_STEPS + 1 },
  (_, step) => sampleAtDistance(spiralSamples, totalDistance * (step / BOARD_STEPS))
);

export const BOARD_PATH_D = spiralSamples
  .filter((_, index) => index % 4 === 0 || index === spiralSamples.length - 1)
  .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(3)} ${point.y.toFixed(3)}`)
  .join(' ');

export function getBoardPoint(step: number): BoardPoint {
  const safeStep = Math.max(0, Math.min(BOARD_STEPS, Math.round(step)));
  return BOARD_POINTS[safeStep];
}
