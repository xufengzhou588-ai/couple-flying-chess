import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import { Translation } from '../../i18n';
import { Theme } from '../../types';

interface ThemeEditorModalProps {
  isOpen: boolean;
  theme: Theme | null;
  copy: Translation;
  onClose: () => void;
  onSaveMeta: (themeId: string, patch: Partial<Pick<Theme, 'name' | 'desc' | 'audience'>>) => void;
  onAddTask: (themeId: string, taskText: string) => void;
  onRemoveTask: (themeId: string, index: number) => void;
  onOpenAiImport: (themeId: string) => void;
}

const audienceValues: Theme['audience'][] = ['common', 'male', 'female'];

export function ThemeEditorModal({
  isOpen,
  theme,
  copy,
  onClose,
  onSaveMeta,
  onAddTask,
  onRemoveTask,
  onOpenAiImport
}: ThemeEditorModalProps) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [audience, setAudience] = useState<Theme['audience']>('common');
  const [taskText, setTaskText] = useState('');

  useEffect(() => {
    if (!isOpen || !theme) return;
    setName(theme.name);
    setDesc(theme.desc);
    setAudience(theme.audience);
    setTaskText('');
  }, [isOpen, theme]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  if (!isOpen || !theme) return null;

  return (
    <div className="fixed inset-0 z-[130]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[88vh] rounded-t-[30px] border-t border-white/12 bg-[#130d16] p-5 shadow-2xl">
        <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-white/28" />
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white">{copy.form.editTheme}</h3>
            <p className="mt-1 text-xs text-white/46">{copy.form.editHint}</p>
          </div>
          <button
            className="h-10 rounded-2xl bg-white px-4 text-sm font-black text-[#14070d] transition active:scale-[0.98] disabled:opacity-40"
            disabled={!canSave}
            onClick={() => {
              onSaveMeta(theme.id, { name: name.trim(), desc: desc.trim(), audience });
              onClose();
            }}
          >
            {copy.form.save}
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto pb-8 no-scrollbar">
          <label className="block space-y-2">
            <span className="text-xs font-semibold text-white/52">{copy.form.themeName}</span>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-white outline-none focus:border-rose-200/40"
              maxLength={24}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-semibold text-white/52">{copy.form.desc}</span>
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-white outline-none focus:border-rose-200/40"
              maxLength={60}
            />
          </label>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-white/52">{copy.form.audience}</div>
            <div className="grid grid-cols-3 gap-2">
              {audienceValues.map(value => (
                <button
                  key={value}
                  className={`h-11 rounded-2xl border text-sm font-black transition active:scale-[0.98] ${
                    audience === value
                      ? 'border-white bg-white text-[#14070d]'
                      : 'border-white/10 bg-white/[0.07] text-white/68'
                  }`}
                  onClick={() => setAudience(value)}
                >
                  {copy.audience[value]}
                </button>
              ))}
            </div>
          </div>

          <button
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7dd3fc,#fb7185,#fbbf24)] text-sm font-black text-[#16090f] shadow-[0_18px_46px_rgba(251,113,133,0.24)] transition active:scale-[0.98]"
            onClick={() => onOpenAiImport(theme.id)}
          >
            <Wand2 size={18} />
            {copy.form.aiGenerate}
          </button>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-white/52">{copy.form.addTask}</div>
            <div className="flex gap-2">
              <input
                value={taskText}
                onChange={e => setTaskText(e.target.value)}
                className="h-12 min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-white outline-none focus:border-rose-200/40"
                placeholder={copy.form.taskPlaceholder}
                maxLength={80}
              />
              <button
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#14070d] transition active:scale-[0.98] disabled:opacity-40"
                disabled={!taskText.trim()}
                onClick={() => {
                  onAddTask(theme.id, taskText);
                  setTaskText('');
                }}
                aria-label={copy.form.addTaskAria}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-white/52">{copy.form.taskList}</div>
              <div className="text-[11px] font-semibold text-white/38">
                {theme.tasks.length} {copy.cardUnit}
              </div>
            </div>
            <div className="space-y-2">
              {theme.tasks.map((task, idx) => (
                <div
                  key={`${theme.id}_${idx}`}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-3"
                >
                  <div className="mt-0.5 w-5 text-center text-[11px] font-black text-white/38">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1 text-sm leading-relaxed text-white/86">{task}</div>
                  <button
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-black/24 text-rose-200 transition active:scale-95"
                    onClick={() => onRemoveTask(theme.id, idx)}
                    aria-label={copy.form.deleteTaskAria}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {theme.tasks.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-sm text-white/48">
                  {copy.form.emptyTasks}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
