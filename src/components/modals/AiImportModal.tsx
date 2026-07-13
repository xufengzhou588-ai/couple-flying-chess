import { useEffect, useMemo, useState } from 'react';
import { Translation } from '../../i18n';
import { Locale } from '../../types';

interface AiImportModalProps {
  isOpen: boolean;
  themeName: string;
  locale: Locale;
  copy: Translation;
  onClose: () => void;
  onImport: (tasks: string[], mode: 'append' | 'replace') => void;
}

export function AiImportModal({ isOpen, themeName, locale, copy, onClose, onImport }: AiImportModalProps) {
  const [mode, setMode] = useState<'append' | 'replace'>('append');
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setMode('append');
    setJsonText('');
    setError('');
    setCopied(false);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const prompt = useMemo(() => {
    if (locale === 'en') {
      return `You are writing dares for an American couples party game called Couple Flight Chess. Create 24 English dares for a deck named "${themeName}".

Rules:
1. Write original American-style flirting, not translated Chinese phrasing.
2. Use playful confidence, teasing, rom-com humor, cheesy pickup lines, poker-face jokes, and light competition.
3. Match the deck name's heat level. Keep lower levels cute; allow direct adult intimacy only when the deck clearly signals a high level.
4. Assume both players are consenting adults. Every dare must allow an immediate pause, softer version, or pass.
5. Each dare must be a specific, doable action in 8 to 24 words.
6. Avoid clinical wording, porn-style narration, coercion, humiliation, and gender stereotypes.
7. Include some prop-based mini games such as blindfold touch guessing with feather, ice, warm towel, chocolate, or fingertips.
8. Do not number items, use Markdown, or add explanations.

Only output JSON:
{"tasks":["task 1","task 2"]}`;
    }

    return `你是情侣桌游任务设计师。请围绕「${themeName}」生成 24 条中文情侣飞行棋挑战任务。

要求：
1. 根据主题名称判断升温等级，低等级轻松浪漫，高等级可更直接表达成年人之间的身体亲密。
2. 文案要像中文情侣桌游原创内容，不要翻译腔；加入撒娇、反差、输赢玩笑和轻微挑衅。
3. 默认双方均为自愿参与的成年人；每条任务都允许暂停、降级或跳过。
4. 每条 8 到 30 个字，必须是具体、可执行的动作。
5. 避免临床措辞、色情片式描述、强迫、羞辱和性别刻板印象。
6. 可加入道具玩法，例如眼罩触觉盲盒、羽毛、冰块、热毛巾、巧克力或指尖猜谜。
7. 不要编号，不要 Markdown，不要解释。

只输出 JSON：
{"tasks":["任务1","任务2"]}`;
  }, [locale, themeName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[140]">
      <div className="absolute inset-0 bg-black/72 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 max-h-[88vh] rounded-t-[30px] border-t border-white/12 bg-[#130d16] p-5 shadow-2xl">
        <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-white/28" />

        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-white">{copy.ai.title}</h3>
            <p className="mt-1 text-xs text-white/46">{copy.ai.subtitle}</p>
          </div>
          <button
            className={`h-10 shrink-0 rounded-2xl px-4 text-sm font-black transition active:scale-[0.98] ${
              copied ? 'bg-emerald-300 text-[#04140d]' : 'bg-white text-[#14070d]'
            }`}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(prompt);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? copy.ai.copied : copy.ai.copy}
          </button>
        </div>

        <div className="max-h-[70vh] space-y-4 overflow-y-auto pb-8 no-scrollbar">
          <label className="block space-y-2">
            <span className="text-xs font-semibold text-white/52">{copy.ai.promptLabel}</span>
            <textarea
              value={prompt}
              readOnly
              className="h-36 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-sm leading-relaxed text-white/74 outline-none"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-semibold text-white/52">{copy.ai.pasteLabel}</span>
            <textarea
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              className="h-40 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-sm leading-relaxed text-white outline-none focus:border-rose-200/40"
              placeholder={copy.ai.placeholder}
            />
          </label>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-white/52">{copy.ai.importMode}</div>
            <div className="grid grid-cols-2 gap-2">
              {(['append', 'replace'] as const).map(value => (
                <button
                  key={value}
                  className={`h-11 rounded-2xl border text-sm font-black transition active:scale-[0.98] ${
                    mode === value
                      ? 'border-white bg-white text-[#14070d]'
                      : 'border-white/10 bg-white/[0.07] text-white/68'
                  }`}
                  onClick={() => setMode(value)}
                >
                  {value === 'append' ? copy.ai.append : copy.ai.replace}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="text-sm text-rose-300">{error}</div>}

          <div className="flex gap-3 pt-1">
            <button
              className="h-12 flex-1 rounded-2xl bg-white/10 text-sm font-black text-white/76 transition active:scale-[0.98]"
              onClick={onClose}
            >
              {copy.form.cancel}
            </button>
            <button
              className="h-12 flex-1 rounded-2xl bg-white text-sm font-black text-[#14070d] transition active:scale-[0.98]"
              onClick={() => {
                setError('');
                const raw = jsonText.trim();
                if (!raw) {
                  setError(copy.ai.pasteJson);
                  return;
                }

                try {
                  const parsed: unknown = JSON.parse(raw);
                  const isRecord = (v: unknown): v is Record<string, unknown> =>
                    !!v && typeof v === 'object' && !Array.isArray(v);
                  const list: unknown[] | null = Array.isArray(parsed)
                    ? parsed
                    : isRecord(parsed) && Array.isArray(parsed.tasks)
                      ? parsed.tasks
                      : null;

                  if (!list) {
                    setError(copy.ai.badFormat);
                    return;
                  }

                  const tasks = list
                    .map(item => {
                      if (typeof item === 'string') return item.trim();
                      if (isRecord(item) && typeof item.task === 'string') return item.task.trim();
                      return '';
                    })
                    .filter((task): task is string => task.length > 0);

                  if (tasks.length === 0) {
                    setError(copy.ai.noTasks);
                    return;
                  }

                  onImport(tasks, mode);
                  onClose();
                } catch {
                  setError(copy.ai.parseFailed);
                }
              }}
            >
              {copy.ai.import}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
