# Sunnah Sleep (Expo)

React Native Expo app for Sunnah Sleep — sleep tracking, alarms, and bedtime duas. Built with **Expo Router** and **NativeWind** (Tailwind for React Native).

## Run

```bash
npm install
npx expo start
```

Then scan the QR code with Expo Go (iOS/Android) or press `i` / `a` for simulator.

## Structure

- **app/** — Expo Router screens: `index` (redirect), `onboarding`, `(tabs)` (Home, Sleep, Alarms, Duas, Prayer, Settings)
- **lib/storage.ts** — AsyncStorage for sleep, alarms, favorites, location, locale, prayer cache
- **components/** — Shared UI (from template)
- **tailwind.config.js** + **global.css** — NativeWind (Tailwind) config

## Features

- Onboarding (first launch only); respects system “Reduce motion”
- **Home** — Greeting (i18n), shortcuts to Log sleep / Alarms / Duas / Prayer, last night summary vs goal; pull-to-refresh
- **Sleep** — Log bedtime/wake time; edit/delete; history; stats and 7d/30d/All filter; pull-to-refresh; KeyboardAvoidingView for forms
- **Alarms** — Add/edit/remove/toggle; time validation; daily notifications; **Snooze 5 min** and **Dismiss** actions; KeyboardAvoidingView for add/edit form
- **Duas** — Bedtime duas, search, favorites, All | Favorites filter; pull-to-refresh
- **Prayer** — Today's prayer times (Aladhan API), **Qibla** angle/direction; location-based or fallback; pull-to-refresh
- **Settings** — Notifications, **use device location for prayer times**, **Language (English / العربية)**, sleep goal, export data, reset onboarding, clear all data, about/version

Tab bar titles follow app language (i18n). Background fetch refreshes prayer times cache when the app is in the background.

All UI uses NativeWind and `constants/theme.ts` for PWA-style parity. Data is in AsyncStorage; full reset clears everything and returns to onboarding.

## Test / verify

```bash
npm run test   # TypeScript check (tsc --noEmit)
npm start      # Expo dev server; test on device/simulator
```

Manual verification: use `docs/FEATURE_PARITY_CHECKLIST.md` in the repo root — run the "How to verify" steps for each section and confirm behavior.

## App Store & Play Store

The app is configured for submission to **Apple App Store** and **Google Play Store**:

- **app.json** — App name "Sunnah Sleep", `ios.bundleIdentifier` and `android.package` (`com.sunnahsleep.app`), version/build numbers, permissions, and notification/location plugins.
- **eas.json** — EAS Build profiles (development, preview, production) and submit placeholders. Fill in your Apple ID, App Store Connect app ID, team ID, and (for Android) service account path before running submit.
- **store.config.json** — Store metadata (privacy policy URL, category, descriptions). Replace `YOUR_ORG` and the privacy policy URL with your hosted policy link.
- **PRIVACY_POLICY.md** — Privacy policy text. Host this at a public URL and set that URL in the store consoles and in `store.config.json`.
- **docs/STORE_LISTING.md** — Checklist, build/submit commands, and suggested store copy for both stores.

**Build and submit (requires [EAS CLI](https://docs.expo.dev/eas/) and an Expo account):**

```bash
npm run build:ios       # or build:android / build:all
npm run submit:ios      # or submit:android (after configuring eas.json)
```

See `docs/STORE_LISTING.md` for prerequisites (Apple/Google developer accounts, icons, screenshots) and step-by-step guidance.
