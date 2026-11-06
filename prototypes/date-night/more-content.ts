import type { Stage, Vibe } from './content';

export type DicePrompt = { id: string; stage: Stage; playful: string; flirty: string };
export const dicePrompts: DicePrompt[] = [
  { id: 'n1', stage: 'new', playful: 'What harmless opinion would you defend way too passionately?', flirty: 'What was the first thing about me that made you want to stay and talk?' },
  { id: 'n2', stage: 'new', playful: 'Pitch the most ridiculous second date that you would secretly enjoy.', flirty: 'Give me a two-line pitch for our next date. Start with “Picture this…”' },
  { id: 'n3', stage: 'new', playful: 'What very specific thing could we both get nerdy about?', flirty: 'What’s a question you wanted to ask me but haven’t yet?' },
  { id: 'n4', stage: 'new', playful: 'What would your friends guess is your oddly charming flaw?', flirty: 'Try a compliment that says more than “you look good.”' },
  { id: 'n5', stage: 'new', playful: 'If we had a two-person trivia team, what would our name be?', flirty: 'What small sign tells you a conversation has real chemistry?' },
  { id: 'n6', stage: 'new', playful: 'Which local place would you show me if we had one free hour?', flirty: 'If we both felt the spark, what would make a first kiss feel right?' },
  { id: 't1', stage: 'together', playful: 'What inside joke deserves a comeback?', flirty: 'When did I last catch your eye in a way you didn’t expect?' },
  { id: 't2', stage: 'together', playful: 'Invent a new tradition that costs almost nothing.', flirty: 'Recreate our first “oh, I like you” moment in one sentence.' },
  { id: 't3', stage: 'together', playful: 'What would our friends say is our signature move as a duo?', flirty: 'Ask me on a date as if you haven’t seen me all week.' },
  { id: 't4', stage: 'together', playful: 'What tiny adventure could get us out of autopilot?', flirty: 'What do I do that still gives you butterflies?' },
  { id: 't5', stage: 'together', playful: 'Rename a familiar place as if it were our secret club.', flirty: 'What kind of affectionate touch makes you feel especially wanted?' },
  { id: 't6', stage: 'together', playful: 'What’s a silly thing we’ve gotten surprisingly good at together?', flirty: 'Describe a low-key date with me that would feel special right now.' },
  { id: 'm1', stage: 'married', playful: 'What everyday moment of ours deserves a movie trailer?', flirty: 'What is one part of our ordinary life that still feels romantic to you?' },
  { id: 'm2', stage: 'married', playful: 'Pick one routine we should turn into a tiny celebration.', flirty: 'Invite me out like we just met, using something you know I love.' },
  { id: 'm3', stage: 'married', playful: 'What new hobby would make us hilariously bad beginners?', flirty: 'What side of me would you like more one-on-one time with?' },
  { id: 'm4', stage: 'married', playful: 'What small thing did we handle as a team this month?', flirty: 'Tell me one recent moment when you felt especially close to me.' },
  { id: 'm5', stage: 'married', playful: 'Design an after-hours date without leaving home.', flirty: 'If you were planning our next first date, what would you do differently?' },
  { id: 'm6', stage: 'married', playful: 'What would our shared autobiography be called?', flirty: 'If we had a whole night just for us, how would you want me to set the mood?' },
];
export const diceTwists = ['Answer in one sentence, then ask a follow-up.', 'Start with “I bet you didn’t know…”', 'Let your partner answer first; build on it.', 'Give the answer as a playful invitation.', 'Add one detail that makes it unmistakably us.', 'Make it a 20-second story.'];
export const diceAnswer = (prompt: DicePrompt, vibe: Vibe) => prompt[vibe];

