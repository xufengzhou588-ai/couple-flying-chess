import { DiceReactionData, FinalRewardId, Locale, MilestoneEventData } from '../types';

export interface FinalRewardOption {
  id: FinalRewardId;
  category: 'sweet' | 'flirty' | 'after-dark' | 'wild';
  title: string;
  description: string;
  gentleVersion: string;
}

const DEFAULT_REWARD_IDS: FinalRewardId[] = [
  'slow-kiss',
  'massage',
  'date-choice',
  'body-choice',
  'private-wish'
];

const rewards = {
  zh: [
    {
      id: 'slow-kiss',
      category: 'flirty',
      title: '赢家之吻',
      description: '赢家指定一种亲吻方式，持续30秒。',
      gentleVersion: '改成15秒慢吻或额头吻。'
    },
    {
      id: 'massage',
      category: 'sweet',
      title: '专属放松',
      description: '获得5分钟肩颈、手部或腿部按摩。',
      gentleVersion: '改成2分钟肩颈按摩。'
    },
    {
      id: 'date-choice',
      category: 'sweet',
      title: '下次约会权',
      description: '赢家决定下一次约会的主题和地点。',
      gentleVersion: '两人各提一个方案，赢家二选一。'
    },
    {
      id: 'body-choice',
      category: 'after-dark',
      title: '身体偏爱',
      description: '赢家选择双方允许的一个部位，享受60秒专属亲密。',
      gentleVersion: '改成隔衣触碰或亲吻20秒。'
    },
    {
      id: 'private-wish',
      category: 'after-dark',
      title: '今晚心愿',
      description: '赢家说出一个亲密心愿，由对方决定实现到哪一步。',
      gentleVersion: '只说出心愿，今晚不必执行。'
    },
    {
      id: 'breakfast',
      category: 'sweet',
      title: '明早服务',
      description: '输家负责明早的早餐、咖啡或赖床照顾。',
      gentleVersion: '改成明早准备一杯喜欢的饮料。'
    },
    {
      id: 'outfit',
      category: 'flirty',
      title: '造型决定权',
      description: '赢家为对方挑选今晚或下次约会的一套造型。',
      gentleVersion: '只选择一个配饰或颜色。'
    },
    {
      id: 'wild-card',
      category: 'wild',
      title: '神秘通行证',
      description: '赢家提出一个双方都愿意的临时奖励。',
      gentleVersion: '若没有共识，自动换成30秒拥抱。'
    }
  ],
  en: [
    {
      id: 'slow-kiss',
      category: 'flirty',
      title: 'Winner’s Kiss',
      description: 'The winner picks the style. The kiss lasts 30 seconds.',
      gentleVersion: 'Make it a 15-second slow kiss or a forehead kiss.'
    },
    {
      id: 'massage',
      category: 'sweet',
      title: 'Five-Star Service',
      description: 'Cash in five minutes of shoulder, hand, or leg massage.',
      gentleVersion: 'Make it a two-minute shoulder massage.'
    },
    {
      id: 'date-choice',
      category: 'sweet',
      title: 'Next Date Draft Pick',
      description: 'The winner chooses the theme and location of the next date.',
      gentleVersion: 'Each person pitches one idea. The winner picks.'
    },
    {
      id: 'body-choice',
      category: 'after-dark',
      title: 'Favorite Place',
      description: 'Pick one mutually approved body area for 60 seconds of attention.',
      gentleVersion: 'Keep it over clothing or make it a 20-second kiss.'
    },
    {
      id: 'private-wish',
      category: 'after-dark',
      title: 'Tonight’s Wish',
      description: 'Name one intimate wish. Your partner decides exactly how far it goes.',
      gentleVersion: 'Share the wish now and save the action for another night.'
    },
    {
      id: 'breakfast',
      category: 'sweet',
      title: 'Morning-After Perks',
      description: 'The runner-up handles breakfast, coffee, or premium lounging service.',
      gentleVersion: 'Make it one favorite morning drink.'
    },
    {
      id: 'outfit',
      category: 'flirty',
      title: 'Wardrobe Privileges',
      description: 'Choose one outfit for tonight or the next date.',
      gentleVersion: 'Choose only one accessory or color.'
    },
    {
      id: 'wild-card',
      category: 'wild',
      title: 'Wild Card',
      description: 'Pitch one mutually wanted reward. Keep negotiations charming.',
      gentleVersion: 'No deal? It automatically becomes a 30-second hug.'
    }
  ]
} satisfies Record<Locale, FinalRewardOption[]>;

