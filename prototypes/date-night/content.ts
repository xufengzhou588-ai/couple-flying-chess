export type Vibe = 'playful' | 'flirty';
export type Stage = 'new' | 'together' | 'married';
export type Mode = 'first-date' | 'mission' | 'double-yes' | 'heart-dice' | 'read-my-mind' | 'wish-auction' | 'date-mystery' | 'after-hours';
export type Branch = 'missed-connection' | 'birthday';
export type Names = [string, string];

export const games: Record<Mode, { title: string; category: string; description: string; time: string }> = {
  'first-date': {
    title: 'First Date, Again', category: 'A little role play', time: '10–15 min',
    description: 'One open seat. Two new identities. Flirt like you just met.',
  },
  mission: {
    title: 'Secret Mission', category: 'A little mischief', time: '5–10 min',
    description: 'You each have a secret assignment. Try not to give yours away.',
  },
  'double-yes': {
    title: 'Double Yes', category: 'A little discovery', time: '5–10 min',
    description: 'Pick what sounds fun. Find the ideas you both secretly love.',
  },
  'heart-dice': { title: 'Heart Dice', category: 'A little chance', time: '5–8 min', description: 'Roll a prompt and a twist. Make the next move your own.' },
  'read-my-mind': { title: 'Read My Mind', category: 'A little discovery', time: '6–10 min', description: 'Guess what your person would pick. The best part is the story after.' },
  'wish-auction': { title: 'Wish Auction', category: 'A little negotiation', time: '8–12 min', description: 'Spend pretend tokens on tiny dates you both actually want.' },
  'date-mystery': { title: 'Date Night Mystery', category: 'A little teamwork', time: '8–12 min', description: 'Two private clues. One shared answer. Solve a night out together.' },
  'after-hours': { title: 'The Slow Burn', category: 'A little heat', time: '8–12 min', description: 'Choose a shared spark in private. Then play out one scene that belongs to you two.' },
};

export const stageLabels: Record<Stage, string> = {
  new: 'Just started dating', together: 'Together a while', married: 'Married',
};

export const stageNotes: Record<Stage, string> = {
  new: 'Keep it curious. Find a surprising common thread.',
  together: 'Bring back what first clicked, and find something new.',
  married: 'Step out of routine and meet each other again.',
};

export const roles = [
  {
    name: 'The bartender', kicker: 'Good listener. Better comeback.',
    setup: 'It’s a quiet night. Someone interesting just took the last open seat. You have nowhere else to be.',
    secret: 'Find out what makes this stranger lose track of time. Work their answer into your invitation at the end.',
    hint: 'Ask one good question, then follow their answer. You don’t need a bartender voice.',
  },
  {
    name: 'The stranger', kicker: 'A little curious. Staying a little longer.',
    setup: 'You came in on a whim. The person behind the bar has your attention. Make up a name if you feel like it.',
    secret: 'Find one unexpected thing you have in common. Bring it back up before you leave.',
    hint: 'Give them something to work with: a tiny story, an opinion, or a question of your own.',
  },
] as const;

export interface Beat {
  label: string;
  title: string;
  prompt: string;
  lead: 0 | 1;
  lines: Record<Vibe, [string, string]>;
  reply: Record<Vibe, [string, string]>;
  followup: string;
}

