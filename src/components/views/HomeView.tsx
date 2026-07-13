import { ChevronRight, Crown, Flame, Gift, HeartHandshake, Share2, Shuffle } from 'lucide-react';
import { Player, Theme } from '../../types';
import { Translation } from '../../i18n';
import { CharacterToken } from '../CharacterToken';

interface HomeViewProps {
  players: Player[];
  themes: Theme[];
  copy: Translation;
  rewardCount: number;
  onSelectTheme: (playerId: number) => void;
  onOpenPremium: () => void;
  onOpenInvite: () => void;
  onOpenRewards: () => void;
  onStartGame: () => void;
}

export function HomeView({
  players,
  themes,
  copy,
  rewardCount,
  onSelectTheme,
  onOpenPremium,
  onOpenInvite,
  onOpenRewards,
  onStartGame
}: HomeViewProps) {
  const selectedCount = players.filter(player => player.themeId).length;
  const totalTasks = players.reduce((count, player) => {
    const theme = themes.find(item => item.id === player.themeId);
    return count + (theme?.tasks.length || 0);
  }, 0);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pb-3 no-scrollbar">
      <section className="mb-5 mt-2">
        <div className="max-w-[330px]">
          <p className="mb-2 text-sm font-semibold text-rose-100/80">{copy.tagline}</p>
          <h2 className="text-[34px] font-black leading-[1.05] tracking-normal">
            {copy.heroLine1}
            <br />
            {copy.heroLine2}
          </h2>
        </div>
      </section>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-[18px] border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-md">
          <HeartHandshake className="mb-2 text-rose-200" size={18} />
          <div className="text-lg font-black">{selectedCount}/2</div>
          <div className="text-[11px] text-white/55">{copy.selectedThemes}</div>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-md">
          <Flame className="mb-2 text-amber-200" size={18} />
          <div className="text-lg font-black">{totalTasks}</div>
          <div className="text-[11px] text-white/55">{copy.tonightCards}</div>
        </div>
        <div className="rounded-[18px] border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-md">
          <Shuffle className="mb-2 text-sky-200" size={18} />
          <div className="text-lg font-black">{copy.random}</div>
          <div className="text-[11px] text-white/55">{copy.heatRoute}</div>
        </div>
      </div>

      <button
        type="button"
        className="mb-4 flex w-full items-center gap-3 rounded-[20px] border border-amber-100/20 bg-amber-100/10 p-3 text-left transition active:scale-[0.99]"
        onClick={onOpenRewards}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-[#321304]">
          <Gift size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-black text-white">{copy.finalRewards}</div>
          <div className="mt-0.5 text-[11px] text-white/52">
            {rewardCount} {copy.rewardsReady}
          </div>
        </div>
        <ChevronRight size={19} className="text-white/42" />
      </button>

      <button
        type="button"
        className="mb-4 flex w-full items-center gap-3 rounded-[20px] border border-rose-100/18 bg-[#2a101c]/72 p-3 text-left shadow-[0_16px_44px_rgba(255,79,127,0.16)] transition active:scale-[0.99]"
        onClick={onOpenPremium}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-[#321018]">
          <Crown size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-black text-white">{copy.premiumEntry}</div>
          <div className="mt-0.5 text-[11px] leading-relaxed text-white/52">
            {copy.premiumEntryHint}
          </div>
        </div>
        <ChevronRight size={19} className="text-white/42" />
      </button>

      <button
        type="button"
        className="mb-4 flex w-full items-center gap-3 rounded-[20px] border border-sky-100/18 bg-sky-100/10 p-3 text-left transition active:scale-[0.99]"
        onClick={onOpenInvite}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-200 text-[#07111d]">
          <Share2 size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-black text-white">{copy.inviteEntry}</div>
          <div className="mt-0.5 text-[11px] leading-relaxed text-white/52">
            {copy.inviteEntryHint}
          </div>
        </div>
        <ChevronRight size={19} className="text-white/42" />
      </button>

      <div className="space-y-3">
        {players.map((player, idx) => {
          const theme = themes.find(t => t.id === player.themeId);
          return (
            <button
              key={player.id}
              className="group w-full rounded-[22px] border border-white/12 bg-[#171018]/82 p-4 text-left shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur-xl transition duration-200 active:scale-[0.985]"
              onClick={() => onSelectTheme(player.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center"
                    style={{
                      boxShadow: `0 16px 34px ${player.color}35`
                    }}
                  >
                    <CharacterToken
                      player={player}
                      mood={theme ? (idx === 0 ? 'tease' : 'heart') : 'idle'}
                      size="home"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white">{player.name}</div>
                    <div className="mt-1 truncate text-[13px] text-white/62">
                      {theme ? theme.name : copy.chooseTheme}
                    </div>
                    {theme && (
                      <div className="mt-2 text-[11px] text-rose-100/65">
                        {theme.tasks.length} {copy.cards} · {theme.desc}
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight
                  className="shrink-0 text-white/38 transition group-hover:text-white"
                  size={20}
                />
              </div>
            </button>
          );
        })}
      </div>

      <button
        className="sticky bottom-0 mt-5 flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-white text-base font-black text-[#14070d] shadow-[0_18px_60px_rgba(255,79,127,0.28)] transition active:scale-[0.98]"
        onClick={onStartGame}
      >
        {copy.startGame}
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
