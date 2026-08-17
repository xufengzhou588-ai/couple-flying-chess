import { useEffect, useMemo, useState } from 'react';
import { Translation } from '../../i18n';
import { Theme } from '../../types';

interface ThemeCreateModalProps {
  isOpen: boolean;
  copy: Translation;
  onClose: () => void;
  onCreate: (input: { name: string; desc: string; audience: Theme['audience'] }) => void;
}

const audienceValues: Theme['audience'][] = ['common', 'male', 'female'];

export function ThemeCreateModal({ isOpen, copy, onClose, onCreate }: ThemeCreateModalProps) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [audience, setAudience] = useState<Theme['audience']>('common');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setName('');
    setDesc('');
    setAudience('common');
    setError('');
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const canSubmit = useMemo(() => name.trim().length > 0, [name]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true" aria-label={copy.form.newTheme}>
      <button type="button" className="cfc-modal-scrim" onClick={onClose} aria-label={copy.form.cancel} />
      <div className="cfc-sheet absolute inset-x-0 bottom-0">
        <div className="cfc-sheet-handle" />
        <h3 className="mb-5 text-xl font-black text-white">{copy.form.newTheme}</h3>

        <div className="space-y-4 pb-7">
          <label className="block space-y-2">
            <span className="cfc-field-label">{copy.form.themeName}</span>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="cfc-input"
              placeholder={copy.form.namePlaceholder}
              maxLength={24}
            />
          </label>

          <label className="block space-y-2">
            <span className="cfc-field-label">{copy.form.desc}</span>
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="cfc-input"
              placeholder={copy.form.descPlaceholder}
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

          {error && <div className="text-sm text-rose-300">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="cfc-action-secondary flex-1"
              onClick={onClose}
            >
              {copy.form.cancel}
            </button>
            <button
              type="button"
              className="cfc-action-primary flex-1"
              disabled={!canSubmit}
              onClick={() => {
                if (!name.trim()) {
                  setError(copy.form.nameRequired);
                  return;
                }
                onCreate({ name: name.trim(), desc: desc.trim(), audience });
              }}
            >
              {copy.form.createAndEdit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
