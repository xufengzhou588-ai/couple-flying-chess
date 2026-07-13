import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { HandshakeIcon, Heart, Lock, Sparkles } from 'lucide-react';
import { Translation } from '../../i18n';
import { TaskEventData } from '../../types';
import {
  playCharacterVoice,
  stopCharacterVoice,
  unlockCharacterVoice
} from '../../utils/characterVoice';

interface TaskCardModalProps {
  isOpen: boolean;
  taskData: TaskEventData | null;
  copy: Translation;
  onAccept: () => void;
  onReject: () => void;
}

const iconMap: Record<string, ReactNode> = {
  favorite: <Heart size={30} fill="currentColor" />,
  lock: <Lock size={30} />,
  handshake: <HandshakeIcon size={30} />
};

type TaskVisualKey =
  | 'whisper'
  | 'hands'
  | 'blindbox'
  | 'props'
  | 'reward'
  | 'hug'
  | 'gaze'
  | 'couch'
  | 'close';

type TaskVisual = {
  key: TaskVisualKey;
  srcs: readonly string[];
  keywords: readonly string[];
};

const taskVisuals: readonly TaskVisual[] = [
  {
    key: 'whisper',
    srcs: ['/assets/pose-whisper.webp', '/assets/pose-lounge-close.webp'],
    keywords: ['耳', '声音', '秘密', '气音', '昵称', '情话', '名字', '说', 'whisper', 'secret', 'voice', 'name']
  },
  {
    key: 'hands',
    srcs: ['/assets/pose-hands.webp', '/assets/pose-prop-kit.webp'],
    keywords: ['手', '掌心', '手腕', '手肘', '指尖', '牵', '喂', '饮料', '点心', '触碰', 'hand', 'palm', 'wrist', 'fingertip', 'feed', 'touch']
  },
  {
    key: 'blindbox',
    srcs: ['/assets/pose-blindbox.webp', '/assets/pose-blindfold-kit.webp', '/assets/pose-prop-kit.webp'],
    keywords: ['盲眼', '眼罩', '丝巾', '触觉', '盲盒', '羽毛', '冰块', '热毛巾', '巧克力', '猜', 'blindfold', 'blind box', 'touch guessing', 'feather', 'ice cube', 'warm towel', 'chocolate', 'guess']
  },
  {
    key: 'props',
    srcs: ['/assets/pose-prop-kit.webp', '/assets/pose-blindfold-kit.webp'],
    keywords: ['道具', '丝巾', '羽毛', '巧克力', '冰', '热', '小惩罚', '玩法', 'props', 'scarf', 'feather', 'chocolate', 'ice', 'warm', 'punishment']
  },
  {
    key: 'reward',
    srcs: ['/assets/pose-reward-box.webp', '/assets/pose-prop-kit.webp'],
    keywords: ['奖励', '终点', '赢家', '奖池', '选择', 'reward', 'winner', 'finish', 'victory', 'prize']
  },
  {
    key: 'hug',
    srcs: ['/assets/pose-backhug.webp', '/assets/pose-lounge-close.webp'],
    keywords: ['背后', '拥抱', '抱', '背上', '腰侧', '腰腹', '臀侧', '臀部', '屁股', '靠近', 'hug', 'hold', 'behind', 'back', 'waist', 'hip', 'butt', 'embrace']
  },
  {
    key: 'gaze',
    srcs: ['/assets/pose-forehead.webp', '/assets/pose-lounge-close.webp'],
    keywords: ['对视', '额头', '闭眼', '晚安', '安心', '温柔', 'gaze', 'forehead', 'eyes', 'soft']
  },
  {
    key: 'couch',
    srcs: ['/assets/pose-couch.webp', '/assets/pose-lounge-close.webp'],
    keywords: ['毯子', '沙发', '放松', '按摩', '肩颈', '肩膀', '肩胛', '膝盖', '音乐', '坐姿', 'couch', 'blanket', 'massage', 'shoulder', 'knee', 'music']
  },
  {
    key: 'close',
    srcs: ['/assets/pose-close.webp', '/assets/pose-lounge-close.webp', '/assets/pose-reward-box.webp'],
    keywords: ['嘴唇', '亲吻', '心跳', '奖励', '邀请', '暂停', '升级', '颈侧', '耳后', '锁骨', '呼吸', '胸口', '胸部', '胸尖', '私处', '敏感', '私密', '贴身', '大腿外侧', '大腿内侧', 'kiss', 'lips', 'close', 'pause', 'neck', 'collarbone', 'chest', 'nipple', 'private area', 'sensitive', 'intimate', 'breath', 'thigh', 'reward']
  }
] as const;

function getTaskVisual(task: string) {
  const lowerTask = task.toLowerCase();
  const visual =
    taskVisuals.find(visual => visual.keywords.some(keyword => lowerTask.includes(keyword.toLowerCase()))) ||
    taskVisuals[Math.abs(hashText(task)) % taskVisuals.length];
  const src = visual.srcs[Math.abs(hashText(`${task}_${visual.key}`)) % visual.srcs.length];
  return { key: visual.key, src };
}

