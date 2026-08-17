import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, LockKeyhole, Sparkles, User, UserRound, Wifi } from 'lucide-react';
import { Translation } from '../../i18n';
import {
  DiceReactionData,
  DiceRollEvent,
  Locale,
  MilestoneEventData,
  Player,
  TaskEventData,
  TileType
} from '../../types';
import { RemoteRoomRole, RemoteSyncStatus } from '../../utils/remoteRoom';
import { calculateNewPosition, rollDice } from '../../utils/gameLogic';
import { playDiceSequence } from '../../utils/diceSound';
import { assetPath } from '../../utils/assets';
import {
  getDiceReaction,
  getHotStreakReaction,
  getMilestoneEvent
} from '../../data/gameExperience';
import { playDiceReactionVoice, unlockCharacterVoice } from '../../utils/characterVoice';
import { Dice } from '../Dice';
import { GameBoard } from '../GameBoard';
import { VideoCallWidget } from '../VideoCallWidget';

interface GameViewProps {
  players: Player[];
  boardMap: TileType[];
  currentTurn: number;
  locale: Locale;
  copy: Translation;
  isRolling: boolean;
  remoteRoomCode: string | null;
  remoteRole: RemoteRoomRole | null;
  remoteSyncStatus: RemoteSyncStatus;
  remoteHasPartner: boolean;
  showVideo: boolean;
  lastDiceRoll: DiceRollEvent | null;
  canRoll: boolean;
  rollLockedHint: string;
  onMove: (steps: number) => void;
  onCheckTile: (landingStep: number) => TaskEventData | 'win' | null;
  onEndTurn: () => void;
  onSetRolling: (rolling: boolean) => void;
  onDiceRoll: (playerId: number, result: number) => void;
  onWin: (winnerId: number) => void;
  onTaskTrigger: (data: TaskEventData) => void;
  onMilestone: (data: MilestoneEventData) => void;
  onBack: () => void;
}

const heatStages = [
  { threshold: 0, key: 'ice', color: 'from-sky-300 to-rose-200' },
  { threshold: 25, key: 'warm', color: 'from-rose-200 to-amber-200' },
  { threshold: 50, key: 'hot', color: 'from-amber-200 to-rose-300' },
  { threshold: 75, key: 'night', color: 'from-rose-300 to-fuchsia-300' }
] as const;

