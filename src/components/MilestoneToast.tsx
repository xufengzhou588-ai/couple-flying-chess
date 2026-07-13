import { Flame, Sparkles } from 'lucide-react';
import { MilestoneEventData } from '../types';

export function MilestoneToast({
  event,
  unlockedLabel
}: {
  event: MilestoneEventData | null;
  unlockedLabel: string;
}) {
  if (!event) return null;

  return (
    <div className="pointer-events-none fixed inset-x-4 top-[22%] z-[115] mx-auto max-w-sm animate-[milestone-in_2.8s_ease_both]">
      <div className="overflow-hidden rounded-[24px] border border-amber-100/25 bg-[#1b1018]/94 p-5 text-center shadow-[0_28px_90px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-[#321304]">
          {event.threshold === 75 ? <Flame size={23} /> : <Sparkles size={23} />}
        </div>
        <div className="mt-3 text-[10px] font-black uppercase text-amber-200/72">
          {event.threshold}% {unlockedLabel}
        </div>
        <h3 className="mt-1 text-xl font-black text-white">{event.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/68">{event.line}</p>
      </div>
    </div>
  );
}
