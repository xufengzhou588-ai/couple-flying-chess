import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Clock, Eye, Heart, Lock, MessageCircle, Moon, Pause, Plane, Play, RefreshCw, Shuffle, Sparkles, Ticket, Users, X } from 'lucide-react';
import { Button, Eyebrow, Progress, Handoff, Ending } from './shared';
import { PromptIllustration } from './illustrations';
import { CoupleGameEmblem } from '../../src/components/CoupleGameEmblem';
import { illustrationFor, sceneIllustration } from './illustration-map';
import { useScreenFocus } from './useScreenFocus';
import { ReadMyMind, WishAuction, DateMystery } from './more-games';
import { ChemistryDice } from './chemistry-dice';
import { AfterHours } from './after-hours';
import { SketchDate } from './sketch-date';
import { dateIdeas, drawFresh, games, missions, mutualIdeas, roles, sceneBeats, type Branch, type DateIdea, type Mode, type Names, type Stage, type Vibe, stageLabels, stageNotes } from './content';

const flightBoardUrl = import.meta.env.VITE_FLIGHT_BOARD_URL || (import.meta.env.DEV ? `${window.location.protocol}//${window.location.hostname}:5174/` : '/');

const gameCatalog = [
  { mode: 'after-hours', number: '01', kind: 'FLIRT & ROLEPLAY', prompt: 'Pick a spark you both want.' },
  { mode: 'heart-dice', number: '02', kind: 'ROLL & TEASE', prompt: 'Let two dice choose your move.' },
  { mode: 'sketch-date', number: '03', kind: 'DRAW & DREAM', prompt: 'Draw a date worth stealing.' },
  { mode: 'date-mystery', number: '04', kind: 'CLUES FOR TWO', prompt: 'Trade clues. Solve together.' },
] as const;

function Home({ onChoose }: { onChoose: (mode: Mode) => void }) {
  useScreenFocus('home');
  return <div className="home-screen">
    <section className="home-intro">
      <div><Eyebrow><span className="small-star">✳</span> Just the two of you</Eyebrow>
        <h1 tabIndex={-1}>Just us. A little <em>mischief.</em></h1>
        <p className="intro-copy">Four ways to flirt, get close, and surprise each other.</p>
      </div>
      <div className="evening-note"><Moon size={19} /><span>One phone.<br /><strong>Your night.</strong></span></div>
    </section>

    <section className="game-catalog" aria-labelledby="game-catalog-title">
      <div className="catalog-heading"><h2 id="game-catalog-title">All four games</h2><span>Tap any game to start</span></div>
      <div className="catalog-grid">{gameCatalog.map(({ mode, number, kind, prompt }) => <button key={mode} className={`catalog-card catalog-card-${mode}`} type="button" aria-label={`Play ${games[mode].title}`} onClick={() => onChoose(mode)}>
        <CoupleGameEmblem mode={mode} className="catalog-emblem" />
        <span className="catalog-copy"><span className="catalog-number">{number} / {kind}</span><strong className="catalog-title">{games[mode].title}</strong><span className="catalog-prompt">{prompt}</span><span className="catalog-duration"><Clock size={13} /> {games[mode].time}</span></span>
        <span className="catalog-play">Play <ArrowUpRight size={16} /></span>
      </button>)}</div>
    </section>

    <a className="board-feature" href={flightBoardUrl} aria-label="Play Flight Chess">
      <span className="board-feature-mark"><Plane size={23} /><Heart size={11} fill="currentColor" className="board-feature-heart" /></span>
      <span className="board-feature-copy"><small>THE ORIGINAL COUPLE FLIGHT GAME</small><strong>Flight Chess</strong><span>Roll, flirt, and follow the board together. Play on one screen or invite your partner online.</span></span>
      <span className="board-feature-action">Play the board <ArrowUpRight size={18} /></span>
    </a>
    <div className="home-footnote"><span><Users size={16} /> These four games use one phone. Pass it between you.</span><span>No account. No audience. Just you.</span></div>
  </div>;
}

