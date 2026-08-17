import { ChevronRight, Crown, Flame, Gift, HeartHandshake, LogIn, Share2, Shuffle, Wifi } from 'lucide-react';
import { Player, Theme } from '../../types';
import { Translation } from '../../i18n';
import { CharacterToken } from '../CharacterToken';
import { RemoteRoomRole, RemoteSyncStatus } from '../../utils/remoteRoom';

interface HomeViewProps {
  players: Player[];
  themes: Theme[];
  copy: Translation;
  rewardCount: number;
  remoteRoomCode: string | null;
  remoteRole: RemoteRoomRole | null;
  remoteSyncStatus: RemoteSyncStatus;
  remoteHasPartner: boolean;
  showPremium: boolean;
  onSelectTheme: (playerId: number) => void;
  onOpenPremium: () => void;
  onOpenInvite: () => void;
  onOpenJoinInvite: () => void;
  onOpenRewards: () => void;
}

export function HomeView({
  players,
  themes,
  copy,
  rewardCount,
  remoteRoomCode,
  remoteRole,
  remoteSyncStatus,
  remoteHasPartner,
  showPremium,
  onSelectTheme,
  onOpenPremium,
  onOpenInvite,
  onOpenJoinInvite,
  onOpenRewards
}: HomeViewProps) {
  const selectedCount = players.filter(player => player.themeId).length;
  const totalTasks = players.reduce((count, player) => {
    const theme = themes.find(item => item.id === player.themeId);
    return count + (theme?.tasks.length || 0);
  }, 0);

  return (
    <div className="home-view flex min-h-0 flex-1 flex-col overflow-hidden no-scrollbar">
      <section className="home-hero">
        <div className="max-w-[330px]">
          <p className="home-tagline text-sm font-semibold text-rose-100/80">{copy.tagline}</p>
          <h2 className="home-hero-title font-black leading-[1.05] tracking-normal">
            {copy.heroLine1}
            <br />
            {copy.heroLine2}
          </h2>
        </div>
      </section>

      <div className="home-stats grid grid-cols-3 gap-2">
        <div className="home-stat-card cfc-surface rounded-[18px] px-3 py-3">
          <HeartHandshake className="home-stat-icon text-[var(--cfc-rose-soft)]" size={18} />
          <div className="home-stat-value font-black">{selectedCount}/2</div>
          <div className="home-stat-label text-[11px] text-[var(--cfc-text-muted)]">{copy.selectedThemes}</div>
        </div>
        <div className="home-stat-card cfc-surface rounded-[18px] px-3 py-3">
          <Flame className="home-stat-icon text-[var(--cfc-amber)]" size={18} />
          <div className="home-stat-value font-black">{totalTasks}</div>
          <div className="home-stat-label text-[11px] text-[var(--cfc-text-muted)]">{copy.tonightCards}</div>
        </div>
        <div className="home-stat-card cfc-surface rounded-[18px] px-3 py-3">
          <Shuffle className="home-stat-icon text-[var(--cfc-sky)]" size={18} />
          <div className="home-stat-value font-black">{copy.random}</div>
          <div className="home-stat-label text-[11px] text-[var(--cfc-text-muted)]">{copy.heatRoute}</div>
        </div>
      </div>

      {remoteRoomCode && (
        <div className="home-remote-card cfc-surface flex items-center justify-between gap-3 rounded-[20px] p-3 text-left">
          <div className="flex min-w-0 items-center gap-3">
            <div className="cfc-icon-tile flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--cfc-mint)] text-[#061510]">
              <Wifi size={18} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-black text-white">
                {copy.remote.roomLabel} {remoteRoomCode}
              </div>
              <div className="mt-0.5 text-[11px] leading-relaxed text-[var(--cfc-text-muted)]">
                {remoteRole === 'guest' ? copy.invite.guestRole : copy.invite.hostRole} ·{' '}
                {remoteHasPartner ? copy.remote.partnerOnline : copy.remote.partnerWaiting}
              </div>
            </div>
          </div>
          <div
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              remoteSyncStatus === 'connected' ? 'bg-emerald-200' : 'bg-amber-200'
            }`}
          />
        </div>
      )}

      <button
        type="button"
        className="home-wide-action cfc-pressable cfc-surface flex w-full items-center gap-3 rounded-[20px] p-3 text-left"
        onClick={onOpenRewards}
      >
        <div className="home-action-icon cfc-icon-tile flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--cfc-amber)] text-[#321304]">
          <Gift size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="home-action-title font-black text-white">{copy.finalRewards}</div>
          <div className="home-action-hint mt-0.5 text-[11px] text-[var(--cfc-text-muted)]">
            {rewardCount} {copy.rewardsReady}
          </div>
        </div>
        <ChevronRight size={19} className="text-white/42" />
      </button>

      {showPremium && (
        <button
          type="button"
          className="home-wide-action cfc-pressable cfc-surface-strong flex w-full items-center gap-3 rounded-[20px] p-3 text-left"
          onClick={onOpenPremium}
        >
          <div className="home-action-icon cfc-icon-tile flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--cfc-rose-soft)] text-[#321018]">
            <Crown size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="home-action-title font-black text-white">{copy.premiumEntry}</div>
            <div className="home-action-hint mt-0.5 text-[11px] leading-relaxed text-[var(--cfc-text-muted)]">
              {copy.premiumEntryHint}
            </div>
          </div>
          <ChevronRight size={19} className="text-white/42" />
        </button>
      )}

      <div className="home-invite-grid grid grid-cols-2 gap-2">
        <button
          type="button"
          className="home-square-action cfc-pressable cfc-surface flex min-h-[112px] w-full flex-col justify-between rounded-[20px] p-3 text-left"
          onClick={onOpenInvite}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="home-small-action-icon cfc-icon-tile flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--cfc-sky)] text-[#07111d]">
              <Share2 size={19} />
            </div>
            <ChevronRight size={18} className="text-white/42" />
          </div>
          <div>
            <div className="home-action-title font-black text-white">{copy.inviteEntry}</div>
            <div className="home-action-hint mt-1 text-[11px] leading-relaxed text-[var(--cfc-text-muted)]">
              {copy.inviteEntryHint}
            </div>
          </div>
        </button>

        <button
          type="button"
          className="home-square-action cfc-pressable cfc-surface flex min-h-[112px] w-full flex-col justify-between rounded-[20px] p-3 text-left"
          onClick={onOpenJoinInvite}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="home-small-action-icon cfc-icon-tile flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--cfc-mint)] text-[#061510]">
              <LogIn size={19} />
            </div>
            <ChevronRight size={18} className="text-white/42" />
          </div>
          <div>
            <div className="home-action-title font-black text-white">{copy.joinEntry}</div>
            <div className="home-action-hint mt-1 text-[11px] leading-relaxed text-[var(--cfc-text-muted)]">
              {copy.joinEntryHint}
            </div>
          </div>
        </button>
      </div>

      <div className="home-player-list space-y-3">
        {players.map((player, idx) => {
          const theme = themes.find(t => t.id === player.themeId);
          return (
            <button
              key={player.id}
              type="button"
              className="home-player-card cfc-pressable cfc-surface group w-full rounded-[22px] p-4 text-left"
              onClick={() => onSelectTheme(player.id)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="home-player-avatar flex h-14 w-14 shrink-0 items-center justify-center"
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
                    <div className="home-player-name text-sm font-bold text-white">{player.name}</div>
                    <div className="home-player-theme mt-1 truncate text-[13px] text-[var(--cfc-text-muted)]">
                      {theme ? theme.name : copy.chooseTheme}
                    </div>
                    {theme && (
                      <div className="home-player-desc mt-2 text-[11px] text-rose-100/65">
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
    </div>
  );
}
