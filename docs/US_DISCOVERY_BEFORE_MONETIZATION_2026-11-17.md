# US discovery before monetization — 2026-11-17

## Decision

Keep the US App Store app free while we publish and measure the four couples mini games. Do not use a paid unlock as the next growth step. China storefront distribution is outside this plan.

## Verified starting point

- The public US listing is **Couple Game: Flight Chess**, version 1.1, free. The four Midnight Flirt mini games are in TestFlight build 10, not in the public listing.
- Apple's public Search API returned the app first for its full current name. In checks on 2026-11-17, broad US English searches including `couple game`, `couples games`, `games for couples`, and `date night games` did not reliably return it. The API is a directional check, not a substitute for testing App Store search on a US-region iPhone.
- The current product page foregrounds one board game. Its first screenshots and description do not yet present the four-game collection.

## Draft for the next US public version

Use this only after the public binary includes the four mini games and the screenshots show the same experience.

| Field | Draft | Limit check |
| --- | --- | --- |
| Name | `Couples Games: Flight Chess` | 27/30 characters |
| Subtitle | `Flirty Date Night for Two` | 25/30 characters |
| Keywords | `romantic,relationship,partner,intimate,ludo,challenge,icebreaker,spicy,roleplay,sketch,mystery,kiss` | 99/100 bytes |

The name introduces the familiar US search phrase `couples games` while retaining `Flight Chess`. The subtitle explains the use case. The keyword field covers features the public update must actually contain and avoids repeating words from the proposed name and subtitle. These edits can improve text relevance; they cannot guarantee rank.

The first screenshot should show the collection and its distinct games. The next two should show an actual Chemistry Dice turn and a playful scene or Flight Chess challenge. Use only captured UI from the release candidate. Rewrite the description to lead with the choice of five games, one-phone play, and the separate remote Flight Chess option. Do not advertise remote play for mini games until it exists.

## How users download before broad search works

Share the existing [US App Store product link](https://apps.apple.com/us/app/couple-game-flight-chess/id6799199803) in the product website, couples-focused short demos, and partner invitations. Use campaign links where possible so App Store Connect Analytics can separate web and app referrals from App Store search. A direct link already opens the real public listing; TestFlight builds do not replace that listing.

## Release and measurement order

1. Finish a public release candidate with the mini games, matching US metadata, and screenshots. Verify the English copy and the first three screenshots on an actual US-region iPhone.
2. Publish the free update. Then test the full name and specific intent phrases such as `couples dice game`, `date night board game`, and `spicy couples game` on US-region devices. Record the device, region, date, query, and approximate position. Do not treat one API query as a stable ranking.
3. In App Store Connect Analytics, compare US App Store search, web referrals, product page views, downloads, and conversion. Also collect real couple feedback on whether they complete a game and would replay it.
4. Choose a paid content pack only after there is evidence that couples find, install, and enjoy the free experience. Then implement Apple purchase, restore, and entitlement handling, expand premium content, and test the purchase flow on device. The first In-App Purchase must accompany a new app version for review.

## Current account blocker

On 2026-11-17 the App Store Connect API returned `A required agreement is missing or has expired` for app and build requests. This does not identify which agreement needs attention. The Account Holder should inspect **Business → Agreements** and complete the item shown there before paid setup or another submission is planned.

## Apple references

- [App Store search](https://developer.apple.com/app-store/search/) — title, subtitle, keywords, category, and user behavior affect discovery; promotional text does not affect search ranking.
- [Creating your product page](https://developer.apple.com/app-store/product-page/) — the first screenshots can appear in search results.
- [Acquisition analytics](https://developer.apple.com/help/app-store-connect-analytics/acquisition/acquisition) — search, referrals, views, downloads, and conversion.
- [Submit an In-App Purchase](https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-in-app-purchase) — a first purchase of each type must be submitted with a new app version.