export function GameView({
  players,
  boardMap,
  currentTurn,
  locale,
  copy,
  isRolling,
  remoteRoomCode,
  remoteRole,
  remoteSyncStatus,
  remoteHasPartner,
  showVideo,
  lastDiceRoll,
  canRoll,
  rollLockedHint,
  onMove,
  onCheckTile,
  onEndTurn,
  onSetRolling,
  onDiceRoll,
  onWin,
  onTaskTrigger,
  onMilestone,
  onBack
}: GameViewProps) {
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [reaction, setReaction] = useState<DiceReactionData | null>(null);
  const reachedMilestonesRef = useRef(new Set<number>());
  const highRollStreaksRef = useRef([0, 0]);
  const seenRemoteRollIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!lastDiceRoll || canRoll || isRolling) return;
    if (seenRemoteRollIdRef.current === lastDiceRoll.id) return;

    seenRemoteRollIdRef.current = lastDiceRoll.id;
    const nextReaction = getDiceReaction(locale, lastDiceRoll.playerId, lastDiceRoll.result);
    setDiceResult(lastDiceRoll.result);
    setReaction(nextReaction);

    const resultTimer = window.setTimeout(() => setDiceResult(null), 1800);
    const reactionTimer = window.setTimeout(() => setReaction(null), 2200);
    return () => {
      window.clearTimeout(resultTimer);
      window.clearTimeout(reactionTimer);
    };
  }, [canRoll, isRolling, lastDiceRoll, locale]);

  useEffect(() => {
    if (!canRoll || !lastDiceRoll || lastDiceRoll.playerId === currentTurn) return;
    setDiceResult(null);
    setReaction(null);
  }, [canRoll, currentTurn, lastDiceRoll]);

  const handleRoll = useCallback(() => {
    if (!canRoll || isRolling || isMoving || diceResult) return;

    onSetRolling(true);
    unlockCharacterVoice(locale);
    const result = rollDice();
    onDiceRoll(currentTurn, result);
    void playDiceSequence();
    navigator.vibrate?.(24);

    setTimeout(() => {
      if (result === 4) {
        highRollStreaksRef.current[currentTurn] += 1;
      } else {
        highRollStreaksRef.current[currentTurn] = 0;
      }
      const nextReaction =
        highRollStreaksRef.current[currentTurn] >= 2
          ? getHotStreakReaction(locale, currentTurn, highRollStreaksRef.current[currentTurn])
          : getDiceReaction(locale, currentTurn, result);
      setDiceResult(result);
      setReaction(nextReaction);
      playDiceReactionVoice(
        nextReaction.tauntLine ?? nextReaction.line,
        currentTurn,
        locale
      );
      onSetRolling(false);
      window.setTimeout(() => setReaction(null), 2200);
    }, 1000);
  }, [canRoll, isRolling, isMoving, diceResult, onSetRolling, onDiceRoll, locale, currentTurn]);

  const handleRollComplete = useCallback(() => {
    if (!diceResult) return;

    const landingStep = calculateNewPosition(players[currentTurn].step, diceResult);
    const startingStep = players[currentTurn].step;
    setIsMoving(true);

    const moveDelayMs = 220;
    let movedSteps = 0;

    const stepOnce = () => {
      onMove(1);
      movedSteps += 1;

      if (movedSteps < diceResult) {
        setTimeout(stepOnce, moveDelayMs);
        return;
      }

      setTimeout(() => {
        const milestone = [
          { step: 12, threshold: 25 as const },
          { step: 24, threshold: 50 as const },
          { step: 36, threshold: 75 as const }
        ].find(
          item =>
            startingStep < item.step &&
            landingStep >= item.step &&
            !reachedMilestonesRef.current.has(item.threshold)
        );

        const resolveLanding = () => {
          const tileCheck = onCheckTile(landingStep);

          if (tileCheck === 'win') {
            onWin(currentTurn);
          } else if (tileCheck) {
            onTaskTrigger(tileCheck);
          } else {
            onEndTurn();
          }

          setDiceResult(null);
          setIsMoving(false);
        };

        if (milestone) {
          reachedMilestonesRef.current.add(milestone.threshold);
          onMilestone(
            getMilestoneEvent(locale, milestone.threshold)
          );
          window.setTimeout(resolveLanding, 1900);
          return;
        }

        resolveLanding();
      }, moveDelayMs);
    };

    setTimeout(stepOnce, moveDelayMs);
  }, [
    diceResult,
    players,
    currentTurn,
    onMove,
    onCheckTile,
    onWin,
    onTaskTrigger,
    onMilestone,
    onEndTurn,
    locale
  ]);

  const activePlayer = players[currentTurn];
  const leaderStep = Math.max(...players.map(player => player.step));
  const progress = Math.round((leaderStep / 48) * 100);
  const heatStage =
    [...heatStages].reverse().find(stage => progress >= stage.threshold) || heatStages[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--cfc-bg)]">
      {showVideo && <VideoCallWidget copy={copy} />}

      <div className="absolute inset-0 z-0">
        <img src={assetPath('assets/couple-game-hero.jpg')} alt="" className="h-full w-full object-cover opacity-34" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,11,0.78),rgba(8,6,11,0.94))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,111,154,0.16),transparent_36%),radial-gradient(circle_at_14%_72%,rgba(138,215,255,0.11),transparent_30%)]" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[430px] flex-col">
        <header className="game-header flex shrink-0 items-center gap-2 px-3 pb-2 pt-10">
          <button
            type="button"
            onClick={onBack}
            className="cfc-pressable flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--cfc-border)] bg-[var(--cfc-surface-soft)]"
            aria-label={copy.back}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="game-turn-strip cfc-surface min-w-0 flex-1 rounded-2xl p-2">
            <div className="flex items-center justify-between gap-2">
              <div
                className={`game-turn-pill flex items-center justify-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-black ${
                  currentTurn === 0 ? 'bg-sky-300 text-[#07111d]' : 'text-sky-100/52'
                }`}
              >
                <User size={14} className="shrink-0" />
                <span className="truncate">{copy.playerBlue}</span>
              </div>
              <div className="game-progress-pill flex min-w-0 items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/42">
                <Sparkles size={12} className="shrink-0" />
                {progress}%
              </div>
              <div
                className={`game-turn-pill flex items-center justify-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-black ${
                  currentTurn === 1 ? 'bg-rose-300 text-[#220811]' : 'text-rose-100/52'
                }`}
              >
                <span className="truncate">{copy.playerRed}</span>
                <UserRound size={14} className="shrink-0" />
              </div>
            </div>
          </div>
        </header>

        {remoteRoomCode && (
          <div className="cfc-surface mx-4 mb-1 flex shrink-0 items-center justify-between gap-2 rounded-2xl px-3 py-2 text-xs text-emerald-100/82">
            <div className="flex min-w-0 items-center gap-2">
              <Wifi size={14} className={remoteSyncStatus === 'connected' ? 'text-emerald-100' : 'text-white/38'} />
              <span className="truncate font-black">
                {copy.remote.roomLabel} {remoteRoomCode}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-[11px] font-bold text-white/62">
              <span>{remoteRole === 'guest' ? copy.invite.guestRole : copy.invite.hostRole}</span>
              <span className="text-white/28">·</span>
              <span>{remoteHasPartner ? copy.remote.partnerOnline : copy.remote.partnerWaiting}</span>
            </div>
          </div>
        )}

        <div className="board-stage relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 py-1">
          <GameBoard
            boardMap={boardMap}
            players={players}
            currentTurn={currentTurn}
            copy={copy}
            reaction={reaction}
          />
          {reaction && (
            <div className="pointer-events-none absolute left-1/2 top-[92px] z-40 w-[82%] -translate-x-1/2 animate-[reaction-pop_2.2s_ease_both] rounded-[20px] border border-[var(--cfc-border-strong)] bg-[rgba(23,13,23,0.94)] px-4 py-3 text-center shadow-2xl backdrop-blur-xl">
              <div className="text-sm font-black text-[var(--cfc-amber)]">{reaction.title}</div>
              <div className="mt-1 text-xs text-white/76">{reaction.line}</div>
              {reaction.tauntLine && (
                <div className="mt-1 text-xs font-semibold text-rose-100/82">{reaction.tauntLine}</div>
              )}
            </div>
          )}
        </div>

        <div className="game-control-panel cfc-surface-strong mx-4 mb-3 shrink-0 rounded-[24px] p-3">
          <div className="mb-2 rounded-2xl border border-[var(--cfc-border)] bg-[rgba(255,255,255,0.055)] px-3 py-2">
            <div className="mb-1.5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold text-[var(--cfc-text-subtle)]">{copy.heatStage}</div>
                <div className="text-base font-black text-white">{copy.stages[heatStage.key]}</div>
              </div>
              <div className="max-w-[190px] text-right text-[11px] leading-relaxed text-[var(--cfc-text-muted)]">
                {copy.stageHints[heatStage.key]}
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${heatStage.color} transition-all duration-500`}
                style={{ width: `${Math.max(progress, 6)}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div
                className={`text-sm font-black ${
                  currentTurn === 0 ? 'text-sky-200' : 'text-rose-200'
                }`}
              >
                {currentTurn === 0 ? copy.maleTurn : copy.femaleTurn}
              </div>
              <div className={`mt-1 flex items-center gap-1.5 text-xs ${canRoll ? 'text-white/48' : 'text-amber-100/72'}`}>
                {!canRoll && <LockKeyhole size={12} />}
                <span>{canRoll ? copy.rollHint : rollLockedHint}</span>
              </div>
            </div>
            <div className="shrink-0 rounded-2xl border border-[var(--cfc-border)] bg-[var(--cfc-surface-soft)] px-3 py-2 text-right">
              <div className="text-base font-black text-white">{activePlayer.step}</div>
              <div className="text-[9px] text-[var(--cfc-text-subtle)]">{copy.position}</div>
            </div>
            <button
              type="button"
              className={`dice-action -my-4 -mr-1 flex shrink-0 items-center justify-center rounded-[34px] ${
                canRoll ? '' : 'cursor-not-allowed opacity-50'
              }`}
              onClick={handleRoll}
              disabled={!canRoll || isRolling || isMoving || !!diceResult}
              aria-label={canRoll ? copy.rollHint : rollLockedHint}
            >
              <Dice
                isRolling={isRolling}
                result={diceResult}
                onRollComplete={canRoll ? handleRollComplete : undefined}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
