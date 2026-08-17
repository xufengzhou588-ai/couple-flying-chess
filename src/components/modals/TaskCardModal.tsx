import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { HandshakeIcon, Heart, Lock, Sparkles } from 'lucide-react';
import { Translation } from '../../i18n';
import { TaskEventData } from '../../types';
import {
  playCharacterVoice,
  stopCharacterVoice,
  unlockCharacterVoice
} from '../../utils/characterVoice';
import { assetPath } from '../../utils/assets';
import { parseTaskTag } from '../../utils/themeTaskTags';

interface TaskCardModalProps {
  isOpen: boolean;
  taskData: TaskEventData | null;
  copy: Translation;
  canResolve: boolean;
  lockedHint: string;
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
    srcs: ['/assets/pose-whisper.jpg', '/assets/pose-lounge-close.jpg'],
    keywords: ['耳', '声音', '秘密', '气音', '昵称', '情话', '名字', '说', 'whisper', 'secret', 'voice', 'name']
  },
  {
    key: 'hands',
    srcs: ['/assets/pose-hands.jpg', '/assets/pose-prop-kit.jpg'],
    keywords: ['手', '掌心', '手腕', '手肘', '指尖', '牵', '喂', '饮料', '点心', '触碰', 'hand', 'palm', 'wrist', 'fingertip', 'feed', 'touch']
  },
  {
    key: 'blindbox',
    srcs: ['/assets/pose-blindbox.jpg', '/assets/pose-blindfold-kit.jpg', '/assets/pose-prop-kit.jpg'],
    keywords: ['盲眼', '眼罩', '丝巾', '触觉', '盲盒', '羽毛', '冰块', '热毛巾', '巧克力', '猜', 'blindfold', 'blind box', 'touch guessing', 'feather', 'ice cube', 'warm towel', 'chocolate', 'guess']
  },
  {
    key: 'props',
    srcs: ['/assets/pose-prop-kit.jpg', '/assets/pose-blindfold-kit.jpg'],
    keywords: ['道具', '丝巾', '羽毛', '巧克力', '冰', '热', '小惩罚', '玩法', 'props', 'scarf', 'feather', 'chocolate', 'ice', 'warm', 'punishment']
  },
  {
    key: 'reward',
    srcs: ['/assets/pose-reward-box.jpg', '/assets/pose-prop-kit.jpg'],
    keywords: ['奖励', '终点', '赢家', '奖池', '选择', 'reward', 'winner', 'finish', 'victory', 'prize']
  },
  {
    key: 'hug',
    srcs: ['/assets/pose-backhug.jpg', '/assets/pose-lounge-close.jpg'],
    keywords: ['背后', '拥抱', '抱', '背上', '腰侧', '靠近', 'hug', 'hold', 'behind', 'back', 'waist', 'hip', 'embrace']
  },
  {
    key: 'gaze',
    srcs: ['/assets/pose-forehead.jpg', '/assets/pose-lounge-close.jpg'],
    keywords: ['对视', '额头', '闭眼', '晚安', '安心', '温柔', 'gaze', 'forehead', 'eyes', 'soft']
  },
  {
    key: 'couch',
    srcs: ['/assets/pose-couch.jpg', '/assets/pose-lounge-close.jpg'],
    keywords: ['毯子', '沙发', '放松', '按摩', '肩颈', '肩膀', '肩胛', '膝盖', '音乐', '坐姿', 'couch', 'blanket', 'massage', 'shoulder', 'knee', 'music']
  },
  {
    key: 'close',
    srcs: ['/assets/pose-close.jpg', '/assets/pose-lounge-close.jpg', '/assets/pose-reward-box.jpg'],
    keywords: ['嘴唇', '亲吻', '心跳', '奖励', '邀请', '暂停', '升级', '颈侧', '耳后', '锁骨', '呼吸', '贴近', '安全位置', 'kiss', 'lips', 'close', 'pause', 'neck', 'collarbone', 'safe place', 'intimate', 'breath', 'reward']
  }
] as const;

function getTaskVisual(task: string) {
  const lowerTask = task.toLowerCase();
  const visual =
    taskVisuals.find(visual => visual.keywords.some(keyword => lowerTask.includes(keyword.toLowerCase()))) ||
    taskVisuals[Math.abs(hashText(task)) % taskVisuals.length];
  const src = visual.srcs[Math.abs(hashText(`${task}_${visual.key}`)) % visual.srcs.length];
  return { key: visual.key, src: assetPath(src) };
}

function hashText(text: string) {
  return Array.from(text).reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) | 0, 7);
}

