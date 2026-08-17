import { useEffect, useMemo, useState } from 'react';
import { Crown, Plus, Tags, Trash2, Wand2 } from 'lucide-react';
import { Translation } from '../../i18n';
import { Theme } from '../../types';
import {
  createTaggedTask,
  parseTaskTag,
  TRUTH_DARE_THEME_ID,
  type TruthDareIntensity,
  type TruthDareKind
} from '../../utils/themeTaskTags';

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
const truthDareKindValues: TruthDareKind[] = ['truth', 'dare', 'chemistry', 'boundary', 'custom'];
const truthDareIntensityValues: TruthDareIntensity[] = ['gentle', 'flirty', 'heated', 'finale'];

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
  const [taskKind, setTaskKind] = useState<TruthDareKind>('truth');
  const [taskIntensity, setTaskIntensity] = useState<TruthDareIntensity>('gentle');

  useEffect(() => {
    if (!isOpen || !theme) return;
    setName(theme.name);
    setDesc(theme.desc);
    setAudience(theme.audience);
    setTaskText('');
    setTaskKind('truth');
    setTaskIntensity('gentle');
  }, [isOpen, theme]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  if (!isOpen || !theme) return null;

  const isTruthDareTheme = theme.category === 'truth-dare' || theme.id === TRUTH_DARE_THEME_ID;
  const addCurrentTask = () => {
    const trimmed = taskText.trim();
    if (!trimmed) return;

    const nextTask = isTruthDareTheme
      ? createTaggedTask(
          copy.truthDare.taskKinds[taskKind],
          copy.truthDare.intensities[taskIntensity],
          trimmed
        )
      : trimmed;

    onAddTask(theme.id, nextTask);
    setTaskText('');
  };

  const addCustomFinalCards = () => {
    copy.truthDare.customFinalCards.forEach(card => {
      onAddTask(
        theme.id,
        createTaggedTask(
          copy.truthDare.taskKinds.custom,
          copy.truthDare.intensities.finale,
          card
        )
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[130]" role="dialog" aria-modal="true" aria-label={copy.form.editTheme}>
      <button type="button" className="cfc-modal-scrim" onClick={onClose} aria-label={copy.form.cancel} />
      <div className="cfc-sheet absolute inset-x-0 bottom-0">
        <div className="cfc-sheet-handle" />
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black text-white">{copy.form.editTheme}</h3>
              {theme.access === 'premium' && (
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-100/20 bg-amber-100/12 px-2.5 py-1 text-[10px] font-black text-amber-100">
                  <Crown size={12} />
                  {copy.truthDare.premiumBadge}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-[var(--cfc-text-muted)]">{copy.form.editHint}</p>
          </div>
          <button
            type="button"
            className="cfc-action-primary h-10 rounded-2xl px-4 text-sm"
            disabled={!canSave}
            onClick={() => {
              onSaveMeta(theme.id, { name: name.trim(), desc: desc.trim(), audience });
              onClose();
            }}
          >
            {copy.form.save}
          </button>
        </div>

        <div className="cfc-modal-scroll max-h-[70vh] space-y-4">
          <label className="block space-y-2">
            <span className="cfc-field-label">{copy.form.themeName}</span>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="cfc-input"
              maxLength={24}
            />
          </label>

          <label className="block space-y-2">
            <span className="cfc-field-label">{copy.form.desc}</span>
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="cfc-input"
              maxLength={60}
            />
          </label>

          <div className="space-y-2">
            <div className="cfc-field-label">{copy.form.audience}</div>
            <div className="cfc-segment grid-cols-3">
              {audienceValues.map(value => (
                <button
                  key={value}
                  type="button"
                  className="cfc-segment-button"
                  data-active={audience === value}
                  onClick={() => setAudience(value)}
                >
                  {copy.audience[value]}
                </button>
              ))}
            </div>
          </div>

          {isTruthDareTheme && (
            <div className="rounded-[22px] border border-amber-100/18 bg-amber-100/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-black text-amber-100">
                <Tags size={16} />
                {copy.truthDare.categoryBadge}
              </div>
              <p className="text-xs leading-relaxed text-white/58">{copy.truthDare.editorHint}</p>
            </div>
          )}

          <button
            type="button"
            className="cfc-action-primary w-full"
            onClick={() => onOpenAiImport(theme.id)}
          >
            <Wand2 size={18} />
            {copy.form.aiGenerate}
          </button>

          {isTruthDareTheme && (
            <div className="cfc-info-card space-y-3 rounded-[22px] p-3">
              <div className="space-y-2">
                <div className="cfc-field-label">{copy.truthDare.kindLabel}</div>
                <div className="cfc-segment grid-cols-3">
                  {truthDareKindValues.map(value => (
                    <button
                      key={value}
                      type="button"
                      className="cfc-segment-button text-[11px]"
                      data-active={taskKind === value}
                      onClick={() => setTaskKind(value)}
                    >
                      {copy.truthDare.taskKinds[value]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="cfc-field-label">{copy.truthDare.intensityLabel}</div>
                <div className="cfc-segment grid-cols-4">
                  {truthDareIntensityValues.map(value => (
                    <button
                      key={value}
                      type="button"
                      className="cfc-segment-button px-1 text-[11px]"
                      data-active={taskIntensity === value}
                      onClick={() => setTaskIntensity(value)}
                    >
                      {copy.truthDare.intensities[value]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="cfc-action-secondary h-11 w-full border-amber-100/20 bg-amber-100/12 text-xs text-amber-100"
                onClick={addCustomFinalCards}
              >
                <Plus size={15} />
                {copy.truthDare.addCustomFinal}
              </button>
            </div>
          )}

          <div className="space-y-2">
            <div className="cfc-field-label">{copy.form.addTask}</div>
            <div className="flex gap-2">
              <input
                value={taskText}
                onChange={e => setTaskText(e.target.value)}
                className="cfc-input min-w-0 flex-1"
                placeholder={copy.form.taskPlaceholder}
                maxLength={isTruthDareTheme ? 120 : 80}
              />
              <button
                type="button"
                className="cfc-action-primary h-12 w-12 shrink-0 rounded-2xl p-0"
                disabled={!taskText.trim()}
                onClick={addCurrentTask}
                aria-label={copy.form.addTaskAria}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="cfc-field-label">{copy.form.taskList}</div>
              <div className="text-[11px] font-semibold text-[var(--cfc-text-subtle)]">
                {theme.tasks.length} {copy.cardUnit}
              </div>
            </div>
            <div className="space-y-2">
              {theme.tasks.map((task, idx) => {
                const parsedTask = parseTaskTag(task);

                return (
                  <div
                    key={`${theme.id}_${idx}`}
                    className="cfc-info-card flex items-start gap-3 rounded-2xl p-3"
                  >
                    <div className="mt-0.5 w-5 text-center text-[11px] font-black text-[var(--cfc-text-subtle)]">
                      {idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      {(parsedTask.kindLabel || parsedTask.intensityLabel) && (
                        <div className="mb-1 flex flex-wrap gap-1.5">
                          {parsedTask.kindLabel && (
                            <span className="rounded-full bg-rose-100/14 px-2 py-0.5 text-[10px] font-black text-rose-100">
                              {parsedTask.kindLabel}
                            </span>
                          )}
                          {parsedTask.intensityLabel && (
                            <span className="rounded-full bg-amber-100/14 px-2 py-0.5 text-[10px] font-black text-amber-100">
                              {parsedTask.intensityLabel}
                            </span>
                          )}
                        </div>
                      )}
                      <div className="text-sm leading-relaxed text-white/86">{parsedTask.text}</div>
                    </div>
                    <button
                      type="button"
                      className="cfc-action-danger flex h-9 w-9 shrink-0 items-center justify-center rounded-xl p-0"
                      onClick={() => onRemoveTask(theme.id, idx)}
                      aria-label={copy.form.deleteTaskAria}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
              {theme.tasks.length === 0 && (
                <div className="cfc-info-card rounded-2xl p-4 text-sm text-[var(--cfc-text-muted)]">
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
