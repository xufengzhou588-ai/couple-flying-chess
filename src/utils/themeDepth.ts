import { Theme } from '../types';

export type ThemeStageKey =
  | 'early'
  | 'warming'
  | 'flexible'
  | 'steady'
  | 'intimate'
  | 'cohabit'
  | 'deep'
  | 'boundary'
  | 'custom';

export interface ThemeDepthInfo {
  rank: number;
  level: number | null;
  stageKey: ThemeStageKey;
}

const DEFAULT_THEME_DEPTH: Record<string, ThemeDepthInfo> = {
  spark: { rank: 10, level: 1, stageKey: 'early' },
  wine: { rank: 20, level: 2, stageKey: 'warming' },
  'truth-dare-intimacy': { rank: 25, level: null, stageKey: 'flexible' },
  mischief: { rank: 30, level: 3, stageKey: 'steady' },
  afterdark: { rank: 40, level: 4, stageKey: 'intimate' },
  tease: { rank: 50, level: 5, stageKey: 'cohabit' },
  'deep-love': { rank: 60, level: 6, stageKey: 'deep' },
  'private-boundary': { rank: 70, level: 7, stageKey: 'boundary' }
};

const LEVEL_STAGE: Record<number, ThemeStageKey> = {
  1: 'early',
  2: 'warming',
  3: 'steady',
  4: 'intimate',
  5: 'cohabit',
  6: 'deep',
  7: 'boundary'
};

export function getThemeDepthInfo(theme: Theme): ThemeDepthInfo {
  const known = DEFAULT_THEME_DEPTH[theme.id];
  if (known) return known;

  if (theme.category === 'truth-dare') {
    return { rank: 25, level: null, stageKey: 'flexible' };
  }

  const levelMatch = theme.desc.match(/(?:Level|Nivel)\s*(\d+)/i);
  const parsedLevel = levelMatch ? Number(levelMatch[1]) : null;
  if (parsedLevel && parsedLevel >= 1 && parsedLevel <= 7) {
    return {
      rank: parsedLevel * 10,
      level: parsedLevel,
      stageKey: LEVEL_STAGE[parsedLevel] || 'custom'
    };
  }

  return { rank: 90, level: null, stageKey: 'custom' };
}

export function compareThemesByDepth(a: Theme, b: Theme) {
  const aInfo = getThemeDepthInfo(a);
  const bInfo = getThemeDepthInfo(b);

  if (aInfo.rank !== bInfo.rank) return aInfo.rank - bInfo.rank;
  if ((a.access || 'free') !== (b.access || 'free')) {
    return a.access === 'premium' ? 1 : -1;
  }
  return a.name.localeCompare(b.name);
}
