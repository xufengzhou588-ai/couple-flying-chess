import { useCallback, useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useGameState } from './hooks/useGameState';
import { GameState, MilestoneEventData } from './types';
import { HomeView } from './components/views/HomeView';
import { GameView } from './components/views/GameView';
import { ThemesView } from './components/views/ThemesView';
import { ThemeSelectorModal } from './components/modals/ThemeSelectorModal';
import { TaskCardModal } from './components/modals/TaskCardModal';
import { WinModal } from './components/modals/WinModal';
import { BottomNav } from './components/BottomNav';
import { ThemeCreateModal } from './components/modals/ThemeCreateModal';
import { ThemeEditorModal } from './components/modals/ThemeEditorModal';
import { AiImportModal } from './components/modals/AiImportModal';
import { AmbientSound } from './components/AmbientSound';
import { RewardSetupModal } from './components/modals/RewardSetupModal';
import { MilestoneToast } from './components/MilestoneToast';
import { PremiumPreviewModal } from './components/modals/PremiumPreviewModal';
import { InvitePartnerModal } from './components/modals/InvitePartnerModal';
import { RemoteSetupModal } from './components/modals/RemoteSetupModal';
import { AppMessageModal } from './components/modals/AppMessageModal';
import { localeLabels, t } from './i18n';
import { getFinalRewards } from './data/gameExperience';
import { assetPath } from './utils/assets';
import { releaseFeatures } from './config/release';
import {
  connectRemoteRoom,
  normalizeRoomCode,
  type RemotePresenceSnapshot,
  type RemoteRoomRole,
  type RemoteSyncStatus
} from './utils/remoteRoom';

const localeOrder = ['zh', 'en', 'es'] as const;
const showMiniGamePreview = import.meta.env.VITE_SHOW_MINIGAMES === 'true';
type InviteMode = 'invite' | 'join';
type AppDialog = {
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm?: () => void;
};
const emptyRemotePresence: RemotePresenceSnapshot = {
  participants: [],
  onlineCount: 0,
  hasPartner: false,
  hasHost: false,
  hasGuest: false
};

