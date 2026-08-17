export type TruthDareKind = 'truth' | 'dare' | 'chemistry' | 'boundary' | 'custom';
export type TruthDareIntensity = 'gentle' | 'flirty' | 'heated' | 'finale';

export const TRUTH_DARE_THEME_ID = 'truth-dare-intimacy';

interface ParsedTaskTag {
  label: string;
  kindLabel: string | null;
  intensityLabel: string | null;
  text: string;
}

const TASK_TAG_PATTERN = /^【([^】]+)】\s*(.*)$/;

export function parseTaskTag(task: string): ParsedTaskTag {
  const match = task.match(TASK_TAG_PATTERN);
  if (!match) {
    return {
      label: '',
      kindLabel: null,
      intensityLabel: null,
      text: task
    };
  }

  const label = match[1].trim();
  const parts = label.split('·').map(item => item.trim()).filter(Boolean);

  return {
    label,
    kindLabel: parts[0] || null,
    intensityLabel: parts[1] || null,
    text: match[2].trim() || task
  };
}

export function createTaggedTask(kindLabel: string, intensityLabel: string, text: string) {
  return `【${kindLabel} · ${intensityLabel}】 ${text.trim()}`;
}

export function isFinaleTask(task: string) {
  const parsed = parseTaskTag(task);
  const label = `${parsed.kindLabel || ''} ${parsed.intensityLabel || ''}`.toLowerCase();
  return /终局|finale|final|personalizada/.test(label);
}
