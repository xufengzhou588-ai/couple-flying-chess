import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Heart, RefreshCw, Shuffle, Sparkles, Timer } from 'lucide-react';
import { Button, Ending, Eyebrow, Handoff, Progress } from './shared';
import { shuffled, type Names, type Vibe } from './content';
import { useScreenFocus } from './useScreenFocus';
import { useMiniI18n, type MiniLocale } from './mini-i18n';
import { playDiceSequence } from '../../src/utils/diceSound';
import { playMiniVoice } from './mini-audio';

type PartId = 'hand' | 'cheek' | 'forehead' | 'shoulder' | 'forearm' | 'upper-back' | 'neck' | 'waist' | 'lips';
type Part = { id: PartId; label: string; x: number; y: number };
type Action = { id: string; title: string; allowed: PartId[]; describe: (part: Part) => string };
type Pair = { action: Action; part: Part };

const parts: Record<PartId, Part> = {
  hand: { id: 'hand', label: 'Hand', x: 25, y: 119 },
  cheek: { id: 'cheek', label: 'Cheek', x: 94, y: 42 },
  forehead: { id: 'forehead', label: 'Forehead', x: 80, y: 26 },
  shoulder: { id: 'shoulder', label: 'Shoulder', x: 54, y: 78 },
  forearm: { id: 'forearm', label: 'Forearm', x: 35, y: 101 },
  'upper-back': { id: 'upper-back', label: 'Upper back', x: 80, y: 101 },
  neck: { id: 'neck', label: 'Neck', x: 80, y: 65 },
  waist: { id: 'waist', label: 'Waist', x: 80, y: 146 },
  lips: { id: 'lips', label: 'Lips', x: 80, y: 50 },
};

const partDeck: Record<Vibe, PartId[]> = {
  playful: ['hand', 'cheek', 'forehead', 'shoulder', 'forearm', 'upper-back'],
  flirty: ['hand', 'cheek', 'shoulder', 'neck', 'waist', 'lips'],
};

const actions: Action[] = [
  { id: 'kiss', title: 'A soft kiss', allowed: ['hand', 'cheek', 'forehead', 'shoulder', 'neck', 'lips'], describe: part => `Ask first, then give them a soft kiss on the ${part.label.toLowerCase()}.` },
  { id: 'trace', title: 'Trace a line', allowed: ['hand', 'cheek', 'forehead', 'shoulder', 'forearm', 'upper-back', 'neck', 'waist', 'lips'], describe: part => part.id === 'lips' ? 'If they want, trace the edge of their lips with one fingertip.' : `If they want, trace a slow line along their ${part.label.toLowerCase()}.` },
  { id: 'brush', title: 'A light brush', allowed: ['hand', 'cheek', 'forehead', 'shoulder', 'forearm', 'upper-back', 'neck', 'waist', 'lips'], describe: part => `If they want, lightly brush your fingertips across their ${part.label.toLowerCase()}.` },
  { id: 'hold', title: 'Stay for a beat', allowed: ['hand', 'cheek', 'shoulder', 'forearm', 'upper-back', 'waist'], describe: part => `If they want, rest your hand on their ${part.label.toLowerCase()} for five seconds.` },
  { id: 'massage', title: 'A tiny massage', allowed: ['hand', 'shoulder', 'forearm', 'upper-back', 'neck'], describe: part => `If they want, give their ${part.label.toLowerCase()} a gentle ten-second massage.` },
  { id: 'heart', title: 'Draw a heart', allowed: ['hand', 'cheek', 'forehead', 'shoulder', 'forearm', 'upper-back', 'waist'], describe: part => `If they want, draw a tiny heart on their ${part.label.toLowerCase()} with a fingertip.` },
];

const pips: Record<number, number[]> = {
  1: [5], 2: [1, 9], 3: [1, 5, 9], 4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9],
};

function Die({ face, label, rolling }: { face: number; label: string; rolling: boolean }) {
  const { tr } = useMiniI18n();
  return <div className={`heart-die-wrap ${rolling ? 'is-rolling' : ''}`}><span className="heart-die-label">{tr(label)}</span><span className="heart-die" role="img" aria-label={`${tr(label)}: ${face}`}>{Array.from({ length: 9 }, (_, index) => <i key={index} className={pips[face].includes(index + 1) ? 'is-visible' : ''} />)}</span></div>;
}

