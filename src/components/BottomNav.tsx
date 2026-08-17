import { GamepadIcon, Layers } from 'lucide-react';
import { Translation } from '../i18n';

interface BottomNavProps {
  activeView: 'home' | 'game' | 'themes';
  copy: Translation;
  canStart: boolean;
  onNavigate: (view: 'home' | 'themes') => void;
  onStartGame: () => void;
}

export function BottomNav({ activeView, copy, canStart, onNavigate, onStartGame }: BottomNavProps) {
  const handlePlayClick = () => {
    if (activeView === 'home') {
      onStartGame();
      return;
    }

    onNavigate('home');
  };

  const playLabel = activeView === 'home' && canStart ? copy.startGame : copy.navPlay;

  return (
    <nav className="bottom-nav z-50 flex h-[calc(72px+env(safe-area-inset-bottom))] shrink-0 items-start justify-around border-t border-[var(--cfc-border)] bg-[rgba(9,7,12,0.78)] pb-[env(safe-area-inset-bottom)] pt-3 backdrop-blur-2xl">
      <button
        type="button"
        className={`cfc-pressable group flex min-w-[128px] flex-col items-center justify-center gap-1 rounded-2xl px-4 py-1.5 ${
          activeView === 'home' || activeView === 'game' ? 'opacity-100' : 'opacity-48'
        } ${activeView === 'home' && canStart ? 'bg-[linear-gradient(135deg,var(--cfc-amber),var(--cfc-rose-soft))] text-[#241016] shadow-[0_12px_34px_rgba(255,111,154,0.2)]' : 'text-white'}`}
        onClick={handlePlayClick}
      >
        <GamepadIcon
          className={
            activeView === 'home' && canStart
              ? 'text-[#241016]'
              : activeView === 'home' || activeView === 'game'
                ? 'text-white'
                : 'text-white/62'
          }
          size={25}
        />
        <span className={`text-[10px] font-semibold ${activeView === 'home' && canStart ? 'text-[#241016]' : 'text-white'}`}>
          {playLabel}
        </span>
      </button>

      <button
        type="button"
        className={`cfc-pressable group flex w-16 flex-col items-center justify-center gap-1 rounded-2xl ${
          activeView === 'themes' ? 'opacity-100' : 'opacity-48'
        }`}
        onClick={() => onNavigate('themes')}
      >
        <Layers className={activeView === 'themes' ? 'text-white' : 'text-white/62'} size={25} />
        <span className="text-[10px] font-semibold text-white">{copy.navCards}</span>
      </button>
    </nav>
  );
}
