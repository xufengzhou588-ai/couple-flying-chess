import type { Branch, Mode, Vibe } from './content';
import type { ArtKind } from './illustrations';

// A card gets art only when the picture can depict the prompt itself. Missing
// entries are intentional: an abstract question reads better without filler.
const dice: Partial<Record<string, ArtKind>> = {
  n2: 'ticket', n6: 'map', t1: 'chat', t4: 'map',
  m1: 'movie', m4: 'hands', m5: 'home', m6: 'book',
};
const diceFlirty: Partial<Record<string, ArtKind>> = {
  n1: 'spark', n2: 'ticket', n3: 'chat', n4: 'chat', n5: 'spark', n6: 'heart',
  t1: 'spark', t2: 'camera', t3: 'ticket', t4: 'butterfly', t5: 'hands', t6: 'ticket',
  m1: 'home', m2: 'ticket', m4: 'hands', m5: 'ticket', m6: 'home',
};
export function diceIllustration(id: string, vibe: Vibe): ArtKind | undefined {
  return vibe === 'flirty' ? diceFlirty[id] : dice[id];
}

// Neutral art only: never picture one of the answer options in a guessing game.
const mind: Partial<Record<string, ArtKind>> = { n2: 'chat', n3: 'chat', t2: 'camera', m3: 'camera' };
const wish: Partial<Record<string, ArtKind>> = {
  n1: 'ticket', n2: 'chat', n4: 'map', t1: 'ticket',
  t2: 'phone-off', t3: 'map', m1: 'home',
};
// Private clue art shows the physical note or ticket. The shared question has
// no image; the revealed resolution gets art only after the answer is known.
const mysteryClue: Partial<Record<string, ArtKind>> = {
  n1: 'letter', n2: 'letter', n3: 'letter',
  t1: 'ticket', t3: 'letter',
  m1: 'letter', m2: 'letter', m3: 'letter',
};
const mysteryReveal: Record<string, ArtKind> = {
  n1: 'book', n2: 'icecream', n3: 'walk',
  t1: 'ticket', t2: 'book', t3: 'dance',
  m1: 'coffee', m2: 'book', m3: 'music',
};
const mission: Partial<Record<string, ArtKind>> = {
  'tiny-trip': 'map', 'first-date': 'camera', 'band-name': 'music',
  'inside-joke': 'chat', weekend: 'calendar', soundtrack: 'music',
  superpower: 'medal', 'food-debate': 'chat', nickname: 'chat',
  'first-move': 'chat', dance: 'dance',
  'new-curiosity': 'chat', 'new-invite': 'ticket',
  'together-throwback': 'camera', 'together-reinvite': 'ticket',
  'married-thanks': 'chat', 'married-reinvite': 'home',
};
const idea: Partial<Record<string, ArtKind>> = {
  diner: 'diner', playlist: 'music', 'bad-art': 'paint',
  'dream-trip': 'travel', pitch: 'movie', 'old-photo': 'camera',
  taste: 'diner', awards: 'medal', sunday: 'calendar',
  'meet-cute': 'coffee', 'slow-dance': 'dance', 'love-note': 'letter',
  'movie-scene': 'movie', callback: 'camera', 'new-exchange': 'map',
  'new-opener': 'chat',
  'together-callback': 'ticket', 'married-night': 'home',
  'married-first-date': 'ticket',
};
const artByMode: Record<Mode, ArtKind> = {
  'first-date': 'bar', mission: 'letter', 'double-yes': 'hands',
  'heart-dice': 'dice', 'read-my-mind': 'puzzle',
  'wish-auction': 'coins', 'date-mystery': 'book', 'after-hours': 'butterfly',
  'sketch-date': 'paint',
};
export function sceneIllustration(branch: Branch, round: number): ArtKind {
  return round === 2 ? (branch === 'birthday' ? 'dessert' : 'chat') : (['bar', 'chat', 'chat', 'ticket'] as ArtKind[])[round];
}
export const illustrationFor = { dice, mind, wish, mysteryClue, mysteryReveal, mission, idea, game: artByMode };
