import { Check, Gift, Heart, MoonStar, Sparkles, Zap } from 'lucide-react';
import { getFinalRewards } from '../../data/gameExperience';
import { Translation } from '../../i18n';
import { FinalRewardId, Locale } from '../../types';

interface RewardSetupModalProps {
  isOpen: boolean;
  locale: Locale;
  copy: Translation;
  selectedIds: FinalRewardId[];
  onChange: (ids: FinalRewardId[]) => void;
  onClose: () => void;
}

const categoryIcons = {
  sweet: Heart,
  flirty: Sparkles,
  'after-dark': MoonStar,
  wild: Zap
};

export function RewardSetupModal({
  isOpen,
  locale,
  copy,
  selectedIds,
  onChange,
  onClose
}: RewardSetupModalProps) {
  if (!isOpen) return null;

  const rewards = getFinalRewards(locale);
  const toggle = (id: FinalRewardId) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 3) return;
      onChange(selectedIds.filter(item => item !== id));
      return;
    }
    if (selectedIds.length >= 5) return;
    onChange([...selectedIds, id]);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center bg-black/76 backdrop-blur-md">
      <div className="max-h-[90vh] w-full max-w-[430px] overflow-y-auto rounded-t-[28px] border-t border-white/12 bg-[#130d16] p-5 shadow-2xl no-scrollbar">
        <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-white/24" />
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-amber-200">
              <Gift size={18} />
              <span className="text-xs font-black uppercase">{copy.finalRewards}</span>
            </div>
            <h3 className="text-2xl font-black text-white">{copy.reward.setupTitle}</h3>
            <p className="mt-2 text-xs leading-relaxed text-white/52">{copy.reward.setupHint}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-2 text-center">
            <div className="text-lg font-black text-white">{selectedIds.length}/5</div>
            <div className="text-[9px] text-white/48">{copy.reward.selected}</div>
          </div>
        </div>

        <div className="space-y-2.5">
          {rewards.map(reward => {
            const selected = selectedIds.includes(reward.id);
            const Icon = categoryIcons[reward.category];
            return (
              <button
                key={reward.id}
                type="button"
                className={`flex w-full items-center gap-3 rounded-[18px] border p-3 text-left transition active:scale-[0.99] ${
                  selected
                    ? 'border-amber-100/45 bg-amber-100/12'
                    : 'border-white/10 bg-white/[0.05]'
                }`}
                onClick={() => toggle(reward.id)}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    selected ? 'bg-amber-100 text-[#321304]' : 'bg-white/10 text-white/66'
                  }`}
                >
                  {selected ? <Check size={20} /> : <Icon size={19} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white">{reward.title}</span>
                    <span className="rounded-full bg-white/8 px-2 py-0.5 text-[9px] font-bold text-white/48">
                      {copy.reward.categories[reward.category]}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/54">{reward.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="sticky bottom-0 mt-5 bg-[#130d16] pb-2 pt-2">
          <button
            type="button"
            className="h-12 w-full rounded-2xl bg-white text-sm font-black text-[#170b11] transition active:scale-[0.98]"
            onClick={onClose}
          >
            {copy.reward.done}
          </button>
        </div>
      </div>
    </div>
  );
}
