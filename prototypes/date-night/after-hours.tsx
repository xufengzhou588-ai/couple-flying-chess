import { useState } from 'react';
import { ArrowRight, Check, Heart, Lock, Moon, Sparkles } from 'lucide-react';
import { Button, Ending, Eyebrow, Handoff, Progress } from './shared';
import { PromptIllustration, type ArtKind } from './illustrations';
import { stageLabels, type Names, type Stage, type Vibe } from './content';
import { useScreenFocus } from './useScreenFocus';
import { useMiniI18n } from './mini-i18n';
import { playMiniCue, playMiniVoice } from './mini-audio';
import bedroomSheet from './assets/slow-burn-married-velvet.png';

type Choice = 'yes' | 'maybe' | 'pass';
type Move = {
  id: string;
  title: string;
  pitch: string;
  art?: ArtKind;
  bedroomCell?: number;
  action: string;
  invitation?: string;
  comeback: string;
};

const newMoves: Move[] = [
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

const togetherMoves: Move[] = [
  { id: 'welcome', title: 'The welcome-home kiss', pitch: 'Greet them as if you have been waiting all week.', art: 'home', action: 'Ask for a kiss and let them choose how long it lasts.', invitation: '“Can I have the kind of hello we used to save for dates?”', comeback: '“Only if you promise not to rush away.”' },
  { id: 'memory', title: 'Remember that night', pitch: 'Bring back one detail from a date you still think about.', art: 'ticket', action: 'Each name one detail. Then choose one to recreate soon.', invitation: '“Remember that night? I still think about one part of it.”', comeback: '“Tell me yours. I have one too.”' },
  { id: 'close', title: 'Choose the next move', pitch: 'Offer a kiss, a slow dance, or a private plan for later.', art: 'dance', action: 'Let your partner pick one, suggest another, or pass.', invitation: '“I have three ideas for us. Which one sounds like tonight?”', comeback: '“Tell me the options. I might add a fourth.”' },
];

const marriedPlayfulMoves: Move[] = [
  { id: 'pillow-look', title: 'Pillow talk, no phones', pitch: 'Lie face to face and tell each other one thing you still find irresistible.', bedroomCell: 1, action: 'Take turns with one honest line. A smile is allowed to interrupt.', invitation: '“Phone down. Tell me one thing you still like about us.”', comeback: '“I have more than one. You go first.”' },
  { id: 'bedside-kiss', title: 'One more goodnight kiss', pitch: 'Meet at the edge of the bed for a kiss that lasts longer than usual.', bedroomCell: 0, action: 'Ask for one kiss. Let your partner decide if it gets an encore.', invitation: '“Can we give tonight a better ending?”', comeback: '“That depends. How good is your first kiss?”' },
  { id: 'switch-lead', title: 'Your turn, then mine', pitch: 'Each choose one small bedroom move the other can say yes to or change.', bedroomCell: 5, action: 'Offer one move each. Keep the version you both like.', invitation: '“You pick our first move. I get the next one.”', comeback: '“Deal. No peeking at my choice.”' },
];

const marriedFlirtyMoves: Move[] = [
  { id: 'slow-kiss', title: 'A kiss worth staying for', pitch: 'Sit together at the edge of the bed and let the first kiss take its time.', bedroomCell: 0, action: 'Take turns choosing when to lean in. Pause and ask before another kiss.', invitation: '“I want to kiss you like we have nowhere else to be. Can I?”', comeback: '“Come closer. Slow is exactly what I want.”' },
  { id: 'face-to-face', title: 'Face to face', pitch: 'Turn toward each other on the pillows; choose a look, a kiss, or both.', bedroomCell: 1, action: 'Stay face to face for three breaths. Let either person choose the next move.', invitation: '“Stay here with me. What should I do first?”', comeback: '“Start with that look. Then ask me again.”' },
  { id: 'whisper-wish', title: 'Whisper a wish', pitch: 'Tell your spouse one thing you would love tonight, softly and without guessing.', bedroomCell: 2, action: 'Each whisper one wish. The other can say yes, suggest a change, or pass.', invitation: '“I have one wish for tonight. Want to hear it?”', comeback: '“Tell me. I’ll tell you what I want too.”' },
  { id: 'shoulder-heart', title: 'Leave a little clue', pitch: 'Trace a tiny heart over a clothed shoulder and ask where the next kiss should land.', bedroomCell: 3, action: 'Ask before touching. Let their answer choose the next move.', invitation: '“I’m leaving you a clue. Where would you like the next kiss?”', comeback: '“I like that clue. Try here.”' },
  { id: 'side-by-side', title: 'Side by side', pitch: 'Lie together under the covers and let one person choose what comes next.', bedroomCell: 4, action: 'Hold hands for three breaths; ask if they want a kiss, a whisper, or more time.', invitation: '“Come lie next to me. We can take our time.”', comeback: '“Yes. Stay close and ask me what I’m thinking.”' },
  { id: 'take-the-lead', title: 'Your turn to lead', pitch: 'Take turns choosing one bedtime move: a kiss, a close embrace, or a whispered request.', bedroomCell: 5, action: 'One person offers a move; the other accepts, changes it, or passes. Then swap.', invitation: '“Your move. Surprise me with something I’d actually like.”', comeback: '“Only if I get the next turn.”' },
];

function MoveIllustration({ move }: { move: Move }) {
  if (move.bedroomCell === undefined) return <PromptIllustration kind={move.art} />;
  const column = move.bedroomCell % 3;
  const row = Math.floor(move.bedroomCell / 3);
  return <span className="prompt-art bedroom-art" data-art-kind={`bedroom-${move.bedroomCell}`} aria-hidden="true" style={{ backgroundImage: `url(${bedroomSheet})`, backgroundSize: '300% 200%', backgroundPosition: `${column * 50}% ${row * 100}%` }} />;
}

const settings: Record<Stage, string> = {
  new: 'The date is ending. Neither of you is in a hurry to say goodbye.',
  together: 'You made it home. The ordinary evening still has room for one more moment.',
  married: 'The bedroom door is closed. You get to choose how tonight begins together.',
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
  const { locale, tr, fmt, displayName } = useMiniI18n();
  const deck = stage === 'married' ? vibe === 'flirty' ? marriedFlirtyMoves : marriedPlayfulMoves : stage === 'together' ? togetherMoves : newMoves;
  const [phase, setPhase] = useState<'pick' | 'detail' | 'reveal' | 'scene' | 'ending'>('pick');
  const [owner, setOwner] = useState(0);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<[Record<string, Choice>, Record<string, Choice>]>([{}, {}]);
  const [selected, setSelected] = useState<Move | null>(null);
  const [details, setDetails] = useState<[string, string]>(['', '']);
  const [beat, setBeat] = useState(0);
  const [ending, setEnding] = useState<'linger' | 'later'>('linger');
  useScreenFocus(`after-hours-${phase}-${owner}-${index}-${beat}`);
  const matches = deck.filter(move => answers[0][move.id] !== 'pass' && answers[1][move.id] !== 'pass' && answers[0][move.id] && answers[1][move.id]);

  function choose(choice: Choice) {
    const thisPerson = { ...answers[owner], [deck[index].id]: choice };
    setAnswers(previous => owner === 0
      ? [thisPerson, previous[1]]
      : [previous[0], thisPerson]);
    if (index < deck.length - 1) setIndex(index + 1);
    else if (deck.every(move => thisPerson[move.id] === 'pass')) {
      if (owner === 0) { setOwner(1); setIndex(0); }
      else setPhase('reveal');
    } else setPhase('detail');
  }

  if (phase === 'detail') return <Handoff key={owner} name={names[owner]} voicePlayer={owner} title="Make it yours." label="One detail only you know">
    <p className="lede">{fmt("Think of one small thing about {name} that caught your attention. You can bring it into your scene later.", { name: displayName(names[owner === 0 ? 1 : 0]) })}</p>
    <label className="after-hours-detail">{tr("Your private detail")}
      <input maxLength={80} autoComplete="off" placeholder={tr(stage === 'new' ? 'e.g. the way they laughed tonight' : 'e.g. that look across the kitchen')} value={details[owner]} onChange={event => setDetails(previous => owner === 0 ? [event.target.value, previous[1]] : [previous[0], event.target.value])} />
    </label>
    <p className="form-footnote">{tr("Your words appear only if you both choose to play a scene. You can leave this blank.")}</p>
    <Button className="full-width" onClick={() => { if (owner === 0) { setOwner(1); setIndex(0); setPhase('pick'); } else setPhase('reveal'); }}>{owner === 0 ? fmt('Hide & pass to {name}', { name: displayName(names[1]) }) : tr('Hide & reveal our sparks')} <ArrowRight size={17} /></Button>
  </Handoff>;

  if (phase === 'pick') {
    const move = deck[index];
    return <Handoff key={owner} name={names[owner]} voicePlayer={owner} title="What sounds good tonight?" label="Only you see these choices">
      <Progress current={index + 1} total={deck.length} label="Spark" />
      <div className="paper-card mini-paper after-hours-choice" data-move-id={move.id}>
        <span className="card-label">{tr(stage === 'married' ? 'A BEDROOM MOVE' : 'A SMALL MOVE')}</span>
        <MoveIllustration move={move} />
        <p>{tr(move.title)}</p><small>{tr(move.pitch)}</small>
      </div>
      <div className="after-hours-votes">
        <Button className="full-width" onClick={() => choose('yes')}><Heart size={17} /> {tr("Yes, tonight")}</Button>
        <Button className="full-width" variant="secondary" onClick={() => choose('maybe')}><Sparkles size={17} /> {tr("Maybe, ask me")}</Button>
        <Button className="full-width" variant="quiet" onClick={() => choose('pass')}> {tr("Pass for now")}</Button>
      </div>
      <p className="form-footnote">{tr("A “maybe” is an invitation to ask again, never an automatic yes. Passed choices stay private.")}</p>
    </Handoff>;
  }

  if (phase === 'reveal') return <section className="screen-narrow mini-game after-hours-screen">
    <Eyebrow><Moon size={14} /> {tr("The Slow Burn")} · {tr(stageLabels[stage])}</Eyebrow>
    <h1 tabIndex={-1}>{matches.length ? <>{tr("You both left")}<br /><em>{tr("the door open.")}</em></> : <>{tr("Tonight can stay")}<br /><em>{tr("easy.")}</em></>}</h1>
    <p className="lede">{tr(matches.length ? 'Pick one spark to play out together. You can change your minds at any point.' : 'No shared spark this round. Keep the good company, or try another night.')}</p>
    {matches.length > 0 && <div className="after-hours-match-list">{matches.map(move =>
      <button key={move.id} className={`after-hours-match ${move.art || move.bedroomCell !== undefined ? '' : 'artless'}`} data-match-move={move.id} onClick={() => { setSelected(move); setPhase('scene'); void playMiniCue('reveal'); playMiniVoice(locale, 1, 'mini-spark'); }}>
        <MoveIllustration move={move} /><span><small>{tr("YOUR SHARED SPARK")}</small><strong>{tr(move.title)}</strong><em>{tr(move.pitch)}</em></span><ArrowRight size={19} />
      </button>)}</div>}
    <p className="soft-note"><Lock size={14} /> {tr("Everything else stays between each person and their choices.")}</p>
    <Button className="full-width" variant="secondary" onClick={matches.length ? onReplay : onHome}>{tr(matches.length ? 'Start a different round' : 'Choose another game')}</Button>
  </section>;

  if (phase === 'scene' && selected) return <section className="screen-narrow mini-game after-hours-screen">
    <Eyebrow><Moon size={14} /> {tr("The Slow Burn")} · {tr(selected.title)}</Eyebrow>
    <h1 tabIndex={-1}>{beat === 0 ? <>{tr("Set the")} <em>{tr("scene.")}</em></> : beat === 1 ? <>{tr("Make your")} <em>{tr("move.")}</em></> : <>{tr("Give it")} <em>{tr("back.")}</em></>}</h1>
    <Progress current={beat + 1} total={3} label="Beat" />
    <div className="paper-card mini-paper after-hours-scene">
      <span className="card-label">{beat === 0 ? tr('YOUR SETTING') : beat === 1 ? fmt('{name}, YOUR INVITATION', { name: displayName(names[0]) }) : fmt('{name}, YOUR REPLY', { name: displayName(names[1]) })}</span>
      {selected.bedroomCell !== undefined ? <MoveIllustration move={selected} /> : <PromptIllustration kind={beat === 0 ? (stage === 'new' ? undefined : 'home') : selected.art} />}
      <p>{tr(beat === 0 ? settings[stage] : beat === 1 ? (vibe === 'playful' && selected.id === 'closer' ? '“Want to come a little closer, or should I try one more opening line?”' : selected.invitation ?? invitations[stage][selected.id]) : selected.comeback)}</p>
      <small>{tr(beat === 0 ? 'Put the phone down for a breath. Decide who will make the first move.' : beat === 1 ? selected.action : 'Use your own words. Then decide together whether to linger or leave this moment here.')}</small>
      {beat > 0 && details[beat - 1].trim() && <div className="after-hours-callback"><Sparkles size={15} /><span>{fmt("Make it personal: “{detail}”", { detail: details[beat - 1].trim() })}</span></div>}
    </div>
    {beat < 2 ? <Button className="full-width" onClick={() => setBeat(beat + 1)}>{tr(beat === 0 ? 'We’re ready' : 'Your turn to respond')} <ArrowRight size={17} /></Button> : <div className="after-hours-finish">
      <Button onClick={() => { setEnding('linger'); setPhase('ending'); }}><Heart size={17} /> {tr("Linger here")}</Button>
      <Button variant="secondary" onClick={() => { setEnding('later'); setPhase('ending'); }}> {tr("Save it for later")}</Button>
    </div>}
    <p className="form-footnote">{tr("The line is a starting point. Either person can pause, change the move, or pass.")}</p>
  </section>;

  return <Ending eyebrow="The Slow Burn · Your scene" title={selected ? (ending === 'linger' ? 'Stay with that feeling.' : 'Leave a little spark for later.') : 'Another night is yours.'} onHome={onHome} onReplay={onReplay} replayLabel="Play a new scene">
    <p className="lede">{selected ? (ending === 'linger' ? fmt('You chose “{title}.” Put the phone away and let the next moment be yours.', { title: tr(selected.title) }) : fmt('You chose “{title}.” Tell each other one thing you liked, then make your own plan for another night.', { title: tr(selected.title) })) : tr('You can choose a new spark whenever you both want.')}</p>
    <div className="debrief"><h2>{tr("What stays with you?")}</h2><p>{tr("One look, one line, or one small move. Say which one you want to remember.")}</p></div>
    <p className="soft-note"><Check size={14} /> {tr("Nothing from this round is saved.")}</p>
  </Ending>;
}
