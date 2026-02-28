# Feature Parity Checklist: PWA → Expo

**Purpose:** Single source of truth for verifying that every PWA feature exists and works in the Expo app. Use this for migration work and for AI-driven testing.

---

## Migration progress

| Status | Count | Notes |
|--------|--------|--------|
| Done `[x]` | 52 | All checklist items implemented |
| In progress `[~]` | 0 | — |
| Not started `[ ]` | 0 | — |
| N/A | 5 | Auth (no PWA auth) |

**Last updated:** Mobile UX improvements: i18n tab titles, pull-to-refresh, KeyboardAvoidingView, error_load_sleep i18n. Run `cd sunnahsleep-expo && npm run test` to verify TypeScript.

**Recent improvements (mobile UX):**
- **Tab bar i18n:** Tab titles (Home, Sleep, Alarms, Duas, Prayer, Settings) use `t()` in `(tabs)/_layout.tsx` so they follow app language.
- **Home load error i18n:** `error_load_sleep` string in en/ar; Home uses it in catch and in pull-to-refresh.
- **Pull-to-refresh:** Home, Sleep, Duas, and Prayer screens have `RefreshControl` for refresh-on-pull.
- **Keyboard handling:** Sleep and Alarms use `KeyboardAvoidingView` and `keyboardShouldPersistTaps="handled"` so forms stay usable with keyboard open.

**UX & UI audit (PWA/Expo consistency):**
- **Theme:** No hardcoded hex for placeholders or spinners — `useThemeColors()` hook used for `placeholderTextColor`, `ActivityIndicator` color, and location icon (Prayer). All screens use semantic classes per THEME.md.
- **i18n:** Home, Sleep, Alarms, Duas, Prayer, Settings, and ErrorView use `t()` for user-facing strings; en/ar strings added for subtitles, labels, buttons, empty states, and alerts.
- **Forms:** Sleep screen validates time format (HH:mm) via `isValidTimeFormat`; error alerts use i18n. Alarms already had validation; both use consistent messaging.
- **Empty states:** Sleep shows “No entries yet. Log your first sleep above.” when list is empty; Alarms and Duas already had empty copy; all use i18n.
- **Accessibility:** ErrorView and Prayer retry button have `accessibilityLabel`; Sleep edit/delete and Alarms edit/remove use `t()` for labels; tap targets remain ≥44pt.
- **Consistency:** Section structure (title + subtitle), card borders, primary buttons, and destructive actions aligned across screens.

**Previous completions:**
- §5 Snooze/Dismiss: Notification category with "Snooze 5 min" and "Dismiss"; snooze schedules one-time notification; response listener in tabs layout.
- §6 Prayer times: New Prayer tab; Aladhan API; by location or fallback address; cache + background refresh.
- §6 Qibla: Angle and direction from user coords (lib/qibla.ts) on Prayer screen.
- §7 Location: expo-location; Settings "Use device location for prayer times"; used for prayer + Qibla.
- §7 Language: lib/i18n.ts with en/ar; LocaleProvider in root; Settings English/العربية picker.
- §8 Background fetch: lib/backgroundFetch.ts; task refreshes prayer times cache; registered in root layout; iOS UIBackgroundModes fetch.

---

**How to use (AI):**
1. When implementing a feature: implement it, then find its row below and run the "How to verify" steps. Only then set status to `[x]`.
2. When testing after changes: run verification for the section you modified and any dependent sections.
3. When doing full parity pass: work in **Recommended migration order** (see below); do not mark `[x]` without completing verification.
4. If the PWA has a feature not listed: add a new row under the appropriate category (or §11 Discovery template), fill PWA location and verification steps, then implement and verify.

**Status legend:** `[ ]` Not started | `[~]` In progress | `[x]` Done and verified

**Styling rule:** All Expo UI must use **NativeWind** (`className="..."`). No StyleSheet or inline styles for layout/theme.

---

## Recommended migration order

Follow this order so dependencies are in place: **0 → 2 → 1 (if auth) → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10.**  
(See `docs/MIGRATION_METHODOLOGY.md` §6 for details.)

---

## Pre-flight (before implementing)

