import { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useGameState } from './hooks/useGameState';
import { MilestoneEventData, TaskEventData } from './types';
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
import { localeLabels, t } from './i18n';
import { getFinalRewards } from './data/gameExperience';

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
    checkTile,
    resolveTask,
    resetGame
  } = useGameState();

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number>(0);
  const [taskData, setTaskData] = useState<TaskEventData | null>(null);
  const [winnerId, setWinnerId] = useState<number | null>(null);
  const [isRewardSetupOpen, setIsRewardSetupOpen] = useState(false);
  const [isPremiumPreviewOpen, setIsPremiumPreviewOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [milestoneEvent, setMilestoneEvent] = useState<MilestoneEventData | null>(null);
  const [isCreateThemeModalOpen, setIsCreateThemeModalOpen] = useState(false);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [aiImportThemeId, setAiImportThemeId] = useState<string | null>(null);
  const taskBonusSecondsRef = useRef(0);

  const handleSelectTheme = (playerId: number) => {
    setSelectedPlayerId(playerId);
    setIsThemeModalOpen(true);
  };

  const selectedPlayer = state.players.find(p => p.id === selectedPlayerId) || state.players[0];
  const copy = t[state.locale];
  const selectableThemes = state.themes.filter(
    t => t.audience === 'common' || t.audience === selectedPlayer.role
  );
  const canStartGame = state.players.every(player => {
    if (!player.themeId) return false;
    const theme = state.themes.find(item => item.id === player.themeId);
    return !!theme && theme.tasks.length > 0;
  });

  useEffect(() => {
    const roomCode = new URLSearchParams(window.location.search).get('room');
    if (roomCode) setIsInviteOpen(true);
  }, []);

  const handleStartGame = () => {
    if (!startGame()) {
      alert(copy.selectedPrompt);
      return;
    }
    taskBonusSecondsRef.current = 0;
    setTaskData(null);
    setMilestoneEvent(null);
  };

  const handleBackFromGame = () => {
    if (confirm(copy.leaveConfirm)) {
      taskBonusSecondsRef.current = 0;
      setTaskData(null);
      setMilestoneEvent(null);
      resetGame();
      switchView('home');
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#09070c] text-white">
      <div className="fixed inset-0 z-0">
        <img
          src="/assets/couple-game-hero.webp"
          alt=""
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,5,9,0.25),rgba(6,5,9,0.84)_42%,rgba(6,5,9,0.96))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,79,127,0.22),transparent_35%),radial-gradient(circle_at_15%_80%,rgba(79,179,255,0.16),transparent_28%)]" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[430px] flex-col overflow-hidden border-x border-white/10 bg-[#09070c]/58 shadow-2xl backdrop-blur-[2px]">
        <header className="shrink-0 px-5 pb-2 pt-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200/80">
                <Sparkles size={13} />
                Couple Flight
              </div>
              <h1 className="text-[30px] font-black leading-none tracking-normal text-white">
                {copy.brand}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <AmbientSound copy={copy} inGame={state.view === 'game'} />
              <button
                className="h-9 rounded-2xl border border-white/15 bg-white/10 px-3 text-[11px] font-black text-white/80 transition active:scale-95"
                onClick={() => switchLocale(state.locale === 'zh' ? 'en' : 'zh')}
              >
                {localeLabels[state.locale === 'zh' ? 'en' : 'zh']}
              </button>
              <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/80">
                {copy.edition}
              </div>
            </div>
          </div>
        </header>

        <main className="relative min-h-0 flex-1 overflow-hidden">
          <div
            className={`absolute inset-0 flex flex-col px-5 pb-7 pt-4 transition-all duration-500 ease-out ${
              state.view === 'home'
                ? 'translate-x-0 opacity-100'
                : '-translate-x-full opacity-0 pointer-events-none'
            }`}
          >
            <HomeView
              players={state.players}
              themes={state.themes}
              copy={copy}
              rewardCount={state.finalRewardIds.length}
              onSelectTheme={handleSelectTheme}
              onOpenPremium={() => setIsPremiumPreviewOpen(true)}
              onOpenInvite={() => setIsInviteOpen(true)}
              onOpenRewards={() => setIsRewardSetupOpen(true)}
              onStartGame={handleStartGame}
            />
          </div>

          <div
            className={`absolute inset-0 flex min-h-0 flex-col px-5 pb-4 pt-4 transition-all duration-500 ease-out ${
              state.view === 'themes'
                ? 'translate-x-0 opacity-100'
                : 'translate-x-full opacity-0 pointer-events-none'
            }`}
          >
            <ThemesView
              themes={state.themes}
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
        onSelect={themeId => selectTheme(selectedPlayerId, themeId)}
        onClose={() => setIsThemeModalOpen(false)}
      />

      <TaskCardModal
        isOpen={!!taskData}
        taskData={taskData}
        copy={copy}
        onAccept={() => {
          if (!taskData) return;
          if (taskData.bonusSeconds) taskBonusSecondsRef.current = 0;
          setTaskData(null);
          resolveTask(taskData, 'accept');
        }}
        onReject={() => {
          if (!taskData) return;
          setTaskData(null);
          resolveTask(taskData, 'reject');
        }}
      />

      <WinModal
        isOpen={winnerId !== null}
        winnerName={winnerId !== null ? state.players[winnerId].name : ''}
        locale={state.locale}
        rewardIds={state.finalRewardIds}
        copy={copy}
        onRestart={() => {
          taskBonusSecondsRef.current = 0;
          setTaskData(null);
          setMilestoneEvent(null);
          resetGame();
          setWinnerId(null);
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

      <PremiumPreviewModal
        isOpen={isPremiumPreviewOpen}
        copy={copy}
        onClose={() => setIsPremiumPreviewOpen(false)}
      />

      <InvitePartnerModal
        isOpen={isInviteOpen}
        copy={copy}
        onClose={() => setIsInviteOpen(false)}
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
          onMove={movePlayer}
          onCheckTile={checkTile}
          onEndTurn={endTurn}
          onSetRolling={setIsRolling}
          onWin={setWinnerId}
          onTaskTrigger={data => {
            setTaskData({
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
    </div>
  );
}

export default App;
