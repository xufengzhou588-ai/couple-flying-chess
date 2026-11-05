import { Check, HeartHandshake, LockKeyhole, Play, Wifi, X } from 'lucide-react';
import type { Translation } from '../../i18n';
import type { Player, Theme } from '../../types';
import type { RemoteRoomRole } from '../../utils/remoteRoom';
import { CharacterToken } from '../CharacterToken';

interface RemoteSetupModalProps {
  isOpen: boolean;
  roomCode: string;
  roomRole: RemoteRoomRole | null;
  players: Player[];
  themes: Theme[];
  copy: Translation;
  localPlayerId: number | null;
  partnerPlayerId: number | null;
  canStart: boolean;
  onSelectPlayer: (playerId: number) => void;
  onSelectTheme: (playerId: number) => void;
  onStart: () => void;
  onClose: () => void;
}

export function RemoteSetupModal({
  isOpen,
  roomCode,
  roomRole,
  players,
  themes,
  copy,
  localPlayerId,
  partnerPlayerId,
  canStart,
  onSelectPlayer,
  onSelectTheme,
  onStart,
  onClose
}: RemoteSetupModalProps) {
  if (!isOpen) return null;

  const selectionReady = localPlayerId !== null && partnerPlayerId !== null && localPlayerId !== partnerPlayerId;
  const myPlayer = players.find(player => player.id === localPlayerId);
  const myTheme = themes.find(theme => theme.id === myPlayer?.themeId);
  const partnerPlayer = players.find(player => player.id === partnerPlayerId);
  const partnerTheme = themes.find(theme => theme.id === partnerPlayer?.themeId);
  const canChooseCharacter = localPlayerId === null && (roomRole === 'host' || partnerPlayerId !== null);

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center px-4 pb-4 sm:items-center" role="dialog" aria-modal="true" aria-label={copy.invite.setupTitle}>
      <button type="button" className="cfc-modal-scrim" onClick={onClose} aria-label={copy.invite.close} />
      <div className="cfc-dialog-card relative max-h-[92dvh] w-full max-w-[390px] overflow-y-auto p-5 pb-[max(20px,env(safe-area-inset-bottom))] no-scrollbar">
        <button type="button" className="cfc-action-secondary absolute right-4 top-4 h-10 w-10 rounded-2xl p-0 text-white/76" onClick={onClose} aria-label={copy.invite.close}><X size={18} /></button>

        <div className="pr-12">
          <div className="cfc-icon-tile mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--cfc-mint)] text-[#061510]"><HeartHandshake size={23} /></div>
          <h2 className="text-2xl font-black leading-tight text-white" role="status">{copy.invite.setupTitle}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--cfc-text-muted)]">{copy.invite.setupSubtitle}</p>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-emerald-200/20 bg-emerald-200/10 px-3 py-2 text-xs font-bold text-emerald-100">
          <span className="flex items-center gap-2"><Wifi size={15} />{copy.invite.partnerOnline}</span>
          <span className="font-mono tracking-wider">{roomCode}</span>
        </div>

        <div className="mt-5">
          <h3 className="text-sm font-black text-white">1 · {copy.invite.chooseCharacter}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[var(--cfc-text-muted)]">
            {roomRole === 'guest' && partnerPlayerId === null ? copy.invite.waitForHostCharacter : copy.invite.chooseCharacterHint}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {players.map(player => {
              const selectedByMe = localPlayerId === player.id;
              const selectedByPartner = partnerPlayerId === player.id;
              const canPick = canChooseCharacter && !selectedByPartner;
              return <button
                key={player.id}
                type="button"
                aria-label={`${copy.invite.chooseCharacter}: ${player.name}`}
                aria-pressed={selectedByMe}
                data-role-player-id={player.id}
                disabled={!canPick}
                onClick={() => onSelectPlayer(player.id)}
                className={`cfc-info-card flex min-h-[116px] flex-col items-center justify-center rounded-[20px] p-3 text-center ${selectedByMe ? 'border-emerald-200/55 bg-emerald-200/15' : selectedByPartner ? 'opacity-55' : ''} ${canPick ? 'cfc-pressable' : ''}`}
              >
                <CharacterToken player={player} mood="idle" size="home" />
                <strong className="mt-2 text-sm text-white">{player.name}</strong>
                <small className="mt-1 text-[11px] text-white/60">{selectedByMe ? copy.invite.yourCharacter : selectedByPartner ? copy.invite.partnerCharacter : canPick ? copy.invite.tapToChoose : copy.invite.waiting}</small>
              </button>;
            })}
          </div>
        </div>

        {localPlayerId !== null ? (
          <div className="mt-5">
            <h3 className="text-sm font-black text-white">2 · {copy.invite.chooseDeck}</h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--cfc-text-muted)]">{copy.invite.chooseDeckHint}</p>
            <button type="button" data-select-deck={localPlayerId} className="cfc-info-card cfc-pressable mt-3 flex w-full items-center justify-between gap-3 rounded-[20px] p-4 text-left" onClick={() => onSelectTheme(localPlayerId)}>
              <span className="min-w-0"><strong className="block text-sm text-white">{myPlayer?.name}</strong><small className="mt-1 block truncate text-xs text-white/60">{myTheme?.name || copy.chooseTheme}</small></span>
              {myTheme ? <Check size={19} className="shrink-0 text-emerald-200" /> : <Play size={17} className="shrink-0 text-white/65" />}
            </button>
            <div className="mt-2 flex items-center gap-2 rounded-2xl bg-black/18 px-3 py-2 text-xs text-white/55"><LockKeyhole size={14} />{partnerPlayer ? `${partnerPlayer.name}: ${partnerTheme?.name || copy.invite.waitingForDeck}` : copy.invite.waitingForCharacter}</div>
          </div>
        ) : null}

        <div className="mt-5 rounded-[20px] border border-sky-100/18 bg-sky-100/10 p-3">
          {roomRole === 'host' ? (
            <button type="button" className="cfc-action-primary h-12 w-full disabled:cursor-not-allowed disabled:opacity-45" disabled={!selectionReady || !canStart} onClick={onStart}><Play size={17} />{copy.invite.startTogether}</button>
          ) : (
            <p className="py-2 text-center text-sm font-bold text-sky-100" role="status">{selectionReady && canStart ? copy.invite.waitingForStart : copy.invite.finishSetupFirst}</p>
          )}
          {roomRole === 'host' && (!selectionReady || !canStart) ? <p className="mt-2 text-center text-xs text-sky-100/70">{copy.invite.startWhenReady}</p> : null}
        </div>
      </div>
    </div>
  );
}
