import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ArrowRight, Eye, Heart, Lock, RefreshCw } from 'lucide-react';
import { useScreenFocus } from './useScreenFocus';
import { useMiniI18n } from './mini-i18n';
import { playMiniVoice } from './mini-audio';

function Button({ children, variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet'; children: ReactNode }) {
  return <button type="button" {...props} className={`button button-${variant} ${className}`}>{children}</button>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function Progress({ current, total, label }: { current: number; total: number; label: string }) {
  const { fmt, tr } = useMiniI18n();
  return <div className="progress-wrap"><span>{fmt('{label} {current} of {total}', { label: tr(label), current, total })}</span><div className="progress-bars" aria-hidden="true">{Array.from({ length: total }, (_, i) => <i key={i} className={i < current ? 'filled' : ''} />)}</div></div>;
}

function Handoff({ name, title, children, label = 'Your private card', voicePlayer = 0 }: { name: string; title: string; children: ReactNode; label?: string; voicePlayer?: number }) {
  const { locale, tr, fmt } = useMiniI18n();
  const displayName = name === 'Player 1' || name === 'Player 2' ? tr(name) : name;
  const [revealed, setRevealed] = useState(false);
  useScreenFocus(`${name}-${revealed}-${title}`);
  useEffect(() => {
    const hide = () => { if (document.hidden) setRevealed(false); };
    document.addEventListener('visibilitychange', hide);
    return () => document.removeEventListener('visibilitychange', hide);
  }, []);
  if (!revealed) return <section className="handoff screen-narrow"><div className="handoff-icon"><Lock size={30} /></div><Eyebrow>{tr('A little mystery works better in private')}</Eyebrow><h1 tabIndex={-1}>{tr('Pass the phone')}<br />{tr('to')} <em>{displayName}.</em></h1><p className="lede">{tr('Everyone else, look away for a moment.')}</p><Button onClick={() => { setRevealed(true); playMiniVoice(locale, voicePlayer, 'mini-turn'); }}>{fmt('I’m {name}', { name: displayName })} <Eye size={18} /></Button><p className="soft-note">{tr('Tap when you’re the only one looking.')}</p></section>;
  return <section className="screen-narrow private-screen"><div className="private-heading"><Eyebrow><Lock size={12} /> {tr(label)} · {displayName}</Eyebrow><button className="text-button" onClick={() => setRevealed(false)}>{tr('Hide')} <Eye size={14} /></button></div><h1 tabIndex={-1}>{tr(title)}</h1>{children}</section>;
}

function Ending({ eyebrow, title, localizedTitle = false, children, onHome, onReplay, replayLabel = 'Play another round' }: { eyebrow: string; title: string; localizedTitle?: boolean; children: ReactNode; onHome: () => void; onReplay: () => void; replayLabel?: string }) {
  const { tr } = useMiniI18n();
  useScreenFocus('ending');
  return <section className="screen-narrow ending"><div className="ending-stamp"><Heart size={29} /></div><Eyebrow>{tr(eyebrow)}</Eyebrow><h1 tabIndex={-1}>{localizedTitle ? title : tr(title)}</h1>{children}<div className="action-stack"><Button onClick={onHome}>{tr('Choose another game')} <ArrowRight size={18} /></Button><Button variant="secondary" onClick={onReplay}><RefreshCw size={16} /> {tr(replayLabel)}</Button></div></section>;
}

export { Button, Eyebrow, Progress, Handoff, Ending };
