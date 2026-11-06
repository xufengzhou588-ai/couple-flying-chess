import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ArrowRight, Eye, Heart, Lock, RefreshCw } from 'lucide-react';
import { useScreenFocus } from './useScreenFocus';

function Button({ children, variant = 'primary', className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet'; children: ReactNode }) {
  return <button type="button" {...props} className={`button button-${variant} ${className}`}>{children}</button>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function Progress({ current, total, label }: { current: number; total: number; label: string }) {
  return <div className="progress-wrap"><span>{label} {current} of {total}</span><div className="progress-bars" aria-hidden="true">{Array.from({ length: total }, (_, i) => <i key={i} className={i < current ? 'filled' : ''} />)}</div></div>;
}

function Handoff({ name, title, children, label = 'Your private card' }: { name: string; title: string; children: ReactNode; label?: string }) {
  const [revealed, setRevealed] = useState(false);
  useScreenFocus(`${name}-${revealed}-${title}`);
  useEffect(() => {
    const hide = () => { if (document.hidden) setRevealed(false); };
    document.addEventListener('visibilitychange', hide);
    return () => document.removeEventListener('visibilitychange', hide);
  }, []);
  if (!revealed) return <section className="handoff screen-narrow"><div className="handoff-icon"><Lock size={30} /></div><Eyebrow>A little mystery works better in private</Eyebrow><h1 tabIndex={-1}>Pass the phone<br />to <em>{name}.</em></h1><p className="lede">Everyone else, look away for a moment.</p><Button onClick={() => setRevealed(true)}>I’m {name} <Eye size={18} /></Button><p className="soft-note">Tap when you’re the only one looking.</p></section>;
  return <section className="screen-narrow private-screen"><div className="private-heading"><Eyebrow><Lock size={12} /> {label} · {name}</Eyebrow><button className="text-button" onClick={() => setRevealed(false)}>Hide <Eye size={14} /></button></div><h1 tabIndex={-1}>{title}</h1>{children}</section>;
}

function Ending({ eyebrow, title, children, onHome, onReplay, replayLabel = 'Play another round' }: { eyebrow: string; title: string; children: ReactNode; onHome: () => void; onReplay: () => void; replayLabel?: string }) {
  useScreenFocus('ending');
  return <section className="screen-narrow ending"><div className="ending-stamp"><Heart size={29} /></div><Eyebrow>{eyebrow}</Eyebrow><h1 tabIndex={-1}>{title}</h1>{children}<div className="action-stack"><Button onClick={onHome}>Choose another game <ArrowRight size={18} /></Button><Button variant="secondary" onClick={onReplay}><RefreshCw size={16} /> {replayLabel}</Button></div></section>;
}

export { Button, Eyebrow, Progress, Handoff, Ending };
