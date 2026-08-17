import { Sparkles } from 'lucide-react';
import { BOARD_PATH_D, BOARD_POINTS, getBoardPoint } from '../config/boardLayout';
import { Translation } from '../i18n';
import { DiceReactionData, Player, TileType } from '../types';
import { assetPath } from '../utils/assets';
import { CharacterToken } from './CharacterToken';

interface GameBoardProps {
  boardMap: TileType[];
  players: Player[];
  currentTurn: number;
  copy: Translation;
  reaction: DiceReactionData | null;
}

function getTokenPoint(player: Player, players: Player[]) {
  const point = getBoardPoint(player.step);
  const playersOnSameTile = players.filter(item => item.step === player.step);
  const indexOnTile = playersOnSameTile.findIndex(item => item.id === player.id);

  if (playersOnSameTile.length < 2) return point;

  const direction = indexOnTile === 0 ? -1 : 1;

  // Keep both players readable at the shared start without covering the flag.
  if (player.step === 0) {
    return {
      ...point,
      x: 50 + direction * 4.7,
      y: 91.25
    };
  }

  const offset = 2.75 * direction;
  return {
    ...point,
    x: point.x + Math.cos(point.angle) * offset,
    y: point.y + Math.sin(point.angle) * offset
  };
}

function TileGlyph({ type, outlined = false }: { type: TileType; outlined?: boolean }) {
  if (type === 'lucky') {
    const path = 'M 0 1.45 C -0.4 1.08 -1.7 0.28 -1.7 -0.72 C -1.7 -1.72 -0.48 -1.95 0 -1.05 C 0.48 -1.95 1.7 -1.72 1.7 -0.72 C 1.7 0.28 0.4 1.08 0 1.45 Z';
    return outlined ? (
      <path d={path} fill="none" stroke="currentColor" strokeWidth="0.46" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d={path} fill="currentColor" />
    );
  }

  if (type === 'trap') {
    const path = 'M 0 -1.75 C 1.18 -0.68 1.55 0.38 1.02 1.22 C 0.48 2.04 -0.52 2.04 -1.05 1.2 C -1.58 0.38 -1.2 -0.55 -0.32 -1.28 C -0.42 -0.45 0.02 -0.02 0.35 0.42 C 0.7 -0.38 0.48 -1.02 0 -1.75 Z';
    return outlined ? (
      <path d={path} fill="none" stroke="currentColor" strokeWidth="0.46" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d={path} fill="currentColor" />
    );
  }

  return <circle r="0.52" fill="currentColor" />;
}

function BoardTileMarker({ type }: { type: TileType }) {
  const accent = type === 'lucky' ? '#f08aa8' : type === 'trap' ? '#e7b45a' : '#d8bc83';

  if (type === 'blank') {
    return (
      <g>
        <circle r="1.12" fill="rgba(20,10,16,0.92)" stroke="rgba(243,215,155,0.68)" strokeWidth="0.34" />
        <circle r="0.38" fill="#e9c982" />
      </g>
    );
  }

  return (
    <g color={accent}>
      <circle r="1.92" fill="rgba(22,10,17,0.94)" stroke="currentColor" strokeWidth="0.46" />
      <circle r="1.53" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="0.22" />
      <g transform="scale(0.78)">
        <TileGlyph type={type} outlined />
      </g>
    </g>
  );
}

