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
  ],
  es: [
    {
      id: 'slow-kiss',
      category: 'flirty',
      title: 'Beso ganador',
      description: 'El ganador elige el estilo. El beso dura 30 segundos.',
      gentleVersion: 'Hazlo un beso lento de 15 segundos o un beso en la frente.'
    },
    {
      id: 'massage',
      category: 'sweet',
      title: 'Servicio cinco estrellas',
      description: 'Cobra cinco minutos de masaje en hombros, manos o piernas.',
      gentleVersion: 'Hazlo un masaje de hombros de dos minutos.'
    },
    {
      id: 'date-choice',
      category: 'sweet',
      title: 'Elección de cita',
      description: 'El ganador elige el tema y el lugar de la próxima cita.',
      gentleVersion: 'Cada quien propone una idea. El ganador elige una.'
    },
    {
      id: 'body-choice',
      category: 'after-dark',
      title: 'Atención favorita',
      description: 'Elige una forma de atención aprobada por ambos durante 60 segundos.',
      gentleVersion: 'Hazlo por encima de la ropa o cambia por un beso de 20 segundos.'
    },
    {
      id: 'private-wish',
      category: 'after-dark',
      title: 'Deseo de la noche',
      description: 'Nombra un deseo romántico. Tu pareja decide la versión cómoda.',
      gentleVersion: 'Comparte el deseo ahora y deja la acción para otra noche.'
    },
    {
      id: 'breakfast',
      category: 'sweet',
      title: 'Premio de mañana',
      description: 'Quien quede segundo se encarga del desayuno, café o mimos de descanso.',
      gentleVersion: 'Hazlo una bebida favorita por la mañana.'
    },
    {
      id: 'outfit',
      category: 'flirty',
      title: 'Poder de estilo',
      description: 'Elige un outfit para esta noche o para la próxima cita.',
      gentleVersion: 'Elige solo un accesorio o color.'
    },
    {
      id: 'wild-card',
      category: 'wild',
      title: 'Carta libre',
      description: 'Propón un premio que ambos quieran. Negocien con encanto.',
      gentleVersion: '¿Sin acuerdo? Se convierte en un abrazo de 30 segundos.'
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
        line: isMale ? '这手气，今晚稳了。' : '我先往前一点，你慢慢跟上来。'
      };
    }
    if (result === 1) {
      return {
        playerId,
        result,
        mood,
        title: '就一点？',
        line: isMale ? '骰子可能嫉妒我的实力。' : '没关系，慢一点也很好玩。'
      };
    }
    return {
      playerId,
      result,
      mood,
      title: result === 3 ? '不错哦' : '慢慢来',
      line: isMale ? '距离奖励又近了一点。' : '别急，我们慢慢来。'
    };
  }

  if (locale === 'es') {
    if (result === 4) {
      return {
        playerId,
        result,
        mood,
        title: '¡Gran jugada!',
        line: isMale ? 'Así se tira el dado, amor.' : 'Ven, amor. Te espero.'
      };
    }
    if (result === 1) {
      return {
        playerId,
        result,
        mood,
        title: '¿Solo uno?',
        line: isMale ? 'El dado le teme a mi potencial.' : 'Está bien. Ir lento también tiene encanto.'
      };
    }
    return {
      playerId,
      result,
      mood,
      title: result === 3 ? 'Nada mal' : 'Fuego lento',
      line: isMale ? 'Un paso más cerca de lo bueno.' : 'Sin prisa. Alcanzarte es parte del juego.'
    };
  }

  if (result === 4) {
    return {
      playerId,
      result,
      mood,
      title: 'Big move!',
      line: isMale ? 'That’s how you roll, babe.' : 'Come on, love. I will wait for you.'
    };
  }
  if (result === 1) {
    return {
      playerId,
      result,
      mood,
      title: 'One. Seriously?',
      line: isMale ? 'The dice clearly fear my potential.' : 'It is okay. Slow can be sweet too.'
    };
  }
  return {
    playerId,
    result,
    mood,
    title: result === 3 ? 'Not bad' : 'Slow burn',
    line: isMale ? 'One step closer to the good part.' : 'No rush. The fun is catching up.'
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
      line: isMale ? '今晚这骰子明显站我这边。' : '今天好运好像一直陪着我。'
    };
  }

  if (locale === 'es') {
    return {
      playerId,
      result: 4,
      mood: 'heart',
      title: `${streak} tiradas grandes. ¡Racha caliente!`,
      line: isMale
        ? 'El dado tiene muy buen gusto esta noche.'
        : 'Parece que la suerte me está tratando muy bien.'
    };
  }

  return {
    playerId,
    result: 4,
    mood: 'heart',
    title: `${streak} big rolls. Hot streak!`,
    line: isMale
      ? 'The dice have excellent taste tonight.'
      : 'Looks like luck is being very kind tonight.'
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
    },
    es: {
      25: ['Primer desbloqueo', 'Intercambien un cumplido que secretamente querían escuchar esta noche.'],
      50: ['Bono de química', 'Suma diez segundos al próximo reto que ambos acepten.'],
      75: ['Vista previa del premio', 'Cada persona da una pista del premio que espera ver.']
    }
  } as const;
  const [title, line] = content[locale][threshold];
  return { threshold, title, line };
}
