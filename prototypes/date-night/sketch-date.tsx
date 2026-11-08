import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Eraser, Pencil, Timer } from 'lucide-react';
import { Button, Ending, Eyebrow, Handoff, Progress } from './shared';
import { shuffled, stageLabels, type Names, type Stage } from './content';
import { useScreenFocus } from './useScreenFocus';
import { useMiniI18n } from './mini-i18n';
import { playMiniCue, playMiniVoice } from './mini-audio';

type Sketch = { id: string; stage: Stage; title: string; choices: [string, string, string] };

const sketches: Sketch[] = [
  { id: 'n1', stage: 'new', title: 'Rooftop ice cream', choices: ['Rooftop ice cream', 'Drive-in movie', 'Bowling alley'] },
  { id: 'n2', stage: 'new', title: 'Bookstore treasure hunt', choices: ['Karaoke night', 'Bookstore treasure hunt', 'Canoe ride'] },
  { id: 'n3', stage: 'new', title: 'Arcade prize for two', choices: ['Coffee tasting', 'Museum at night', 'Arcade prize for two'] },
  { id: 't1', stage: 'together', title: 'Picnic under string lights', choices: ['Picnic under string lights', 'Pottery class', 'Movie marathon'] },
  { id: 't2', stage: 'together', title: 'A dance in the kitchen', choices: ['A beach walk', 'A dance in the kitchen', 'A concert'] },
  { id: 't3', stage: 'together', title: 'A tiny road trip', choices: ['A cooking class', 'A rooftop dinner', 'A tiny road trip'] },
  { id: 'm1', stage: 'married', title: 'Coffee date before sunrise', choices: ['Coffee date before sunrise', 'A theater night', 'A garden picnic'] },
  { id: 'm2', stage: 'married', title: 'A living-room dance', choices: ['A hiking trip', 'A living-room dance', 'A farmers market'] },
  { id: 'm3', stage: 'married', title: 'Dessert after dark', choices: ['An afternoon movie', 'A museum visit', 'Dessert after dark'] },
];

type Phase = 'intro' | 'draw' | 'guess' | 'reveal' | 'choose' | 'end';
type Result = { title: string; image: string; guessed: boolean };

