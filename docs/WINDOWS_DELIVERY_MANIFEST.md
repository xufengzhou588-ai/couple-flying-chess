# Windows Delivery Manifest

Date: 2026-07-01

## Built Artifacts

The Windows side can produce:

- `dist/` - Vite production web build
- `release/couple-flight-web-dist-20260701.zip` - production web assets
- `release/couple-flight-source-handoff-20260701.zip` - source handoff for Mac

## Verification

Run:

```bash
npm run typecheck
npm run lint
npm run build
```

Latest local status:

- TypeScript: pass
- ESLint: pass
- Vite build: pass

## Current Live Site

```text
https://couple-flight-chess.netlify.app
```

Latest successful deployed version before this handoff includes:

- Chinese speech restored
- WebP asset optimization
- Task-card preload
- Romantic illustration series
- Random visual selection by task type

The later remote-room status UI is implemented locally but may not be live if Netlify account credits are exhausted.

