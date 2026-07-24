import { useCallback, useEffect, useState } from 'react';
import { FinalRewardId, GameState, Locale, Player, TaskEventData, Theme } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/localStorage';
import { calculateNewPosition, generateBoardMap, generateSpiralPath } from '../utils/gameLogic';
import { DEFAULT_THEMES, getDefaultThemes } from '../data/defaultThemes';
import { t } from '../i18n';
import { getDefaultFinalRewardIds } from '../data/gameExperience';

const STORAGE_KEY = 'couple-flying-chess-v3';
const DEFAULT_THEME_IDS = new Set(DEFAULT_THEMES.map(theme => theme.id));
const FINAL_REWARD_IDS = new Set<FinalRewardId>([
  'slow-kiss',
  'massage',
  'date-choice',
  'body-choice',
  'private-wish',
  'breakfast',
  'outfit',
  'wild-card'
]);

function createInitialPlayers(locale: Locale): Player[] {
  const copy = t[locale];

  return [
    { id: 0, name: copy.playerBlue, color: '#4fb3ff', role: 'male', step: 0, themeId: null },
    { id: 1, name: copy.playerRed, color: '#ff4f7f', role: 'female', step: 0, themeId: null }
  ];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isThemeAllowedForRole(theme: Theme, role: Player['role']) {
  return theme.audience === 'common' || theme.audience === role;
}

function normalizePlayers(input: unknown, locale: Locale): Player[] {
  const incoming = Array.isArray(input) ? input : [];

  return createInitialPlayers(locale).map(base => {
    const found = incoming.find(
      player => isRecord(player) && typeof player.id === 'number' && player.id === base.id
    );
    const record = isRecord(found) ? found : {};
    const roleValue = record.role;
    const themeIdValue = record.themeId;

    return {
      id: base.id,
      name: base.name,
      color: typeof record.color === 'string' ? record.color : base.color,
      role: roleValue === 'male' || roleValue === 'female' ? roleValue : base.role,
      step: typeof record.step === 'number' ? record.step : 0,
      themeId: typeof themeIdValue === 'string' || themeIdValue === null ? themeIdValue : null
    };
  });
}

function normalizeThemes(input: unknown, locale: Locale): Theme[] {
  const incoming = Array.isArray(input) ? input : [];
  const source = incoming.length > 0 ? incoming : getDefaultThemes(locale);

  return source
    .map(item => {
      const record = isRecord(item) ? item : {};
      const tasksValue = record.tasks;
      const tasks = Array.isArray(tasksValue)
        ? tasksValue
            .map(task => (typeof task === 'string' ? task.trim() : ''))
            .filter((task): task is string => task.length > 0)
        : [];
      const audienceValue = record.audience;

      return {
        id: typeof record.id === 'string' ? record.id : `theme_${Date.now()}`,
        name: typeof record.name === 'string' ? record.name : 'Untitled Theme',
        desc: typeof record.desc === 'string' ? record.desc : '',
        audience:
          audienceValue === 'common' || audienceValue === 'male' || audienceValue === 'female'
            ? audienceValue
            : 'common',
        tasks
      } satisfies Theme;
    })
    .reduce<Theme[]>((acc, theme) => {
      if (!acc.some(item => item.id === theme.id)) acc.push(theme);
      return acc;
    }, []);
}

function applyDefaultThemeLocale(themes: Theme[], locale: Locale) {
  const customThemes = themes.filter(theme => !DEFAULT_THEME_IDS.has(theme.id));
  const customIds = new Set(customThemes.map(theme => theme.id));

  return [
    ...getDefaultThemes(locale).filter(theme => !customIds.has(theme.id)),
    ...customThemes
  ];
}

function normalizeGameState(saved: unknown): GameState | null {
  if (!isRecord(saved)) return null;

  const locale: Locale = saved.locale === 'en' || saved.locale === 'es' ? saved.locale : 'zh';
  const themes = applyDefaultThemeLocale(normalizeThemes(saved.themes, locale), locale);
  const players = normalizePlayers(saved.players, locale).map(player => {
    if (player.themeId === null) return player;
    const theme = themes.find(item => item.id === player.themeId);
    if (!theme || !isThemeAllowedForRole(theme, player.role)) return { ...player, themeId: null };
    return player;
  });
  const savedRewardIds = Array.isArray(saved.finalRewardIds)
    ? saved.finalRewardIds.filter(
        (value): value is FinalRewardId =>
          typeof value === 'string' && FINAL_REWARD_IDS.has(value as FinalRewardId)
      )
    : [];

  return {
    view:
      saved.view === 'home' || saved.view === 'game' || saved.view === 'themes'
        ? saved.view
        : 'home',
    locale,
    turn: saved.turn === 0 || saved.turn === 1 ? saved.turn : 0,
    players,
    themes,
    boardMap: Array.isArray(saved.boardMap) ? saved.boardMap : generateBoardMap(),
    pathCoords: Array.isArray(saved.pathCoords) ? saved.pathCoords : generateSpiralPath(),
    isRolling: !!saved.isRolling,
    finalRewardIds:
      savedRewardIds.length >= 3 ? Array.from(new Set(savedRewardIds)).slice(0, 5) : getDefaultFinalRewardIds()
  };
}

function createThemeId(existingIds: Set<string>) {
  const base =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? (crypto as Crypto).randomUUID()
      : `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

  let id = `user_${base}`;
  while (existingIds.has(id)) {
    id = `user_${base}_${Math.random().toString(36).slice(2, 6)}`;
  }
  return id;
}

function randomTask(theme: Theme | undefined, locale: Locale) {
  if (!theme || theme.tasks.length === 0) return t[locale].fallbackTask;
  return theme.tasks[Math.floor(Math.random() * theme.tasks.length)];
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const normalized = normalizeGameState(loadFromStorage<GameState | null>(STORAGE_KEY, null));

    return (
      normalized || {
        view: 'home',
        locale: 'zh',
        turn: 0,
        players: createInitialPlayers('zh'),
        themes: getDefaultThemes('zh'),
        boardMap: generateBoardMap(),
        pathCoords: generateSpiralPath(),
        isRolling: false,
        finalRewardIds: getDefaultFinalRewardIds()
      }
    );
  });

  useEffect(() => {
    saveToStorage(STORAGE_KEY, state);
  }, [state]);

  const switchView = useCallback((view: GameState['view']) => {
    setState(prev => ({ ...prev, view }));
  }, []);

  const switchLocale = useCallback((locale: Locale) => {
    setState(prev => ({
      ...prev,
      locale,
      players: prev.players.map(player => ({
        ...player,
        name: player.id === 0 ? t[locale].playerBlue : t[locale].playerRed
      })),
      themes: applyDefaultThemeLocale(prev.themes, locale)
    }));
  }, []);

  const selectTheme = useCallback((playerId: number, themeId: string) => {
    setState(prev => ({
      ...prev,
      players: prev.players.map(player =>
        player.id === playerId ? { ...player, themeId } : player
      )
    }));
  }, []);

  const setFinalRewardIds = useCallback((rewardIds: FinalRewardId[]) => {
    const cleaned = Array.from(new Set(rewardIds)).filter(id => FINAL_REWARD_IDS.has(id)).slice(0, 5);
    if (cleaned.length < 3) return false;
    setState(prev => ({ ...prev, finalRewardIds: cleaned }));
    return true;
  }, []);

  const createTheme = useCallback(
    (input: { name: string; desc?: string; audience: Theme['audience'] }) => {
      const name = input.name.trim();
      const desc = (input.desc || '').trim();
      if (!name) return null;

      let createdId: string | null = null;
      setState(prev => {
        const id = createThemeId(new Set(prev.themes.map(theme => theme.id)));
        createdId = id;

        return {
          ...prev,
          themes: [...prev.themes, { id, name, desc, audience: input.audience, tasks: [] }]
        };
      });

      return createdId;
    },
    []
  );

  const updateThemeMeta = useCallback(
    (themeId: string, patch: Partial<Pick<Theme, 'name' | 'desc' | 'audience'>>) => {
      setState(prev => ({
        ...prev,
        themes: prev.themes.map(theme => {
          if (theme.id !== themeId) return theme;
          const nextName = typeof patch.name === 'string' ? patch.name.trim() : theme.name;
          const nextDesc = typeof patch.desc === 'string' ? patch.desc.trim() : theme.desc;

          return {
            ...theme,
            name: nextName || theme.name,
            desc: nextDesc,
            audience: patch.audience || theme.audience
          };
        })
      }));
    },
    []
  );

  const addThemeTask = useCallback((themeId: string, taskText: string) => {
    const trimmed = taskText.trim();
    if (!trimmed) return;

    setState(prev => ({
      ...prev,
      themes: prev.themes.map(theme => {
        if (theme.id !== themeId || theme.tasks.includes(trimmed)) return theme;
        return { ...theme, tasks: [...theme.tasks, trimmed] };
      })
    }));
  }, []);

  const removeThemeTask = useCallback((themeId: string, index: number) => {
    setState(prev => ({
      ...prev,
      themes: prev.themes.map(theme => {
        if (theme.id !== themeId || index < 0 || index >= theme.tasks.length) return theme;
        return { ...theme, tasks: theme.tasks.filter((_, i) => i !== index) };
      })
    }));
  }, []);

  const importThemeTasks = useCallback(
    (themeId: string, tasks: string[], mode: 'append' | 'replace' = 'append') => {
      const cleaned = tasks
        .map(task => (typeof task === 'string' ? task.trim() : ''))
        .filter(task => task.length > 0);

      if (cleaned.length === 0) return;

      setState(prev => ({
        ...prev,
        themes: prev.themes.map(theme => {
          if (theme.id !== themeId) return theme;
          const base = mode === 'replace' ? [] : theme.tasks;
          return { ...theme, tasks: Array.from(new Set([...base, ...cleaned])) };
        })
      }));
    },
    []
  );

  const startGame = useCallback(() => {
    for (const player of state.players) {
      if (!player.themeId) return false;
      const theme = state.themes.find(item => item.id === player.themeId);
      if (!theme || !isThemeAllowedForRole(theme, player.role) || theme.tasks.length === 0) {
        return false;
      }
    }

    setState(prev => ({
      ...prev,
      view: 'game',
      turn: Math.random() < 0.5 ? 0 : 1,
      players: prev.players.map(player => ({ ...player, step: 0 })),
      boardMap: generateBoardMap()
    }));
    return true;
  }, [state.players, state.themes]);

  const movePlayer = useCallback((steps: number) => {
    setState(prev => {
      const activePlayer = prev.players[prev.turn];
      const newStep = calculateNewPosition(activePlayer.step, steps);

      return {
        ...prev,
        players: prev.players.map(player =>
          player.id === activePlayer.id ? { ...player, step: newStep } : player
        )
      };
    });
  }, []);

  const endTurn = useCallback(() => {
    setState(prev => ({ ...prev, turn: prev.turn === 0 ? 1 : 0, isRolling: false }));
  }, []);

  const setIsRolling = useCallback((rolling: boolean) => {
    setState(prev => ({ ...prev, isRolling: rolling }));
  }, []);

  const checkTile = useCallback(
    (landingStep: number): TaskEventData | 'win' | null => {
      const copy = t[state.locale];
      const activePlayer = state.players[state.turn];
      const opponent = state.players[state.turn === 0 ? 1 : 0];

      if (landingStep === 48) return 'win';

      if (landingStep !== 0 && landingStep === opponent.step) {
        const theme = state.themes.find(item => item.id === activePlayer.themeId);

        return {
          type: 'collision',
          locale: state.locale,
          initiatorPlayerId: activePlayer.id,
          executorPlayerId: opponent.id,
          title: copy.eventTitles.collision,
          subtitle: `${copy.taskFrom} ${copy.themeQuoteOpen}${theme?.name || copy.mysteryTheme}${copy.themeQuoteClose}`,
          icon: 'handshake',
          color: 'text-amber-300',
          task: randomTask(theme, state.locale),
          taskSourceId: activePlayer.themeId || ''
        };
      }

      const tileType = state.boardMap[landingStep];

      if (tileType === 'lucky') {
        const theme = state.themes.find(item => item.id === activePlayer.themeId);

        return {
          type: 'lucky',
          locale: state.locale,
          initiatorPlayerId: activePlayer.id,
          executorPlayerId: opponent.id,
          title: copy.eventTitles.lucky,
          subtitle: `${copy.taskFrom} ${copy.themeQuoteOpen}${theme?.name || copy.mysteryTheme}${copy.themeQuoteClose}`,
          icon: 'favorite',
          color: 'text-rose-300',
          task: randomTask(theme, state.locale),
          taskSourceId: activePlayer.themeId || ''
        };
      }

      if (tileType === 'trap') {
        const theme = state.themes.find(item => item.id === opponent.themeId);

        return {
          type: 'trap',
          locale: state.locale,
          initiatorPlayerId: activePlayer.id,
          executorPlayerId: activePlayer.id,
          title: copy.eventTitles.trap,
          subtitle: `${copy.taskFrom} ${copy.themeQuoteOpen}${theme?.name || copy.mysteryTheme}${copy.themeQuoteClose}`,
          icon: 'lock',
          color: 'text-fuchsia-300',
          task: randomTask(theme, state.locale),
          taskSourceId: opponent.themeId || ''
        };
      }

      return null;
    },
    [state.players, state.turn, state.themes, state.boardMap, state.locale]
  );

  const resolveTask = useCallback((task: TaskEventData, outcome: 'accept' | 'reject') => {
    setState(prev => {
      let nextPlayers = prev.players;

      if (outcome === 'reject') {
        const backSteps = Math.floor(Math.random() * 3) + 1;
        nextPlayers = prev.players.map(player => {
          if (player.id !== task.executorPlayerId) return player;
          if (task.type === 'collision') return { ...player, step: 0 };
          return { ...player, step: Math.max(0, player.step - backSteps) };
        });
      }

      return {
        ...prev,
        players: nextPlayers,
        turn: prev.turn === 0 ? 1 : 0,
        isRolling: false
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(prev => ({
      ...prev,
      view: 'home',
      turn: 0,
      players: createInitialPlayers(prev.locale).map(player => ({
        ...player,
        themeId: null,
        step: 0
      })),
      boardMap: generateBoardMap(),
      pathCoords: generateSpiralPath(),
      isRolling: false
    }));
  }, []);

  return {
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
  };
}