export function sceneBeats(branch: Branch): Beat[] {
  return [
    {
      label: 'The opening', title: 'Give them a reason to stay.', lead: 0,
      prompt: 'Bartender, break the ice. Stranger, give a little back. Keep it going for a minute or two.',
      lines: {
        playful: ['So, are we celebrating something, or making up a reason?', 'I need a second opinion. Is a midnight pancake run a good idea or an excellent one?'],
        flirty: ['I was about to call it a quiet night. Then you walked in.', 'Are you always this easy to get distracted by, or is this a special occasion?'],
      },
      reply: {
        playful: ['I was going with “Tuesday,” but I’m open to better ideas.', 'Excellent. But I need to know where you stand on extra syrup.'],
        flirty: ['Then I picked a good time to show up.', 'I’d like to say it’s effortless, but I did spend ten minutes choosing this shirt.'],
      },
      followup: 'Pick up on one thing they just said. Ask about that instead of reaching for another line.',
    },
    {
      label: 'The back-and-forth', title: 'A little less small talk.', lead: 1,
      prompt: 'Stranger, ask something you actually want to know. Bartender, answer with a story, then ask it back.',
      lines: {
        playful: ['What’s a tiny hill you’re absolutely willing to die on?', 'What’s something you could talk about for way too long?'],
        flirty: ['What’s your idea of a really good second date?', 'What’s something about you I wouldn’t guess from across the room?'],
      },
      reply: {
        playful: ['Breakfast for dinner deserves more respect. I’m prepared to defend this.', 'Okay, but you’re not allowed to judge me until I finish the story.'],
        flirty: ['Something with time to talk. And a very good reason to stay out a little later.', 'I’ll give you a clue, but you have to take a guess first.'],
      },
      followup: 'Find a shared detail and give it a little attention: “Wait, you too?” works better than a new question.',
    },
    branch === 'missed-connection' ? {
      label: 'The plot twist', title: 'Wait. We’ve matched before.', lead: 0,
      prompt: 'You recognize each other from a dating app a year ago. Neither of you sent the first message. You get a do-over.',
      lines: {
        playful: ['Wait. Were you the one with the very strong opinions about breakfast tacos?', 'So we both went with the bold strategy of saying absolutely nothing.'],
        flirty: ['I think I owe you a first message. Can I try it in person?', 'Apparently I needed a year to come up with “hi.” Worth the wait?'],
      },
      reply: {
        playful: ['That does sound like me. Please tell me the tacos weren’t why you never said hi.', 'Very mysterious of us. Maybe we should try talking this time.'],
        flirty: ['You’ve got my attention now. What were you going to say?', 'Depends. Are you going to make me wait another year to ask me out?'],
      },
      followup: 'Use something you learned in the last round in your second attempt. Make it specific to them.',
    } : {
      label: 'The plot twist', title: 'Two birthdays. Zero plans.', lead: 1,
      prompt: 'You discover it’s both of your birthdays. Neither of you made plans. Invent a very small celebration together.',
      lines: {
        playful: ['Wait, yours too? Okay, we need a cake. Or at least something we can put a candle in.', 'We’ve got one imaginary candle and no plan. What are we wishing for?'],
        flirty: ['I was going to keep my birthday quiet. I’m glad that didn’t work out.', 'I’m starting to think this is a pretty good birthday present.'],
      },
      reply: {
        playful: ['I vote for dessert first and absolutely no singing from the staff.', 'A great story to tell tomorrow. We’re off to a pretty good start.'],
        flirty: ['Me too. I like where this is going.', 'Then let’s make it a night we’ll want to tell the story of.'],
      },
      followup: 'Build a plan together. Each person adds one detail; keep it possible without buying anything.',
    },
    {
      label: 'The invitation', title: 'Leave them with a next time.', lead: 0,
      prompt: branch === 'missed-connection'
        ? 'You got your second chance. Take turns suggesting a date using something the other person mentioned.'
        : 'You’ve planned a birthday. Now take turns suggesting a reason to see each other when it isn’t one.',
      lines: {
        playful: ['I feel like we owe this conversation a part two. What would you pick?', 'Next time, you pick the place. I’ll bring another questionable opinion.'],
        flirty: ['I’d like another hour with you. What should we do with it?', 'I’m going to be a little direct: I’d like to see you again.'],
      },
      reply: {
        playful: ['Pancakes? A walk? Give me your best pitch.', 'Deal. But I’m choosing the snacks.'],
        flirty: ['A walk somewhere quiet. I’m not done getting to know you.', 'Good. I was hoping you’d ask.'],
      },
      followup: 'Either person can change the plan. End with something you both actually like.',
    },
  ];
}

export interface Mission {
  id: string;
  stage?: Stage;
  vibe: 'both' | 'flirty';
  title: string;
  task: string;
  nudge: string;
}

