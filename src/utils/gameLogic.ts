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
  // Every playable stop belongs to one partner. The original map supplies the
  // rhythm; previously neutral stops alternate between her pink and his gold.
  return FIXED_BOARD_MAP.map((tile, step) =>
    step > 0 && step < 48 && tile === 'blank'
      ? (step % 2 === 0 ? 'trap' : 'lucky')
      : tile
  );
}

// TileType retains its stored identifiers; on the board lucky is pink/her and
// trap is gold/him. Whether a landing is lucky depends on who is rolling.
export function boardTileOwner(tile: TileType): 0 | 1 | null {
  return tile === 'lucky' ? 1 : tile === 'trap' ? 0 : null;
}

export function calculateNewPosition(current: number, steps: number): number {
  let target = current + steps;

  if (target >= 48) {
    target = 48 - (target - 48);
  }

  return target;
}

export function rollDice(): number {
  // The six visible die faces are equally likely, so numbered spaces can be
  // used to plan a landing without the result being chosen by the player.
  return Math.floor(Math.random() * 6) + 1;
}