export function TaskCardModal({
  isOpen,
  taskData,
  copy,
  canResolve,
  lockedHint,
  onAccept,
  onReject
}: TaskCardModalProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const actionLockedRef = useRef(false);
  const parsedTask = useMemo(() => parseTaskTag(taskData?.task || ''), [taskData?.task]);
  const visual = useMemo(() => getTaskVisual(parsedTask.text), [parsedTask.text]);
  const visualLabel = copy.visualLabels[visual.key];

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
    if (!canResolve) return;
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
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-4">
      <div className="cfc-modal-scrim" />

      <div
        className="relative h-[min(560px,calc(100dvh-32px))] w-full max-w-sm perspective-1000"
        role="dialog"
        aria-modal="true"
        aria-label={taskData.title}
      >
        <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
          <button
            type="button"
            className="flip-card-front cfc-dialog-card cfc-pressable overflow-hidden text-left"
            onClick={() => {
              unlockCharacterVoice(taskData.locale);
              playCharacterVoice({ ...taskData, task: parsedTask.text });
              setIsFlipped(true);
            }}
            aria-label={`${copy.flipTask}: ${taskData.title}`}
          >
            <img src={visual.src} alt="" decoding="async" loading="eager" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(8,4,8,0.22)_42%,rgba(8,4,8,0.92))]" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-center">
              <div className="cfc-icon-tile mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--cfc-border)] bg-[var(--cfc-surface-soft)] text-[var(--cfc-rose-soft)] backdrop-blur-md">
                {iconMap[taskData.icon] || iconMap.favorite}
              </div>
              <div className="cfc-chip mb-2 border-amber-100/24 bg-amber-100/12 text-amber-100/86">
                <Sparkles size={12} />
                {parsedTask.kindLabel || visualLabel} {parsedTask.intensityLabel || copy.taskVisualSuffix}
              </div>
              <h3 className="text-3xl font-black text-white">{taskData.title}</h3>
              <p className="mt-3 text-sm font-medium text-[var(--cfc-text-muted)]">{copy.flipTask}</p>
            </div>
          </button>

          <div className="flip-card-back cfc-dialog-card overflow-hidden">
            <img src={visual.src} alt="" decoding="async" loading="eager" className="absolute inset-0 h-full w-full object-cover opacity-48" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,7,15,0.36),rgba(13,7,15,0.88)_36%,rgba(13,7,15,0.98))]" />

            <div className="relative z-10 flex h-full flex-col p-5 pb-[max(20px,env(safe-area-inset-bottom))]">
              <div className="mb-3 flex items-center justify-between">
                <div className={`cfc-icon-tile flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--cfc-surface-soft)] ${taskData.color}`}>
                  {iconMap[taskData.icon] || iconMap.favorite}
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  {(parsedTask.kindLabel || parsedTask.intensityLabel) ? (
                    <>
                      {parsedTask.kindLabel && (
                        <span className="rounded-full bg-rose-100/14 px-3 py-1 text-[11px] font-black text-rose-100">
                          {parsedTask.kindLabel}
                        </span>
                      )}
                      {parsedTask.intensityLabel && (
                        <span className="rounded-full bg-amber-100/14 px-3 py-1 text-[11px] font-black text-amber-100">
                          {parsedTask.intensityLabel}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/70">
                      {visualLabel}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-2xl font-black text-white">{taskData.title}</h3>
              <div className="mt-2 text-xs leading-relaxed text-[var(--cfc-text-muted)]">
                <div>{taskData.subtitle}</div>
                <div>
                  {copy.executeBy} <span className={executorClassName}>{executorLabel}</span> {copy.execute}
                </div>
              </div>

              <div className="cfc-info-card mt-6 flex min-h-[148px] flex-1 items-center justify-center rounded-[24px] p-5 backdrop-blur-md">
                <div className="text-center">
                  {taskData.bonusSeconds && (
                    <div className="cfc-chip mb-3 border-amber-100/25 bg-amber-100/12 text-amber-100">
                      {copy.taskBonus} {taskData.bonusSeconds} {taskData.locale === 'zh' ? '秒' : 'seconds'}
                    </div>
                  )}
                  <p className="text-[22px] font-black leading-relaxed text-white">
                    {parsedTask.text}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-[var(--cfc-text-subtle)]">
                {canResolve ? copy.taskConsent : lockedHint}
              </p>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  disabled={!canResolve}
                  className="cfc-action-danger flex-1 touch-manipulation"
                  onPointerUp={() => finishTask('reject')}
                  onClick={() => finishTask('reject')}
                >
                  {rejectLabel}
                </button>
                <button
                  type="button"
                  disabled={!canResolve}
                  className="cfc-action-primary flex-1 touch-manipulation"
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