export function getDefaultFinalRewardIds() {
  return [...DEFAULT_REWARD_IDS];
}

export function getFinalRewards(locale: Locale) {
  return rewards[locale];
}

export function getDiceReaction(locale: Locale, playerId: number, result: number): DiceReactionData {
  const isMale = playerId === 0;
  const mood = result === 4 ? 'heart' : result === 1 ? 'spicy' : 'tease';

  if (locale === 'zh') {
    if (result === 4) {
      return {
        playerId,
        result,
        mood,
        title: '漂亮！',
        line: isMale ? '这手气，今晚稳了。' : '跟紧一点哦，我可不等人。'
      };
    }
    if (result === 1) {
      return {
        playerId,
        result,
        mood,
        title: '就一点？',
        line: isMale ? '骰子可能嫉妒我的实力。' : '我只是先让你一点点。'
      };
    }
    return {
      playerId,
      result,
      mood,
      title: result === 3 ? '不错哦' : '慢慢来',
      line: isMale ? '距离奖励又近了一点。' : '别急，好戏还在后面。'
    };
  }

  if (result === 4) {
    return {
      playerId,
      result,
      mood,
      title: 'Big move!',
      line: isMale ? 'That’s how you roll, babe.' : 'Try to keep up, handsome.'
    };
  }
  if (result === 1) {
    return {
      playerId,
      result,
      mood,
      title: 'One. Seriously?',
      line: isMale ? 'The dice clearly fear my potential.' : 'Cute. I was giving you a chance.'
    };
  }
  return {
    playerId,
    result,
    mood,
    title: result === 3 ? 'Not bad' : 'Slow burn',
    line: isMale ? 'One step closer to the good part.' : 'Relax. The fun is catching up.'
  };
}

export function getHotStreakReaction(
  locale: Locale,
  playerId: number,
  streak: number
): DiceReactionData {
  const isMale = playerId === 0;

  if (locale === 'zh') {
    return {
      playerId,
      result: 4,
      mood: 'heart',
      title: `${streak} 连高点，手气发烫`,
      line: isMale ? '今晚这骰子明显站我这边。' : '别眨眼，我的好运还没停。'
    };
  }

  return {
    playerId,
    result: 4,
    mood: 'heart',
    title: `${streak} big rolls. Hot streak!`,
    line: isMale
      ? 'The dice have excellent taste tonight.'
      : 'Try to keep up. I am apparently irresistible to dice.'
  };
}

export function getMilestoneEvent(locale: Locale, threshold: 25 | 50 | 75): MilestoneEventData {
  const content = {
    zh: {
      25: ['第一层解锁', '两人互相说一句今晚最想听到的夸奖。'],
      50: ['默契加码', '下一张被接受的任务，时长自动增加10秒。'],
      75: ['终点预热', '赢家奖励即将解锁。现在各说一个希望它包含的关键词。']
    },
    en: {
      25: ['First unlock', 'Trade one compliment you secretly hoped to hear tonight.'],
      50: ['Chemistry bonus', 'Add ten seconds to the next dare you both accept.'],
      75: ['Final reward preview', 'Each person gives one clue about the reward they hope appears.']
    }
  } as const;
  const [title, line] = content[locale][threshold];
  return { threshold, title, line };
}
