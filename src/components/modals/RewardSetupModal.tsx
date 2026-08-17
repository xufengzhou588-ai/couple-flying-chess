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
    <div className="fixed inset-0 z-[130] flex items-end justify-center">
      <button type="button" className="cfc-modal-scrim" onClick={onClose} aria-label={copy.reward.done} />
      <div className="cfc-sheet relative w-full max-w-[430px] overflow-hidden">
        <div className="cfc-sheet-handle" />
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-amber-200">
              <Gift size={18} />
              <span className="text-xs font-black uppercase">{copy.finalRewards}</span>
            </div>
            <h3 className="text-2xl font-black text-white">{copy.reward.setupTitle}</h3>
            <p className="mt-2 text-xs leading-relaxed text-[var(--cfc-text-muted)]">{copy.reward.setupHint}</p>
          </div>
          <div className="cfc-info-card rounded-2xl px-3 py-2 text-center">
            <div className="text-lg font-black text-white">{selectedIds.length}/5</div>
            <div className="text-[9px] text-[var(--cfc-text-subtle)]">{copy.reward.selected}</div>
          </div>
        </div>

        <div className="cfc-modal-scroll max-h-[calc(90dvh-180px)] space-y-2.5">
          {rewards.map(reward => {
            const selected = selectedIds.includes(reward.id);
            const Icon = categoryIcons[reward.category];
            return (
              <button
                key={reward.id}
                type="button"
                className="cfc-select-card cfc-pressable flex w-full items-center gap-3 rounded-[18px] p-3 text-left"
                data-selected={selected}
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
                    <span className="cfc-chip min-h-0 px-2 py-0.5 text-[9px] text-[var(--cfc-text-muted)]">
                      {copy.reward.categories[reward.category]}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-[var(--cfc-text-muted)]">{reward.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="sticky bottom-0 mt-5 bg-[rgba(18,12,21,0.96)] pb-1 pt-2">
          <button
            type="button"
            className="cfc-action-primary w-full"
            onClick={onClose}
          >
            {copy.reward.done}
          </button>
        </div>
      </div>
    </div>
  );
}
