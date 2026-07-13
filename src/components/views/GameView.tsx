import { useCallback, useRef, useState } from 'react';
import { ArrowLeft, Sparkles, User, UserRound } from 'lucide-react';
import { Translation } from '../../i18n';
import {
  DiceReactionData,
  Locale,
  MilestoneEventData,
  Player,
  TaskEventData,
  TileType
} from '../../types';
import { calculateNewPosition, rollDice } from '../../utils/gameLogic';
import { playDiceSequence } from '../../utils/diceSound';
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
  onMove: (steps: number) => void;
  onCheckTile: (landingStep: number) => TaskEventData | 'win' | null;
  onEndTurn: () => void;
  onSetRolling: (rolling: boolean) => void;
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
  onMove,
  onCheckTile,
  onEndTurn,
  onSetRolling,
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

  const handleRoll = useCallback(() => {
    if (isRolling || isMoving || diceResult) return;

    onSetRolling(true);
    unlockCharacterVoice(locale);
    const result = rollDice();
    playDiceSequence();
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
        nextReaction.line,
        currentTurn,
        locale
      );
      onSetRolling(false);
      window.setTimeout(() => setReaction(null), 2200);
    }, 1000);
  }, [isRolling, isMoving, diceResult, onSetRolling, locale, currentTurn]);

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
    <div className="fixed inset-0 z-50 flex flex-col bg-[#08060b]">
      <VideoCallWidget copy={copy} />

      <div className="absolute inset-0 z-0">
        <img src="/assets/couple-game-hero.webp" alt="" className="h-full w-full object-cover opacity-38" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,11,0.74),rgba(8,6,11,0.92))]" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[430px] flex-col">
        <header className="flex shrink-0 items-center gap-3 px-4 pb-2 pt-10">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/10 transition active:scale-95"
            aria-label={copy.back}
          >
            <ArrowLeft size={20} />
          </button>

          <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.08] p-2 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-2">
              <div
                className={`flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-black ${
                  currentTurn === 0 ? 'bg-sky-300 text-[#07111d]' : 'text-sky-100/52'
                }`}
              >
                <User size={14} />
                {copy.playerBlue}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                <Sparkles size={12} />
                {progress}%
              </div>
              <div
                className={`flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-xs font-black ${
                  currentTurn === 1 ? 'bg-rose-300 text-[#220811]' : 'text-rose-100/52'
                }`}
              >
                {copy.playerRed}
                <UserRound size={14} />
              </div>
            </div>
          </div>
        </header>

        <div className="relative flex flex-1 items-center justify-center px-3 py-1">
          <GameBoard
            boardMap={boardMap}
            players={players}
            currentTurn={currentTurn}
            copy={copy}
            reaction={reaction}
          />
          {reaction && (
            <div className="pointer-events-none absolute left-1/2 top-[92px] z-40 w-[82%] -translate-x-1/2 animate-[reaction-pop_2.2s_ease_both] rounded-[20px] border border-white/15 bg-[#170d17]/92 px-4 py-3 text-center shadow-2xl backdrop-blur-xl">
              <div className="text-sm font-black text-amber-100">{reaction.title}</div>
              <div className="mt-1 text-xs text-white/72">{reaction.line}</div>
            </div>
          )}
        </div>

        <div className="mx-4 mb-3 shrink-0 rounded-[24px] border border-white/12 bg-[#120d16]/88 p-3 shadow-2xl backdrop-blur-2xl">
          <div className="mb-2 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2">
            <div className="mb-1.5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold text-white/42">{copy.heatStage}</div>
                <div className="text-base font-black text-white">{copy.stages[heatStage.key]}</div>
              </div>
              <div className="max-w-[190px] text-right text-[11px] leading-relaxed text-white/54">
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
              <div className="mt-1 text-xs text-white/48">{copy.rollHint}</div>
            </div>
            <div className="shrink-0 rounded-2xl bg-white/10 px-3 py-2 text-right">
              <div className="text-base font-black text-white">{activePlayer.step}</div>
              <div className="text-[9px] text-white/42">{copy.position}</div>
            </div>
            <div className="-my-4 -mr-1 flex shrink-0 scale-[0.68] items-center justify-center" onClick={handleRoll}>
              <Dice isRolling={isRolling} result={diceResult} onRollComplete={handleRollComplete} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
