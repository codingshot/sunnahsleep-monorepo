# Agent guidance: Sunnah Sleep monorepo

## Repo purpose

- **sunnah-sleep-pwa:** Source web PWA (React + Tailwind).
- **sunnahsleep-expo:** Target React Expo mobile app. Must reach **feature parity** with the PWA and use **NativeWind** for styling (Tailwind for React Native).

## How to trigger migration

To start or resume the PWA → Expo migration, use the exact prompts in **docs/TRIGGER_MIGRATION.md**. Options: **Full run** (discovery + implement in order + verify + mark checklist); **Next batch** (pick next unchecked section, implement with NativeWind, verify, mark [x]); **Single section** (migrate one checklist section); **Verify only** (re-run "How to verify" for a section). Do not mark a checklist row [x] without running its "How to verify" steps.

## When working on the Expo app

1. **Styling:** Use NativeWind only — `className` with Tailwind-style classes. No `StyleSheet` or inline styles for layout/theme. See `.cursor/rules/expo-nativewind.mdc`.
2. **Migration:** When implementing or testing a PWA feature in Expo, use `docs/FEATURE_PARITY_CHECKLIST.md`. Mark a feature complete only after running its "How to verify" steps. Follow `docs/MIGRATION_METHODOLOGY.md` for process and stack mapping.
3. **New features:** If you add a user-facing feature, add a row to the checklist (or the Discovery template in §11) with PWA location (if applicable), Expo location, and verification steps.

## Key docs

- **Trigger migration:** `docs/TRIGGER_MIGRATION.md` — copy-paste prompts to run full migration, next batch, or single section.
- **Methodology:** `docs/MIGRATION_METHODOLOGY.md` — how to convert PWA → Expo, NativeWind setup, feature discovery, recommended order.
- **Checklist:** `docs/FEATURE_PARITY_CHECKLIST.md` — every feature, verification steps, status, pre-flight, discovery commands. Single source of truth for "done."

## Quick verification

- Run Expo: `cd sunnahsleep-expo && npx expo start`
- After changes, run the checklist verifications for the sections you touched and update statuses.