function hashText(text: string) {
  return Array.from(text).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 7);
}

export function TaskCardModal({ isOpen, taskData, copy, onAccept, onReject }: TaskCardModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const actionLockedRef = useRef(false);
  const visual = useMemo(() => getTaskVisual(taskData?.task || ''), [taskData?.task]);
  const visualLabel = copy.visualLabels[visual.key];

  useEffect(() => {
    const sources = new Set(taskVisuals.flatMap(item => item.srcs));
    sources.forEach(src => {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsFlipped(false);
      setIsDismissed(false);
      actionLockedRef.current = false;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      stopCharacterVoice();
      document.body.style.overflow = '';
    };
  }, [isOpen, taskData]);

  const finishTask = (action: 'accept' | 'reject') => {
    if (actionLockedRef.current) return;
    actionLockedRef.current = true;
    stopCharacterVoice();
    setIsDismissed(true);

    window.requestAnimationFrame(() => {
      if (action === 'accept') onAccept();
      else onReject();
    });
  };

  if (!isOpen || !taskData || isDismissed) return null;

  const rejectLabel = taskData.type === 'collision' ? copy.rejectStart : copy.rejectBack;
  const executorLabel = taskData.executorPlayerId === 0 ? copy.playerBlue : copy.playerRed;
  const executorClassName = taskData.executorPlayerId === 0 ? 'text-sky-200' : 'text-rose-200';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-5">
      <div className="absolute inset-0 bg-[#07050a]/86 backdrop-blur-md" />

      <div className="relative h-[560px] w-full max-w-sm perspective-1000">
        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
          <div
            className="flip-card-front overflow-hidden border border-white/12 bg-[#170f18] shadow-2xl"
            onClick={() => {
              unlockCharacterVoice(taskData.locale);
              playCharacterVoice(taskData);
              setIsFlipped(true);
            }}
          >
            <img src={visual.src} alt="" decoding="async" loading="eager" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(8,4,8,0.22)_42%,rgba(8,4,8,0.92))]" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/12 text-rose-100 backdrop-blur-md">
                {iconMap[taskData.icon] || iconMap.favorite}
              </div>
              <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-amber-100/80">
                <Sparkles size={12} />
                {visualLabel} {copy.taskVisualSuffix}
              </div>
              <h3 className="text-3xl font-black text-white">{taskData.title}</h3>
              <p className="mt-3 text-sm font-medium text-white/58">{copy.flipTask}</p>
            </div>
          </div>

          <div className="flip-card-back overflow-hidden border border-white/12 bg-[#170f18] shadow-2xl">
            <img src={visual.src} alt="" decoding="async" loading="eager" className="absolute inset-0 h-full w-full object-cover opacity-48" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,7,15,0.36),rgba(13,7,15,0.88)_36%,rgba(13,7,15,0.98))]" />

            <div className="relative z-10 flex h-full flex-col p-5">
              <div className="mb-3 flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 ${taskData.color}`}>
                  {iconMap[taskData.icon] || iconMap.favorite}
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/70">
                  {visualLabel}
                </div>
              </div>

              <h3 className="text-2xl font-black text-white">{taskData.title}</h3>
              <div className="mt-2 text-xs leading-relaxed text-white/56">
                <div>{taskData.subtitle}</div>
                <div>
                  {copy.executeBy} <span className={executorClassName}>{executorLabel}</span> {copy.execute}
                </div>
              </div>

              <div className="mt-7 flex min-h-[150px] flex-1 items-center justify-center rounded-[24px] border border-white/12 bg-black/24 p-5 backdrop-blur-md">
                <div className="text-center">
                  {taskData.bonusSeconds && (
                    <div className="mb-3 inline-flex rounded-full border border-amber-100/25 bg-amber-100/12 px-3 py-1 text-[11px] font-black text-amber-100">
                      {copy.taskBonus} {taskData.bonusSeconds} {taskData.locale === 'zh' ? '秒' : 'seconds'}
                    </div>
                  )}
                  <p className="text-[22px] font-black leading-relaxed text-white">
                    {taskData.task}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-white/46">
                {copy.taskConsent}
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  className="h-12 flex-1 touch-manipulation rounded-2xl border border-white/10 bg-white/10 text-sm font-black text-rose-200 transition active:scale-[0.98]"
                  onPointerUp={() => finishTask('reject')}
                  onClick={() => finishTask('reject')}
                >
                  {rejectLabel}
                </button>
                <button
                  type="button"
                  className="h-12 flex-1 touch-manipulation rounded-2xl bg-white text-sm font-black text-[#16090f] shadow-lg transition active:scale-[0.98]"
                  onPointerUp={() => finishTask('accept')}
                  onClick={() => finishTask('accept')}
                >
                  {copy.accept}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