export const missions: Mission[] = [
  { id: 'tiny-trip', vibe: 'both', title: 'Plan a tiny escape', task: 'Get your partner to name a place you could disappear to for one afternoon. Add one fun detail of your own.', nudge: 'You could start with: “If we both had tomorrow off…”' },
  { id: 'first-date', stage: 'together', vibe: 'both', title: 'Bring back a detail', task: 'Get your partner to tell you one small thing they remember from an early date. Share a detail you remember too.', nudge: 'Try: “I just remembered something from when we first started hanging out.”' },
  { id: 'band-name', vibe: 'both', title: 'Start a very bad band', task: 'Get your partner to help name your imaginary two-person band. Agree on your wildly unrealistic first tour stop.', nudge: 'A terrible name is a perfectly good starting point.' },
  { id: 'inside-joke', stage: 'together', vibe: 'both', title: 'Bring back an inside joke', task: 'Work an old inside joke into the conversation naturally. See whether your partner remembers the rest.', nudge: 'A phrase, a place, or a spectacular cooking failure all count.' },
  { id: 'weekend', vibe: 'both', title: 'Make a little plan', task: 'Get your partner to suggest one free thing you could do together this weekend. Add it to your mental shortlist.', nudge: 'Try: “What’s something we keep saying we should do?”' },
  { id: 'soundtrack', vibe: 'both', title: 'Find your soundtrack', task: 'Get your partner to pick a song for this exact moment. Ask why that one made the cut.', nudge: 'You don’t need to play it. A dramatic description counts.' },
  { id: 'superpower', vibe: 'both', title: 'Give them a superpower', task: 'Tell your partner one oddly specific thing they’re great at. Get them to name your superpower in return.', nudge: 'Keep it real: finding good snacks is a valid superpower.' },
  { id: 'food-debate', vibe: 'both', title: 'Settle absolutely nothing', task: 'Start a low-stakes food debate. Get your partner to defend their opinion, then invent a compromise together.', nudge: 'Fries in a milkshake? Breakfast for dinner? Keep it silly.' },
  { id: 'nickname', vibe: 'flirty', title: 'Try a new nickname', task: 'Offer your partner a new, affectionate nickname. Let them approve it, change it, or give you one instead.', nudge: 'Try: “I think I have a new nickname for you. Hear me out.”' },
  { id: 'compliment', vibe: 'flirty', title: 'Make it specific', task: 'Give a compliment about something your partner did recently. Keep it casual enough that it feels like part of the conversation.', nudge: '“I liked how you…” gives you somewhere natural to start.' },
  { id: 'first-move', vibe: 'flirty', title: 'Rewrite the first move', task: 'Ask your partner how they’d start a conversation with you if you met today. Give them your version too.', nudge: 'Let the first attempt be a little ridiculous.' },
  { id: 'dance', vibe: 'flirty', title: 'Float a dance invitation', task: 'Find a natural moment to suggest a 20-second slow dance. If they’d rather stay seated, suggest picking the song together instead.', nudge: 'An invitation is the whole mission. A yes is never required.' },
  { id: 'new-curiosity', stage: 'new', vibe: 'both', title: 'Find a shared rabbit hole', task: 'Find one interest you could both happily lose an hour talking about. Ask a real follow-up.', nudge: '“What could you talk about forever?” is a good start.' },
  { id: 'new-invite', stage: 'new', vibe: 'flirty', title: 'Make the next move', task: 'Work a low-pressure next-date invitation into the conversation. Let your partner change the plan.', nudge: 'Try: “I’d like to see you again. What sounds fun to you?”' },
  { id: 'together-throwback', stage: 'together', vibe: 'both', title: 'A good callback', task: 'Bring up one small thing you loved about an early date, then ask what your partner remembers.', nudge: 'Specific beats grand.' },
  { id: 'together-reinvite', stage: 'together', vibe: 'flirty', title: 'Ask them out again', task: 'Invite your partner on a date as if you had not seen them all week.', nudge: 'Give them a real choice of place or time.' },
  { id: 'married-thanks', stage: 'married', vibe: 'both', title: 'Notice the unnoticed', task: 'Thank your partner for one ordinary thing they did recently. Ask what made their week easier.', nudge: 'No big speech needed.' },
  { id: 'married-reinvite', stage: 'married', vibe: 'flirty', title: 'Break the routine', task: 'Invite your partner to turn a familiar evening into a date, on terms you both like.', nudge: 'Try: “What if we made tonight ours for an hour?”' },
];

