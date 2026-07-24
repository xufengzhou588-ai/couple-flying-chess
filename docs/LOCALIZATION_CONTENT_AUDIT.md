# Localization and App Store Content Audit

Date: 2026-07-24

## Executive Summary

The current Chinese and English product copy is usable for internal testing and web play, but it is not yet safe enough for a US App Store submission without a content pass.

The main issue is not translation accuracy. The English UI is mostly natural and intentionally playful. The risk is content rating and review positioning: the built-in Level 4–7 decks contain direct sexual/body-part instructions, and those decks are visible as default product content.

Recommended direction for the US App Store:

1. Create an App Store-safe default deck set.
2. Keep the tone romantic, playful, consent-first, and non-explicit.
3. Rewrite or hide Level 4–7 content for the App Store build.
4. Add Spanish before French if only one new language is added first.
5. Use third-party proofreading after the product-safe English rewrite, not before.

Official Apple references to check before submission:

- App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- App Store Connect age ratings: https://developer.apple.com/help/app-store-connect/reference/age-ratings/
- Apple localization guidance: https://developer.apple.com/localization/

## Content Inventory Reviewed

Visible or review-relevant content currently lives mainly in:

- `src/i18n.ts`
  - 173 Chinese UI strings
  - 173 English UI strings
- `src/data/defaultThemes.ts`
  - 7 Chinese default decks, 174 Chinese default tasks
  - 7 English default decks, 174 English default tasks
- `src/data/gameExperience.ts`
  - 8 Chinese final rewards
  - 8 English final rewards
  - dice reactions and milestone text
- `src/utils/characterVoice.ts`
  - fixed local voice line mapping
- `scripts/generate-elevenlabs-voice-pack.mjs`
  - fixed voice generation text
- `docs/`
  - App Store handoff, Mac continuation, voice-pack documentation

## Translation Quality Findings

### Chinese UI

Status: Good for native Chinese users.

The Chinese tone is coherent: romantic, playful, and product-like. It does not feel like machine translation. Some terms are more China-market style than US-market style, but that is fine for Chinese localization.

Potential improvements:

- Use fewer highly suggestive terms in App Store-facing screenshots.
- Keep "情趣" out of public metadata unless the final age rating and positioning intentionally support it.

### English UI

Status: Mostly natural, but intentionally edgy.

Good examples:

- "For couples who still know how to make each other blush"
- "Keep it fun and mutual. Soften it, skip it, or trade it for a hug anytime."
- "Same couch now, long-distance rooms next"

Potential issues:

- "Dare Deck" is understandable, but it makes the product feel like a party dare app rather than a romantic board game. Safer alternative: "Card Deck" or "Challenge Deck".
- "Tap to reveal your questionable life choice" is funny, but may feel too meme-like for polished App Store positioning.
- "Chicken Out" can sound shaming. Safer alternative: "Skip: Back to Start".
- "After Dark" is attractive but signals mature content strongly. This is fine for a mature app, risky for public screenshots.

Recommended English positioning:

- Use "romantic challenges" for public-facing copy.
- Use "dare" sparingly in App Store metadata.
- Keep consent copy visible and warm.

## Default Deck Risk Review

### Summary by deck

| Deck | Risk for US App Store | Notes |
| --- | --- | --- |
| `spark` / 心跳破冰 | Low | Safe, romantic, good onboarding deck. |
| `wine` / 微醺升温 | Low-Medium | Mostly safe; blindfold/prop wording should stay mild. |
| `mischief` / 身体试探 | Medium-High | Many body-touch tasks; needs rewrite for App Store-safe default content. |
| `afterdark` | High | Contains direct private-area and nipple wording. |
| `tease` | High | Contains direct sexual body-part interaction. |
| `deep-love` | Very High | Too explicit for default visible content. |
| `private-boundary` | Very High | Too explicit for App Store default content. |

### Keyword scan

The risk is concentrated in direct-body-action terms:

- English: `private area`, `nipple`, `suck`, `tongue`, `underwear`, `bare chest`, `directly`
- Chinese: `私处`, `胸尖`, `含住`, `轻吸`, `舌尖`, `内衣`, `脱掉`, `直接`

These are not translation mistakes. They are content-rating and review-positioning risks.