export type MindQuestion = { id: string; stage: Stage; question: string; options: [string, string, string]; followup: string };
export const mindQuestions: MindQuestion[] = [
  { id: 'n1', stage: 'new', question: 'What would make a first free Saturday together?', options: ['A new café', 'A wandering walk', 'A live show'], followup: 'What detail would turn that into a great date?' },
  { id: 'n2', stage: 'new', question: 'Which opener would actually get your attention?', options: ['A funny observation', 'A bold compliment', 'A thoughtful question'], followup: 'Show your partner your version of it.' },
  { id: 'n3', stage: 'new', question: 'Pick a conversation that could last all night.', options: ['Travel stories', 'Music we love', 'Our weird opinions'], followup: 'Tell the story behind your pick.' },
  { id: 'n4', stage: 'new', question: 'Which surprise feels sweetest?', options: ['A handwritten note', 'A planned outing', 'A favorite snack'], followup: 'What makes that one feel personal?' },
  { id: 'n5', stage: 'new', question: 'What is your ideal last stop on a date?', options: ['Dessert', 'One more walk', 'A quiet rooftop'], followup: 'Describe the scene in one sentence.' },
  { id: 't1', stage: 'together', question: 'What would refresh our next date most?', options: ['A new place', 'No phones', 'A shared challenge'], followup: 'What is the easiest version we could try?' },
  { id: 't2', stage: 'together', question: 'What would you replay from our story?', options: ['Our first date', 'A weird adventure', 'A quiet win'], followup: 'What do you remember that I might not?' },
  { id: 't3', stage: 'together', question: 'What kind of affection lands best this week?', options: ['A sincere note', 'Time together', 'A small surprise'], followup: 'What would that look like in real life?' },
  { id: 't4', stage: 'together', question: 'Which two-person project sounds most fun?', options: ['Make a playlist', 'Cook something new', 'Learn a dance'], followup: 'Who would take the lead?' },
  { id: 't5', stage: 'together', question: 'Where would you like a spontaneous detour?', options: ['A bookstore', 'A food truck', 'A scenic lookout'], followup: 'What would we do when we got there?' },
  { id: 'm1', stage: 'married', question: 'Which ordinary evening would you upgrade?', options: ['Dinner together', 'The walk home', 'A lazy Sunday'], followup: 'What tiny change would make it feel like a date?' },
  { id: 'm2', stage: 'married', question: 'What do you want more of as a couple?', options: ['Playful surprises', 'Unhurried talks', 'New adventures'], followup: 'What would one small first step be?' },
  { id: 'm3', stage: 'married', question: 'Pick a throwback worth revisiting.', options: ['Our early dates', 'A favorite trip', 'A shared milestone'], followup: 'What do you remember most vividly?' },
  { id: 'm4', stage: 'married', question: 'How should we celebrate a completely normal Tuesday?', options: ['Dress up at home', 'Go somewhere new', 'Make a silly toast'], followup: 'What are we toasting?' },
  { id: 'm5', stage: 'married', question: 'What feels like the best invitation right now?', options: ['“Come dance”', '“Let’s get away”', '“Tell me everything”'], followup: 'Say the invitation in your own words.' },
];

export type Wish = { id: string; stage: Stage; title: string; pitch: string; details: [string, string] };
export const wishes: Wish[] = [
  { id: 'n1', stage: 'new', title: 'The second-date remix', pitch: 'Plan a date neither of you would have thought to suggest alone.', details: ['Pick a surprising place', 'Pick a surprising activity'] },
  { id: 'n2', stage: 'new', title: 'The question hour', pitch: 'Trade questions you are actually curious about over a snack or a walk.', details: ['Start light and funny', 'Start with a dream'] },
  { id: 'n3', stage: 'new', title: 'The mutual obsession', pitch: 'Each introduce the other to one thing you can talk about for hours.', details: ['Music exchange', 'Favorite place exchange'] },
  { id: 'n4', stage: 'new', title: 'The mini adventure', pitch: 'Take one tiny detour together and see where it goes.', details: ['Before dinner', 'After dinner'] },
  { id: 't1', stage: 'together', title: 'Our first date, upgraded', pitch: 'Recreate an early date with one new twist.', details: ['Same place, new question', 'New place, same ritual'] },
  { id: 't2', stage: 'together', title: 'The no-phone hour', pitch: 'Give each other one undistracted hour.', details: ['At home', 'Out on a walk'] },
  { id: 't3', stage: 'together', title: 'The secret itinerary', pitch: 'One person plans a small surprise; the other adds the final stop.', details: ['You choose the start', 'Your partner chooses the start'] },
  { id: 't4', stage: 'together', title: 'The new-thing pact', pitch: 'Be beginners at something together, with zero pressure to be good.', details: ['Try a recipe', 'Try a class or video'] },
  { id: 'm1', stage: 'married', title: 'The ordinary-night takeover', pitch: 'Turn a familiar evening into a date with an intentional start and finish.', details: ['Dress up at home', 'Take a sunset walk'] },
  { id: 'm2', stage: 'married', title: 'The appreciation exchange', pitch: 'Trade three specific things you noticed about each other lately.', details: ['Write tiny notes', 'Say them over dessert'] },
  { id: 'm3', stage: 'married', title: 'The memory remix', pitch: 'Revisit a favorite memory, then imagine the next chapter.', details: ['Start with a photo', 'Start with a song'] },
  { id: 'm4', stage: 'married', title: 'The two-person escape', pitch: 'Protect a little time that belongs only to the two of you.', details: ['A morning café', 'An evening in'] },
];