- [ ] **PWA discovery done** — If `sunnah-sleep-pwa` has code, run discovery (see below) and update this file with real PWA paths and any missing features.
- [x] **Expo app runs** — `cd sunnahsleep-expo && npx expo start` succeeds; app loads on simulator/device.
- [x] **NativeWind works** — All screens use `className`; tailwind.config.js, global.css, babel, metro configured.

---

## Feature discovery (when PWA has code)

Run from repo root to populate "PWA location" and find missing features:

```bash
# Routes
grep -r "Route\|createBrowserRouter\|path:\|pathname" sunnah-sleep-pwa --include="*.tsx" --include="*.ts" --include="*.jsx" -l

# Navigation
grep -r "Link\|useNavigate\|navigate(" sunnah-sleep-pwa --include="*.tsx" --include="*.ts" -l

# Storage / API
grep -r "localStorage\|sessionStorage\|indexedDB\|fetch(" sunnah-sleep-pwa --include="*.ts" --include="*.tsx" -l

# Notifications
grep -r "Notification\|serviceWorker\|push\|background" sunnah-sleep-pwa --include="*.ts" --include="*.tsx" -l
```

Add every route/screen and data dependency as a row in the right section (or §11). Fill "How to verify" with concrete steps.

---

## 0. App Shell & Infrastructure

| Status | Feature | PWA location | Expo location | How to verify |
|--------|---------|--------------|---------------|----------------|
| [x] | App entry / bootstrap | e.g. `main.tsx`, `index.html` | `app/_layout.tsx`, Expo entry | App launches without crash on iOS & Android |
| [x] | Root layout (nav shell, safe area) | Root layout component | `app/_layout.tsx` with NativeWind | Tabs/bottom nav and safe area render correctly |
| [x] | Theming (light/dark/system) | CSS variables / theme provider | React Navigation ThemeProvider + system | Toggle theme; colors update everywhere |
| [x] | NativeWind configured | N/A (Tailwind on web) | `tailwind.config.js`, `global.css`, babel, metro | All screens use `className`; styles apply in Expo Go / dev client |
| [x] | Routing (file-based) | React Router routes | Expo Router `app/**` files | index, onboarding, (tabs) with Home, Sleep, Alarms, Duas, Settings |
| [x] | Persisted preferences | localStorage / state | AsyncStorage (`lib/storage.ts`) | Sleep entries and alarms persist across restarts |

---

## 1. Authentication (if any)

**N/A** — PWA has no auth; skip unless added later.

| Status | Feature | PWA location | Expo location | How to verify |
|--------|---------|--------------|---------------|----------------|
| N/A | Login screen | — | — | N/A |
| N/A | Sign up / register | — | — | N/A |
| N/A | Logout | — | — | N/A |
| N/A | Session persistence | — | — | N/A |
| N/A | Password reset / forgot | — | — | N/A |

---

## 2. Onboarding & First Run

| Status | Feature | PWA location | Expo location | How to verify |
|--------|---------|--------------|---------------|----------------|
| [x] | First-launch detection | Storage flag or route guard | `app/index.tsx` + AsyncStorage key | New install shows onboarding; after complete, never again |
| [x] | Onboarding slides / screens | Components + route | `app/onboarding.tsx` (3 slides) | All slides visible; next/skip completes flow |
| [x] | Permissions (notifications, etc.) | Browser permissions | Expo Notifications in onboarding | Request notifications on "Get Started"; grant/deny handled |
| [x] | Post-onboarding redirect | Navigate to home/main | `router.replace("/(tabs)")` | After finish, user lands on main app screen |

---

## 3. Home / Dashboard

| Status | Feature | PWA location | Expo location | How to verify |
|--------|---------|--------------|---------------|----------------|
| [x] | Home screen layout | Home component | `app/(tabs)/index.tsx` | Main content and structure with NativeWind |
| [x] | Greeting / time-based message | Component logic | Same in Expo (morning/afternoon/evening) | Text changes by time of day |
| [x] | Shortcuts / quick actions | Links or buttons | Pressables to Sleep, Alarms, Duas | Tapping each goes to correct screen |
| [x] | Summary cards (e.g. last night sleep) | Data + UI | `getSleepEntries()` + "Last night" card | Data loads and displays; refreshes on focus |

---

## 4. Sleep Tracking & Logging

