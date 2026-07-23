import { Flame, Heart, Sparkles, Trophy } from 'lucide-react';
import { Translation } from '../i18n';
import { DiceReactionData, Player, TileType } from '../types';
import { CharacterToken } from './CharacterToken';

interface GameBoardProps {
  boardMap: TileType[];
  players: Player[];
  currentTurn: number;
  copy: Translation;
  reaction: DiceReactionData | null;
}

function getSpiralPoint(step: number) {
  if (step >= 48) return { x: 50, y: 50 };

  const t = step / 48;
  const radius = 41 - t * 32;
  const angle = (122 + t * 1035) * (Math.PI / 180);

  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius
  };
}

function markerForType(type: TileType) {
  if (type === 'lucky') {
    return {
      className: 'border-rose-100/58 bg-rose-400/36 text-white shadow-[0_0_14px_rgba(251,113,133,0.44)]',
      icon: <Heart size={13} fill="currentColor" />
    };
  }

  if (type === 'trap') {
    return {
      className: 'border-amber-100/55 bg-amber-200/42 text-[#3a1305] shadow-[0_0_12px_rgba(251,191,36,0.34)]',
      icon: <Flame size={13} />
    };
  }

  return null;
}

export function GameBoard({
  boardMap,
  players,
  currentTurn,
  copy,
  reaction
}: GameBoardProps) {
  return (
    <div
      className="relative aspect-square shrink-0"
      style={{ width: 'min(92vw, 400px, calc(100vh - 318px))' }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[36px] border border-amber-100/28 bg-[#160b12] shadow-[0_34px_96px_rgba(0,0,0,0.58)]">
        <img
          src="/assets/romance-board-clean.webp"
          alt=""
          className="h-full w-full object-contain opacity-[0.96] contrast-[1.12] saturate-[1.16]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_54%,rgba(0,0,0,0.08)_92%)]" />
      </div>

      {boardMap.map((type, step) => {
        if (step === 0 || step === 48) return null;
        const marker = markerForType(type);
        if (!marker) return null;
        const point = getSpiralPoint(step);

        return (
          <div
            key={`marker_${step}`}
            className={`absolute z-20 flex h-[5.1%] w-[5.1%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border backdrop-blur-[1px] ${marker.className}`}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            {marker.icon}
          </div>
        );
      })}

      <div
        className="absolute z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-sky-100/70 bg-sky-300 text-xs font-black text-[#061626] shadow-[0_0_22px_rgba(125,211,252,0.55)]"
        style={{ left: `${getSpiralPoint(0).x}%`, top: `${getSpiralPoint(0).y}%` }}
      >
        {copy.start}
      </div>

      <div
        className="absolute z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-amber-100/70 bg-amber-100 text-[#321304] shadow-[0_0_24px_rgba(251,191,36,0.5)]"
        style={{ left: `${getSpiralPoint(48).x}%`, top: `${getSpiralPoint(48).y}%` }}
      >
        <Trophy size={20} fill="currentColor" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        {players.map(player => {
          const point = getSpiralPoint(player.step);
          const playersOnSameTile = players.filter(p => p.step === player.step);
          const isOverlapping = playersOnSameTile.length > 1;
          const indexOnTile = playersOnSameTile.findIndex(p => p.id === player.id);
          const translate = isOverlapping
            ? indexOnTile === 0
              ? 'translate(-58%, -58%)'
              : 'translate(-42%, -42%)'
            : 'translate(-50%, -50%)';
          const isActive = player.id === currentTurn;
          const playerReaction = reaction?.playerId === player.id ? reaction : null;
          const currentTile = boardMap[player.step];
          const mood =
            playerReaction
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
              className={`absolute z-30 flex h-12 w-12 items-center justify-center transition-all duration-500 ease-out ${
                isActive ? 'avatar-pulse scale-110' : ''
              } ${playerReaction?.result === 4 ? 'character-celebrate' : ''} ${
                playerReaction?.result === 1 ? 'character-grumble' : ''
              }`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                transform: translate
              }}
            >
              <CharacterToken player={player} active={isActive} mood={mood} size="board" />
            </div>
          );
        })}
      </div>

      <div className="absolute left-3 top-3 z-20 rounded-full border border-white/12 bg-black/24 px-2.5 py-1.5 text-[10px] font-black text-white/76 backdrop-blur-md">
        <span className="inline-flex items-center gap-1">
          <Sparkles size={12} className="text-amber-200" />
          {copy.routeName}
        </span>
      </div>
    </div>
  );
}
