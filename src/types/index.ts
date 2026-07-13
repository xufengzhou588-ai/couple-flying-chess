export type TileType = 'blank' | 'lucky' | 'trap';

export type PlayerRole = 'male' | 'female';

export interface Player {
  id: number;
  name: string;
  color: string;
  role: PlayerRole;
  step: number;
  themeId: string | null;
}

export type ThemeAudience = 'common' | 'male' | 'female';
export type Locale = 'zh' | 'en';
export type FinalRewardId =
  | 'slow-kiss'
  | 'massage'
  | 'date-choice'
  | 'body-choice'
  | 'private-wish'
  | 'breakfast'
  | 'outfit'
  | 'wild-card';

export interface Theme {
  id: string;
  name: string;
  desc: string;
  audience: ThemeAudience;
  tasks: string[];
}

export interface PathCoord {
  r: number;
  c: number;
}

export interface GameState {
  view: 'home' | 'game' | 'themes';
  locale: Locale;
  turn: number;
  players: Player[];
  themes: Theme[];
  boardMap: TileType[];
  pathCoords: PathCoord[];
  isRolling: boolean;
  finalRewardIds: FinalRewardId[];
}

export interface DiceReactionData {
  playerId: number;
  result: number;
  mood: 'heart' | 'tease' | 'spicy';
  title: string;
  line: string;
}

export interface MilestoneEventData {
  threshold: 25 | 50 | 75;
  title: string;
  line: string;
}

export interface TaskEventData {
  type: 'collision' | 'lucky' | 'trap';
  locale: Locale;
  initiatorPlayerId: number;
  executorPlayerId: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  task: string;
  taskSourceId: string;
  bonusSeconds?: number;
}
