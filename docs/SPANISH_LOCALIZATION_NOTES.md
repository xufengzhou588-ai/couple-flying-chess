# Spanish Localization Notes

Date: 2026-07-24

## Localization Strategy

The Spanish version is not a direct translation of the Chinese content.

For App Store readiness, Spanish was written from the safer US-market product direction:

1. Use the English product tone as the source of intent.
2. Rewrite into natural US/LatAm Spanish.
3. Avoid Chinese sentence structure and literal idioms.
4. Avoid direct translation of the high-risk Level 4–7 Chinese and English tasks.
5. Keep the default Spanish decks romantic, playful, consent-first, and non-explicit.

## Tone Target

Spanish target tone:

- warm
- romantic
- playful
- slightly flirty
- easy to understand for US Spanish speakers
- not pornographic
- not overly formal Castilian Spanish

Preferred region style: neutral US/LatAm Spanish.

## Safety Changes

The Spanish default decks intentionally avoid direct equivalents of:

- private area
- nipple
- suck
- tongue
- underwear
- bare chest
- direct private touch

The Spanish decks keep:

- eye contact
- hand holding
- hugs
- slow kisses
- whispers
- gentle massage
- blindfold/tactile mini-games in safe zones
- clear check-ins
- pass/soften options

## Voice Pack

Spanish local voice clips were generated for:

```text
public/audio/voice/es/male/
public/audio/voice/es/female/
```

Each folder contains:

- `task-trap.mp3`
- `task-collision.mp3`
- `task-bold.mp3`
- `task-kiss.mp3`
- `task-blush.mp3`
- `dice-big-roll.mp3`
- `dice-small-roll.mp3`
- `dice-steady.mp3`
- `dice-hot-streak.mp3`

These clips are enough for local testing. For final commercial release, use a native Spanish speaker or a licensed Spanish voice with commercial rights.

## Recommended Human QA Prompt

When hiring a proofreader, use this brief:

> Please review this Spanish localization for a romantic couples board game targeting US App Store users. The tone should be natural US/LatAm Spanish: playful, warm, flirty, consent-first, and not pornographic. Please flag anything that sounds like literal Chinese/English translation, anything too explicit for public app distribution, and any phrase that feels unnatural to Spanish-speaking couples in the United States.

## Engineering Files Changed

- `src/types/index.ts`
- `src/i18n.ts`
- `src/data/defaultThemes.ts`
- `src/data/gameExperience.ts`
- `src/utils/characterVoice.ts`
- `scripts/check-local-voice-pack.mjs`
- `scripts/generate-elevenlabs-voice-pack.mjs`
- `public/audio/voice/es/male/*.mp3`
- `public/audio/voice/es/female/*.mp3`