export type Mystery = { id: string; stage: Stage; scene: string; clueA: string; clueB: string; question: string; options: [string, string, string]; answer: number; hint: string; resolution: string };
export const mysteries: Mystery[] = [
  { id: 'n1', stage: 'new', scene: 'A date-night invitation arrives with the location missing.', clueA: 'The note says: “Where stories live, but no one asks you to whisper.”', clueB: 'Your map shows a bookshop, a movie theater, and a library. Only one hosts a late reading tonight.', question: 'Where are you meeting?', options: ['The movie theater', 'The bookshop', 'The library'], answer: 1, hint: 'Look for stories and a place where talking is welcome.', resolution: 'You meet at the bookshop. Now pick the book each of you would recommend.' },
  { id: 'n2', stage: 'new', scene: 'At the bookshop, a card points to the next stop.', clueA: 'It reads: “The next place has a view and serves something sweet.”', clueB: 'The options nearby are a rooftop ice-cream stand, a basement bakery, and a riverside taco truck.', question: 'What is your next stop?', options: ['Rooftop ice cream', 'Basement bakery', 'Riverside tacos'], answer: 0, hint: 'It needs both a view and something sweet.', resolution: 'Rooftop ice cream it is. Tell each other your most controversial flavor opinion.' },
  { id: 'n3', stage: 'new', scene: 'The last envelope asks for your next move.', clueA: 'It says: “Choose what gives you more time to talk.”', clueB: 'The street performer finishes in two minutes. The boardwalk stays open for an hour. The rides close now.', question: 'How do you end the night?', options: ['Watch the performer', 'Walk the boardwalk', 'Run to the rides'], answer: 1, hint: 'Which option actually leaves room for a conversation?', resolution: 'You take the long way home. Each ask one question you really want answered.' },
  { id: 't1', stage: 'together', scene: 'An old ticket stub appears in your date-night envelope.', clueA: 'The ticket is stamped with the night you first stayed out too late.', clueB: 'Three places are on the list: your usual takeout spot, the venue from that night, and a new café.', question: 'Where does the trail start?', options: ['The takeout spot', 'The old venue', 'The new café'], answer: 1, hint: 'The stamp points to a place with a shared memory.', resolution: 'Back to the old venue. Each tell one detail you remember differently.' },
  { id: 't2', stage: 'together', scene: 'A clue asks you to find something you can both add to.', clueA: '“It has no last page and can hold a hundred tiny memories.”', clueB: 'On the table: a framed photo, a shared notebook, and a sealed postcard.', question: 'Which object unlocks the next clue?', options: ['The framed photo', 'The shared notebook', 'The postcard'], answer: 1, hint: 'Choose something you can keep adding to.', resolution: 'The notebook opens. Give your next date a one-line title.' },
  { id: 't3', stage: 'together', scene: 'The final card says the best surprise is still unwritten.', clueA: '“Pick a plan that neither of you has tried.”', clueB: 'Your options are your usual movie, an old favorite restaurant, or a beginner dance class.', question: 'What does the card point to?', options: ['The usual movie', 'The favorite restaurant', 'The dance class'], answer: 2, hint: 'Which plan is new for both of you?', resolution: 'You pick the dance class. Describe the first song you hope plays.' },
  { id: 'm1', stage: 'married', scene: 'An invitation says to take a break from the usual route.', clueA: '“Start where we can sit side by side without a to-do list.”', clueB: 'The options: a grocery aisle, a quiet café, or the garage.', question: 'Where does the trail begin?', options: ['The grocery aisle', 'The quiet café', 'The garage'], answer: 1, hint: 'Look for a place that makes room for just the two of you.', resolution: 'At the café, order the imaginary drink your partner would invent for you.' },
  { id: 'm2', stage: 'married', scene: 'A second note is tucked under the café napkin.', clueA: '“Find a thing we made together that can grow.”', clueB: 'There is a souvenir magnet, a blank shared journal, and an old receipt.', question: 'Which item holds the next clue?', options: ['The magnet', 'The journal', 'The receipt'], answer: 1, hint: 'Which one can keep growing with you?', resolution: 'The journal asks for the best part of this week. Trade answers.' },
  { id: 'm3', stage: 'married', scene: 'The last note gives you the night back.', clueA: '“Choose a plan that feels like a date, even if it’s small.”', clueB: 'You could finish chores, scroll separately, or make a two-person playlist and slow dance if you both want.', question: 'Which plan completes the trail?', options: ['Finish chores', 'Scroll separately', 'Make a playlist'], answer: 2, hint: 'Look for the choice you can enjoy together.', resolution: 'The playlist is yours. Name its first track, real or imaginary.' },
];
