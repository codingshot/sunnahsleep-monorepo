# PWA → Expo Migration Methodology

## Overview

This document defines how to convert **sunnah-sleep-pwa** (web PWA) into **sunnahsleep-expo** (React Native Expo app) with **feature parity** and **NativeWind** for styling.

---

## 1. Stack Alignment

| Concern | PWA (Source) | Expo (Target) |
|--------|---------------|---------------|
| Framework | React (Vite/CRA) | React (Expo SDK) |
| Styling | Tailwind CSS | **NativeWind** (Tailwind for React Native) |
| Routing | React Router | Expo Router (file-based) |
| State | (varies) | Same patterns; avoid DOM-only APIs |
| Storage | localStorage / IndexedDB | AsyncStorage / expo-secure-store |
| Notifications | Web Push / Service Worker | Expo Notifications |
| Offline | Service Worker + Cache | AsyncStorage + optional SQLite |

---

## 2. NativeWind Setup (Required)

- **Use NativeWind v4** with Expo. All UI must use Tailwind-style classes via `className` on React Native components.
- **Do not** use StyleSheet or inline styles for layout/theme; use `className` (e.g. `className="flex-1 bg-background p-4"`).
- Config lives in `tailwind.config.js` and is shared conceptually with the PWA’s design tokens (colors, spacing, typography).
- Reference: [NativeWind docs](https://www.nativewind.dev/).

---

## 3. Feature Parity Process

1. **Inventory**  
   List every user-facing feature from the PWA (screens, flows, settings, integrations). Use `docs/FEATURE_PARITY_CHECKLIST.md` and the “Feature discovery” section below to populate it.

2. **Map**  
   For each feature, map:
   - PWA route → Expo route (Expo Router path).
   - PWA component → Expo screen/component (with NativeWind).
   - PWA data source (API, storage) → Expo equivalent (same API; storage swapped as in the table above).

3. **Implement**  
   Build or migrate one feature (or one screen) at a time. After each:
   - Mark the corresponding checklist item.
   - Run the “How to verify” steps for that item.

4. **Verify**  
   Before closing a feature:
   - Manual test on iOS and Android (or simulator).
   - Confirm no regressions on already-migrated features.
   - Use the checklist’s verification column.

---

## 4. Feature Discovery (How to Find All PWA Features)

When the PWA codebase is present, use this to build the feature list:

- **Routes**  
  Search for `<Route`, `createBrowserRouter`, `path:`, or `pathname` in the PWA. Each route is a candidate screen/flow.
- **Navigation**  
  Search for `<Link`, `useNavigate`, `navigate(`. These define user flows (e.g. onboarding → home → settings).
- **Storage / API**  
  Search for `localStorage`, `sessionStorage`, `indexedDB`, `fetch(`, API client imports. Each unique usage is a data dependency to replicate in Expo.
- **Notifications / Background**  
  Search for `Notification`, `serviceWorker`, `push`, `background`. Map to Expo Notifications and (if needed) background tasks.
- **Settings / Preferences**  
  Find settings screens and any toggles, options, or saved preferences. Each becomes a checklist entry (e.g. “Theme”, “Notification time”, “Language”).

After discovery, add each finding to `docs/FEATURE_PARITY_CHECKLIST.md` under the right category and fill in “Verification” and “Notes”.

---

## 5. Checklist Usage (AI and Humans)

- **Location**  
  Single source of truth: `docs/FEATURE_PARITY_CHECKLIST.md`.

- **When to use**  
  - Before finishing a migration task: mark only the items you actually completed and run their verification steps.  
  - When testing: run verification for the section you changed.  
  - When doing a full parity pass: work through the checklist top to bottom and confirm every item.

- **Status values**  
  - `[ ]` Not started  
  - `[~]` In progress / partial  
  - `[x]` Done and verified  

- **Do not** mark `[x]` without running the “How to verify” steps for that row.

---

## 6. Recommended Migration Order

Work in this order to avoid blocked work:

1. **§0 App shell** — Entry, layout, NativeWind, routing, theme, persisted prefs. Required before any screen.
2. **§2 Onboarding** — Before home, so first-run flow is correct.
3. **§1 Auth** (if present in PWA) — Before any protected screens.
4. **§3 Home** — Main dashboard.
5. **§4 Sleep** → **§5 Alarms** → **§6 Islamic/content** — Core features.
6. **§7 Settings** — Depends on theme, notifications, storage.
7. **§8 Notifications** — Can be done with or after Alarms/Settings.
8. **§9 Accessibility** — Can be done per-screen or as a pass at the end.
9. **§10 Edge cases** — Empty/error/loading/offline last.

---

## 7. Repo Layout

```
sunnahsleep-monorepo/
├── sunnah-sleep-pwa/     # Source: existing web PWA
├── sunnahsleep-expo/     # Target: Expo app (NativeWind)
├── docs/
│   ├── MIGRATION_METHODOLOGY.md       # This file
│   └── FEATURE_PARITY_CHECKLIST.md    # Master checklist
└── .cursor/
    └── rules/            # AI rules for migration + NativeWind
```

---

## 8. How to Trigger Migration (Exact Instructions)

Use this when you want to start or continue the PWA → Expo migration. **For copy-paste prompts, see `docs/TRIGGER_MIGRATION.md`.**

### One-time setup (if sunnahsleep-expo is empty)

1. From repo root: create Expo app in `sunnahsleep-expo` with Expo Router and TypeScript (e.g. `npx create-expo-app@latest sunnahsleep-expo --template tabs`), or use an existing Expo + Expo Router project.
2. Install and configure NativeWind v4 in `sunnahsleep-expo` per [NativeWind Expo guide](https://www.nativewind.dev/quick-starts/expo): `tailwind.config.js`, `global.css`, Babel preset, Metro `withNativeWind`, and import `global.css` in root layout.
3. Ensure design tokens (colors, fonts) from the PWA are reflected in `tailwind.config.js` so the app looks consistent.

### Exact prompt to trigger migration (for AI)

Copy-paste this (or a shortened version) to instruct the AI to run the migration:

```
Run the PWA → Expo migration for this monorepo.

1. Read docs/MIGRATION_METHODOLOGY.md and docs/FEATURE_PARITY_CHECKLIST.md.
2. If sunnah-sleep-pwa has code: run feature discovery (MIGRATION_METHODOLOGY.md §4), then update FEATURE_PARITY_CHECKLIST.md with actual PWA routes/components and any missing features.
3. In sunnahsleep-expo, implement features in the order given in the checklist’s “Recommended migration order” (app shell first, then auth/onboarding, then screens). Use NativeWind for all UI (className only).
4. After each feature (or each batch): run the “How to verify” steps for the affected checklist rows, then set their status to [x]. Do not mark [x] without verifying.
5. Continue until every checklist row is either [x] or explicitly N/A (e.g. no auth in PWA).
```

### Shorter trigger (resume / next batch)

```
Continue the PWA → Expo migration: open docs/FEATURE_PARITY_CHECKLIST.md, pick the next unchecked section, implement those features in sunnahsleep-expo with NativeWind, verify each row, and mark [x] when done.
```

---

## 9. Summary

- **Goal:** Sunnah Sleep Expo app matches PWA behavior and content, styled with NativeWind.  
- **Process:** Inventory → Map → Implement per feature → Verify with checklist.  
- **Authority:** `docs/FEATURE_PARITY_CHECKLIST.md` is the contract for “done”; keep it updated as the PWA or requirements change.