function App() {
  const {
    state,
    switchView,
    switchLocale,
    selectTheme,
    setFinalRewardIds,
    createTheme,
    updateThemeMeta,
    addThemeTask,
    removeThemeTask,
    importThemeTasks,
    startGame,
    movePlayer,
    endTurn,
    setIsRolling,
    recordDiceRoll,
    setActiveTask,
    setWinner,
    applyRemoteState,
    checkTile,
    resolveTask,
    resetGame
  } = useGameState();

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(0);
  const [isRewardSetupOpen, setIsRewardSetupOpen] = useState(false);
  const [isPremiumPreviewOpen, setIsPremiumPreviewOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isRemoteSetupDismissed, setIsRemoteSetupDismissed] = useState(false);
  const [inviteMode, setInviteMode] = useState<InviteMode>('invite');
  const [inviteRoomCode, setInviteRoomCode] = useState<string | null>(null);
  const [remoteRoomCode, setRemoteRoomCode] = useState<string | null>(null);
  const [remoteRole, setRemoteRole] = useState<RemoteRoomRole | null>(null);
  const [remotePlayerId, setRemotePlayerId] = useState<number | null>(null);
  const [remotePartnerPlayerId, setRemotePartnerPlayerId] = useState<number | null>(null);
  const [remoteSyncStatus, setRemoteSyncStatus] = useState<RemoteSyncStatus>('idle');
  const [remotePresence, setRemotePresence] = useState<RemotePresenceSnapshot>(emptyRemotePresence);
  const [milestoneEvent, setMilestoneEvent] = useState<MilestoneEventData | null>(null);
  const [isCreateThemeModalOpen, setIsCreateThemeModalOpen] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [aiImportThemeId, setAiImportThemeId] = useState<string | null>(null);
  const [appDialog, setAppDialog] = useState<AppDialog | null>(null);
  const taskBonusSecondsRef = useRef(0);
  const remoteClientIdRef = useRef(
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
  );
  const sendRemoteStateRef = useRef<((state: GameState) => void) | null>(null);
  const requestRemoteStateRef = useRef<(() => void) | null>(null);
  const selectRemotePlayerRef = useRef<((playerId: number | null) => void) | null>(null);
  const sendPlayerSelectionRef = useRef<((playerId: number) => void) | null>(null);
  const sendThemeSelectionRef = useRef<((playerId: number, themeId: string) => void) | null>(null);
  const remoteRoomIdentityRef = useRef('');
  const latestStateRef = useRef(state);
  const remoteRoleRef = useRef<RemoteRoomRole | null>(null);
  const skipNextRemoteBroadcastRef = useRef(false);
  const remoteGuestWaitingForHostRef = useRef(false);
  const lastRemoteStateAtBySenderRef = useRef(new Map<string, number>());

  const selectedPlayer = state.players.find(p => p.id === selectedPlayerId) || state.players[0];
  const copy = t[state.locale];
  const nextLocale = localeOrder[(localeOrder.indexOf(state.locale) + 1) % localeOrder.length];
  const availableThemes = state.themes.filter(
    theme => releaseFeatures.premium || theme.access !== 'premium'
  );
  const selectableThemes = availableThemes.filter(
    t => t.audience === 'common' || t.audience === selectedPlayer.role
  );
  const canStartGame = state.players.every(player => {
    if (!player.themeId) return false;
    const theme = availableThemes.find(item => item.id === player.themeId);
    return !!theme && theme.tasks.length > 0;
  });
  const remoteLocalPlayerId = remotePlayerId ?? -1;
  const hasRemoteRoom = !!remoteRoomCode && !!remoteRole;
  const remoteSetupReady = hasRemoteRoom && remotePresence.hasPartner && state.view !== 'game';
  const showRemoteSetup = remoteSetupReady && !isRemoteSetupDismissed;
  const partnerPlayerId = remotePresence.participants.find(
    participant => participant.clientId !== remoteClientIdRef.current
  )?.playerId ?? remotePartnerPlayerId;
  const canControlCurrentTurn = !hasRemoteRoom || state.turn === remoteLocalPlayerId;
  const canResolveCurrentTask =
    !hasRemoteRoom || !state.activeTask || state.activeTask.executorPlayerId === remoteLocalPlayerId;
  const remoteRollLockedHint = remotePresence.hasPartner
    ? copy.remote.partnerTurn
    : copy.remote.partnerWaiting;

  const showInfo = (message: string) => {
    setAppDialog({
      message,
      confirmLabel: copy.premium.close
    });
  };

  const showConfirm = (message: string, onConfirm: () => void) => {
    setAppDialog({
      message,
      confirmLabel: copy.reward.close,
      cancelLabel: copy.form.cancel,
      onConfirm
    });
  };

  const handleSelectTheme = (playerId: number) => {
    if (remoteRoomCode && playerId !== remotePlayerId) {
      showInfo(copy.remote.hostPlayerLocked);
      return;
    }

    setSelectedPlayerId(playerId);
    setIsThemeModalOpen(true);
  };

  const handleThemeChosen = (themeId: string) => {
    selectTheme(selectedPlayerId, themeId);
    if (remoteRole === 'guest' && selectedPlayerId === remotePlayerId) {
      sendThemeSelectionRef.current?.(selectedPlayerId, themeId);
    }
  };

  useEffect(() => {
    const roomCode = new URLSearchParams(window.location.search).get('room');
    if (roomCode) {
      const normalized = normalizeRoomCode(roomCode);
      setInviteRoomCode(normalized);
      setRemoteRoomCode(normalized);
      setRemoteRole('guest');
      setInviteMode('join');
      remoteGuestWaitingForHostRef.current = true;
      switchView('home');
      setIsInviteOpen(true);
    }
  }, [switchView]);

  useEffect(() => {
    latestStateRef.current = state;
  }, [state]);

  useEffect(() => {
    remoteRoleRef.current = remoteRole;
  }, [remoteRole]);

  useEffect(() => {
    if (!remoteRoomCode || !remoteRole) {
      sendRemoteStateRef.current = null;
      requestRemoteStateRef.current = null;
      selectRemotePlayerRef.current = null;
      sendPlayerSelectionRef.current = null;
      sendThemeSelectionRef.current = null;
      setRemotePartnerPlayerId(null);
      setRemotePresence(emptyRemotePresence);
      setRemoteSyncStatus('idle');
      return;
    }

    const connection = connectRemoteRoom(remoteRoomCode, remoteClientIdRef.current, remoteRole, {
      onStatus: setRemoteSyncStatus,
      onPresence: snapshot => {
        setRemotePresence(snapshot);
        if (!snapshot.hasPartner) setRemotePartnerPlayerId(null);
        const partner = snapshot.participants.find(participant => participant.clientId !== remoteClientIdRef.current);
        if (partner?.playerId === 0 || partner?.playerId === 1) setRemotePartnerPlayerId(partner.playerId);
      },
      onPlayerSelection: payload => setRemotePartnerPlayerId(payload.playerId),
      onThemeSelection: payload => {
        if (remoteRoleRef.current !== 'host') return;
        const player = latestStateRef.current.players.find(item => item.id === payload.playerId);
        const theme = latestStateRef.current.themes.find(item => item.id === payload.themeId);
        if (!player || !theme || (!releaseFeatures.premium && theme.access === 'premium') ||
          (theme.audience !== 'common' && theme.audience !== player.role) || theme.tasks.length === 0) return;
        selectTheme(payload.playerId, payload.themeId);
      },
      onState: (remoteState, payload) => {
        if (remoteRoleRef.current === 'host' && remoteState.view === 'home') return;
        const lastSentAt = lastRemoteStateAtBySenderRef.current.get(payload.senderId) || 0;
        if (payload.sentAt <= lastSentAt) return;
        lastRemoteStateAtBySenderRef.current.set(payload.senderId, payload.sentAt);
        remoteGuestWaitingForHostRef.current = false;
        skipNextRemoteBroadcastRef.current = true;
        applyRemoteState(remoteState);
      },
      onStateRequest: () => {
        if (remoteGuestWaitingForHostRef.current) return;
        if (remoteRoleRef.current !== 'host') return;
        window.setTimeout(() => {
          sendRemoteStateRef.current?.(latestStateRef.current);
        }, 50);
      }
    });

    sendRemoteStateRef.current = connection?.sendState || null;
    requestRemoteStateRef.current = connection?.requestState || null;
    selectRemotePlayerRef.current = connection?.selectPlayer || null;
    sendPlayerSelectionRef.current = connection?.sendPlayerSelection || null;
    sendThemeSelectionRef.current = connection?.sendThemeSelection || null;

    return () => {
      sendRemoteStateRef.current = null;
      requestRemoteStateRef.current = null;
      selectRemotePlayerRef.current = null;
      sendPlayerSelectionRef.current = null;
      sendThemeSelectionRef.current = null;
      connection?.disconnect();
    };
  }, [applyRemoteState, remoteRole, remoteRoomCode, selectTheme]);

  useEffect(() => {
    if (remoteSyncStatus === 'connected') selectRemotePlayerRef.current?.(remotePlayerId);
  }, [remotePlayerId, remoteSyncStatus]);

  useEffect(() => {
    if (remoteSyncStatus === 'connected' && remotePresence.hasPartner && remotePlayerId !== null) {
      sendPlayerSelectionRef.current?.(remotePlayerId);
    }
  }, [remotePlayerId, remotePresence.hasPartner, remoteSyncStatus]);

  useEffect(() => {
    if (!remoteRoomCode || !remotePresence.hasPartner) setIsRemoteSetupDismissed(false);
  }, [remotePresence.hasPartner, remoteRoomCode]);

  useEffect(() => {
    if (remoteRole === 'guest' && state.view === 'game') setIsInviteOpen(false);
  }, [remoteRole, state.view]);

  useEffect(() => {
    if (remoteSyncStatus !== 'connected' || !remoteGuestWaitingForHostRef.current) return;

    let attempts = 0;
    const requestState = () => {
      if (!remoteGuestWaitingForHostRef.current || attempts >= 10) return;
      attempts += 1;
      requestRemoteStateRef.current?.();
    };

    requestState();
    const timer = window.setInterval(requestState, 2000);
    return () => window.clearInterval(timer);
  }, [remoteRoomCode, remoteSyncStatus]);

  useEffect(() => {
    if (!remoteRoomCode || !sendRemoteStateRef.current || remoteSyncStatus !== 'connected') return;

    if (skipNextRemoteBroadcastRef.current) {
      skipNextRemoteBroadcastRef.current = false;
      return;
    }

    if (remoteGuestWaitingForHostRef.current) return;
    if (remoteRole === 'guest' && state.view === 'home') return;

    const timer = window.setTimeout(() => {
      sendRemoteStateRef.current?.(state);
    }, 140);

    return () => window.clearTimeout(timer);
  }, [remoteRole, remoteRoomCode, remoteSyncStatus, state]);

  const handleRoomCodeReady = useCallback((roomCode: string, options?: { role?: RemoteRoomRole; waitForHost?: boolean }) => {
    const normalized = normalizeRoomCode(roomCode);
    if (!normalized) return;
    const identity = `${normalized}:${options?.role || 'host'}`;
    if (remoteRoomIdentityRef.current !== identity) {
      remoteRoomIdentityRef.current = identity;
      setRemotePlayerId(null);
      setRemotePartnerPlayerId(null);
      setRemotePresence(emptyRemotePresence);
      setRemoteSyncStatus('connecting');
      setIsRemoteSetupDismissed(false);
      switchView('home');
    }
    setInviteRoomCode(normalized);
    setRemoteRoomCode(normalized);
    setRemoteRole(options?.role || 'host');
    remoteGuestWaitingForHostRef.current = !!options?.waitForHost;
  }, [switchView]);

  const handleStartGame = () => {
    if (remoteRoomCode && remoteRole === 'guest') {
      showInfo(copy.remote.hostOnlyStart);
      return false;
    }

    if (remoteRoomCode && (!remotePresence.hasPartner || remotePlayerId === null || partnerPlayerId === null || remotePlayerId === partnerPlayerId)) {
      showInfo(copy.remote.partnerWaiting);
      return false;
    }

    if (!startGame()) {
      showInfo(copy.selectedPrompt);
      return false;
    }
    taskBonusSecondsRef.current = 0;
    setActiveTask(null);
    setMilestoneEvent(null);
    return true;
  };

  const handleBackFromGame = () => {
    if (remoteRoomCode && remoteRole === 'guest') {
      showInfo(copy.remote.hostOnlyReset);
      return;
    }

    showConfirm(copy.leaveConfirm, () => {
      taskBonusSecondsRef.current = 0;
      setActiveTask(null);
      setMilestoneEvent(null);
      resetGame();
      switchView('home');
    });
  };

  return (
    <div className="app-root h-[100dvh] w-screen overflow-hidden bg-[var(--cfc-bg)] text-[var(--cfc-text)]" data-locale={state.locale}>
      <div className="fixed inset-0 z-0">
        <img
          src={assetPath('assets/couple-game-hero.jpg')}
          alt=""
          className="h-full w-full object-cover opacity-62"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,12,0.2),rgba(9,7,12,0.82)_40%,rgba(9,7,12,0.98))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,111,154,0.2),transparent_34%),radial-gradient(circle_at_16%_78%,rgba(138,215,255,0.14),transparent_30%),radial-gradient(circle_at_88%_68%,rgba(248,211,138,0.1),transparent_28%)]" />
      </div>

      <div className="app-phone-shell relative z-10 mx-auto flex h-full w-full max-w-[430px] flex-col overflow-hidden border-x border-[var(--cfc-border)] bg-[rgba(9,7,12,0.68)] shadow-2xl backdrop-blur-[2px]">
        <header className="app-header shrink-0 px-5 pb-2 pt-10">
          <div className="flex items-center justify-between">
            <div className="app-brand min-w-0">
              <div className="app-brand-kicker mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--cfc-amber)]">
                <Sparkles size={13} />
                Couple Flight
              </div>
              <h1 className="app-brand-title text-[30px] font-black leading-none tracking-normal text-white">
                {copy.brand}
              </h1>
            </div>
            <div className="app-header-actions flex shrink-0 items-center gap-2">
              <AmbientSound copy={copy} inGame={state.view === 'game'} />
              <button
                type="button"
                className="app-header-pill cfc-pressable h-9 rounded-2xl border border-[var(--cfc-border)] bg-[var(--cfc-surface-soft)] px-3 text-[11px] font-black text-white/82"
                onClick={() => switchLocale(nextLocale)}
              >
                {localeLabels[nextLocale]}
              </button>
              <div className="app-edition-pill rounded-full border border-[var(--cfc-border)] bg-[var(--cfc-surface-soft)] px-3 py-1.5 text-[11px] font-semibold text-white/80">
                {copy.edition}
              </div>
            </div>
          </div>
        </header>

        <main className="relative min-h-0 flex-1 overflow-hidden">
          <div
            className={`home-panel absolute inset-0 flex flex-col px-5 pb-7 pt-4 transition-all duration-500 ease-out ${
              state.view === 'home'
                ? 'visible translate-x-0 opacity-100'
                : 'invisible -translate-x-full opacity-0 pointer-events-none'
            }`}
            aria-hidden={state.view !== 'home'}
          >
            <HomeView
              players={state.players}
              themes={availableThemes}
              copy={copy}
              locale={state.locale}
              rewardCount={state.finalRewardIds.length}
              remoteRoomCode={remoteRoomCode}
              remoteRole={remoteRole}
              remoteSyncStatus={remoteSyncStatus}
              remoteHasPartner={remotePresence.hasPartner}
              showPremium={releaseFeatures.premium}
              showMiniGames={showMiniGamePreview}
              onSelectTheme={handleSelectTheme}
              onOpenPremium={() => setIsPremiumPreviewOpen(true)}
              onOpenMiniGames={() => {
                const base = import.meta.env.DEV
                  ? `${window.location.protocol}//${window.location.hostname}:5180/`
                  : '/games/';
                const url = `${base}?lang=${state.locale}`;
                window.location.assign(url);
              }}
              onOpenInvite={() => {
                setInviteMode('invite');
                setInviteRoomCode(remoteRoomCode);
                setIsRemoteSetupDismissed(false);
                setIsInviteOpen(true);
              }}
              onOpenJoinInvite={() => {
                setInviteMode(remoteRole === 'host' ? 'invite' : 'join');
                setInviteRoomCode(remoteRoomCode);
                setIsRemoteSetupDismissed(false);
                setIsInviteOpen(true);
              }}
              onOpenRewards={() => setIsRewardSetupOpen(true)}
            />
          </div>

          <div
            className={`absolute inset-0 flex min-h-0 flex-col px-5 pb-4 pt-4 transition-all duration-500 ease-out ${
              state.view === 'themes'
                ? 'visible translate-x-0 opacity-100'
                : 'invisible translate-x-full opacity-0 pointer-events-none'
            }`}
            aria-hidden={state.view !== 'themes'}
          >
            <ThemesView
              themes={availableThemes}
              copy={copy}
              onCreateTheme={() => setIsCreateThemeModalOpen(true)}
              onEditTheme={themeId => setEditingThemeId(themeId)}
            />
          </div>
        </main>

        <BottomNav
          activeView={state.view}
          canStart={canStartGame}
          onNavigate={switchView}
          onStartGame={handleStartGame}
          copy={copy}
        />
      </div>

      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        themes={selectableThemes}
        copy={copy}
        selectedThemeId={selectedPlayer?.themeId || null}
        onSelect={handleThemeChosen}
        onClose={() => setIsThemeModalOpen(false)}
      />

      <TaskCardModal
        isOpen={!!state.activeTask}
        taskData={state.activeTask}
        copy={copy}
        canResolve={canResolveCurrentTask}
        lockedHint={copy.remote.taskLocked}
        onAccept={() => {
          if (!state.activeTask) return;
          if (state.activeTask.bonusSeconds) taskBonusSecondsRef.current = 0;
          resolveTask(state.activeTask, 'accept');
        }}
        onReject={() => {
          if (!state.activeTask) return;
          resolveTask(state.activeTask, 'reject');
        }}
      />

      <WinModal
        isOpen={state.winnerId !== null}
        winnerName={state.winnerId !== null ? state.players[state.winnerId].name : ''}
        locale={state.locale}
        rewardIds={state.finalRewardIds}
        copy={copy}
        onRestart={() => {
          taskBonusSecondsRef.current = 0;
          setActiveTask(null);
          setMilestoneEvent(null);
          resetGame();
          setWinner(null);
        }}
      />

      <RewardSetupModal
        isOpen={isRewardSetupOpen}
        locale={state.locale}
        copy={copy}
        selectedIds={state.finalRewardIds}
        onChange={ids => {
          setFinalRewardIds(ids);
        }}
        onClose={() => setIsRewardSetupOpen(false)}
      />

      {releaseFeatures.premium && (
        <PremiumPreviewModal
          isOpen={isPremiumPreviewOpen}
          copy={copy}
          onClose={() => setIsPremiumPreviewOpen(false)}
        />
      )}

      <InvitePartnerModal
        isOpen={isInviteOpen && !showRemoteSetup}
        mode={inviteMode}
        initialRoomCode={inviteRoomCode}
        role={remoteRole}
        presence={remotePresence}
        syncStatus={remoteSyncStatus}
        copy={copy}
        onModeChange={setInviteMode}
        onRoomCodeReady={handleRoomCodeReady}
        onClose={() => {
          setIsInviteOpen(false);
          setInviteRoomCode(null);
        }}
      />

      <RemoteSetupModal
        isOpen={showRemoteSetup}
        roomCode={remoteRoomCode || ''}
        roomRole={remoteRole}
        players={state.players}
        themes={availableThemes}
        copy={copy}
        localPlayerId={remotePlayerId}
        partnerPlayerId={partnerPlayerId}
        canStart={canStartGame}
        onSelectPlayer={setRemotePlayerId}
        onSelectTheme={handleSelectTheme}
        onStart={() => {
          if (handleStartGame()) {
            setIsInviteOpen(false);
            setIsRemoteSetupDismissed(true);
            setInviteRoomCode(null);
          }
        }}
        onClose={() => {
          setIsRemoteSetupDismissed(true);
          setIsInviteOpen(false);
        }}
      />

      <MilestoneToast event={milestoneEvent} unlockedLabel={copy.unlocked} />

      <ThemeCreateModal
        isOpen={isCreateThemeModalOpen}
        copy={copy}
        onClose={() => setIsCreateThemeModalOpen(false)}
        onCreate={input => {
          const id = createTheme(input);
          setIsCreateThemeModalOpen(false);
          if (id) setEditingThemeId(id);
        }}
      />

      <ThemeEditorModal
        isOpen={!!editingThemeId}
        theme={editingThemeId ? state.themes.find(t => t.id === editingThemeId) || null : null}
        copy={copy}
        onClose={() => {
          setEditingThemeId(null);
          setAiImportThemeId(null);
        }}
        onSaveMeta={(themeId, patch) => updateThemeMeta(themeId, patch)}
        onAddTask={(themeId, taskText) => addThemeTask(themeId, taskText)}
        onRemoveTask={(themeId, index) => removeThemeTask(themeId, index)}
        onOpenAiImport={themeId => setAiImportThemeId(themeId)}
      />

      <AiImportModal
        isOpen={!!aiImportThemeId}
        themeName={aiImportThemeId ? state.themes.find(t => t.id === aiImportThemeId)?.name || '' : ''}
        locale={state.locale}
        copy={copy}
        onClose={() => setAiImportThemeId(null)}
        onImport={(tasks, mode) => {
          if (aiImportThemeId) importThemeTasks(aiImportThemeId, tasks, mode);
        }}
      />

      {state.view === 'game' && (
        <GameView
          players={state.players}
          boardMap={state.boardMap}
          currentTurn={state.turn}
          locale={state.locale}
          copy={copy}
          isRolling={state.isRolling}
          remoteRoomCode={remoteRoomCode}
          remoteRole={remoteRole}
          remoteSyncStatus={remoteSyncStatus}
          remoteHasPartner={remotePresence.hasPartner}
          showVideo={releaseFeatures.remoteVideo}
          lastDiceRoll={state.lastDiceRoll}
          canRoll={canControlCurrentTurn}
          rollLockedHint={remoteRollLockedHint}
          onMove={movePlayer}
          onCheckTile={checkTile}
          onEndTurn={endTurn}
          onSetRolling={setIsRolling}
          onDiceRoll={recordDiceRoll}
          onWin={setWinner}
          onTaskTrigger={data => {
            setActiveTask({
              ...data,
              bonusSeconds: taskBonusSecondsRef.current || undefined
            });
          }}
          onMilestone={event => {
            let nextEvent = event;

            if (event.threshold === 50) {
              taskBonusSecondsRef.current = 10;
            }

            if (event.threshold === 75) {
              const rewardPool = getFinalRewards(state.locale).filter(reward =>
                state.finalRewardIds.includes(reward.id)
              );
              const preview = rewardPool[Math.floor(Math.random() * rewardPool.length)];

              if (preview) {
                nextEvent = {
                  ...event,
                  line:
                    state.locale === 'zh'
                      ? `奖池预览：「${preview.title}」可能成为今晚的赢家奖励。`
                      : state.locale === 'es'
                        ? `Avance: “${preview.title}” espera en la meta. Intenta no hacer campaña demasiado obvia.`
                        : `Sneak peek: “${preview.title}” is waiting in the finish pool. Try not to campaign too obviously.`
                };
              }
            }

            setMilestoneEvent(nextEvent);
            window.setTimeout(() => {
              setMilestoneEvent(current => (current === nextEvent ? null : current));
            }, 2800);
          }}
          onBack={handleBackFromGame}
        />
      )}

      <AppMessageModal
        isOpen={!!appDialog}
        message={appDialog?.message || ''}
        confirmLabel={appDialog?.confirmLabel || copy.premium.close}
        cancelLabel={appDialog?.cancelLabel}
        onClose={() => setAppDialog(null)}
        onConfirm={() => {
          const action = appDialog?.onConfirm;
          setAppDialog(null);
          action?.();
        }}
      />
    </div>
  );
}

export default App;
