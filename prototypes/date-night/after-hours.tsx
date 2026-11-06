import { useState } from 'react';
import { ArrowRight, Check, Heart, Lock, Moon, Sparkles } from 'lucide-react';
import { Button, Ending, Eyebrow, Handoff, Progress } from './shared';
import { PromptIllustration, type ArtKind } from './illustrations';
import { stageLabels, type Names, type Stage, type Vibe } from './content';
import { useScreenFocus } from './useScreenFocus';

type Choice = 'yes' | 'maybe' | 'pass';
type Move = {
  id: 'words' | 'gaze' | 'closer';
  title: string;
  pitch: string;
  art?: ArtKind;
  action: string;
  comeback: string;
};

const moves: Move[] = [
  {
    id: 'words', title: 'Make me blush', pitch: 'Trade one specific compliment, close enough to hear it clearly.',
    art: 'chat',
    action: 'Name a real detail. Let the other person answer in their own words.',
    comeback: '“I was hoping you would notice. Want to hear what I noticed about you?”',
  },
  {
    id: 'gaze', title: 'Hold the look', pitch: 'Put the phone down and let a quiet glance last a little longer.',
    action: 'Look at each other for ten unhurried seconds. A smile counts as an answer.',
    comeback: '“Okay. Now I want to know what that smile meant.”',
  },
  {
    id: 'closer', title: 'Close the distance', pitch: 'Offer a hand, a hug, or a kiss. Let your partner choose.',
    art: 'hands',
    action: 'Ask, listen, and follow the answer you get now. A no or a different idea is complete in itself.',
    comeback: '“Then let’s do exactly that.”',
  },
];

const settings: Record<Stage, string> = {
  new: 'The date is ending. Neither of you is in a hurry to say goodbye.',
  together: 'You made it home. The ordinary evening still has room for one more moment.',
  married: 'The day is finally quiet. You get to choose how tonight begins again.',
};

const invitations: Record<Stage, Record<Move['id'], string>> = {
  new: {
    words: '“I was trying to play it cool. Then you did that thing I keep thinking about…”',
    gaze: '“You caught me looking. Want to guess why?”',
    closer: '“I want to come closer. Would you like a hand, a hug, or a kiss?”',
  },
  together: {
    words: '“I know we’ve heard each other say a lot. Here’s something I still want you to hear…”',
    gaze: '“You know that look. Ask me what it means tonight.”',
    closer: '“Come here, if you want to. I missed this part of us.”',
  },
  married: {
    words: '“We know each other’s routines. Let me tell you what I noticed today…”',
    gaze: '“We have ten quiet seconds. I want to spend them looking at you.”',
    closer: '“Can I steal a moment with you before the day starts again?”',
  },
};

