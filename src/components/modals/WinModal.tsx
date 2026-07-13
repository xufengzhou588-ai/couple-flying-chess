import { useEffect, useState } from 'react';
import { Check, Crown, Heart, MoonStar, RotateCcw, Sparkles, Zap } from 'lucide-react';
import { getFinalRewards, type FinalRewardOption } from '../../data/gameExperience';
import { Translation } from '../../i18n';
import { FinalRewardId, Locale } from '../../types';

interface WinModalProps {
  isOpen: boolean;
  winnerName: string;
  locale: Locale;
  rewardIds: FinalRewardId[];
  copy: Translation;
  onRestart: () => void;
}

const categoryIcons = {
  sweet: Heart,
  flirty: Sparkles,
  'after-dark': MoonStar,
  wild: Zap
};

function sampleRewards(rewards: FinalRewardOption[]) {
  return [...rewards].sort(() => Math.random() - 0.5).slice(0, 3);
}

export function WinModal({
  isOpen,
  winnerName,
  locale,
  rewardIds,
  copy,
  onRestart
}: WinModalProps) {
  const [selectedReward, setSelectedReward] = useState<FinalRewardOption | null>(null);
  const [version, setVersion] = useState<'standard' | 'gentle' | null>(null);
  const [choices, setChoices] = useState<FinalRewardOption[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    setChoices(
      sampleRewards(getFinalRewards(locale).filter(reward => rewardIds.includes(reward.id)))
    );
    setSelectedReward(null);
    setVersion(null);
  }, [isOpen, locale, rewardIds]);

  if (!isOpen) return null;

  const restart = () => {
    setSelectedReward(null);
    setVersion(null);
    onRestart();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#07050a]/94 px-5 backdrop-blur-md">
      <div className="max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-[28px] border border-white/12 bg-[#150e18] shadow-2xl no-scrollbar">
        <div className="relative h-36">
          <img src="/assets/couple-game-hero.webp" alt="" className="h-full w-full object-cover opacity-58" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(21,14,24,0.98))]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] border border-amber-100/40 bg-amber-100 text-[#2c1504] shadow-[0_18px_60px_rgba(251,191,36,0.25)]">
              <Crown size={30} fill="currentColor" />
            </div>
          </div>
        </div>

        <div className="px-5 pb-6 text-center">
          <div className="mb-1 text-[10px] font-semibold uppercase text-amber-100/70">
            {copy.winnerLabel}
          </div>
          <h2 className="text-3xl font-black text-white">{winnerName}</h2>

          {!selectedReward && (
            <>
              <h3 className="mt-4 text-xl font-black text-white">{copy.reward.finalTitle}</h3>
              <p className="mt-1 text-xs leading-relaxed text-white/52">{copy.reward.finalHint}</p>
              <div className="mt-4 space-y-2.5 text-left">
                {choices.map(reward => {
                  const Icon = categoryIcons[reward.category];
                  return (
                    <button
                      key={reward.id}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-[18px] border border-white/10 bg-white/[0.06] p-3 transition active:scale-[0.99]"
                      onClick={() => setSelectedReward(reward)}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100/12 text-amber-100">
                        <Icon size={19} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-white">{reward.title}</div>
                        <p className="mt-1 text-[11px] leading-relaxed text-white/52">
                          {reward.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {selectedReward && !version && (
            <>
              <div className="mt-5 rounded-[20px] border border-amber-100/25 bg-amber-100/10 p-4">
                <div className="text-xl font-black text-amber-100">{selectedReward.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/72">{selectedReward.description}</p>
              </div>
              <h3 className="mt-5 text-lg font-black text-white">{copy.reward.intensityTitle}</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 text-left">
                <button
                  type="button"
                  className="rounded-[18px] border border-rose-200/25 bg-rose-300/12 p-3 transition active:scale-[0.98]"
                  onClick={() => setVersion('standard')}
                >
                  <div className="font-black text-rose-100">{copy.reward.standard}</div>
                  <div className="mt-1 text-[11px] leading-relaxed text-white/52">
                    {selectedReward.description}
                  </div>
                </button>
                <button
                  type="button"
                  className="rounded-[18px] border border-sky-200/25 bg-sky-300/10 p-3 transition active:scale-[0.98]"
                  onClick={() => setVersion('gentle')}
                >
                  <div className="font-black text-sky-100">{copy.reward.gentle}</div>
                  <div className="mt-1 text-[11px] leading-relaxed text-white/52">
                    {selectedReward.gentleVersion}
                  </div>
                </button>
              </div>
            </>
          )}

          {selectedReward && version && (
            <>
              <div className="mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-300 text-[#062117]">
                <Check size={26} />
              </div>
              <h3 className="mt-3 text-xl font-black text-white">{copy.reward.confirmed}</h3>
              <div className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.06] p-4">
                <div className="text-lg font-black text-amber-100">{selectedReward.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/72">
                  {version === 'standard' ? selectedReward.description : selectedReward.gentleVersion}
                </p>
              </div>
              <button
                type="button"
                className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-[#14070d] transition active:scale-[0.98]"
                onClick={restart}
              >
                <RotateCcw size={18} />
                {copy.reward.playAgain}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
