import { TileType, PathCoord } from '../types';

const GRID_SIZE = 7;
const TILES_COUNT = 49;

export const FIXED_BOARD_MAP: TileType[] = [
  'blank',
  'lucky',
  'trap',
  'blank',
  'lucky',
  'trap',
  'lucky',
  'blank',
  'trap',
  'lucky',
  'blank',
  'trap',
  'lucky',
  'trap',
  'blank',
  'lucky',
  'trap',
  'lucky',
  'blank',
  'trap',
  'lucky',
  'blank',
  'trap',
  'lucky',
  'trap',
  'blank',
  'lucky',
  'trap',
  'blank',
  'lucky',
  'trap',
  'lucky',
  'blank',
  'trap',
  'lucky',
  'trap',
  'blank',
  'lucky',
  'trap',
  'blank',
  'lucky',
  'trap',
  'lucky',
  'blank',
  'trap',
  'lucky',
  'trap',
  'blank',
  'blank'
];

export function generateSpiralPath(): PathCoord[] {
  const path: PathCoord[] = [];
  let r = 0, c = 0, dr = 0, dc = 1;
  const visited: boolean[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));

  for (let i = 0; i < TILES_COUNT; i++) {
    path[i] = { r, c };
    visited[r][c] = true;

    const nr = r + dr;
    const nc = c + dc;

    if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE && !visited[nr][nc]) {
      r = nr;
      c = nc;
    } else {
      if (dr === 0 && dc === 1) { dr = 1; dc = 0; }
      else if (dr === 1 && dc === 0) { dr = 0; dc = -1; }
      else if (dr === 0 && dc === -1) { dr = -1; dc = 0; }
      else if (dr === -1 && dc === 0) { dr = 0; dc = 1; }
      r += dr;
      c += dc;
    }
  }

  return path;
}

export function generateBoardMap(): TileType[] {
  return [...FIXED_BOARD_MAP];
}

export function calculateNewPosition(current: number, steps: number): number {
  let target = current + steps;

  if (target >= 48) {
    target = 48 - (target - 48);
  }

  return target;
}

export function rollDice(): number {
  // A slower 1-4 pace keeps a full date-length game without changing the board art.
  const dateNightRolls = [1, 2, 2, 3, 3, 4];
  return dateNightRolls[Math.floor(Math.random() * dateNightRolls.length)];
}