function Setup({ mode, names, vibe, stage, onStart }: { mode: Mode; names: Names; vibe: Vibe; stage: Stage; onStart: (names: Names, vibe: Vibe, stage: Stage) => void }) {
  const [draftNames, setDraftNames] = useState<Names>(names);
  const [draftVibe, setDraftVibe] = useState<Vibe>(mode === 'after-hours' ? 'flirty' : vibe);
  const [draftStage, setDraftStage] = useState(stage);
  const catalogGame = gameCatalog.find(game => game.mode === mode);
  useScreenFocus(`setup-${mode}`);
  const notes: Record<Mode, [string, string, string]> = {
    'first-date': ['Choose your names and the mood.', 'Read your roles privately, then act out four short beats.', 'Borrow a line whenever you want. No acting skills needed.'],
    mission: ['Read one secret assignment each.', 'Chat, hang out, and try your mission. Keep it kind.', 'Guess each other’s assignments before the big reveal.'],
    'double-yes': ['Take turns picking ideas on your own.', 'Only ideas you both say yes to are revealed.', 'Choose one shared idea and try its tiny date plan.'],
    'heart-dice': ['Each privately chooses comfortable body parts.', 'Roll one die for an action and one for a shared body part.', 'Try the move, reroll once, or pass whenever you want.'],
    'read-my-mind': ['One of you privately picks an answer.', 'The other privately guesses the pick.', 'Reveal, talk about it, and switch roles.'],
    'wish-auction': ['Each start with five pretend tokens.', 'Bid privately on four tiny date ideas.', 'Only mutual bids spend tokens. Save what you both like.'],
    'date-mystery': ['Each read a private clue.', 'Share your clues out loud.', 'Solve three scenes together. Wrong guesses unlock a hint.'],
    'after-hours': ['Each privately marks the sparks that feel good tonight.', 'Only choices you both left open appear.', 'Pick one and play a three-beat scene together.'],
    'sketch-date': ['Take turns drawing a date idea with your finger.', 'Your partner guesses from three possible dates.', 'Choose one sketch you would actually like to try.'],
  };
  return <section className="setup-layout">
    <div className="setup-intro"><Eyebrow>{games[mode].category}</Eyebrow><div className="setup-title-row">{catalogGame && <CoupleGameEmblem mode={catalogGame.mode} className="setup-emblem" />}<h1 tabIndex={-1}>{games[mode].title}</h1></div><p className="lede">{games[mode].description}</p><ol className="how-to">{notes[mode].map((note, i) => <li key={note}><span>0{i + 1}</span><p>{note}</p></li>)}</ol><p className="soft-note"><Clock size={15} /> {games[mode].time} · Go at your own pace.</p></div>
    <form className="setup-form" onSubmit={event => {
      event.preventDefault();
      const clean = draftNames.map((name, i) => name.trim() || `Player ${i + 1}`) as Names;
      if (clean[0].toLowerCase() === clean[1].toLowerCase()) { clean[0] += ' (1)'; clean[1] += ' (2)'; }
      onStart(clean, draftVibe, draftStage);
    }}>
      <h2>Make yourselves comfortable.</h2><p className="muted">Nicknames welcome. Names are optional.</p>
      <div className="names-row">{[0, 1].map(index => <label key={index} htmlFor={`player-${index}`}>Player {index + 1}<input id={`player-${index}`} maxLength={24} autoComplete="off" placeholder={index === 0 ? 'e.g. Alex' : 'e.g. Sam'} value={draftNames[index].startsWith('Player ') ? '' : draftNames[index]} onChange={event => setDraftNames(prev => index === 0 ? [event.target.value, prev[1]] : [prev[0], event.target.value])} /></label>)}</div>
      {mode !== 'heart-dice' && <fieldset><legend>Where are you two right now?</legend><div className="stage-options">{(['new', 'together', 'married'] as const).map(value => <label className={`stage-choice ${draftStage === value ? 'selected' : ''}`} key={value}><input type="radio" name="stage" value={value} checked={draftStage === value} onChange={() => setDraftStage(value)} /><span><strong>{stageLabels[value]}</strong><small>{stageNotes[value]}</small></span></label>)}</div></fieldset>}
      {mode !== 'sketch-date' && mode !== 'date-mystery' && <fieldset><legend>What’s the mood?</legend><div className="vibe-options">{(['playful', 'flirty'] as const).map(value => <label className={`vibe-choice ${draftVibe === value ? 'selected' : ''}`} key={value}><input type="radio" name="vibe" value={value} checked={draftVibe === value} onChange={() => setDraftVibe(value)} /><span>{value === 'playful' ? <Sparkles size={18} /> : <Heart size={18} />}<strong>{value === 'playful' ? 'Playful' : 'Flirty'}</strong><small>{value === 'playful' ? 'Easy laughs & good stories' : 'Banter & a little chemistry'}</small></span></label>)}</div></fieldset>}
      <div className="comfort-note"><Heart size={17} /><p>Pick a mood you both like. You can pass on anything, for any reason.</p></div>
      <Button type="submit" className="full-width">{({ 'first-date': 'Meet your characters', mission: 'Deal our missions', 'double-yes': 'Find our shared yeses', 'heart-dice': 'Choose our comfort', 'read-my-mind': 'Start guessing', 'wish-auction': 'Open the auction', 'date-mystery': 'Open the first clue', 'after-hours': 'Find our spark', 'sketch-date': 'Start our sketches' } satisfies Record<Mode, string>)[mode]} <ArrowRight size={18} /></Button>
      <p className="form-footnote">Your names and choices stay in this session.<br />Leaving or reloading clears the round.</p>
    </form>
  </section>;
}

