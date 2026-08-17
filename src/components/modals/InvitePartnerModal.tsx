import { useEffect, useMemo, useRef, useState } from 'react';
import type { IScannerControls } from '@zxing/browser';
import {
  Camera,
  Copy,
  Link as LinkIcon,
  Loader2,
  LogIn,
  QrCode,
  Share2,
  Smartphone,
  Users,
  Wifi,
  X
} from 'lucide-react';
import { Translation } from '../../i18n';
import {
  createRemoteChannelName,
  createRoomCode,
  getRemoteRoomConfig,
  normalizeRoomCode,
  type RemotePresenceSnapshot,
  type RemoteRoomRole,
  type RemoteSyncStatus
} from '../../utils/remoteRoom';

type InvitePartnerMode = 'invite' | 'join';

interface InvitePartnerModalProps {
  isOpen: boolean;
  mode: InvitePartnerMode;
  initialRoomCode?: string | null;
  role: RemoteRoomRole | null;
  presence: RemotePresenceSnapshot;
  syncStatus: RemoteSyncStatus;
  copy: Translation;
  onModeChange: (mode: InvitePartnerMode) => void;
  onRoomCodeReady: (roomCode: string, options?: { role?: RemoteRoomRole; waitForHost?: boolean }) => void;
  onClose: () => void;
}

function readRoomCodeFromInput(value: string) {
  const input = value.trim();

  try {
    const url = new URL(input);
    return normalizeRoomCode(url.searchParams.get('room') || input);
  } catch {
    return normalizeRoomCode(input);
  }
}