export interface DateIdea {
  id: string;
  stage?: Stage;
  vibe: 'both' | 'flirty';
  title: string;
  category: string;
  description: string;
  steps: [string, string, string];
}

export const dateIdeas: DateIdea[] = [
  { id: 'diner', vibe: 'both', title: 'The midnight diner', category: 'Make-believe date', description: 'Turn your kitchen into a late-night diner. Breakfast for dinner is absolutely on the menu.', steps: ['Pick a diner name together.', 'Describe your very specific usual order. Imaginary food is fine.', 'Ask: “Where are we heading after this?” Build the answer together.'] },
  { id: 'playlist', vibe: 'both', title: 'Our three-song soundtrack', category: 'A little nostalgia', description: 'One song for when you met. One for now. One for whatever comes next.', steps: ['Each choose a song that reminds you of meeting.', 'Tell each other the memory behind it.', 'Choose one future song together. No streaming subscription needed.'] },
  { id: 'bad-art', vibe: 'both', title: 'Terrible portraits, great company', category: 'Make each other laugh', description: 'Draw each other in 60 seconds. Artistic talent would honestly ruin this.', steps: ['Grab paper, or use a drawing app you already have.', 'Draw each other for one minute without erasing.', 'Give each portrait an excessively fancy gallery title.'] },
  { id: 'dream-trip', vibe: 'both', title: 'The wildly specific getaway', category: 'Dream a little', description: 'Invent a weekend away with one ridiculous rule you both have to follow.', steps: ['Each pick a destination. Combine them however you like.', 'Make one silly rule, such as dessert at every meal.', 'Find one tiny piece of the trip you could do at home.'] },
  { id: 'pitch', vibe: 'both', title: 'Pitch me the worst movie', category: 'Friendly competition', description: 'You each have one minute to sell the other person on a delightfully terrible movie idea.', steps: ['Pick three random objects in the room.', 'Take turns making them the plot of a movie.', 'Choose your favorite ridiculous line and cast yourselves.'] },
  { id: 'old-photo', vibe: 'both', title: 'One photo, the whole story', category: 'A little nostalgia', description: 'Choose a photo you’re comfortable sharing. Tell the part the camera missed.', steps: ['Each choose one photo, or describe a memory instead.', 'Share what happened just before or after it.', 'Ask one question you’ve never asked about that moment.'] },
  { id: 'taste', vibe: 'both', title: 'The snack critics', category: 'An at-home date', description: 'Give an ordinary snack an absurdly serious restaurant review.', steps: ['Use a snack or drink you already have, or invent one.', 'Each give a 30-second food-critic review.', 'Together, write its most over-the-top menu description.'] },
  { id: 'parallel', vibe: 'both', title: 'Our parallel universe', category: 'Make-believe date', description: 'You run a tiny business together in another life. What is it, and who does what?', steps: ['Choose a bookstore, diner, record shop, or something stranger.', 'Give yourselves jobs based on your actual quirks.', 'Act out your first customer interaction together.'] },
  { id: 'awards', vibe: 'both', title: 'The very unofficial awards', category: 'A little appreciation', description: 'Give each other an award for something small that deserves more credit.', steps: ['Invent a specific award for your partner.', 'Deliver a wonderfully over-the-top acceptance speech.', 'Tell them the real moment that inspired the award.'] },
  { id: 'sunday', vibe: 'both', title: 'Design our perfect Sunday', category: 'Make a little plan', description: 'Trade ideas for a day with no obligations. Keep one small part for this week.', steps: ['Each choose one morning, afternoon, and evening activity.', 'Combine the parts you both like.', 'Pick one free, easy piece you could actually try soon.'] },
  { id: 'meet-cute', vibe: 'flirty', title: 'Meet me for the first time', category: 'A little role play', description: 'Pretend you’re strangers sharing the last table at a café. Someone has to say hi.', steps: ['Choose who arrived first. Make up names if you like.', 'Try: “I promise I’m a better tablemate than I look before coffee.”', 'Talk for two minutes. End by suggesting your imaginary next date.'] },
  { id: 'slow-dance', vibe: 'flirty', title: 'The living-room slow dance', category: 'A little closeness', description: 'One song, just the two of you. Fancy footwork is very much optional.', steps: ['Pick a song, hum one, or enjoy the quiet.', 'Invite each other to dance, sway, or sit close—whatever you both want.', 'After a minute, share one thing you appreciate about tonight.'] },
  { id: 'love-note', vibe: 'flirty', title: 'The three-line love note', category: 'Say the good stuff', description: 'A tiny note with one memory, one compliment, and one invitation.', steps: ['Start with: “I still think about the time…”', 'Add one specific thing you love about them.', 'Finish with an invitation for something you could do together. Read it aloud if you like.'] },
  { id: 'movie-scene', vibe: 'flirty', title: 'Our rom-com scene', category: 'A little role play', description: 'You’re the leads in a romantic comedy. Improvise the scene where one of you finally makes a move.', steps: ['Choose a rainy bus stop, a bookstore, or a wedding reception.', 'Each choose one charmingly inconvenient character trait.', 'Play for two minutes. A sincere compliment makes a perfectly good ending.'] },
  { id: 'take-lead', vibe: 'flirty', title: 'You plan the next five minutes', category: 'A little surprise', description: 'One of you proposes a tiny date. The other gets to add a twist.', steps: ['Suggest a short activity using only what’s already around you.', 'Let your partner change one part of the plan.', 'Try your shared version, then switch who takes the lead.'] },
  { id: 'callback', vibe: 'flirty', title: 'Our first date, with a twist', category: 'A little nostalgia', description: 'Revisit an early date. This time, say the nice thing you were too nervous to say.', steps: ['Set the scene together: where were you, and what do you remember?', 'Take turns saying what you were secretly hoping would happen.', 'End with one thing you’d tell your past self about the two of you now.'] },
  { id: 'new-exchange', stage: 'new', vibe: 'both', title: 'Trade your favorite corners', category: 'Get to know you', description: 'Each pick one local place you would love to show the other.', steps: ['Describe the place and why you like it.', 'Let your partner ask one question.', 'Choose one you could actually visit together.'] },
  { id: 'new-opener', stage: 'new', vibe: 'flirty', title: 'The better first hello', category: 'A little flirting', description: 'Try the opening line you wish you had used.', steps: ['Pretend you just spotted each other across a room.', 'Each try a sincere or ridiculous opener.', 'Choose the one that earns a real smile.'] },
  { id: 'together-surprise', stage: 'together', vibe: 'both', title: 'The surprise hour', category: 'Refresh the routine', description: 'Each plan 30 minutes the other would enjoy, using what you already have.', steps: ['Name one thing your partner likes.', 'Pitch your tiny surprise.', 'Combine both pitches into one hour.'] },
  { id: 'together-callback', stage: 'together', vibe: 'flirty', title: 'Ask me out again', category: 'A little flirting', description: 'Invite your person somewhere as if you have a crush on them all over again.', steps: ['Choose a real or imaginary place.', 'Make the invitation specific.', 'Let your partner add one twist.'] },
  { id: 'married-night', stage: 'married', vibe: 'both', title: 'The ordinary night, upgraded', category: 'A date at home', description: 'Turn one familiar evening into intentional time for two.', steps: ['Pick a routine evening.', 'Give it a start ritual and a small surprise.', 'Agree on one moment without distractions.'] },
  { id: 'married-first-date', stage: 'married', vibe: 'flirty', title: 'Meet me again', category: 'A little flirting', description: 'Invite your spouse out as if this is your first date, with the advantage of knowing what they love.', steps: ['Choose a place they would genuinely like.', 'Ask them out in your own words.', 'Tell them what you still look forward to learning.'] },
];

export function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Prefer unseen cards; only recycle after eligible unseen content is exhausted.
export function drawFresh<T extends { id: string }>(items: T[], seen: Set<string>, count: number): T[] {
  const fresh = shuffled(items.filter(item => !seen.has(item.id)));
  const recycled = shuffled(items.filter(item => seen.has(item.id)));
  return [...fresh, ...recycled].slice(0, count);
}

export function mutualIdeas(deck: DateIdea[], first: Record<string, boolean>, second: Record<string, boolean>): DateIdea[] {
  return deck.filter(idea => first[idea.id] === true && second[idea.id] === true);
}