export function AfterHours({ names, stage, vibe, onHome, onReplay }: {
  names: Names; stage: Stage; vibe: Vibe; onHome: () => void; onReplay: () => void;
}) {
  const [phase, setPhase] = useState<'pick' | 'detail' | 'reveal' | 'scene' | 'ending'>('pick');
  const [owner, setOwner] = useState(0);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<[Record<string, Choice>, Record<string, Choice>]>([{}, {}]);
  const [selected, setSelected] = useState<Move | null>(null);
  const [details, setDetails] = useState<[string, string]>(['', '']);
  const [beat, setBeat] = useState(0);
  const [ending, setEnding] = useState<'linger' | 'later'>('linger');
  useScreenFocus(`after-hours-${phase}-${owner}-${index}-${beat}`);
  const matches = moves.filter(move => answers[0][move.id] !== 'pass' && answers[1][move.id] !== 'pass' && answers[0][move.id] && answers[1][move.id]);

  function choose(choice: Choice) {
    const thisPerson = { ...answers[owner], [moves[index].id]: choice };
    setAnswers(previous => owner === 0
      ? [thisPerson, previous[1]]
      : [previous[0], thisPerson]);
    if (index < moves.length - 1) setIndex(index + 1);
    else if (moves.every(move => thisPerson[move.id] === 'pass')) {
      if (owner === 0) { setOwner(1); setIndex(0); }
      else setPhase('reveal');
    } else setPhase('detail');
  }

  if (phase === 'detail') return <Handoff key={owner} name={names[owner]} title="Make it yours." label="One detail only you know">
    <p className="lede">Think of one small thing about {names[owner === 0 ? 1 : 0]} that caught your attention. You can bring it into your scene later.</p>
    <label className="after-hours-detail">Your private detail
      <input maxLength={80} autoComplete="off" placeholder={stage === 'new' ? 'e.g. the way they laughed tonight' : 'e.g. that look across the kitchen'} value={details[owner]} onChange={event => setDetails(previous => owner === 0 ? [event.target.value, previous[1]] : [previous[0], event.target.value])} />
    </label>
    <p className="form-footnote">Your words appear only if you both choose to play a scene. You can leave this blank.</p>
    <Button className="full-width" onClick={() => { if (owner === 0) { setOwner(1); setIndex(0); setPhase('pick'); } else setPhase('reveal'); }}>{owner === 0 ? `Hide & pass to ${names[1]}` : 'Hide & reveal our sparks'} <ArrowRight size={17} /></Button>
  </Handoff>;

  if (phase === 'pick') {
    const move = moves[index];
    return <Handoff key={owner} name={names[owner]} title="What sounds good tonight?" label="Only you see these choices">
      <Progress current={index + 1} total={moves.length} label="Spark" />
      <div className="paper-card mini-paper after-hours-choice" data-move-id={move.id}>
        <span className="card-label">A SMALL MOVE</span>
        <PromptIllustration kind={move.art} />
        <p>{move.title}</p><small>{move.pitch}</small>
      </div>
      <div className="after-hours-votes">
        <Button className="full-width" onClick={() => choose('yes')}><Heart size={17} /> Yes, tonight</Button>
        <Button className="full-width" variant="secondary" onClick={() => choose('maybe')}><Sparkles size={17} /> Maybe, ask me</Button>
        <Button className="full-width" variant="quiet" onClick={() => choose('pass')}>Pass for now</Button>
      </div>
      <p className="form-footnote">A “maybe” is an invitation to ask again, never an automatic yes. Passed choices stay private.</p>
    </Handoff>;
  }

  if (phase === 'reveal') return <section className="screen-narrow mini-game after-hours-screen">
    <Eyebrow><Moon size={14} /> The Slow Burn · {stageLabels[stage]}</Eyebrow>
    <h1 tabIndex={-1}>{matches.length ? <>You both left<br /><em>the door open.</em></> : <>Tonight can stay<br /><em>easy.</em></>}</h1>
    <p className="lede">{matches.length ? 'Pick one spark to play out together. You can change your minds at any point.' : 'No shared spark this round. Keep the good company, or try another night.'}</p>
    {matches.length > 0 && <div className="after-hours-match-list">{matches.map(move =>
      <button key={move.id} className={`after-hours-match ${move.art ? '' : 'artless'}`} data-match-move={move.id} onClick={() => { setSelected(move); setPhase('scene'); }}>
        <PromptIllustration kind={move.art} /><span><small>YOUR SHARED SPARK</small><strong>{move.title}</strong><em>{move.pitch}</em></span><ArrowRight size={19} />
      </button>)}</div>}
    <p className="soft-note"><Lock size={14} /> Everything else stays between each person and their choices.</p>
    <Button className="full-width" variant="secondary" onClick={matches.length ? onReplay : onHome}>{matches.length ? 'Start a different round' : 'Choose another game'}</Button>
  </section>;

  if (phase === 'scene' && selected) return <section className="screen-narrow mini-game after-hours-screen">
    <Eyebrow><Moon size={14} /> The Slow Burn · {selected.title}</Eyebrow>
    <h1 tabIndex={-1}>{beat === 0 ? <>Set the <em>scene.</em></> : beat === 1 ? <>Make your <em>move.</em></> : <>Give it <em>back.</em></>}</h1>
    <Progress current={beat + 1} total={3} label="Beat" />
    <div className="paper-card mini-paper after-hours-scene">
      <span className="card-label">{beat === 0 ? 'YOUR SETTING' : beat === 1 ? `${names[0].toUpperCase()}, YOUR INVITATION` : `${names[1].toUpperCase()}, YOUR REPLY`}</span>
      <PromptIllustration kind={beat === 0 ? (stage === 'new' ? undefined : 'home') : selected.art} />
      <p>{beat === 0 ? settings[stage] : beat === 1 ? (vibe === 'playful' && selected.id === 'closer' ? '“Want to come a little closer, or should I try one more opening line?”' : invitations[stage][selected.id]) : selected.comeback}</p>
      <small>{beat === 0 ? 'Put the phone down for a breath. Decide who will make the first move.' : beat === 1 ? selected.action : 'Use your own words. Then decide together whether to linger or leave this moment here.'}</small>
      {beat > 0 && details[beat - 1].trim() && <div className="after-hours-callback"><Sparkles size={15} /><span>Make it personal: “{details[beat - 1].trim()}”</span></div>}
    </div>
    {beat < 2 ? <Button className="full-width" onClick={() => setBeat(beat + 1)}>{beat === 0 ? 'We’re ready' : 'Your turn to respond'} <ArrowRight size={17} /></Button> : <div className="after-hours-finish">
      <Button onClick={() => { setEnding('linger'); setPhase('ending'); }}><Heart size={17} /> Linger here</Button>
      <Button variant="secondary" onClick={() => { setEnding('later'); setPhase('ending'); }}>Save it for later</Button>
    </div>}
    <p className="form-footnote">The line is a starting point. Either person can pause, change the move, or pass.</p>
  </section>;

  return <Ending eyebrow="The Slow Burn · Your scene" title={selected ? (ending === 'linger' ? 'Stay with that feeling.' : 'Leave a little spark for later.') : 'Another night is yours.'} onHome={onHome} onReplay={onReplay} replayLabel="Play a new scene">
    <p className="lede">{selected ? (ending === 'linger' ? `You chose “${selected.title}.” Put the phone away and let the next moment be yours.` : `You chose “${selected.title}.” Tell each other one thing you liked, then make your own plan for another night.`) : 'You can choose a new spark whenever you both want.'}</p>
    <div className="debrief"><h2>What stays with you?</h2><p>One look, one line, or one small move. Say which one you want to remember.</p></div>
    <p className="soft-note"><Check size={14} /> Nothing from this round is saved.</p>
  </Ending>;
}
