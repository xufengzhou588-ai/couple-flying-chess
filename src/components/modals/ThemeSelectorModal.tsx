import { useEffect } from 'react';
import { Check, Crown, Tags } from 'lucide-react';
import { Theme } from '../../types';
import { Translation } from '../../i18n';
import { compareThemesByDepth, getThemeDepthInfo } from '../../utils/themeDepth';
import { ThemeDepthMark, ThemeDepthPill } from '../ThemeDepthBadge';

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

  const sortedThemes = [...themes].sort(compareThemesByDepth);

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={copy.chooseTaskTheme}>
      <button type="button" className="cfc-modal-scrim" onClick={onClose} aria-label={copy.form.cancel} />
      <div className="cfc-sheet absolute inset-x-0 bottom-0">
        <div className="cfc-sheet-handle" />
        <div className="mb-5">
          <h3 className="text-xl font-black text-white">{copy.chooseTaskTheme}</h3>
          <p className="mt-1 text-xs text-[var(--cfc-text-muted)]">{copy.themeHint}</p>
        </div>
        <div className="cfc-modal-scroll max-h-[52vh] space-y-2">
          {sortedThemes.map(theme => {
            const depth = getThemeDepthInfo(theme);
            const stage = copy.themeDepth.stages[depth.stageKey];

            return (
              <button
                key={theme.id}
                type="button"
                aria-label={`${copy.chooseTaskTheme}: ${theme.name}`}
                data-theme-id={theme.id}
                onClick={() => {
                  onSelect(theme.id);
                  onClose();
                }}
                data-selected={selectedThemeId === theme.id}
                className="cfc-select-card cfc-pressable flex w-full items-center justify-between gap-3 rounded-[20px] p-4 text-left"
              >
                <div className="flex min-w-0 flex-1 gap-3">
                  <ThemeDepthMark depth={depth} />
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-1.5">
                      <ThemeDepthPill depth={depth} copy={copy} />
                      {theme.access === 'premium' && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-100/20 bg-amber-100/12 px-2 py-0.5 text-[10px] font-black text-amber-100">
                          <Crown size={11} />
                          {copy.truthDare.premiumBadge}
                        </span>
                      )}
                      {theme.category === 'truth-dare' && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-100/20 bg-rose-100/12 px-2 py-0.5 text-[10px] font-black text-rose-100">
                          <Tags size={11} />
                          {copy.truthDare.categoryBadge}
                        </span>
                      )}
                    </div>
                    <div className="truncate font-black text-white">{theme.name}</div>
                    <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">
                      {theme.desc}
                    </div>
                    <div className="mt-2 rounded-2xl border border-white/8 bg-black/18 px-3 py-2 text-[11px] leading-relaxed text-white/58">
                      {stage.hint}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="cfc-chip border-rose-100/18 bg-rose-100/10 text-rose-100/78">
                        {theme.tasks.length} {copy.cards}
                      </span>
                    </div>
                  </div>
                </div>
                {selectedThemeId === theme.id && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--cfc-amber),var(--cfc-rose-soft))] text-[#241016]">
                    <Check size={18} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