function BodyMap({ part }: { part: Part }) {
  const { tr, fmt } = useMiniI18n();
  return <div className="body-map"><svg viewBox="0 0 160 190" role="img" aria-label={fmt('Selected body part: {part}', { part: tr(part.label) })}>
    <circle cx="80" cy="38" r="22" />
    <path d="M62 62 Q43 65 40 83 L24 125 M98 62 Q117 65 120 83 L136 125 M54 77 Q61 112 57 151 L103 151 Q99 112 106 77 M57 151 L49 184 M103 151 L111 184" />
    <circle className="body-map-marker" cx={part.x} cy={part.y} r="13" />
  </svg><strong>{tr(part.label)}</strong></div>;
}

function describeMove(locale: MiniLocale, action: Action, part: Part) {
  if (locale === 'en') return action.describe(part);
  const zhPart: Record<PartId, string> = { hand: '手', cheek: '脸颊', forehead: '额头', shoulder: '肩膀', forearm: '前臂', 'upper-back': '上背', neck: '脖颈', waist: '腰', lips: '嘴唇' };
  const esPart: Record<PartId, string> = { hand: 'la mano', cheek: 'la mejilla', forehead: 'la frente', shoulder: 'el hombro', forearm: 'el antebrazo', 'upper-back': 'la parte alta de la espalda', neck: 'el cuello', waist: 'la cintura', lips: 'los labios' };
  const partName = locale === 'zh' ? zhPart[part.id] : esPart[part.id];
  if (locale === 'zh') {
    if (action.id === 'kiss') return `先问问对方愿不愿意，再轻轻亲一下${partName}。`;
    if (action.id === 'trace') return part.id === 'lips' ? '如果对方愿意，用指尖轻轻描过唇边。' : `如果对方愿意，用指尖沿着${partName}慢慢画一道线。`;
    if (action.id === 'brush') return `如果对方愿意，用指尖轻轻拂过${partName}。`;
    if (action.id === 'hold') return `如果对方愿意，把手轻放在${partName}上，停留五秒。`;
    if (action.id === 'massage') return `如果对方愿意，轻轻按摩${partName}十秒。`;
    return `如果对方愿意，用指尖在${partName}画一颗小爱心。`;
  }
  if (action.id === 'kiss') return `Pregunta primero y, si te dice que sí, dale un beso suave en ${partName}.`;
  if (action.id === 'trace') return part.id === 'lips' ? 'Si le apetece, recorre suavemente el borde de sus labios con un dedo.' : `Si le apetece, desliza un dedo lentamente por ${partName}.`;
  if (action.id === 'brush') return `Si le apetece, roza suavemente ${partName} con la punta de los dedos.`;
  if (action.id === 'hold') return `Si le apetece, deja tu mano sobre ${partName} durante cinco segundos.`;
  if (action.id === 'massage') return `Si le apetece, dale un masaje suave de diez segundos en ${partName}.`;
  return `Si le apetece, dibuja un corazoncito en ${partName} con un dedo.`;
}

type Phase = 'pick-a' | 'pick-b' | 'no-match' | 'roll' | 'rolling' | 'play' | 'choose' | 'end';

