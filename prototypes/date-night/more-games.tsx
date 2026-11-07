import { useState } from 'react';
import { ArrowRight, Check, Heart, Lightbulb, Lock } from 'lucide-react';
import { shuffled, stageLabels, type Names, type Stage, type Vibe } from './content';
import { mindQuestions, mysteries, wishes } from './more-content';
import { Button, Ending, Eyebrow, Handoff, Progress } from './shared';
import { PromptIllustration } from './illustrations';
import { illustrationFor } from './illustration-map';
import { useScreenFocus } from './useScreenFocus';

type Common = { names: Names; stage: Stage; vibe: Vibe; onHome: () => void; onReplay: () => void };

export function ReadMyMind({ names, stage, onHome, onReplay }: Common) {
  const [deck] = useState(() => shuffled(mindQuestions.filter(question => question.stage === stage)).slice(0, 4));
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<'answer' | 'guess' | 'reveal' | 'end'>('answer');
  const [answer, setAnswer] = useState<number | null>(null);
  const [guess, setGuess] = useState<number | null>(null);
  const [hits, setHits] = useState(0);
  const chooser = round % 2;
  const predictor = chooser === 0 ? 1 : 0;
  const card = deck[round];
  useScreenFocus(`mind-${round}-${phase}`);
  function advance() { if (round === 3) setPhase('end'); else { setRound(round + 1); setAnswer(null); setGuess(null); setPhase('answer'); } }
  if (phase === 'end') return <Ending eyebrow="Read My Mind · The reveal" title="Still learning you." onHome={onHome} onReplay={onReplay}><p className="lede">You guessed {hits} of 4 picks. The stories behind the other picks are the real surprise.</p><div className="debrief"><h2>Take one thing with you.</h2><p>What did your partner choose that you would love to try together?</p></div></Ending>;
  if (phase === 'answer' || phase === 'guess') { const owner = phase === 'answer' ? chooser : predictor; return <Handoff key={`${round}-${phase}`} name={names[owner]} title={phase === 'answer' ? 'What would you pick?' : 'What would they pick?'} label={phase === 'answer' ? 'Your answer stays private' : 'Your guess stays private'}><Progress current={round + 1} total={4} label="Question" /><div className="paper-card mini-paper"><span className="card-label">READ MY MIND</span><PromptIllustration kind={illustrationFor.mind[card.id]} /><p>{card.question}</p></div><div className="option-list">{card.options.map((option, i) => <Button key={option} variant="secondary" className="full-width" onClick={() => { if (phase === 'answer') { setAnswer(i); setPhase('guess'); } else { setGuess(i); if (answer === i) setHits(prev => prev + 1); setPhase('reveal'); } }}>{option} <ArrowRight size={16} /></Button>)}</div><p className="form-footnote">Choose what feels true today. This is a conversation, not a test.</p></Handoff>; }
  return <section className="screen-narrow mini-game"><Eyebrow>Read My Mind · Question {round + 1} of 4</Eyebrow><h1 tabIndex={-1}>{answer === guess ? <>You knew <em>that one.</em></> : <>A new thing to <em>learn.</em></>}</h1><p className="lede">{card.question}</p><div className="answer-reveal"><div><span>{names[chooser]} picked</span><strong>{card.options[answer ?? 0]}</strong></div><div><span>{names[predictor]} guessed</span><strong>{card.options[guess ?? 0]}</strong></div></div><div className="debrief"><h2>Talk about it</h2><p>{card.followup}</p></div><Button className="full-width" onClick={advance}>{round === 3 ? 'See our ending' : 'Next question'} <ArrowRight size={18} /></Button></section>;
}

