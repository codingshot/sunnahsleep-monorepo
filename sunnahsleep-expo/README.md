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
- **Home** — Greeting (i18n), shortcuts to Log sleep / Alarms / Duas / Prayer, last night summary vs goal
- **Sleep** — Log bedtime/wake time; edit/delete; history; stats and 7d/30d/All filter
- **Alarms** — Add/edit/remove/toggle; time validation; daily notifications; **Snooze 5 min** and **Dismiss** actions
- **Duas** — Bedtime duas, search, favorites, All | Favorites filter
- **Prayer** — Today's prayer times (Aladhan API), **Qibla** angle/direction; location-based or fallback
- **Settings** — Notifications, **use device location for prayer times**, **Language (English / العربية)**, sleep goal, export data, reset onboarding, clear all data, about/version

Background fetch refreshes prayer times cache when the app is in the background.

All UI uses NativeWind and `constants/theme.ts` for PWA-style parity. Data is in AsyncStorage; full reset clears everything and returns to onboarding.

## Test / verify

```bash
npm run test   # TypeScript check (tsc --noEmit)
npm start      # Expo dev server; test on device/simulator
```

Manual verification: use `docs/FEATURE_PARITY_CHECKLIST.md` in the repo root — run the "How to verify" steps for each section and confirm behavior.
