import type { CSSProperties } from 'react';

import { Player } from '../types';
import { assetPath } from '../utils/assets';

type CharacterMood = 'idle' | 'heart' | 'tease' | 'spicy';
type CharacterSize = 'home' | 'board';

interface CharacterTokenProps {
  player: Pick<Player, 'id' | 'color'>;
  active?: boolean;
  mood?: CharacterMood;
  size?: CharacterSize;
}

export function CharacterToken({
  player,
  active = false,
  mood = 'idle',
  size = 'board'
}: CharacterTokenProps) {
  const gender = player.id === 0 ? 'boy' : 'girl';
  const avatarSrc = assetPath(gender === 'boy' ? 'assets/avatar-boy.png' : 'assets/avatar-girl.png');

  return (
    <div
      className={`character-token character-token--${gender} character-token--${size} character-token--${mood} ${
        active ? 'character-token--active' : ''
      }`}
      style={{ '--token-color': player.color } as CSSProperties}
      aria-hidden="true"
    >
      <div className="character-token__glow" />
      <img className="character-token__avatar" src={avatarSrc} alt="" />
      <div className="character-token__blink character-token__blink--left" />
      <div className="character-token__blink character-token__blink--right" />
      <div className="character-token__blush character-token__blush--left" />
      <div className="character-token__blush character-token__blush--right" />
      <div className="character-token__heart character-token__heart--one" />
      <div className="character-token__heart character-token__heart--two" />
      <div className="character-token__sweat" />
      <div className="character-token__prop">
        <span />
      </div>
    </div>
  );
}