export function ChemistryDice({ names, vibe, onHome, onReplay }: {
  names: Names; vibe: Vibe; onHome: () => void; onReplay: () => void;
}) {
  const { locale, tr, fmt, displayName } = useMiniI18n();
  const [phase, setPhase] = useState<Phase>('pick-a');
  const [picks, setPicks] = useState<[PartId[], PartId[]]>([[], []]);
  const [round, setRound] = useState(0);
  const [faces, setFaces] = useState<[number, number]>([1, 1]);
  const [pair, setPair] = useState<Pair | null>(null);
  const [used, setUsed] = useState<string[]>([]);
  const [played, setPlayed] = useState<Pair[]>([]);
  const [favorite, setFavorite] = useState<Pair | null>(null);
  const [rerolled, setRerolled] = useState(false);
  const [seconds, setSeconds] = useState(20);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const shared = partDeck[vibe].filter(id => picks[0].includes(id) && picks[1].includes(id));
  useScreenFocus(`chemistry-${phase}-${round}`);

  useEffect(() => () => {
    if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
  }, []);

  useEffect(() => {
    if (!timerRunning || seconds === 0) return;
    const timer = window.setTimeout(() => setSeconds(previous => previous - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, timerRunning]);

  function togglePart(owner: number, id: PartId) {
    setPicks(previous => {
      const next: [PartId[], PartId[]] = [[...previous[0]], [...previous[1]]];
      next[owner] = next[owner].includes(id) ? next[owner].filter(value => value !== id) : [...next[owner], id];
      return next;
    });
  }

  function choosePair(excludeCurrent = false): Pair {
    const possible = actions.flatMap(action => shared.filter(id => action.allowed.includes(id)).map(id => ({ action, part: parts[id] })));
    const candidates = possible.filter(item => !used.includes(`${item.action.id}:${item.part.id}`) && (!excludeCurrent || item.action.id !== pair?.action.id || item.part.id !== pair?.part.id));
    return shuffled(candidates.length ? candidates : possible.filter(item => !excludeCurrent || item.action.id !== pair?.action.id || item.part.id !== pair?.part.id))[0] || possible[0];
  }

  function roll(isReroll = false) {
    void playDiceSequence();
    playMiniVoice(locale, round % 2, 'mini-roll');
    setPhase('rolling');
    intervalRef.current = window.setInterval(() => setFaces([1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]), 70);
    timeoutRef.current = window.setTimeout(() => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
      const next = choosePair(isReroll);
      setPair(next);
      setFaces([actions.indexOf(next.action) + 1, partDeck[vibe].indexOf(next.part.id) + 1]);
      setUsed(previous => [...previous, `${next.action.id}:${next.part.id}`]);
      setRerolled(isReroll);
      setSeconds(20);
      setTimerRunning(false);
      setPhase('play');
    }, 1100);
  }

  function advance(didPlay: boolean) {
    if (didPlay && pair) setPlayed(previous => [...previous, pair]);
    setTimerRunning(false);
    if (round === 3) setPhase('choose');
    else { setRound(previous => previous + 1); setPair(null); setPhase('roll'); }
  }

  if (phase === 'pick-a' || phase === 'pick-b') {
    const owner = phase === 'pick-a' ? 0 : 1;
    return <Handoff key={phase} name={names[owner]} voicePlayer={owner} title="Choose your yeses." label="Only you see your comfort choices">
      <p className="lede">{tr("Tap the body parts you would be comfortable including tonight. Choose only for yourself.")}</p>
      <div className="body-picks">{partDeck[vibe].map(id => <button key={id} className={picks[owner].includes(id) ? 'selected' : ''} aria-pressed={picks[owner].includes(id)} onClick={() => togglePart(owner, id)}>{tr(parts[id].label)}<Heart size={15} /></button>)}</div>
      <p className="form-footnote">{tr("Only parts you both chose can appear. Choosing a part is not consent to every action. Ask again before each move.")}</p>
      <Button className="full-width" disabled={picks[owner].length === 0} onClick={() => setPhase(owner === 0 ? 'pick-b' : shared.length ? 'roll' : 'no-match')}>{owner === 0 ? fmt('Hide & pass to {name}', { name: displayName(names[1]) }) : tr('Hide & roll together')} <ArrowRight size={17} /></Button>
    </Handoff>;
  }

  if (phase === 'no-match') return <section className="screen-narrow mini-game">
    <Eyebrow>{tr("Chemistry Dice · Your comfort comes first")}</Eyebrow>
    <h1 tabIndex={-1}>{tr("No shared spots")} <em>{tr("tonight.")}</em></h1>
    <p className="lede">{tr("That is completely fine. Choose again if you both want, or play something else.")}</p>
    <div className="action-stack"><Button onClick={() => { setPicks([[], []]); setPhase('pick-a'); }}> {tr("Choose again")}</Button><Button variant="secondary" onClick={onHome}> {tr("Choose another game")}</Button></div>
  </section>;

  if (phase === 'choose') return <section className="screen-narrow mini-game">
    <Eyebrow>{tr("Chemistry Dice · Four rolls")}</Eyebrow>
    <h1 tabIndex={-1}>{tr("Keep one")} <em>{tr("spark.")}</em></h1>
    <p className="lede">{tr("Which move would you like to bring back another night?")}</p>
    <div className="dice-favorites">{played.length ? played.map((item, index) => <button key={index} onClick={() => { setFavorite(item); setPhase('end'); }}><Heart size={20} /><span>{tr(item.action.title)} · {tr(item.part.label)}</span><ArrowRight size={17} /></button>) : <Button onClick={onReplay}>{tr("Roll again")} <Shuffle size={17} /></Button>}</div>
    <p className="form-footnote">{tr("A pass never needs an explanation.")}</p>
    <Button variant="quiet" onClick={onHome}> {tr("Choose another game")}</Button>
  </section>;

  if (phase === 'end') return <Ending eyebrow="Chemistry Dice · Your favorite move" title={favorite ? `${tr(favorite.action.title)} · ${tr(favorite.part.label)}` : tr('Another night, another roll.')} localizedTitle onHome={onHome} onReplay={onReplay}>
    <p className="lede">{tr("Keep the idea if you both like it. Ask again when the moment comes.")}</p>
    <p className="soft-note">{tr("Nothing from this round is saved.")}</p>
  </Ending>;

  return <section className="screen-narrow mini-game heart-dice-screen">
    <Eyebrow><Sparkles size={13} /> {tr("Chemistry Dice")}</Eyebrow>
    <h1 tabIndex={-1}>{phase === 'play' ? <>{tr("Your move,")}<br /><em>{displayName(names[round % 2])}.</em></> : <>{tr("Roll for a")}<br /><em>{tr("little spark.")}</em></>}</h1>
    <p className="lede">{phase === 'play' ? tr('One die picked the action. The other picked a spot you both chose.') : fmt('{name} leads this round. Roll for an action and a body part.', { name: displayName(names[round % 2]) })}</p>
    <Progress current={round + 1} total={4} label="Roll" />
    <div className="heart-dice-stage"><Die face={faces[0]} label="ACTION" rolling={phase === 'rolling'} /><Die face={faces[1]} label="BODY PART" rolling={phase === 'rolling'} /></div>
    {phase === 'play' && pair ? <div aria-live="polite">
      <div className="paper-card mini-paper chemistry-result"><span className="card-label">{tr("YOUR TWO DICE")}</span><div className="chemistry-pair"><div><small>{tr("ACTION")}</small><strong>{tr(pair.action.title)}</strong></div><BodyMap part={pair.part} /></div><p>{describeMove(locale, pair.action, pair.part)}</p></div>
      <div className="mini-actions"><Button variant="secondary" disabled={rerolled} onClick={() => roll(true)}><RefreshCw size={16} /> {tr("Reroll both")}</Button><Button variant="quiet" onClick={() => advance(false)}> {tr("Pass this move")}</Button></div>
      <button className="heart-timer" onClick={() => setTimerRunning(previous => !previous)} disabled={seconds === 0} aria-label={tr(timerRunning ? 'Pause twenty-second timer' : 'Start twenty-second timer')}><Timer size={19} /><span>{seconds}s</span><small>{tr(seconds === 0 ? 'Time is up' : timerRunning ? 'Pause timer' : 'Optional timer')}</small></button>
      <Button className="full-width" onClick={() => advance(true)}>{tr(round === 3 ? 'Finish our round' : 'Next roll')} <ArrowRight size={18} /></Button>
    </div> : <Button className="full-width" disabled={phase === 'rolling'} onClick={() => roll()}><Shuffle size={18} /> {tr(phase === 'rolling' ? 'Rolling…' : 'Roll both dice')}</Button>}
    <p className="form-footnote">{tr("Ask before touching. Either person can change the move or pass, even after rolling.")}</p>
  </section>;
}