## Final Rewards Review

### Low-risk rewards

- Winner’s Kiss / 赢家之吻
- Five-Star Service / 专属放松
- Next Date Draft Pick / 下次约会权
- Morning-After Perks / 明早服务
- Wardrobe Privileges / 造型决定权
- Wild Card / 神秘通行证

### Medium-risk rewards

- Favorite Place / 身体偏爱
- Tonight’s Wish / 今晚心愿

These can remain if rewritten slightly softer:

- "Favorite Place" → "Favorite Kind of Attention"
- "Pick one mutually approved body area..." → "Pick one mutually approved way to receive attention for 60 seconds."
- "Name one intimate wish..." → "Name one romantic wish. Your partner chooses the gentle version."

## Voice Line Review

Status: Generally safe.

The fixed voice lines are short and not explicit. The English female voice generation text is flirtier than the displayed text, but still within a soft romantic tone.

Potential issue:

- Documentation still lists older English female voice text without the added pauses used for generation. This is harmless technically, but the docs should be updated before handoff.

## Documentation Review

Several docs are now partially outdated:

- `docs/US_APP_STORE_HANDOFF.md`
  - Says native iOS target is not complete, but the project now has Capacitor/iOS work.
  - Says "speech synthesis cues", but the product now uses local human voice files.
- `docs/MAC_DEVELOPMENT_CONTINUATION.md`
  - Still reads like a Windows-to-Mac handoff rather than current Mac development status.
- `docs/WINDOWS_DELIVERY_MANIFEST.md`
  - Old deployment state and voice status.
- `docs/LOCAL_VOICE_PACK.md`
  - Useful, but should be updated with the latest ElevenLabs style settings and new generated English female text.

Recommendation: before App Store submission, replace older progress docs with one current `APP_STORE_READINESS.md`.

## Third-Party Verification Recommendation

Use tools in this order:

1. Product rewrite first
   - Do not pay a translator to polish content that may later be removed for App Store safety.
2. AI/grammar pass
   - Grammarly, LanguageTool, or DeepL Write for English naturalness.
3. Human review
   - US native proofreader for English.
   - Ask specifically for: "romantic couple game, playful but App Store-safe, not pornographic."
4. Optional legal/content review
   - Needed if keeping explicit Level 4–7 content in the App Store build.

## French vs Spanish Recommendation

If adding only one new language first, add Spanish first.

Why Spanish first:

- Better fit for US App Store audience expansion.
- Larger practical audience inside the United States.
- Easier to position as a US-market localization.
- Spanish romantic/flirty tone can stay warm without sounding as formal as French can if translated too literally.

Add French second if targeting Canada, France, Belgium, Switzerland, or a broader European launch.

## What Adding Spanish or French Requires

The app currently supports only:

```ts
export type Locale = 'zh' | 'en';
```

To add Spanish or French properly, update:

1. `src/types/index.ts`
   - Add `es` or `fr` to `Locale`.
2. `src/i18n.ts`
   - Add 173 UI strings.
   - Add locale switch label.
3. `src/data/defaultThemes.ts`
   - Add 7 decks and 174 tasks.
   - Prefer App Store-safe rewritten content, not direct translation of current Level 4–7.
4. `src/data/gameExperience.ts`
   - Add 8 final rewards, dice reactions, milestone text.
5. `src/utils/characterVoice.ts`
   - Add voice mappings and local audio paths.
6. `scripts/check-local-voice-pack.mjs`
   - Expect new locale voice files.
7. `scripts/generate-elevenlabs-voice-pack.mjs`
   - Add new locale lines and voice IDs.
8. `public/audio/voice/{es|fr}/male/`
9. `public/audio/voice/{es|fr}/female/`
10. App Store metadata
   - Localized app name, subtitle, description, keywords, screenshots, privacy/support URLs if localized.

## Recommended Next Step

Do not add Spanish/French on top of the current explicit deck set yet.

Best next step:

1. Create a US App Store-safe English deck set.
2. Align Chinese with the safer product structure.
3. Then translate that safer source into Spanish.
4. Generate Spanish voice files.
5. Run local QA and App Store metadata review.

This avoids translating content that may later need to be removed.

