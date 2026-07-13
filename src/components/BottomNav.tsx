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

  return (
    <nav className="z-50 flex h-[82px] shrink-0 items-start justify-around border-t border-white/10 bg-[#09070c]/76 pt-3 backdrop-blur-2xl">
      <button
        className={`group flex min-w-20 flex-col items-center gap-1 rounded-2xl px-3 py-1.5 transition ${
          activeView === 'home' || activeView === 'game' ? 'opacity-100' : 'opacity-48'
        } ${activeView === 'home' && canStart ? 'bg-white text-[#14070d] shadow-[0_12px_34px_rgba(255,255,255,0.18)]' : 'text-white'}`}
        onClick={handlePlayClick}
      >
        <GamepadIcon
          className={
            activeView === 'home' && canStart
              ? 'text-[#14070d]'
              : activeView === 'home' || activeView === 'game'
                ? 'text-white'
                : 'text-white/62'
          }
          size={25}
        />
        <span className={`text-[10px] font-semibold ${activeView === 'home' && canStart ? 'text-[#14070d]' : 'text-white'}`}>
          {copy.navPlay}
        </span>
      </button>

      <button
        className={`group flex w-16 flex-col items-center gap-1 transition ${
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
