import { Plus } from 'lucide-react';
import { Theme } from '../../types';
import { Translation } from '../../i18n';

interface ThemesViewProps {
  themes: Theme[];
  copy: Translation;
  onCreateTheme: () => void;
  onEditTheme: (themeId: string) => void;
}

export function ThemesView({ themes, copy, onCreateTheme, onEditTheme }: ThemesViewProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-24 no-scrollbar">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">{copy.themesTitle}</h2>
          <p className="mt-1 text-xs text-white/50">{copy.themesSubtitle}</p>
        </div>
        <button
          className="flex h-10 items-center gap-1.5 rounded-2xl bg-white px-4 text-sm font-black text-[#14070d] transition active:scale-[0.98]"
          onClick={onCreateTheme}
        >
          <Plus size={17} />
          {copy.create}
        </button>
      </div>

      <div className="space-y-3">
        {themes.map(theme => (
          <button
            key={theme.id}
            className="w-full rounded-[22px] border border-white/10 bg-[#171018]/84 p-4 text-left shadow-[0_16px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl transition active:scale-[0.985]"
            onClick={() => onEditTheme(theme.id)}
          >
            <div className="flex justify-between gap-4">
              <div className="min-w-0">
                <div className="truncate text-base font-black text-white">{theme.name}</div>
                <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/52">
                  {theme.desc || copy.noDesc}
                </div>
                <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/70">
                  {copy.audience[theme.audience]}
                </div>
              </div>
              <div className="shrink-0 rounded-2xl bg-rose-300/14 px-3 py-2 text-center">
                <div className="text-lg font-black text-rose-100">{theme.tasks.length}</div>
                <div className="text-[10px] text-white/45">{copy.cardUnit}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
