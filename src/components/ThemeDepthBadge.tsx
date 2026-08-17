import {
  Flame,
  Gem,
  Heart,
  HeartHandshake,
  KeyRound,
  Sparkles,
  VenetianMask,
  Wine
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Translation } from '../i18n';
import { ThemeDepthInfo, ThemeStageKey } from '../utils/themeDepth';

interface ThemeDepthVisual {
  Icon: LucideIcon;
  Icons?: LucideIcon[];
  medallion: string;
  pill: string;
  bubble: string;
}

const DEPTH_VISUALS: Record<ThemeStageKey, ThemeDepthVisual> = {
  early: {
    Icon: Heart,
    medallion: 'border-rose-100/18 bg-rose-300/14 text-rose-100 shadow-[0_0_24px_rgba(251,113,133,0.16)]',
    pill: 'border-rose-100/18 bg-rose-100/10 text-rose-50',
    bubble: 'bg-rose-100 text-[#251018]'
  },
  warming: {
    Icon: Wine,
    medallion: 'border-amber-100/18 bg-amber-200/12 text-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.14)]',
    pill: 'border-amber-100/18 bg-amber-100/10 text-amber-50',
    bubble: 'bg-amber-100 text-[#25170a]'
  },
  flexible: {
    Icon: HeartHandshake,
    medallion: 'border-fuchsia-100/18 bg-fuchsia-300/13 text-fuchsia-100 shadow-[0_0_24px_rgba(217,70,239,0.14)]',
    pill: 'border-fuchsia-100/18 bg-fuchsia-100/10 text-fuchsia-50',
    bubble: 'bg-fuchsia-100 text-[#260f2a]'
  },
  steady: {
    Icon: Sparkles,
    medallion: 'border-red-100/18 bg-red-300/12 text-red-100 shadow-[0_0_24px_rgba(248,113,113,0.13)]',
    pill: 'border-red-100/18 bg-red-100/10 text-red-50',
    bubble: 'bg-red-100 text-[#260d12]'
  },
  intimate: {
    Icon: Flame,
    medallion: 'border-pink-100/18 bg-pink-300/12 text-pink-100 shadow-[0_0_24px_rgba(244,114,182,0.14)]',
    pill: 'border-pink-100/18 bg-pink-100/10 text-pink-50',
    bubble: 'bg-pink-100 text-[#260f1c]'
  },
  cohabit: {
    Icon: Flame,
    Icons: [Heart, Flame, Wine],
    medallion: 'border-orange-100/18 bg-orange-300/13 text-orange-100 shadow-[0_0_26px_rgba(251,146,60,0.16)]',
    pill: 'border-orange-100/18 bg-orange-100/10 text-orange-50',
    bubble: 'bg-orange-100 text-[#281205]'
  },
  deep: {
    Icon: VenetianMask,
    Icons: [Heart, Flame, VenetianMask],
    medallion: 'border-violet-100/18 bg-violet-300/13 text-violet-100 shadow-[0_0_26px_rgba(167,139,250,0.16)]',
    pill: 'border-violet-100/18 bg-violet-100/10 text-violet-50',
    bubble: 'bg-violet-100 text-[#1d1230]'
  },
  boundary: {
    Icon: KeyRound,
    Icons: [Flame, VenetianMask, KeyRound],
    medallion: 'border-cyan-100/18 bg-cyan-300/12 text-cyan-100 shadow-[0_0_26px_rgba(103,232,249,0.14)]',
    pill: 'border-cyan-100/18 bg-cyan-100/10 text-cyan-50',
    bubble: 'bg-cyan-100 text-[#091f26]'
  },
  custom: {
    Icon: Gem,
    medallion: 'border-white/16 bg-white/10 text-white/88 shadow-[0_0_22px_rgba(255,255,255,0.1)]',
    pill: 'border-white/16 bg-white/10 text-white/82',
    bubble: 'bg-white/88 text-[#171018]'
  }
};

interface ThemeDepthProps {
  depth: ThemeDepthInfo;
}

export function ThemeDepthMark({ depth }: ThemeDepthProps) {
  const visual = DEPTH_VISUALS[depth.stageKey];
  const Icon = visual.Icon;

  return (
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border ${visual.medallion}`}>
      {visual.Icons ? (
        <span className="grid grid-cols-3 items-center gap-0.5 px-1">
          {visual.Icons.map((SmallIcon, index) => (
            <SmallIcon key={index} size={10} strokeWidth={2.45} />
          ))}
        </span>
      ) : (
        <Icon size={20} strokeWidth={2.25} />
      )}
    </span>
  );
}

interface ThemeDepthPillProps extends ThemeDepthProps {
  copy: Translation;
  compact?: boolean;
}

export function ThemeDepthPill({ depth, copy, compact = false }: ThemeDepthPillProps) {
  const visual = DEPTH_VISUALS[depth.stageKey];
  const Icon = visual.Icon;
  const stage = copy.themeDepth.stages[depth.stageKey];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-black ${visual.pill} ${
        compact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[10px]'
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-full ${visual.bubble} ${
          visual.Icons
            ? compact
              ? 'h-[18px] w-8'
              : 'h-5 w-9'
            : compact
              ? 'h-[18px] w-[18px]'
              : 'h-5 w-5'
        }`}
      >
        {visual.Icons ? (
          <span className="grid grid-cols-3 items-center gap-px">
            {visual.Icons.map((SmallIcon, index) => (
              <SmallIcon key={index} size={compact ? 7 : 8} strokeWidth={2.6} />
            ))}
          </span>
        ) : (
          <Icon size={compact ? 10 : 11} strokeWidth={2.5} />
        )}
      </span>
      <span>{stage.title}</span>
    </span>
  );
}