function FirstDate({ names, vibe, stage, onHome, onReplay }: { names: Names; vibe: Vibe; stage: Stage; onHome: () => void; onReplay: () => void }) {
  const [phase, setPhase] = useState<'roles' | 'scene' | 'twist' | 'ending'>('roles');
  const [owner, setOwner] = useState(0);
  const [round, setRound] = useState(0);
  const [branch, setBranch] = useState<Branch>('missed-connection');
  const [line, setLine] = useState(0);
  useScreenFocus(`${phase}-${round}`);
  const beat = sceneBeats(branch)[round];
  function advance() {
    setLine(0);
    if (round === 1) setPhase('twist');
    else if (round === 3) setPhase('ending');
    else setRound(prev => prev + 1);
  }
  if (phase === 'roles') return <Handoff key={owner} name={names[owner]} title={roles[owner].name} label={`Role ${owner + 1} of 2`}><p className="role-kicker">{roles[owner].kicker}</p><div className="paper-card role-card"><span className="card-label">THE LAST OPEN SEAT</span><PromptIllustration kind="bar" /><p>{roles[owner].setup}</p><div className="secret-goal"><Lock size={17} /><div><h2>Your secret goal</h2><p>{roles[owner].secret}</p></div></div></div><p className="supporting-copy">{roles[owner].hint}</p><Button className="full-width" onClick={() => owner === 0 ? setOwner(1) : setPhase('scene')}>{owner === 0 ? `Hide & pass to ${names[1]}` : 'Hide card & start the scene'} <ArrowRight size={18} /></Button><p className="soft-note">You can do this from your couch. No drinks or props needed.</p></Handoff>;
  if (phase === 'twist') return <section className="screen-narrow twist-screen"><Eyebrow>Halfway through. Time to change the story.</Eyebrow><h1 tabIndex={-1}>Choose your<br /><em>plot twist.</em></h1><p className="lede">Pick one together. Then see where it takes you.</p><div className="twist-options"><button onClick={() => { setBranch('missed-connection'); setRound(2); setPhase('scene'); }}><span className="twist-symbol"><MessageCircle size={23} /></span><span><strong>The missed connection</strong><small>You matched a year ago. Neither sent a message.</small></span><ArrowUpRight size={20} /></button><button onClick={() => { setBranch('birthday'); setRound(2); setPhase('scene'); }}><span className="twist-symbol"><Sparkles size={23} /></span><span><strong>The birthday coincidence</strong><small>Same birthday. No plans. That could change.</small></span><ArrowUpRight size={20} /></button></div></section>;
  if (phase === 'ending') return <Ending eyebrow="Scene complete · Back to being you" title="Still you. A little unexpected." onHome={onHome} onReplay={onReplay} replayLabel="Play again & swap roles"><p className="lede">Take a breath. Drop the characters.</p><div className="debrief"><h2>One last thing, as yourselves.</h2><p>“What did I say that you’d like to hear from me more often?”</p><p>Then tell each other your secret goals. Did you notice?</p><p>{({ new: 'What would make our next real date worth looking forward to?', together: 'What could make our next date feel new again?', married: 'What could make an ordinary night feel like a first date again?' } satisfies Record<Stage, string>)[stage]}</p></div><p className="supporting-copy">Keep one date idea from your conversation. You don’t have to decide when tonight.</p></Ending>;
  return <section className="scene-layout"><aside className="scene-sidebar"><Eyebrow>First Date, Again</Eyebrow><p className="scene-location">The last<br /><em>open seat.</em></p><div className="cast-list"><span><i>A</i><strong>{names[0]}</strong><small>The bartender</small></span><span><i>B</i><strong>{names[1]}</strong><small>The stranger</small></span></div><p className="soft-note">{vibe === 'playful' ? 'Keep it light. Let it get a little silly.' : 'A little bold. Always on your terms.'}</p></aside><div className="scene-main"><Progress current={round + 1} total={4} label="Beat" /><Eyebrow>{beat.label}</Eyebrow><h1 tabIndex={-1}>{beat.title}</h1><div className="scene-prompt"><p className="lede">{beat.prompt}</p><PromptIllustration kind={sceneIllustration(branch, round)} className="scene-prompt-art" /></div><div className="paper-card dialogue-card"><div className="card-label"><MessageCircle size={14} /> {names[beat.lead]}, YOU COULD SAY</div><blockquote>“{beat.lines[vibe][line]}”</blockquote><button className="paper-link" onClick={() => setLine(prev => prev === 0 ? 1 : 0)}><Shuffle size={14} /> Try another line</button></div><details className="reply-hint" key={round}><summary>A comeback for {names[beat.lead === 0 ? 1 : 0]} <span>+</span></summary><p>“{beat.reply[vibe][line]}”</p></details><p className="followup"><Sparkles size={16} /><span>{beat.followup}</span></p><div className="scene-actions"><Button onClick={advance}>{round === 3 ? 'Finish the scene' : round === 1 ? 'Bring on the twist' : 'Next beat'} <ArrowRight size={17} /></Button><Button variant="quiet" onClick={advance}>Pass this beat</Button></div><p className="form-footnote">Say it your way. The lines are a starting point, not a script to memorize.</p></div></section>;
}