export function InvitePartnerModal({
  isOpen,
  mode,
  initialRoomCode,
  role,
  presence,
  syncStatus,
  copy,
  onModeChange,
  onRoomCodeReady,
  onClose
}: InvitePartnerModalProps) {
  const [copied, setCopied] = useState(false);
  const [joinInput, setJoinInput] = useState('');
  const [joinError, setJoinError] = useState(false);
  const [joinedRoomCode, setJoinedRoomCode] = useState<string | null>(null);
  const [inviteRoomCode, setInviteRoomCode] = useState(() => createRoomCode());
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerError, setScannerError] = useState('');
  const [isScannerStarting, setIsScannerStarting] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerControlsRef = useRef<IScannerControls | null>(null);
  const normalizedInitialRoomCode = useMemo(() => normalizeRoomCode(initialRoomCode), [initialRoomCode]);
  const remoteConfig = useMemo(() => getRemoteRoomConfig(), []);
  const activeRoomCode = mode === 'join' ? joinedRoomCode : inviteRoomCode;
  const channelName = useMemo(
    () => (activeRoomCode ? createRemoteChannelName(activeRoomCode) : ''),
    [activeRoomCode]
  );
  const inviteUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('room', inviteRoomCode);
    return url.toString();
  }, [inviteRoomCode]);

  useEffect(() => {
    if (!isOpen || mode !== 'invite' || !inviteUrl) {
      setQrDataUrl('');
      return;
    }

    let ignore = false;
    import('qrcode').then(({ toDataURL }) => toDataURL(inviteUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      scale: 8,
      color: {
        dark: '#170d16',
        light: '#fff7ed'
      }
    })).then(url => {
      if (!ignore) setQrDataUrl(url);
    });

    return () => {
      ignore = true;
    };
  }, [inviteUrl, isOpen, mode]);

  useEffect(() => {
    if (!isOpen) return;

    setCopied(false);
    setJoinError(false);

    if (normalizedInitialRoomCode) {
      setJoinInput(normalizedInitialRoomCode);
      setJoinedRoomCode(normalizedInitialRoomCode);
      if (mode === 'invite') setInviteRoomCode(normalizedInitialRoomCode);
    }
  }, [isOpen, mode, normalizedInitialRoomCode]);

  useEffect(() => {
    if (!isOpen || mode !== 'invite') return;
    onRoomCodeReady(inviteRoomCode, { role: 'host' });
  }, [inviteRoomCode, isOpen, mode, onRoomCodeReady]);

  useEffect(() => {
    if (!isOpen || !isScannerOpen) return;

    let cancelled = false;
    const startScanner = async () => {
      setIsScannerStarting(true);
      setScannerError('');

      try {
        const { BrowserQRCodeReader } = await import('@zxing/browser');
        const reader = new BrowserQRCodeReader();
        const controls = await reader.decodeFromVideoDevice(undefined, videoRef.current || undefined, result => {
          const text = result?.getText();
          if (!text) return;

          const roomCode = readRoomCodeFromInput(text);
          if (roomCode.length < 4) return;

          scannerControlsRef.current?.stop();
          scannerControlsRef.current = null;
          setIsScannerOpen(false);
          setScannerError('');
          setJoinInput(roomCode);
          setJoinedRoomCode(roomCode);
          setJoinError(false);
          onRoomCodeReady(roomCode, { role: 'guest', waitForHost: true });

          if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.set('room', roomCode);
            window.history.replaceState(null, '', url.toString());
          }
        });

        if (cancelled) {
          controls.stop();
          return;
        }

        scannerControlsRef.current = controls;
      } catch {
        if (!cancelled) setScannerError(copy.invite.scanError);
      } finally {
        if (!cancelled) setIsScannerStarting(false);
      }
    };

    startScanner();

    return () => {
      cancelled = true;
      scannerControlsRef.current?.stop();
      scannerControlsRef.current = null;
    };
  }, [copy.invite.scanError, isOpen, isScannerOpen, onRoomCodeReady]);

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
        text: `${copy.invite.roomCode}: ${inviteRoomCode}`,
        url: inviteUrl
      });
    } catch {
      // Sharing can be cancelled by the user.
    }
  };

  const updateMode = (nextMode: InvitePartnerMode) => {
    setJoinError(false);
    setIsScannerOpen(false);
    setScannerError('');
    if (nextMode === 'join' && mode !== 'join') {
      setJoinInput('');
      setJoinedRoomCode(null);
    }
    onModeChange(nextMode);
  };

  const joinRoom = () => {
    const roomCode = readRoomCodeFromInput(joinInput);
    if (roomCode.length < 4) {
      setJoinError(true);
      return;
    }

    setJoinError(false);
    setJoinedRoomCode(roomCode);
    setJoinInput(roomCode);
    onRoomCodeReady(roomCode, { role: 'guest', waitForHost: true });

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('room', roomCode);
      window.history.replaceState(null, '', url.toString());
    }
  };

  return (
    <div className="fixed inset-0 z-[135] flex items-end justify-center px-4 pb-4 sm:items-center">
      <button type="button" className="cfc-modal-scrim" onClick={onClose} aria-label={copy.invite.close} />
      <div className="cfc-dialog-card relative w-full max-w-[390px] overflow-y-auto p-5 pb-[max(20px,env(safe-area-inset-bottom))] no-scrollbar">
        <button
          type="button"
          className="cfc-action-secondary absolute right-4 top-4 h-10 w-10 rounded-2xl p-0 text-white/76"
          onClick={onClose}
          aria-label={copy.invite.close}
        >
          <X size={18} />
        </button>

        <div className="pr-12">
          <div className="cfc-icon-tile mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--cfc-sky)] text-[#07111d]">
            <Users size={23} />
          </div>
          <h3 className="text-2xl font-black leading-tight text-white">
            {mode === 'invite' ? copy.invite.title : copy.invite.joinTitle}
          </h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-[var(--cfc-text-muted)]">
            {mode === 'invite' ? copy.invite.subtitle : copy.invite.joinSubtitle}
          </p>
        </div>

        <div className="cfc-segment mt-5 grid-cols-2">
          <button
            type="button"
            className="cfc-segment-button"
            data-active={mode === 'invite'}
            onClick={() => updateMode('invite')}
          >
            <Share2 size={15} />
            {copy.invite.inviteTab}
          </button>
          <button
            type="button"
            className="cfc-segment-button"
            data-active={mode === 'join'}
            onClick={() => updateMode('join')}
          >
            <LogIn size={15} />
            {copy.invite.joinTab}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="cfc-info-card rounded-[22px] p-4">
            <Smartphone className="mb-3 text-rose-100" size={22} />
            <div className="font-black text-white">{copy.invite.localTitle}</div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--cfc-text-muted)]">{copy.invite.localDesc}</p>
          </div>
          <div className="cfc-info-card rounded-[22px] border-sky-100/18 bg-sky-100/10 p-4">
            <Wifi className="mb-3 text-sky-100" size={22} />
            <div className="font-black text-white">{copy.invite.remoteTitle}</div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--cfc-text-muted)]">{copy.invite.remoteDesc}</p>
          </div>
        </div>

        {mode === 'join' ? (
          <div className="cfc-info-card mt-4 rounded-[22px] p-4">
            <div className="flex items-center justify-between gap-3">
              <label className="cfc-field-label">
                {copy.invite.joinInputLabel}
              </label>
              <button
                type="button"
                className="cfc-action-secondary h-9 shrink-0 gap-1.5 rounded-2xl border-sky-100/18 bg-sky-100/10 px-3 text-[11px] text-sky-100"
                onClick={() => setIsScannerOpen(true)}
              >
                <Camera size={14} />
                {copy.invite.scanQr}
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={joinInput}
                onChange={event => {
                  setJoinInput(event.target.value);
                  setJoinError(false);
                }}
                onKeyDown={event => {
                  if (event.key === 'Enter') joinRoom();
                }}
                className="cfc-input min-w-0 flex-1 font-mono text-base font-black uppercase tracking-[0.12em] placeholder:text-white/28"
                placeholder={copy.invite.joinPlaceholder}
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="button"
                className="cfc-action-primary min-w-[92px] shrink-0 px-3"
                onClick={joinRoom}
              >
                <LogIn size={16} />
                {joinedRoomCode ? copy.invite.joinedButton : copy.invite.joinButton}
              </button>
            </div>
            <div className={`mt-2 flex items-start gap-2 text-xs leading-relaxed ${joinError ? 'text-rose-100' : 'text-white/46'}`}>
              <LinkIcon className="mt-0.5 shrink-0" size={13} />
              <span>{joinError ? copy.invite.joinInvalid : copy.invite.pasteHint}</span>
            </div>
          </div>
        ) : null}

        {mode === 'invite' && qrDataUrl ? (
          <div className="cfc-info-card mt-4 rounded-[24px] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-sm font-black text-white">
                  <QrCode size={16} />
                  {copy.invite.qrTitle}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[var(--cfc-text-subtle)]">{copy.invite.qrHint}</p>
              </div>
              <span className="rounded-full border border-amber-100/18 bg-amber-100/10 px-2.5 py-1 text-[10px] font-black text-amber-100">
                App
              </span>
            </div>
            <div className="mx-auto flex w-full max-w-[210px] items-center justify-center rounded-[22px] bg-[#fff7ed] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
              <img src={qrDataUrl} alt={copy.invite.qrTitle} className="h-full w-full rounded-[14px]" />
            </div>
          </div>
        ) : null}

        {activeRoomCode ? (
          <div className="mt-4 rounded-[24px] border border-amber-100/18 bg-amber-100/10 p-4 text-center">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-amber-100/60">
              {mode === 'join' ? copy.invite.joinedRoom : copy.invite.roomCode}
            </div>
            <div className="mt-2 font-mono text-4xl font-black tracking-[0.22em] text-white">
              {activeRoomCode}
            </div>
          </div>
        ) : null}

        {activeRoomCode ? (
          <div
            className={`mt-3 rounded-[20px] border px-3 py-2 text-xs leading-relaxed ${
              syncStatus === 'connected'
                ? 'border-emerald-200/20 bg-emerald-200/10 text-emerald-100/82'
                : syncStatus === 'error'
                  ? 'border-rose-200/20 bg-rose-200/10 text-rose-100/82'
                  : 'border-amber-100/18 bg-amber-100/10 text-amber-100/72'
            }`}
          >
            <div className="font-black">
              {syncStatus === 'connected'
                ? copy.invite.remoteReady
                : syncStatus === 'error'
                  ? copy.invite.remoteError
                  : remoteConfig.status === 'ready'
                    ? copy.invite.remoteConnecting
                    : copy.invite.remotePending}
            </div>
            <div className="mt-1 break-all">
              {syncStatus === 'error'
                ? copy.invite.remoteErrorHint
                : remoteConfig.status === 'ready'
                  ? `${copy.invite.channel}: ${channelName}`
                  : copy.invite.remotePendingHint}
            </div>
            {remoteConfig.status === 'ready' && syncStatus === 'connected' ? (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-2xl bg-black/18 px-3 py-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
                    {copy.invite.yourRole}
                  </div>
                  <div className="mt-0.5 font-black">
                    {role === 'guest' ? copy.invite.guestRole : copy.invite.hostRole}
                  </div>
                </div>
                <div className="rounded-2xl bg-black/18 px-3 py-2">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
                    {copy.invite.onlineStatus}
                  </div>
                  <div className="mt-0.5 font-black">
                    {presence.hasPartner ? copy.invite.partnerOnline : copy.invite.partnerWaiting}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {mode === 'invite' ? (
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="cfc-action-primary flex-1"
              onClick={copyInvite}
            >
              <Copy size={17} />
              {copied ? copy.invite.copied : copy.invite.copyLink}
            </button>
            <button
              type="button"
              className="cfc-action-secondary w-14 shrink-0 p-0 text-white"
              onClick={shareInvite}
              aria-label={copy.invite.share}
            >
              <Share2 size={18} />
            </button>
          </div>
        ) : null}

        <p className="mt-4 text-center text-xs leading-relaxed text-[var(--cfc-text-subtle)]">
          {mode === 'invite' ? copy.invite.next : copy.invite.joinNext}
        </p>
      </div>

      {isScannerOpen ? (
        <div className="absolute inset-0 z-10 flex items-end justify-center px-4 pb-4 sm:items-center">
          <div className="cfc-modal-scrim" />
          <div className="cfc-dialog-card w-full max-w-[360px] p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-lg font-black text-white">
                  <QrCode size={19} />
                  {copy.invite.scanTitle}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[var(--cfc-text-muted)]">{copy.invite.scanHint}</p>
              </div>
              <button
                type="button"
                className="cfc-action-secondary h-9 w-9 shrink-0 rounded-2xl p-0 text-white/76"
                onClick={() => setIsScannerOpen(false)}
                aria-label={copy.invite.stopScan}
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative overflow-hidden rounded-[24px] border border-white/12 bg-black">
              <video ref={videoRef} className="aspect-square w-full object-cover" muted playsInline />
              <div className="pointer-events-none absolute inset-[14%] rounded-[22px] border-2 border-white/72 shadow-[0_0_0_999px_rgba(0,0,0,0.28)]" />
              {isScannerStarting ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/36">
                  <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black text-[#16090f]">
                    <Loader2 size={15} className="animate-spin" />
                    {copy.invite.scanStarting}
                  </div>
                </div>
              ) : null}
            </div>

            {scannerError ? (
              <div className="mt-3 rounded-2xl border border-rose-100/18 bg-rose-100/10 px-3 py-2 text-xs leading-relaxed text-rose-100">
                {scannerError}
              </div>
            ) : null}

            <button
              type="button"
              className="cfc-action-primary mt-3 h-11 w-full"
              onClick={() => setIsScannerOpen(false)}
            >
              {copy.invite.stopScan}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
