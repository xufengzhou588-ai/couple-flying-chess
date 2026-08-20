# App Store Submission Packet

Date: 2026-08-20

## Build Status

- App name: Couple Flight Chess
- Bundle ID: `com.coupleflyingchess.app`
- Version: `1.0`
- Build: `1`
- Apple Team ID: `WQ8RHQUVQQ`
- Current release commit: `b514814 Prepare App Store release build`
- Local validation: `npm run release:check` passed on 2026-08-20
- Local IPA: `build/AppStoreExport-20260809-000848/App.ipa`

The local IPA was built with Xcode 16.1 / iOS 18.1 SDK. App Store submission now requires Xcode 26 / iOS 26 SDK, so the final upload should be produced by Xcode Cloud or a newer Mac.

## App Information

- Name: Couple Flight Chess
- Subtitle: Romantic board game for couples
- Category: Games
- Secondary category: Lifestyle
- Content rights: The app uses owned/generated visual and audio assets bundled in the app.
- Age rating recommendation: 17+

## Promotional Text

Turn date night into a playful board game with romantic challenges, private room codes, local voices, and cozy couple-focused themes.

## Description

Couple Flight Chess is a romantic board game made for couples. Take turns rolling the dice, move across a richly illustrated board, and reveal playful challenge cards designed for warm, consent-first date nights.

Play together on one device or use optional online room codes to sync a private game between two devices. The app includes Chinese, English, and Spanish text, local character voice clips, sound effects, themed challenge decks, final rewards, and QR-based invite flow.

The experience is designed for adult couples who want a private, lighthearted, and intimate game. Challenges can always be softened, skipped, or replaced with a gentler version.

Features:

- Romantic board game flow for couples
- Local same-device play
- Optional private online room codes
- QR code invite scanning
- Chinese, English, and Spanish localization
- Local human voice clips for character reactions
- Multiple themed challenge decks
- Final reward setup
- Consent-first skip and gentle-version wording

## Keywords

couples,date night,romantic game,board game,relationship,love game,party game,challenge cards,ludo

## Support URL

Use the deployed support page:

`https://couple-flight-chess.netlify.app/support`

If the custom domain is active, use:

`https://cpfly.top/support`

## Privacy Policy URL

Use the deployed privacy policy:

`https://couple-flight-chess.netlify.app/privacy`

If the custom domain is active, use:

`https://cpfly.top/privacy`

## Review Notes

Couple Flight Chess is a romantic board game for adult couples. It supports local play and optional online room-code synchronization. Camera permission is used only to scan invite QR codes. Microphone/video features are not enabled in the current release build.

The app contains mature romantic challenge content, but it is written to be consent-first and non-pornographic. Players can skip or soften challenges at any time.

Suggested test flow:

1. Launch the app.
2. Start a local game from the home screen.
3. Roll the dice and reveal challenge cards.
4. Switch language using the language button.
5. Open invite flow and scan or enter a room code if testing online sync.

## App Privacy Answers

Data collected:

- Contact Info: Email Address, only if the user submits the support form.
- User Content: Support message, only if the user submits the support form.
- Identifiers: Not collected by the app directly for tracking.
- Usage Data: Not collected by the app directly for tracking.
- Diagnostics: Service providers may process technical logs for hosting, support form delivery, and realtime room reliability.

Data use:

- App Functionality: online room synchronization, QR invite flow, support response.
- Customer Support: support form submissions.

Tracking:

- The app does not track users across apps or websites.

Third-party services:

- Supabase: optional realtime room synchronization.
- Netlify: website hosting and support form handling.
- Apple: App Store distribution and any future in-app purchase processing.

## Required Before Final Submission

1. Push local commits through `b514814` to GitHub.
2. Configure Xcode Cloud or use a newer Mac with Xcode 26+ to produce the final build.
3. Upload the Xcode 26 / iOS 26 SDK build to App Store Connect.
4. Confirm App Store Connect metadata, screenshots, privacy answers, age rating, and review notes.
5. Submit to TestFlight first, then submit the build for App Review.
