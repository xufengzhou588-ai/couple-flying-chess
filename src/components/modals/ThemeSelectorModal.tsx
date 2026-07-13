import { useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Theme } from '../../types';
import { Translation } from '../../i18n';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  themes: Theme[];
  copy: Translation;
  selectedThemeId: string | null;
  onSelect: (themeId: string) => void;
  onClose: () => void;
}

export function ThemeSelectorModal({
  isOpen,
  themes,
  copy,
  selectedThemeId,
  onSelect,
  onClose
}: ThemeSelectorModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/68 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 rounded-t-[30px] border-t border-white/12 bg-[#130d16] p-5 shadow-2xl">
        <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-white/28" />
        <div className="mb-5">
          <h3 className="text-xl font-black text-white">{copy.chooseTaskTheme}</h3>
          <p className="mt-1 text-xs text-white/48">{copy.themeHint}</p>
        </div>
        <div className="max-h-[52vh] space-y-2 overflow-y-auto pb-8 no-scrollbar">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => {
                onSelect(theme.id);
                onClose();
              }}
              className="flex w-full items-center justify-between gap-3 rounded-[20px] border border-white/10 bg-white/[0.07] p-4 text-left transition active:scale-[0.985]"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="shrink-0 text-amber-200" size={15} />
                  <span className="truncate font-black text-white">{theme.name}</span>
                </div>
                <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">
                  {theme.desc}
                </div>
                <div className="mt-2 text-[11px] font-semibold text-rose-100/68">
                  {theme.tasks.length} {copy.cards}
                </div>
              </div>
              {selectedThemeId === theme.id && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#16090f]">
                  <Check size={18} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