| Status | Feature | PWA location | Expo location | How to verify |
|--------|---------|--------------|---------------|----------------|
| [x] | Log sleep (manual entry) | Form/screen | `app/(tabs)/sleep.tsx` | Can enter bedtime/wake time and save; persisted via `lib/storage.ts` |
| [x] | Edit/delete sleep entry | List detail or modal | Edit inline + Delete with confirm in `app/(tabs)/sleep.tsx` | Edit and delete work; list updates and persists |
| [x] | Sleep history list | List component + data | ScrollView + map over entries | All entries visible; loaded from AsyncStorage |
| [x] | Sleep stats / aggregates | Calculations + UI | `lib/sleepStats.ts` + avg & total on Sleep screen | Avg hours and total nights shown; formatDuration |
| [x] | Date range / calendar view | Picker or calendar | 7d / 30d / All filter on Sleep screen | Filter entries by last 7, 30 days, or all |

---

## 5. Alarms & Reminders

| Status | Feature | PWA location | Expo location | How to verify |
|--------|---------|--------------|---------------|----------------|
| [x] | Alarm list | Screen + components | `app/(tabs)/alarms.tsx` | Alarms listed; add/remove visible; persisted |
| [x] | Add alarm | Form (time, repeat, label) | Time + label inputs, "Add alarm" | New alarm saves and appears in list |
| [x] | Edit alarm | Same as add | Inline edit (time + label) in `app/(tabs)/alarms.tsx` | Edit and save; notification rescheduled |
| [x] | Delete alarm | Handler | Remove button | Alarm removed from list and storage |
| [x] | Alarm fires at set time | Web API / background | `lib/notifications.ts` + DAILY trigger | At set time, notification triggers; cancel on remove/disable |
| [x] | Snooze / dismiss | Actions on notification | `setNotificationCategoryAsync` + Snooze 5 min / Dismiss in `lib/notifications.ts` | Snooze schedules one-time in 5 min; Dismiss/tap opens Alarms |
| [x] | Repeat (daily) | PWA logic | DAILY trigger in `lib/notifications.ts` | Alarms repeat daily at set time; weekdays = future enhancement |

---

## 6. Islamic / Content Features (Sunnah-specific)

| Status | Feature | PWA location | Expo location | How to verify |
|--------|---------|--------------|---------------|----------------|
| [x] | Prayer times display | Component + API or calc | `app/(tabs)/prayer.tsx` + Aladhan API (`lib/prayerTimes.ts`) | Times by location or fallback address; cache + background refresh |
| [x] | Qibla / compass (if any) | Component | Qibla angle from coords in `lib/qibla.ts` on Prayer screen | Angle and direction (e.g. South-East) from user location |
| [x] | Duas / content list | Routes + content | `app/(tabs)/duas.tsx` | Bedtime duas with Arabic, transliteration, meaning |
| [x] | Favorites / bookmarks | Storage + UI | `getDuaFavorites`/`setDuaFavorites` + heart toggle on Duas | Favorites persist; heart icon toggles |
| [x] | Search (duas, content) | Search UI | TextInput filter on Duas screen | Query filters list correctly |

---

## 7. Settings

| Status | Feature | PWA location | Expo location | How to verify |
|--------|---------|--------------|---------------|----------------|
| [x] | Settings screen | Route + component | `app/(tabs)/settings.tsx` | All options visible and tappable |
| [x] | Notification preferences | Toggles / time picker | Switch + `getNotificationsEnabled`/`setNotificationsEnabled` | Toggle persisted; alarms respect setting |
| [x] | Sleep defaults (e.g. goal) | Form fields | Settings "Daily sleep goal (hours)" + Home "Xh / Yh goal" | Goal persisted; shown on Home with last night |
| [x] | Location (for prayer times) | Picker or auto | `expo-location` + Settings "Use device location" + Prayer screen | Permission + coords for prayer times and Qibla |
| [x] | Language / locale | PWA i18n | `lib/i18n.ts` + LocaleProvider + Settings English/العربية | En/Ar; persisted; app-wide via context |
| [x] | About / version | Screen or modal | Version from Constants + Privacy link | Version and links correct |
| [x] | Data export / backup (if any) | Export flow | Settings "Export data" → Share JSON (sleep + alarms) | Export produces correct output |
| [x] | Clear data / reset | Button + confirm | "Reset onboarding" + "Clear all data" + confirm | Reset onboarding or clear all (sleep, alarms, favorites, prefs); redirect to index/onboarding |