export function SketchDate({ names, stage, onHome, onReplay }: {
  names: Names; stage: Stage; onHome: () => void; onReplay: () => void;
}) {
  const { locale, tr, fmt, displayName } = useMiniI18n();
  const [deck] = useState(() => shuffled(sketches.filter(item => item.stage === stage)));
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>('intro');
  const [seconds, setSeconds] = useState(45);
  const [image, setImage] = useState('');
  const [guessed, setGuessed] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [favorite, setFavorite] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const sketch = deck[round];
  const artist = round % 2;
  const guesser = artist === 0 ? 1 : 0;
  useScreenFocus(`sketch-${phase}-${round}`);

  useEffect(() => {
    if (phase !== 'draw' || seconds === 0) return;
    const timer = window.setTimeout(() => setSeconds(previous => previous - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [phase, seconds]);

  useEffect(() => {
    if (phase !== 'draw') return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    context.fillStyle = '#f7ebdf';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#4b333d';
    context.lineWidth = 11;
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }, [phase, round]);

  function point(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    const bounds = canvas.getBoundingClientRect();
    return { x: (event.clientX - bounds.left) * canvas.width / bounds.width, y: (event.clientY - bounds.top) * canvas.height / bounds.height };
  }

  function startLine(event: React.PointerEvent<HTMLCanvasElement>) {
    if (seconds === 0) return;
    const context = event.currentTarget.getContext('2d');
    if (!context) return;
    const { x, y } = point(event);
    drawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + 0.01, y + 0.01);
    context.stroke();
  }

  function moveLine(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || seconds === 0) return;
    const context = event.currentTarget.getContext('2d');
    if (!context) return;
    const { x, y } = point(event);
    context.lineTo(x, y);
    context.stroke();
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    context.fillStyle = '#f7ebdf';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  function finishDrawing() {
    drawing.current = false;
    setImage(canvasRef.current?.toDataURL('image/png') || '');
    setPhase('guess');
  }

  function nextRound() {
    setResults(previous => [...previous, { title: sketch.title, image, guessed }]);
    if (round === deck.length - 1) setPhase('choose');
    else {
      setRound(previous => previous + 1);
      setImage('');
      setGuessed(false);
      setSeconds(45);
      setPhase('intro');
    }
  }

  if (phase === 'intro') return <Handoff key={`artist-${round}`} name={names[artist]} voicePlayer={artist} title="Sketch our next date." label="Only the artist sees this date">
    <Progress current={round + 1} total={deck.length} label="Sketch" />
    <div className="paper-card sketch-secret"><span className="card-label">{tr("DRAW THIS DATE")}</span><strong>{tr(sketch.title)}</strong></div>
    <p className="supporting-copy">{tr("No words or numbers in the drawing. Give your partner clues with shapes, not labels.")}</p>
    <Button className="full-width" onClick={() => setPhase('draw')}><Pencil size={17} />{tr("Start sketching")} <ArrowRight size={17} /></Button>
  </Handoff>;

  if (phase === 'draw') return <section className="screen-narrow mini-game sketch-screen">
    <Eyebrow>{tr("Sketch Our Date")} · {tr(stageLabels[stage])}</Eyebrow>
    <h1 tabIndex={-1}>{tr("Draw the")} <em>{tr("date.")}</em></h1>
    <p className="lede">{tr(sketch.title)}</p>
    <div className="sketch-toolbar"><span><Timer size={17} /> {seconds}s</span><button type="button" onClick={clearCanvas}><Eraser size={16} /> {tr("Clear canvas")}</button></div>
    <canvas ref={canvasRef} width={720} height={500} aria-label={tr("Draw the date idea with your finger or pointer")} onPointerDown={startLine} onPointerMove={moveLine} onPointerUp={() => { drawing.current = false; }} onPointerCancel={() => { drawing.current = false; }} />
    <p className="form-footnote">{tr(seconds === 0 ? 'Time is up. Pass the drawing over.' : 'Draw with your finger. Your sketch stays on this device for this round.')}</p>
    <Button className="full-width" onClick={finishDrawing}>{fmt('Hide the answer & pass to {name}', { name: displayName(names[guesser]) })} <ArrowRight size={17} /></Button>
  </section>;

  if (phase === 'guess') return <Handoff key={`guess-${round}`} name={names[guesser]} voicePlayer={guesser} title="Guess the date." label="The artist cannot give hints">
    <Progress current={round + 1} total={deck.length} label="Sketch" />
    {image && <img className="sketch-result" src={image} alt={fmt("Drawing by {name}", { name: displayName(names[artist]) })} />}
    <div className="option-list">{sketch.choices.map(choice => <Button key={choice} variant="secondary" className="full-width" onClick={() => { const correct = choice === sketch.title; setGuessed(correct); setPhase('reveal'); void playMiniCue(correct ? 'success' : 'reveal'); if (correct) playMiniVoice(locale, guesser, 'mini-solved'); }}>{tr(choice)} <ArrowRight size={16} /></Button>)}</div>
  </Handoff>;

  if (phase === 'reveal') return <section className="screen-narrow mini-game sketch-screen">
    <Eyebrow>{tr("Sketch Our Date · The reveal")}</Eyebrow>
    <h1 tabIndex={-1}>{guessed ? <>{tr("You")} <em>{tr("got it.")}</em></> : <>{tr("A new date")} <em>{tr("idea.")}</em></>}</h1>
    {image && <img className="sketch-result" src={image} alt={fmt("Drawing of {title}", { title: tr(sketch.title) })} />}
    <div className="sketch-answer"><Check size={18} /><span>{tr(sketch.title)}</span></div>
    <p className="supporting-copy">{tr("What tiny detail would make this date feel like yours?")}</p>
    <Button className="full-width" onClick={nextRound}>{tr(round === deck.length - 1 ? 'See our date sketches' : 'Draw the next date')} <ArrowRight size={17} /></Button>
  </section>;

  if (phase === 'choose') return <section className="screen-narrow mini-game sketch-screen">
    <Eyebrow>{tr("Sketch Our Date · Three ideas, one next date")}</Eyebrow>
    <h1 tabIndex={-1}>{tr("Which one should")}<br /><em>{tr("we try?")}</em></h1>
    <p className="lede">{fmt("You guessed {count} of 3. Pick a sketch you would actually like to turn into a date.", { count: results.filter(item => item.guessed).length })}</p>
    <div className="sketch-gallery">{results.map(item => <button key={item.title} onClick={() => { setFavorite(item.title); setPhase('end'); }}><img src={item.image} alt={fmt("Sketch of {title}", { title: tr(item.title) })} /><span>{tr(item.title)} <ArrowRight size={15} /></span></button>)}</div>
  </section>;

  return <Ending eyebrow="Sketch Our Date · Your next idea" title={favorite} onHome={onHome} onReplay={onReplay} replayLabel="Sketch another round">
    <p className="lede">{tr("You picked this together. Name one day you could try a small version of it.")}</p>
    <p className="soft-note">{tr("Sketches stay on this device and disappear when you leave or reload.")}</p>
  </Ending>;
}
