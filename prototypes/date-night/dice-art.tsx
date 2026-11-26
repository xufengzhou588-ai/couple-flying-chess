import actionSheet from './assets/chemistry-actions-velvet.png';
import femaleParts from './assets/chemistry-parts-female-velvet.png';
import maleParts from './assets/chemistry-parts-male-velvet.png';

export type DicePart = 'hand' | 'cheek' | 'forehead' | 'shoulder' | 'forearm' | 'upper-back' | 'neck' | 'waist' | 'lips';
export type PortraitRole = 'man' | 'woman';

const actionCells: Record<string, number> = {
  trace: 2,
  brush: 3,
  hold: 4,
  massage: 5,
  heart: 6,
};

const partCells: Record<DicePart, number> = {
  hand: 0,
  cheek: 1,
  forehead: 2,
  shoulder: 3,
  forearm: 4,
  'upper-back': 5,
  neck: 6,
  waist: 7,
  lips: 8,
};

function Sprite({ image, columns, rows, cell, kind }: { image: string; columns: number; rows: number; cell: number; kind: string }) {
  const column = cell % columns;
  const row = Math.floor(cell / columns);
  return <span
    aria-hidden="true"
    className={`dice-art-sprite dice-art-${kind}`}
    data-art-cell={cell}
    style={{
      backgroundImage: `url(${image})`,
      backgroundSize: `${columns * 100}% ${rows * 100}%`,
      backgroundPosition: `${column * 100 / (columns - 1)}% ${row * 100 / (rows - 1)}%`,
    }}
  />;
}

export function ActionGlyph({ action, actorRole }: { action: string | null; actorRole: PortraitRole }) {
  const cell = action === null ? 7 : action === 'kiss' ? actorRole === 'man' ? 0 : 1 : actionCells[action];
  return <Sprite image={actionSheet} columns={4} rows={2} cell={cell ?? 7} kind="action" />;
}

export function BodyGlyph({ part, recipientRole }: { part: DicePart | null; recipientRole: PortraitRole }) {
  if (!part) return <span className="dice-art-sealed" aria-hidden="true">?</span>;
  return <Sprite image={recipientRole === 'man' ? maleParts : femaleParts} columns={3} rows={3} cell={partCells[part]} kind="part" />;
}
