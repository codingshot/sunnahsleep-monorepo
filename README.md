# Sunnah Sleep monorepo

Convert the **Sunnah Sleep PWA** (web app) into a **React Expo mobile app** with feature parity, styled with **NativeWind** (Tailwind for React Native).

## Structure

- **sunnah-sleep-pwa/** — Source web PWA (React, Tailwind).
- **sunnahsleep-expo/** — Target Expo app (React Native, NativeWind).
- **docs/** — Migration methodology and feature parity checklist.

## Migration

1. **To trigger migration:** Use the prompts in **docs/TRIGGER_MIGRATION.md** (full run, next batch, or single section).
2. Read **docs/MIGRATION_METHODOLOGY.md** for the conversion process, stack mapping, and recommended order.
3. Use **docs/FEATURE_PARITY_CHECKLIST.md** to track and verify every feature. Only mark a feature done after running its verification steps.
4. All Expo UI must use **NativeWind** (`className="..."`); see `.cursor/rules/expo-nativewind.mdc`.

## AI / agents

See **AGENTS.md** for context and rules when working in this repo (especially for migration and the checklist).
