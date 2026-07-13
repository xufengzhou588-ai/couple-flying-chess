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
    <div className="fixed inset-0 z-[120]">
      <div className="absolute inset-0 bg-black/68 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 rounded-t-[30px] border-t border-white/12 bg-[#130d16] p-5 shadow-2xl">
        <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-white/28" />
        <h3 className="mb-5 text-xl font-black text-white">{copy.form.newTheme}</h3>

        <div className="space-y-4 pb-7">
          <label className="block space-y-2">
            <span className="text-xs font-semibold text-white/52">{copy.form.themeName}</span>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-white outline-none focus:border-rose-200/40"
              placeholder={copy.form.namePlaceholder}
              maxLength={24}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-semibold text-white/52">{copy.form.desc}</span>
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 text-white outline-none focus:border-rose-200/40"
              placeholder={copy.form.descPlaceholder}
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

          {error && <div className="text-sm text-rose-300">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button
              className="h-12 flex-1 rounded-2xl bg-white/10 text-sm font-black text-white/76 transition active:scale-[0.98]"
              onClick={onClose}
            >
              {copy.form.cancel}
            </button>
            <button
              className="h-12 flex-1 rounded-2xl bg-white text-sm font-black text-[#14070d] transition active:scale-[0.98] disabled:opacity-40"
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
