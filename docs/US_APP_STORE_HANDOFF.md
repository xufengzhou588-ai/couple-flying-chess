# Couple Flight Chess - US App Store Handoff

Date: 2026-07-01

## Current Readiness

This project is ready as a production web build, but it is not yet ready for direct US App Store submission.

The missing App Store layer is the iOS native wrapper and submission work:

- Xcode iOS project
- App icon, launch screen, screenshots, metadata
- Camera and microphone permission strings
- Privacy Nutrition Label answers
- Privacy manifest review for native SDKs
- Age rating and content positioning
- In-app purchase or external purchase strategy
- TestFlight QA on real iPhones

## Recommended Packaging Path

Use Capacitor on Mac to wrap the Vite build in a native iOS app.

Suggested product identity:

- App name: Couple Flight
- Chinese name: 情侣飞行棋
- Bundle ID: `com.coupleflight.chess`
- Category: Games or Lifestyle
- Minimum iOS target: iOS 16+
- Primary market: US App Store
- Age rating: likely 17+ because the app contains mature romantic couple content

## Mac Setup

```bash
cd couple-flying-chess-master
npm ci
npm run typecheck
npm run lint
npm run build
```

Then install Capacitor:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Couple Flight" "com.coupleflight.chess" --web-dir dist
npx cap add ios
npx cap sync ios
npx cap open ios
```

After each web change:

```bash
npm run build
npx cap sync ios
```

## Required iOS Permission Text

Add these to `Info.plist` in Xcode:

```xml
<key>NSCameraUsageDescription</key>
<string>Camera access lets partners see each other during invite and long-distance play.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Microphone access lets partners hear each other during invite and long-distance play.</string>
```

Chinese localization can be added later:

```xml
<key>NSCameraUsageDescription</key>
<string>用于异地互动时显示双方视频画面。</string>
<key>NSMicrophoneUsageDescription</key>
<string>用于异地互动时进行语音交流。</string>
```

## App Store Review Notes

Apple review will care about:

- The app must be complete and stable, not just a web page shell.
- All mature couple content should be consensual, non-explicit in screenshots, and clearly positioned for adult couples.
- If paid features unlock game content, use Apple In-App Purchase unless a final legal/payment strategy says otherwise.
- If camera/microphone/remote rooms are present, the app must explain why they are used.
- App Privacy answers must match actual data handling.

Apple official references checked on 2026-07-01:

- App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- App Privacy Details: https://developer.apple.com/app-store/app-privacy-details/
- App Store Connect submission overview: https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/overview-of-submitting-for-review

Key implications:

- Digital premium content, subscriptions, game levels, and feature unlocks generally require In-App Purchase in the app.
- US storefront apps have more flexibility around external purchase links, but the final payment model still needs legal/product review before submission.
- Privacy labels must describe the app and third-party SDK data practices accurately.
- Apple review expects a complete, stable app bundle with accurate metadata and live backend services if those features are present.

## Current Product State

Completed:

- Bilingual Chinese/English UI
- iPhone-focused responsive gameplay
- Romantic board art and task-card illustrations
- WebP-optimized assets
- Task-card image preloading
- Local same-device gameplay
- Dice sound, ambient music, character reactions
- Chinese/English speech synthesis cues
- Final reward setup and winner flow
- Premium preview entry
- Invite partner entry
- Local camera preview bubble

Partially complete:

- Remote invite: room-code UX exists; real-time sync is not live yet.
- Video: local preview exists; remote partner video needs WebRTC signaling and TURN.
- Monetization: product concept exists; no real IAP implementation yet.

Not complete:

- Native iOS app target
- App Store Connect metadata
- TestFlight build
- Real remote multiplayer
- Real remote video/audio
- Account system
- Payment or subscription implementation
- Privacy policy page
- Terms of use page

## Supabase Remote Room Variables

The repository includes `.env.example`:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

When these values are configured, the invite UI can detect that realtime room infrastructure is available. The actual board-state sync still needs to be implemented.

## Pre-Submission Checklist

- Run the web app on iPhone Safari.
- Run the Capacitor app on iPhone through Xcode.
- Confirm camera/microphone permission prompts show correct text.
- Confirm no blank screens without network.
- Confirm task-card images load instantly after first app open.
- Confirm Chinese and English language switching works.
- Confirm audio starts only after user interaction.
- Confirm mature screenshots are tasteful and non-explicit.
- Create a privacy policy and terms page.
- Decide monetization: IAP, subscription, one-night pass, or US external purchase flow.
- Submit to TestFlight before App Review.
