export type DicePart = 'hand' | 'cheek' | 'forehead' | 'shoulder' | 'forearm' | 'upper-back' | 'neck' | 'waist' | 'lips';

function TinyHeart({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <path className="dice-art-heart" transform={`translate(${x} ${y}) scale(${scale})`} d="M0 8 C-15 -2 -7 -12 0 -5 C7 -12 15 -2 0 8Z" />;
}

export function ActionGlyph({ action }: { action: string | null }) {
  return <svg viewBox="0 0 96 96" aria-hidden="true" focusable="false">
    <path className="dice-art-ground" d="M12 82 H84" />
    <g className="dice-art-person">
      <circle cx={action === 'kiss' ? 34 : 30} cy="29" r="10" />
      <path d="M20 46 Q29 40 39 46 L44 79 H17Z" />
      <circle cx={action === 'kiss' ? 61 : 66} cy="29" r="10" />
      <path d="M56 46 Q65 40 76 46 L80 79 H52Z" />
    </g>
    {action === null && <><path className="dice-art-gesture" d="M35 61 Q48 48 61 61" /><TinyHeart x={48} y={44} scale={0.66} /></>}
    {action === 'kiss' && <><path className="dice-art-gesture" d="M43 38 Q48 42 52 38" /><TinyHeart x={48} y={21} scale={0.64} /></>}
    {action === 'trace' && <><path className="dice-art-arm" d="M35 52 Q44 48 52 55" /><path className="dice-art-gesture" d="M55 49 Q72 54 63 69" strokeDasharray="2 4" /><circle className="dice-art-spark" cx="64" cy="68" r="3" /></>}
    {action === 'brush' && <><path className="dice-art-arm" d="M35 55 Q47 44 59 48" /><path className="dice-art-gesture" d="M58 42 Q72 35 81 42 M61 49 Q77 43 84 50" /><circle className="dice-art-spark" cx="74" cy="36" r="2.5" /></>}
    {action === 'hold' && <><path className="dice-art-arm" d="M36 56 Q43 62 48 63 Q54 62 60 56" /><TinyHeart x={48} y={58} scale={0.48} /></>}
    {action === 'massage' && <><path className="dice-art-arm" d="M34 52 Q45 42 57 52 M38 57 Q48 49 61 56" /><path className="dice-art-gesture" d="M55 40 L58 35 M62 41 L67 37 M68 46 L74 44" /></>}
    {action === 'heart' && <><path className="dice-art-arm" d="M35 58 Q44 48 50 50" /><TinyHeart x={63} y={47} scale={0.9} /><path className="dice-art-gesture" d="M48 48 Q52 39 56 38" strokeDasharray="2 4" /></>}
  </svg>;
}

const markerByPart: Record<DicePart, [number, number]> = {
  hand: [13, 70], cheek: [58, 24], forehead: [48, 14], shoulder: [67, 43], forearm: [25, 59],
  'upper-back': [53, 54], neck: [48, 36], waist: [59, 72], lips: [54, 29],
};

export function BodyGlyph({ part }: { part: DicePart | null }) {
  const marker = part ? markerByPart[part] : null;
  return <svg viewBox="0 0 96 96" aria-hidden="true" focusable="false">
    <path className="dice-art-figure" d="M48 8 C36 8 31 16 32 24 C33 34 39 39 48 39 C57 39 63 33 64 24 C65 16 60 8 48 8Z M37 41 C26 42 24 50 22 60 L13 78 M59 41 C70 42 72 50 74 60 L83 78 M37 42 Q42 56 39 78 L57 78 Q54 56 59 42 M39 78 L35 89 M57 78 L61 89" />
    <path className="dice-art-gesture" d="M34 45 Q48 50 62 45" />
    {marker && <><circle className="dice-art-glow" cx={marker[0]} cy={marker[1]} r="10" /><TinyHeart x={marker[0]} y={marker[1] - 2} scale={0.39} /></>}
    {!marker && <TinyHeart x={48} y={61} scale={0.6} />}
  </svg>;
}