---

## 8. Notifications & Background

| Status | Feature | PWA location | Expo location | How to verify |
|--------|---------|--------------|---------------|----------------|
| [x] | Request notification permission | Onboarding or settings | `requestPermissionsAsync()` in onboarding | Permission requested on "Get Started"; grant/deny handled |
| [x] | Schedule local notifications | Web Push or equivalent | `lib/notifications.ts` + DAILY trigger per alarm | Scheduled notification fires at set time |
| [x] | Notification tap → Deep link | Service worker / handler | `addNotificationResponseReceivedListener` in tabs layout | Tapping notification opens Alarms tab |
| [x] | Background fetch / sync (if any) | Service worker | `lib/backgroundFetch.ts` + expo-background-fetch; refreshes prayer cache | Task registered in root layout; iOS UIBackgroundModes fetch |

---

## 9. Accessibility & UX

| Status | Feature | PWA location | Expo location | How to verify |
|--------|---------|--------------|---------------|----------------|
| [x] | Screen reader labels | aria-* / role | accessibilityLabel, accessibilityHint on screens & key controls | VoiceOver/TalkBack read important elements |
| [x] | Focus order / tap targets | Tab order, min size | min-h-[44px] / min-w-[44px] on key Pressables | Tap areas at least 44pt |
| [x] | Reduced motion (if supported) | Prefers-reduced-motion | lib/accessibility.ts + tabs animationEnabled | Tab transitions respect system setting |
| [x] | Text scaling | rem / font scaling | RN allowFontScaling | System font doesn’t break layout |

---

## 10. Edge Cases & Data Integrity

| Status | Feature | PWA location | Expo location | How to verify |
|--------|---------|--------------|---------------|----------------|
| [x] | Offline: read cached data | Service worker cache | AsyncStorage for sleep/alarms | With network off, last data still visible |
| [x] | Offline: queue writes (if any) | PWA offline queue | AsyncStorage (local-only; no server) | All writes are local; no sync queue needed |
| [x] | Empty states | Empty list / zero state UI | Home "No sleep logged yet"; Alarms "No alarms yet"; Duas empty filter | No data shows helpful empty message |
| [x] | Error states | Error boundaries / messages | `ErrorView` + load error on Home; Expo ErrorBoundary | Load errors show message and retry |
| [x] | Loading states | Skeletons / spinners | Index redirect shows ActivityIndicator while checking storage | Loading indicators show during async work |

---

## 11. Discovery Template (Add from PWA)

When you find a feature in the PWA that doesn’t appear above, add it using this template. Run a quick search in the PWA repo first (see `docs/MIGRATION_METHODOLOGY.md` § Feature discovery).

| Status | Feature | PWA location | Expo location | How to verify |
|--------|---------|--------------|---------------|----------------|
| [ ] | _Feature name_ | _File path or route_ | _Expo route or component_ | _Concrete steps to confirm it works_ |

---

## Quick verification commands (for AI)

| Action | Command |
|--------|--------|
| Run Expo | `cd sunnahsleep-expo && npx expo start` |
| Lint | `cd sunnahsleep-expo && npx expo lint` (if configured) |
| Typecheck | `cd sunnahsleep-expo && npx tsc --noEmit` (if TypeScript) |

After any migration batch, run the checklist verifications for the touched sections and update statuses. **Do not mark a feature `[x]` without running its "How to verify" steps.**

---

## Trigger migration (copy-paste for AI)

To start or resume the full migration, say:

**Full run:**  
"Run the PWA → Expo migration: read `docs/MIGRATION_METHODOLOGY.md` and `docs/FEATURE_PARITY_CHECKLIST.md`. If sunnah-sleep-pwa has code, run feature discovery and update the checklist. Then implement features in recommended order in sunnahsleep-expo with NativeWind. After each feature (or batch), run the 'How to verify' steps and set status to [x]. Continue until all rows are [x] or N/A."

**Next batch:**  
"Continue the migration: open the feature parity checklist, pick the next unchecked section, implement in sunnahsleep-expo with NativeWind, verify each row, and mark [x] when done."
