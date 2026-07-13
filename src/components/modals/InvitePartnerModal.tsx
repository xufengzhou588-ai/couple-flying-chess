import { useMemo, useState } from 'react';
import { Copy, Share2, Smartphone, Users, Wifi, X } from 'lucide-react';
import { Translation } from '../../i18n';
import { createRemoteChannelName, getRemoteRoomConfig } from '../../utils/remoteRoom';

interface InvitePartnerModalProps {
  isOpen: boolean;
  copy: Translation;
  onClose: () => void;
}

function createRoomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

export function InvitePartnerModal({ isOpen, copy, onClose }: InvitePartnerModalProps) {
  const [copied, setCopied] = useState(false);
  const roomCode = useMemo(() => createRoomCode(), []);
  const remoteConfig = useMemo(() => getRemoteRoomConfig(), []);
  const channelName = useMemo(() => createRemoteChannelName(roomCode), [roomCode]);
  const inviteUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('room', roomCode);
    return url.toString();
  }, [roomCode]);

  if (!isOpen) return null;

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  const shareInvite = async () => {
    if (!navigator.share) {
      await copyInvite();
      return;
    }

    try {
      await navigator.share({
        title: copy.brand,
        text: `${copy.invite.roomCode}: ${roomCode}`,
        url: inviteUrl
      });
    } catch {
      // Sharing can be cancelled by the user.
    }
  };

  return (
    <div className="fixed inset-0 z-[135] flex items-end justify-center px-4 pb-4 sm:items-center">
      <div className="absolute inset-0 bg-black/72 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[390px] overflow-hidden rounded-[28px] border border-white/14 bg-[#120d16] p-5 shadow-2xl">
        <button
          type="button"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-white/76 active:scale-95"
          onClick={onClose}
          aria-label={copy.invite.close}
        >
          <X size={18} />
        </button>

        <div className="pr-12">
          <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-200 text-[#07111d]">
            <Users size={23} />
          </div>
          <h3 className="text-2xl font-black leading-tight text-white">{copy.invite.title}</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-white/58">{copy.invite.subtitle}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[22px] border border-white/10 bg-white/[0.07] p-4">
            <Smartphone className="mb-3 text-rose-100" size={22} />
            <div className="font-black text-white">{copy.invite.localTitle}</div>
            <p className="mt-2 text-xs leading-relaxed text-white/54">{copy.invite.localDesc}</p>
          </div>
          <div className="rounded-[22px] border border-sky-100/18 bg-sky-100/10 p-4">
            <Wifi className="mb-3 text-sky-100" size={22} />
            <div className="font-black text-white">{copy.invite.remoteTitle}</div>
            <p className="mt-2 text-xs leading-relaxed text-white/54">{copy.invite.remoteDesc}</p>
          </div>
        </div>

        <div className="mt-4 rounded-[24px] border border-amber-100/18 bg-amber-100/10 p-4 text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-100/60">
            {copy.invite.roomCode}
          </div>
          <div className="mt-2 font-mono text-4xl font-black tracking-[0.22em] text-white">
            {roomCode}
          </div>
        </div>

        <div
          className={`mt-3 rounded-[20px] border px-3 py-2 text-xs leading-relaxed ${
            remoteConfig.status === 'ready'
              ? 'border-emerald-200/20 bg-emerald-200/10 text-emerald-100/82'
              : 'border-white/10 bg-white/[0.06] text-white/48'
          }`}
        >
          <div className="font-black">
            {remoteConfig.status === 'ready' ? copy.invite.remoteReady : copy.invite.remotePending}
          </div>
          <div className="mt-1 break-all">
            {remoteConfig.status === 'ready'
              ? `${copy.invite.channel}: ${channelName}`
              : copy.invite.remotePendingHint}
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-white text-sm font-black text-[#16090f] transition active:scale-[0.98]"
            onClick={copyInvite}
          >
            <Copy size={17} />
            {copied ? copy.invite.copied : copy.invite.copyLink}
          </button>
          <button
            type="button"
            className="flex h-12 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-white transition active:scale-[0.98]"
            onClick={shareInvite}
            aria-label={copy.invite.share}
          >
            <Share2 size={18} />
          </button>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-white/46">{copy.invite.next}</p>
      </div>
    </div>
  );
}
