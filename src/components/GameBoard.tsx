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

function tileClassForType(type: TileType, step: number) {
  if (type === 'lucky') {
    return 'border-rose-100/84 bg-rose-300/82 shadow-[0_0_14px_rgba(251,113,133,0.54)]';
  }

  if (type === 'trap') {
    return 'border-amber-100/84 bg-amber-200/84 shadow-[0_0_14px_rgba(251,191,36,0.42)]';
  }

  return step % 2 === 0
    ? 'border-amber-100/60 bg-[#e9bd72]/78'
    : 'border-rose-100/42 bg-[#791b39]/78';
}

function markerForType(type: TileType) {
  if (type === 'lucky') {
    return {
      className: 'text-white drop-shadow-[0_0_8px_rgba(251,113,133,0.92)]',
      icon: <Heart size={12} fill="currentColor" />
    };
  }

  if (type === 'trap') {
    return {
      className: 'text-[#3a1305] drop-shadow-[0_0_7px_rgba(251,191,36,0.72)]',
      icon: <Flame size={12} />
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
      style={{ width: 'min(100%, 430px, calc(100dvh - 266px))' }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[36px] border border-amber-100/28 bg-[#160b12] shadow-[0_34px_96px_rgba(0,0,0,0.58)]">
        <img
          src="/assets/romance-board-clean.webp"
          alt=""
          className="h-full w-full object-contain opacity-92 contrast-[1.08] saturate-[1.12]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_46%,rgba(0,0,0,0.12)_88%)]" />
        <div className="absolute inset-[4.7%] rounded-full border border-amber-100/18" />
        <div className="absolute inset-[20.5%] rounded-full border border-amber-100/14" />
        <div className="absolute inset-[35.5%] rounded-full border border-amber-100/12" />
      </div>

      {boardMap.map((type, step) => {
        if (step === 0 || step === 48) return null;
        const point = getSpiralPoint(step);

        return (
          <div
            key={`tile_${step}`}
            className={`absolute z-10 flex h-[5.45%] w-[5.45%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border shadow-[inset_0_1px_3px_rgba(255,255,255,0.34),0_3px_8px_rgba(0,0,0,0.28)] ring-1 ring-black/16 ${tileClassForType(type, step)}`}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <span className="h-[32%] w-[32%] rounded-full bg-white/28" />
          </div>
        );
      })}

      {boardMap.map((type, step) => {
        if (step === 0 || step === 48) return null;
        const marker = markerForType(type);
        if (!marker) return null;
        const point = getSpiralPoint(step);

        return (
          <div
            key={`marker_${step}`}
            className={`absolute z-20 flex h-[5.45%] w-[5.45%] -translate-x-1/2 -translate-y-1/2 items-center justify-center ${marker.className}`}
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

      <div className="absolute left-4 top-4 z-20 rounded-full border border-white/12 bg-black/28 px-3 py-1.5 text-[11px] font-black text-white/80 backdrop-blur-md">
        <span className="inline-flex items-center gap-1">
          <Sparkles size={12} className="text-amber-200" />
          {copy.routeName}
        </span>
      </div>
    </div>
  );
}
