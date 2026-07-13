# Mac Development Continuation

This document is for continuing development on a Mac and preparing the iOS build.

## Transfer From Windows

Copy the repository or use the source handoff zip from `release/`.

Recommended Mac folder:

```bash
~/Projects/couple-flying-chess-master
```

## First Run On Mac

```bash
npm ci
npm run dev
```

Local dev URL:

```text
http://localhost:5173
```

## Validation Commands

Run before every handoff or iOS sync:

```bash
npm run typecheck
npm run lint
npm run build
```

## iOS Native Shell

Preferred path: Capacitor + Xcode.

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Couple Flight" "com.coupleflight.chess" --web-dir dist
npx cap add ios
npx cap sync ios
npx cap open ios
```

In Xcode:

- Set Team and Bundle Identifier.
- Set deployment target.
- Add app icons.
- Add launch screen.
- Add camera and microphone permission strings.
- Test on a real iPhone.
- Archive and upload to App Store Connect.

## Important App Store Product Decisions

1. Age rating

   This should likely be 17+ due to mature romantic couple content.

2. Content wording

   Keep task wording consensual, intimate, and playful. Avoid pornographic screenshots or App Store metadata.

3. Payments

   If charging for premium decks, date-night passes, or subscriptions inside the app, implement Apple In-App Purchase unless a final US storefront external-payment strategy is approved.

4. Privacy

   If remote rooms, video, analytics, or accounts are added, update privacy labels and the privacy policy.

## Next Engineering Milestones

1. Capacitor iOS project
2. App icon and launch screen
3. iPhone TestFlight build
4. Supabase realtime board sync
5. WebRTC video signaling
6. TURN server configuration
7. Real premium entitlement model
8. Privacy policy and terms pages