function SecretMission({ names, vibe, stage, seen, onHome, onReplay }: { names: Names; vibe: Vibe; stage: Stage; seen: Set<string>; onHome: () => void; onReplay: () => void }) {
  const [assigned, setAssigned] = useState(() => drawFresh(missions.filter(m => m.stage === stage && (m.vibe === 'both' || vibe === 'flirty')), seen, 1).concat(drawFresh(missions.filter(m => !m.stage && (m.vibe === 'both' || vibe === 'flirty')), seen, 1)));
  const [owner, setOwner] = useState(0);
  const [phase, setPhase] = useState<'deal' | 'play' | 'peek' | 'reveal'>('deal');
  const [remaining, setRemaining] = useState(300);
  const [running, setRunning] = useState(false);
  const [starter, setStarter] = useState(0);
  useScreenFocus(`mission-${phase}`);
  useEffect(() => { assigned.forEach(m => seen.add(m.id)); }, [assigned, seen]);
  useEffect(() => {
    if (!running || remaining === 0) return;
    const timer = window.setTimeout(() => setRemaining(prev => Math.max(0, prev - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [running, remaining]);
  useEffect(() => {
    const pause = () => { if (document.hidden) setRunning(false); };
    document.addEventListener('visibilitychange', pause);
    return () => document.removeEventListener('visibilitychange', pause);
  }, []);
  if (phase === 'deal' || phase === 'peek') return <Handoff key={`${phase}-${owner}`} name={names[owner]} title={assigned[owner].title} label="Your secret mission"><div className="paper-card mission-paper"><span className="card-label">FOR YOUR EYES ONLY</span><PromptIllustration kind={illustrationFor.mission[assigned[owner].id]} /><p className="mission-task">{assigned[owner].task}</p><div className="paper-rule" /><p className="mission-nudge">{assigned[owner].nudge}</p></div><p className="supporting-copy">An invitation counts. Your partner never has to say yes.</p>{phase === 'deal' && <Button className="full-width" variant="secondary" onClick={() => setAssigned(prev => {
    const pool = missions.filter(m => (m.vibe === 'both' || vibe === 'flirty') && (!m.stage || m.stage === stage) && !prev.some(p => p.id === m.id));
    const replacement = drawFresh(pool, seen, 1)[0];
    return prev.map((mission, i) => i === owner ? replacement : mission);
  })}><Shuffle size={16} /> Deal me something else</Button>}<Button className="full-width" onClick={() => {
    if (phase === 'peek') setPhase('play');
    else if (owner === 0) setOwner(1);
    else setPhase('play');
  }}>{phase === 'peek' ? 'Hide & return to our game' : owner === 0 ? `Hide & pass to ${names[1]}` : 'Hide & begin our missions'} <ArrowRight size={18} /></Button></Handoff>;
  if (phase === 'reveal') return <Ending eyebrow="The secret’s out" title="So that’s what you were up to." onHome={onHome} onReplay={onReplay}><p className="lede">Take turns revealing what you were trying to do.</p><div className="mission-reveals">{assigned.map((mission, i) => <details key={mission.id}><summary><span>{names[i]}’s mission</span><Eye size={17} /></summary><h2>{mission.title}</h2><p>{mission.task}</p></details>)}</div><div className="debrief"><h2>What gave it away?</h2><p>Tell each other which moment you enjoyed most. No points, no keeping score.</p></div></Ending>;
  const starters = ['What’s something we should do together just because it sounds fun?', 'What’s a small thing from this week that made you smile?', 'What would our very low-budget dream weekend look like?', 'What’s an opinion you have that I somehow still don’t know about?'];
  return <section className="screen-narrow mission-active"><Eyebrow>Secret Mission · Both assignments are hidden</Eyebrow><h1 tabIndex={-1}>Act natural.<br /><em>Or try to.</em></h1><p className="lede">Put the phone down and hang out. Work your mission into the conversation when it feels right.</p><div className="timer-panel"><div><span className="timer-caption">OPTIONAL FIVE-MINUTE TIMER</span><span className="timer-digits" role="timer" aria-label={`${Math.floor(remaining / 60)} minutes ${remaining % 60} seconds remaining`}>{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</span></div><button className="round-link" aria-label={remaining === 0 ? 'Restart timer' : running ? 'Pause timer' : 'Start timer'} onClick={() => { if (remaining === 0) { setRemaining(300); setRunning(true); } else setRunning(prev => !prev); }}>{running && remaining > 0 ? <Pause size={21} /> : <Play size={21} />}</button></div>{remaining === 0 && <p role="status" className="timer-done">Time’s up. Keep talking if you’re having a good time.</p>}<details className="reply-hint"><summary>Need something to talk about? <span>+</span></summary><p>“{starters[starter]}”</p><button className="text-button" onClick={() => setStarter(prev => (prev + 1) % starters.length)}>Another conversation starter <Shuffle size={14} /></button></details><div className="peek-row">{names.map((name, i) => <Button key={i} variant="quiet" onClick={() => { setOwner(i); setRunning(false); setPhase('peek'); }}><Eye size={14} /> {name}’s private peek</Button>)}</div><div className="debrief"><h2>Ready for the reveal?</h2><p>First, guess each other’s missions out loud. Then tap below.</p></div><Button className="full-width" onClick={() => { setRunning(false); setPhase('reveal'); }}>Reveal our missions <ArrowRight size={18} /></Button></section>;
}

function DoubleYes({ names, vibe, stage, seen, onHome, onReplay }: { names: Names; vibe: Vibe; stage: Stage; seen: Set<string>; onHome: () => void; onReplay: () => void }) {
  const [deck] = useState(() => { const tailored = drawFresh(dateIdeas.filter(idea => idea.stage === stage && (idea.vibe === 'both' || vibe === 'flirty')), seen, 2); return tailored.concat(drawFresh(dateIdeas.filter(idea => !idea.stage && (idea.vibe === 'both' || vibe === 'flirty')), seen, 8 - tailored.length)); });
  const [answers, setAnswers] = useState<[Record<string, boolean>, Record<string, boolean>]>([{}, {}]);
  const [owner, setOwner] = useState(0);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'choose' | 'matches' | 'plan' | 'ending'>('choose');
  const [chosen, setChosen] = useState<DateIdea | null>(null);
  const cardRef = useRef<HTMLHeadingElement>(null);
  useScreenFocus(`double-${phase}`);
  useEffect(() => { deck.forEach(idea => seen.add(idea.id)); }, [deck, seen]);
  useEffect(() => { if (index > 0) cardRef.current?.focus({ preventScroll: true }); }, [index]);
  const matches = mutualIdeas(deck, answers[0], answers[1]);
  function answer(value: boolean) {
    setAnswers(prev => owner === 0 ? [{ ...prev[0], [deck[index].id]: value }, prev[1]] : [prev[0], { ...prev[1], [deck[index].id]: value }]);
    if (index < deck.length - 1) setIndex(prev => prev + 1);
    else if (owner === 0) { setOwner(1); setIndex(0); }
    else setPhase('matches');
  }
  if (phase === 'choose') return <Handoff key={owner} name={names[owner]} title="What sounds good tonight?" label="Your picks stay private"><p className="supporting-copy">Go with your own mood. Only your shared yeses will be shown.</p><Progress current={index + 1} total={deck.length} label="Idea" /><article className="paper-card idea-card" data-idea-id={deck[index].id}><span className="card-label">{deck[index].category}</span><PromptIllustration kind={illustrationFor.idea[deck[index].id]} /><h2 tabIndex={-1} ref={cardRef}>{deck[index].title}</h2><p>{deck[index].description}</p><span className="idea-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></article><div className="vote-actions"><Button variant="secondary" onClick={() => answer(false)}><X size={18} /> Not tonight</Button><Button onClick={() => answer(true)}><Heart size={18} /> Sounds fun</Button></div><p className="form-footnote">“Not tonight” stays private, too. There’s no right answer.</p></Handoff>;
  if (phase === 'ending') return <Ending eyebrow="A shared yes, made real" title="That one was yours." onHome={onHome} onReplay={onReplay} replayLabel="Find more shared yeses"><p className="lede">{chosen?.title}</p><div className="debrief"><h2>Would you do it again?</h2><p>Tell each other one part you’d keep and one thing you’d change. Different answers are welcome.</p></div></Ending>;
  if (phase === 'plan' && chosen) return <section className="screen-narrow plan-screen"><Eyebrow><Heart size={13} /> You both picked this</Eyebrow><h1 tabIndex={-1}>{chosen.title}</h1><p className="lede">{chosen.description}</p><ol className="date-steps">{chosen.steps.map((step, i) => <li key={step}><span>0{i + 1}</span><p>{step}</p></li>)}</ol><p className="comfort-note"><Heart size={16} /> Check in before you start. You can change your mind.</p><div className="action-stack"><Button onClick={() => setPhase('ending')}>We tried it <Check size={18} /></Button><Button variant="secondary" onClick={() => setPhase('matches')}>Choose a different shared idea</Button></div></section>;
  return <section className="screen-narrow match-results"><div className="ending-stamp"><Heart size={28} /></div><Eyebrow>Double Yes · The reveal</Eyebrow><h1 tabIndex={-1}>{matches.length > 0 ? <>Oh. You too?</> : <>Different moods.<br /><em>Still a good team.</em></>}</h1><p className="lede">{matches.length > 0 ? `You both liked ${matches.length === 1 ? 'this idea' : `these ${matches.length} ideas`}. Pick one to make a little date of it.` : 'No shared picks this round. Try a fresh set, choose another game, or call it a night.'}</p>{matches.length > 0 && <div className="match-list">{matches.map((idea, i) => <button key={idea.id} data-match-id={idea.id} onClick={() => { setChosen(idea); setPhase('plan'); }}><span className="match-number">{String(i + 1).padStart(2, '0')}</span><span><small>{idea.category}</small><strong>{idea.title}</strong></span><ArrowUpRight size={20} /></button>)}</div>}<p className="soft-note"><Lock size={14} /> Your other choices haven’t been revealed.</p><div className="action-stack"><Button variant={matches.length ? 'secondary' : 'primary'} onClick={onReplay}><RefreshCw size={16} /> Try a fresh set</Button><Button variant="quiet" onClick={onHome}>Choose another game</Button></div></section>;
}

export default function App() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [ready, setReady] = useState(false);
  const [names, setNames] = useState<Names>(['Player 1', 'Player 2']);
  const [vibe, setVibe] = useState<Vibe>('playful');
  const [stage, setStage] = useState<Stage>('new');
  const [session, setSession] = useState(0);
  const [showExit, setShowExit] = useState(false);
  const exitRef = useRef<HTMLDialogElement>(null);
  const seenMissions = useRef(new Set<string>());
  const seenIdeas = useRef(new Set<string>());
  function home() { setMode(null); setReady(false); setShowExit(false); }
  const activeCatalogGame = gameCatalog.find(game => game.mode === mode);
  function leave() { if (ready) setShowExit(true); else home(); }
  function replay(swap = false) { if (swap) setNames(prev => [prev[1], prev[0]]); setSession(prev => prev + 1); }
  useEffect(() => { if (showExit) exitRef.current?.showModal(); else exitRef.current?.close(); }, [showExit]);
  return <div className="app-shell"><a className="skip-link" href="#main">Skip to game</a><header className="site-header"><button className="brand" onClick={leave} aria-label="Date Night Games home"><span className={activeCatalogGame ? "brand-game-mark" : "brand-mark"}>{activeCatalogGame ? <CoupleGameEmblem mode={activeCatalogGame.mode} className="brand-game-emblem" /> : <Plane size={20} />}</span><span>Couple Flight<small>DATE NIGHT GAMES</small></span></button>{mode ? <button className="exit-link" onClick={leave}><ArrowLeft size={16} /><span>{ready ? 'Leave game' : 'All games'}</span></button> : <a className="exit-link" href={flightBoardUrl} aria-label="Back to Flight Chess"><ArrowLeft size={16} /><span>Board</span></a>}</header><main id="main">{!mode ? <Home onChoose={value => { setMode(value); setReady(false); }} /> : !ready ? <Setup mode={mode} names={names} vibe={vibe} stage={stage} onStart={(newNames, newVibe, newStage) => { setNames(newNames); setVibe(newVibe); setStage(newStage); setReady(true); setSession(prev => prev + 1); }} /> : mode === 'first-date' ? <FirstDate key={session} names={names} vibe={vibe} stage={stage} onHome={home} onReplay={() => replay(true)} /> : mode === 'mission' ? <SecretMission key={session} names={names} vibe={vibe} stage={stage} seen={seenMissions.current} onHome={home} onReplay={() => replay()} /> : mode === 'double-yes' ? <DoubleYes key={session} names={names} vibe={vibe} stage={stage} seen={seenIdeas.current} onHome={home} onReplay={() => replay()} /> : mode === 'heart-dice' ? <ChemistryDice key={session} names={names} vibe={vibe} onHome={home} onReplay={() => replay()} /> : mode === 'read-my-mind' ? <ReadMyMind key={session} names={names} vibe={vibe} stage={stage} onHome={home} onReplay={() => replay()} /> : mode === 'wish-auction' ? <WishAuction key={session} names={names} vibe={vibe} stage={stage} onHome={home} onReplay={() => replay()} /> : mode === 'date-mystery' ? <DateMystery key={session} names={names} vibe={vibe} stage={stage} onHome={home} onReplay={() => replay()} /> : mode === 'sketch-date' ? <SketchDate key={session} names={names} stage={stage} onHome={home} onReplay={() => replay()} /> : <AfterHours key={session} names={names} vibe={vibe} stage={stage} onHome={home} onReplay={() => replay()} />}</main><footer className="site-footer"><span><Ticket size={14} /> A little time, just for you two.</span><span>Go at your own pace.</span></footer><dialog ref={exitRef} onCancel={() => setShowExit(false)} onClick={event => { if (event.target === event.currentTarget) setShowExit(false); }}><div className="exit-dialog"><Eyebrow>Pause for a moment</Eyebrow><h2>Call it a night?</h2><p>This round will be cleared. Your answers aren’t saved.</p><div className="action-stack"><Button onClick={home}>Leave this round</Button><Button variant="secondary" onClick={() => setShowExit(false)} autoFocus>Keep playing</Button></div></div></dialog></div>;
}