export function WishAuction({ names, stage, onHome, onReplay }: Common) {
  const [deck] = useState(() => shuffled(wishes.filter(wish => wish.stage === stage)));
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<'first' | 'second' | 'reveal' | 'end'>('first');
  const [tokens, setTokens] = useState<[number, number]>([5, 5]);
  const [bids, setBids] = useState<[number, number]>([0, 0]);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const wish = deck[round];
  useScreenFocus(`auction-${round}-${phase}`);
  function bid(value: number) { if (phase === 'first') { setBids([value, 0]); setPhase('second'); } else { setBids(prev => [prev[0], value]); setPhase('reveal'); } }
  function advance() { if (round === 3) setPhase('end'); else { setRound(round + 1); setBids([0, 0]); setPhase('first'); } }
  if (phase === 'end') return <Ending eyebrow="Wish Auction · Your shortlist" title={shortlist.length ? 'The best bids were mutual.' : 'No bid required.'} onHome={onHome} onReplay={onReplay}><p className="lede">{shortlist.length ? 'Pick one idea for another night, or just enjoy the conversation.' : 'Nothing unlocked today. You can make up your own wish together.'}</p>{shortlist.length > 0 && <ul className="wish-shortlist">{shortlist.map(item => <li key={item}><Heart size={16} /> {item}</li>)}</ul>}<p className="supporting-copy">A yes now is never a promise later. Check in again before making plans.</p></Ending>;
  if (phase === 'first' || phase === 'second') { const owner = phase === 'first' ? 0 : 1; return <Handoff key={`${round}-${phase}`} name={names[owner]} title="What's it worth to you?" label="Your private bid"><Progress current={round + 1} total={4} label="Wish" /><p className="supporting-copy">You have {tokens[owner]} pretend tokens left. Spend only on plans you actually like.</p><div className="paper-card mini-paper"><span className="card-label">WISH {String(round + 1).padStart(2, '0')}</span><PromptIllustration kind={illustrationFor.wish[wish.id]} /><p>{wish.title}</p><small>{wish.pitch}</small></div><div className="bid-options">{[0, 1, 2].map(value => <Button key={value} className="full-width" variant={value === 0 ? 'quiet' : 'secondary'} disabled={value > tokens[owner]} onClick={() => bid(value)}>{value === 0 ? 'Pass' : `${value} token${value === 2 ? 's' : ''} · ${value === 1 ? 'Sounds good' : 'I’m into it'}`}</Button>)}</div><p className="form-footnote">Tokens are pretend. Your bid is only spent when you both bid above zero.</p></Handoff>; }
  const unlocked = bids[0] > 0 && bids[1] > 0;
  return <section className="screen-narrow mini-game"><Eyebrow>Wish Auction · The reveal</Eyebrow><h1 tabIndex={-1}>{unlocked ? <>A shared <em>wish.</em></> : <>Maybe another <em>night.</em></>}</h1><p className="lede">{wish.title} · {wish.pitch}</p><div className="answer-reveal"><div><span>{names[0]} bid</span><strong>{bids[0]}</strong></div><div><span>{names[1]} bid</span><strong>{bids[1]}</strong></div></div>{unlocked ? <><p className="supporting-copy">Choose the version you both like. {bids[0] === bids[1] ? 'You tied, so choose together.' : `${names[bids[0] > bids[1] ? 0 : 1]} gets first suggestion; either of you can change it.`}</p><div className="option-list">{wish.details.map(detail => <Button key={detail} variant="secondary" className="full-width" onClick={() => { setShortlist(prev => [...prev, `${wish.title} · ${detail}`]); setTokens(prev => [prev[0] - bids[0], prev[1] - bids[1]]); advance(); }}>{detail} <Check size={16} /></Button>)}</div><Button variant="quiet" className="full-width" onClick={() => { setShortlist(prev => [...prev, `${wish.title} · decide together later`]); setTokens(prev => [prev[0] - bids[0], prev[1] - bids[1]]); advance(); }}>Decide the details later</Button></> : <><p className="supporting-copy">No tokens spent. Passing is a valid choice.</p><Button className="full-width" onClick={advance}>{round === 3 ? 'See our shortlist' : 'Next wish'} <ArrowRight size={18} /></Button></>}</section>;
}

export function DateMystery({ names, stage, onHome, onReplay }: Common) {
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<'a' | 'b' | 'solve' | 'solved' | 'end'>('a');
  const [wrong, setWrong] = useState(false);
  const puzzle = mysteries.filter(item => item.stage === stage)[round];
  useScreenFocus(`mystery-${round}-${phase}`);
  function advance() { if (round === 2) setPhase('end'); else { setRound(round + 1); setWrong(false); setPhase('a'); } }
  if (phase === 'end') return <Ending eyebrow="Date Night Mystery · Solved together" title="You found your way." onHome={onHome} onReplay={onReplay}><p className="lede">The mystery is over, but the date can keep going. Which stop would you actually want to try?</p></Ending>;
  if (phase === 'a' || phase === 'b') { const owner = phase === 'a' ? 0 : 1; return <Handoff key={`${round}-${phase}`} name={names[owner]} title={`Clue ${phase.toUpperCase()}`} label="Only you see this clue"><Progress current={round + 1} total={3} label="Scene" /><p className="supporting-copy">{puzzle.scene}</p><div className="paper-card mini-paper"><span className="card-label"><Lock size={13} /> PRIVATE CLUE</span><PromptIllustration kind={illustrationFor.mysteryClue[puzzle.id]} /><p>{phase === 'a' ? puzzle.clueA : puzzle.clueB}</p></div><p className="supporting-copy">Remember the clue. Tell your partner once both cards have been seen.</p><Button className="full-width" onClick={() => setPhase(phase === 'a' ? 'b' : 'solve')}>{phase === 'a' ? `Hide & pass to ${names[1]}` : 'Hide & solve together'} <ArrowRight size={18} /></Button></Handoff>; }
  if (phase === 'solved') return <section className="screen-narrow mini-game"><Eyebrow><Check size={14} /> Scene {round + 1} solved</Eyebrow><h1 tabIndex={-1}>Nice work,<br /><em>you two.</em></h1><div className="paper-card mini-paper"><span className="card-label">THE STORY CONTINUES</span><PromptIllustration kind={illustrationFor.mysteryReveal[puzzle.id]} /><p>{puzzle.resolution}</p></div><Button className="full-width" onClick={advance}>{round === 2 ? 'Finish our mystery' : 'Open the next clue'} <ArrowRight size={18} /></Button></section>;
  return <section className="screen-narrow mini-game"><Eyebrow>Date Night Mystery · {stageLabels[stage]}</Eyebrow><h1 tabIndex={-1}>Put your clues <em>together.</em></h1><Progress current={round + 1} total={3} label="Scene" /><p className="lede">{puzzle.scene}</p><p className="supporting-copy">Share what each of you saw. Then choose an answer together.</p><div className="paper-card mini-paper"><span className="card-label">THE QUESTION</span><p>{puzzle.question}</p></div><div className="option-list">{puzzle.options.map((option, i) => <Button key={option} variant="secondary" className="full-width" onClick={() => { if (i === puzzle.answer) setPhase('solved'); else setWrong(true); }}>{option} <ArrowRight size={16} /></Button>)}</div>{wrong && <p role="status" className="mystery-hint"><Lightbulb size={17} /> {puzzle.hint}</p>}<p className="form-footnote">No timer. Wrong guesses only unlock a hint.</p></section>;
}
