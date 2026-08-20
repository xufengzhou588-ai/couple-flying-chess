# GitHub Actions App Store Upload

Date: 2026-08-21

This project can try an App Store Connect upload through GitHub Actions using the `macos-26` runner and Xcode 26.

## Why This Exists

The local Mac has Xcode 16.1 and cannot produce the final App Store build required by Apple's current Xcode 26 / iOS 26 SDK upload rule.

The workflow file is:

`/.github/workflows/ios-app-store.yml`

It is manually triggered from GitHub Actions.

## Required GitHub Secrets

Create an App Store Connect API key:

1. App Store Connect
2. Users and Access
3. Integrations
4. App Store Connect API
5. Create key
6. Recommended role: App Manager or Admin
7. Download the `.p8` key once

Add these repository secrets in GitHub:

- `APP_STORE_CONNECT_API_KEY_ID`
- `APP_STORE_CONNECT_ISSUER_ID`
- `APP_STORE_CONNECT_API_KEY_BASE64`

Create the base64 value on macOS:

```bash
base64 -i AuthKey_XXXXXXXXXX.p8 | pbcopy
```

Paste the copied value into `APP_STORE_CONNECT_API_KEY_BASE64`.

## How To Run

1. GitHub repository: `xufengzhou588-ai/couple-flying-chess`
2. Actions
3. iOS App Store
4. Run workflow
5. First run: set `upload_to_app_store` to `false`
6. If archive/export succeeds, run again with `upload_to_app_store` set to `true`

## Expected Output

- An uploaded GitHub artifact named `CoupleFlightChess-AppStore-IPA`
- If upload is enabled, a build should appear in App Store Connect / TestFlight after Apple processing

## Possible Signing Failure

The workflow uses automatic signing with:

- Team ID: `WQ8RHQUVQQ`
- Bundle ID: `com.coupleflyingchess.app`
- App Store Connect API key authentication

If Apple refuses automatic certificate/profile creation from CI, the fallback is manual signing secrets:

- Distribution certificate `.p12`
- P12 password
- App Store provisioning profile `.mobileprovision`

Do not paste these secrets into chat. Add them only to GitHub repository secrets.
