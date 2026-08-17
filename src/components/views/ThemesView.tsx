import { Crown, Plus, Tags } from 'lucide-react';
import { Theme } from '../../types';
import { Translation } from '../../i18n';
import { compareThemesByDepth, getThemeDepthInfo } from '../../utils/themeDepth';
import { ThemeDepthMark, ThemeDepthPill } from '../ThemeDepthBadge';

interface ThemesViewProps {
  themes: Theme[];
  copy: Translation;
  onCreateTheme: () => void;
  onEditTheme: (themeId: string) => void;
}

export function ThemesView({ themes, copy, onCreateTheme, onEditTheme }: ThemesViewProps) {
  const sortedThemes = [...themes].sort(compareThemesByDepth);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-24 no-scrollbar">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">{copy.themesTitle}</h2>
          <p className="mt-1 text-xs text-white/50">{copy.themesSubtitle}</p>
        </div>
        <button
          type="button"
          className="cfc-pressable flex h-11 items-center gap-1.5 rounded-2xl bg-[linear-gradient(135deg,var(--cfc-amber),var(--cfc-rose-soft))] px-4 text-sm font-black text-[#241016]"
          onClick={onCreateTheme}
        >
          <Plus size={17} />
          {copy.create}
        </button>
      </div>

      <div className="space-y-3">
        {sortedThemes.map(theme => {
          const depth = getThemeDepthInfo(theme);
          const stage = copy.themeDepth.stages[depth.stageKey];

          return (
            <button
              key={theme.id}
              type="button"
              className="cfc-pressable cfc-surface w-full rounded-[22px] p-4 text-left"
              onClick={() => onEditTheme(theme.id)}
            >
              <div className="flex justify-between gap-4">
                <div className="flex min-w-0 flex-1 gap-3">
                  <ThemeDepthMark depth={depth} />
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      <ThemeDepthPill depth={depth} copy={copy} compact />
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
                    <div className="truncate text-base font-black text-white">{theme.name}</div>
                    <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--cfc-text-muted)]">
                      {theme.desc || copy.noDesc}
                    </div>
                    <div className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-[var(--cfc-text-subtle)]">
                      {stage.hint}
                    </div>
                    <div className="mt-3 inline-flex rounded-full border border-[var(--cfc-border)] bg-[var(--cfc-surface-soft)] px-2.5 py-1 text-[11px] font-semibold text-white/72">
                      {copy.audience[theme.audience]}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 rounded-2xl border border-rose-100/14 bg-rose-300/14 px-3 py-2 text-center">
                  <div className="text-lg font-black text-rose-100">{theme.tasks.length}</div>
                  <div className="text-[10px] text-[var(--cfc-text-subtle)]">{copy.cardUnit}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