export function GameBoard({
  boardMap,
  players,
  currentTurn,
  copy,
  reaction
}: GameBoardProps) {
  return (
    <div className="responsive-board relative aspect-square shrink-0" aria-label={copy.routeName}>
      <div className="board-aura absolute inset-[-4%] rounded-[12%] bg-[radial-gradient(circle_at_50%_48%,rgba(248,211,138,0.18),transparent_48%),radial-gradient(circle_at_20%_80%,rgba(255,111,154,0.13),transparent_38%)] blur-xl" />

      <div className="board-surface absolute inset-0 overflow-hidden border border-amber-100/30 bg-[#160b12]">
        <img
          src={assetPath('assets/romance-board-table-v2.jpg')}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(75,15,32,0.08),rgba(5,3,7,0.24)_88%)]" />

        <svg
          className="board-route absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          role="img"
          aria-label={copy.routeName}
        >
          <defs>
            <linearGradient id="board-track" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#7f4924" />
              <stop offset="0.34" stopColor="#f3cf82" />
              <stop offset="0.68" stopColor="#9f5c2a" />
              <stop offset="1" stopColor="#f8d995" />
            </linearGradient>
            <radialGradient id="board-finish" cx="38%" cy="28%" r="72%">
              <stop offset="0" stopColor="#fff5c7" />
              <stop offset="0.52" stopColor="#e8bd61" />
              <stop offset="1" stopColor="#8d501d" />
            </radialGradient>
            <filter id="board-track-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0.8" stdDeviation="1.2" floodColor="#000" floodOpacity="0.62" />
            </filter>
            <filter id="board-tile-glow" x="-80%" y="-80%" width="260%" height="260%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.05" floodColor="currentColor" floodOpacity="0.48" />
            </filter>
          </defs>

          <path
            d={BOARD_PATH_D}
            fill="none"
            stroke="rgba(10,4,8,0.78)"
            strokeWidth="7.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#board-track-shadow)"
          />
          <path
            d={BOARD_PATH_D}
            fill="none"
            stroke="url(#board-track)"
            strokeWidth="5.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={BOARD_PATH_D}
            fill="none"
            stroke="rgba(39,9,20,0.9)"
            strokeWidth="4.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={BOARD_PATH_D}
            fill="none"
            stroke="rgba(255,235,190,0.28)"
            strokeWidth="0.36"
            strokeLinecap="round"
            strokeDasharray="0.8 1.7"
          />

          {BOARD_POINTS.map((point, step) => {
            const type = boardMap[step] ?? 'blank';
            const isStart = step === 0;
            const isFinish = step === BOARD_POINTS.length - 1;
            const radius = isFinish ? 4.2 : 3.25;
            const fill = isFinish ? 'url(#board-finish)' : '#8ad7ff';
            const iconColor = isFinish ? '#401306' : '#071521';

            return (
              <g
                key={step}
                transform={`translate(${point.x} ${point.y})`}
                color={type === 'lucky' ? '#ff7fa7' : type === 'trap' ? '#f2bd57' : '#e7c987'}
                filter={isStart || isFinish ? 'url(#board-tile-glow)' : undefined}
              >
                {isStart || isFinish ? (
                  <>
                    <circle r={radius + 0.45} fill="rgba(4,2,5,0.7)" />
                    <circle
                      r={radius}
                      fill={fill}
                      stroke={isStart ? '#dff7ff' : '#f8ddb0'}
                      strokeWidth={isFinish ? 0.68 : 0.4}
                    />
                    <circle r={radius - 0.72} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.25" />

                    {isFinish ? (
                      <g fill={iconColor}>
                        <path d="M -1.55 -1.75 H 1.55 V -0.35 C 1.55 0.92 0.78 1.68 0 1.68 C -0.78 1.68 -1.55 0.92 -1.55 -0.35 Z" />
                        <path d="M -0.35 1.25 H 0.35 V 2.15 H -0.35 Z M -1.2 2.05 H 1.2 V 2.55 H -1.2 Z" />
                        <path d="M -1.5 -1.25 C -2.45 -1.25 -2.45 0.45 -1.2 0.65 M 1.5 -1.25 C 2.45 -1.25 2.45 0.45 1.2 0.65" fill="none" stroke={iconColor} strokeWidth="0.48" />
                      </g>
                    ) : (
                      <g fill={iconColor}>
                        <path d="M -0.9 -2.05 H -0.35 V 2.1 H -0.9 Z" />
                        <path d="M -0.32 -1.92 L 1.72 -1.32 L -0.32 -0.65 Z" />
                      </g>
                    )}
                  </>
                ) : (
                  <BoardTileMarker type={type} />
                )}
              </g>
            );
          })}
        </svg>

        <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        {players.map(player => {
          const point = getTokenPoint(player, players);
          const isActive = player.id === currentTurn;
          const playerReaction = reaction?.playerId === player.id ? reaction : null;
          const currentTile = boardMap[player.step];
          const mood = playerReaction
            ? playerReaction.mood
            : isActive && currentTile === 'lucky'
              ? 'heart'
              : isActive && currentTile === 'trap'
                ? 'spicy'
                : isActive
                  ? 'tease'
                  : 'idle';

          return (
            <div
              key={player.id}
              className={`board-player-token absolute z-30 flex items-center justify-center transition-all duration-500 ease-out ${
                isActive ? 'avatar-pulse' : ''
              } ${playerReaction?.result === 4 ? 'character-celebrate' : ''} ${
                playerReaction?.result === 1 ? 'character-grumble' : ''
              }`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '8.4%',
                height: '8.4%'
              }}
            >
              <CharacterToken player={player} active={isActive} mood={mood} size="board" />
            </div>
          );
        })}
      </div>

      <div className="board-route-label absolute left-[5%] top-[5%] z-20 rounded-full border border-[var(--cfc-border)] bg-black/38 px-2.5 py-1.5 text-[10px] font-black text-white/82 backdrop-blur-md">
        <span className="inline-flex items-center gap-1">
          <Sparkles size={12} className="text-[var(--cfc-amber)]" />
          {copy.routeName}
        </span>
      </div>
    </div>
  );
}
