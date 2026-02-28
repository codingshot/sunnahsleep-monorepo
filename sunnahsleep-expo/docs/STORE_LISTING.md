# App Store & Play Store Listing Guide

Use this checklist and copy when submitting **Sunnah Sleep** to the Apple App Store and Google Play Store.

**ASO reference:** Metadata and structure follow [aso-skills](https://github.com/Eronred/aso-skills). App context: [app-marketing-context.md](./app-marketing-context.md). See also: [ASO_COMPETITOR_ANALYSIS.md](./ASO_COMPETITOR_ANALYSIS.md) · [ASO_REVIEW_MANAGEMENT.md](./ASO_REVIEW_MANAGEMENT.md) · [ASO_LOCALIZATION.md](./ASO_LOCALIZATION.md) · [ASO_APP_LAUNCH.md](./ASO_APP_LAUNCH.md) · [ASO_FEATURED.md](./ASO_FEATURED.md) · [ASO_AB_TESTING.md](./ASO_AB_TESTING.md).

---

## Before you submit

- [ ] **EAS account:** Run `npm install -g eas-cli`, then `eas login` (Expo account).
- [ ] **Apple Developer:** Enroll at [developer.apple.com](https://developer.apple.com). Create an App ID matching `com.sunnahsleep.app`.
- [ ] **Google Play:** Create a developer account at [play.google.com/console](https://play.google.com/console).
- [ ] **Privacy policy URL:** Host `PRIVACY_POLICY.md` at a public URL (e.g. GitHub Pages or your site). Update `store.config.json` and store consoles with that URL.
- [ ] **Icons & splash:** Ensure `assets/images/icon.png`, `splash-icon.png`, and Android adaptive icon assets exist and look correct (see Expo asset guidelines).

---

## App configuration (already in repo)

| Item | Value |
|------|--------|
| **App name (store)** | Sunnah Sleep: Sleep & Prayer (iOS/Android store listing) |
| **iOS bundle ID** | com.sunnahsleep.app |
| **Android package** | com.sunnahsleep.app |
| **Version** | 1.0.0 (bump for each store release) |
| **iOS build number** | 1 (increment per App Store upload) |
| **Android versionCode** | 1 (increment per Play upload) |

---

## Build & submit commands

```bash
cd sunnahsleep-expo

# Install deps
npm install

# Build for stores (requires EAS)
eas build --platform ios --profile production
eas build --platform android --profile production

# After build succeeds, submit (fill in Apple/Google credentials in eas.json first)
eas submit --platform ios --profile production --latest
eas submit --platform android --profile production --latest
```

Before first submit:

1. **eas.json** — Replace `YOUR_APPLE_ID`, `YOUR_APP_STORE_CONNECT_APP_ID`, `YOUR_TEAM_ID` for iOS. For Android, add a [Google Play service account](https://docs.expo.dev/submit/android/#credentials) and set `serviceAccountKeyPath` or use EAS credentials.
2. Run `eas credentials` if you need to configure signing keys.

---

## Apple App Store

### Required in App Store Connect

- **Privacy Policy URL** (required)
- **Category:** Health & Fitness (or Lifestyle)
- **Age rating:** Complete questionnaire (no login, optional location → typically 4+)
- **Screenshots:** Use the [Screenshot strategy](#screenshot-strategy-10-slots) below; fill all 10 slots per device size when possible.
- **App description:** Use the description below (strong hook in first 3 lines).
- **Keywords:** Use the 100-character keyword string below (no spaces after commas in App Store Connect).
- **What’s New:** See [Conversion signals](#conversion-signals) for guidance.

### ASO-optimized metadata (en-US)

**Title (30 chars) — 27 used:**  
Sunnah Sleep: Sleep & Prayer

**Subtitle (30 chars) — 24 used:**  
Fajr alarm, Qibla & adhkar

**Keyword field (100 chars, comma-separated, no spaces after commas):**  
`bedtime,prayer times,dua,islamic,reminder,wake,adhkar,dhikr,evening,sleep tracker,namaz,muslim,tasbih`

*(Paste the string as-is in App Store Connect to use full 100 characters; do not add spaces after commas.)*

**Promotional text (170 chars):**  
Track sleep, set bedtime and Fajr alarms, see prayer times and Qibla, and read evening adhkar. All data stays on your device.

**Description (hook in first 3 lines, CTA at end):**  
Sunnah Sleep helps you build a blessed sleep routine:

• **Sleep log** — Record bedtime and wake time; see simple stats and history.  
• **Alarms** — Set reminders for bedtime and Fajr with snooze and dismiss.  
• **Prayer times** — Today’s times by your location or a default city; background refresh.  
• **Qibla** — Direction and angle from your location.  
• **Duas** — Evening adhkar with Arabic, transliteration, and meaning; mark favorites.  
• **Settings** — Notifications, sleep goal, language (English/العربية), export data, and more.

Data is stored only on your device. Location is optional and used only for prayer times and Qibla.

**Download Sunnah Sleep and start your blessed sleep routine today.**

---

## Google Play Store

### Required in Play Console

- **Privacy Policy URL** (required)
- **App category:** Health & Fitness (or similar)
- **Content rating:** Complete questionnaire.
- **Screenshots:** At least 2 phone screenshots; consider 7" and 10" tablet if supporting.
- **Feature graphic:** 1024 x 500 px.
- **Short description:** 80 chars max.
- **Full description:** 4000 chars max.

### Suggested copy (en-US)

**Short description (80 chars):**  
Sleep tracking, Fajr alarm, prayer times, Qibla & evening adhkar.

**Full description:**  
Sunnah Sleep helps you build a blessed sleep routine.

• Log sleep — Record bedtime and wake time; see stats and history.  
• Alarms — Bedtime and Fajr reminders with snooze and dismiss.  
• Prayer times — Today’s times by location or default city.  
• Qibla — Direction and angle from your location.  
• Duas — Evening adhkar with Arabic, transliteration, and meaning; favorites.  
• Settings — Notifications, sleep goal, language (English/العربية), export, and more.

All data stays on your device. Location is optional and used only for prayer times and Qibla.

---

## EAS Metadata (optional)

To push store metadata from the repo (e.g. privacy URL, descriptions):

1. Put the real **privacy policy URL** in `store.config.json` (replace the GitHub placeholder).
2. Run:

```bash
eas metadata:push
```

You can also edit metadata in App Store Connect and Play Console directly.

---

## ASO self-audit (aso-skills style)

Use this to score the listing periodically. Weights and criteria follow [aso-skills aso-audit](https://github.com/Eronred/aso-skills).

| Factor | Weight | What to check | Score 0–10 |
|--------|--------|----------------|------------|
| Title | 20% | Primary keyword + brand, ~30 chars, readable | |
| Subtitle | 15% | Secondary keywords, no repeat of title, ~30 chars | |
| Keyword field | 15% | No repeat of title/subtitle, comma no space, 100 chars | |
| Description | 5% iOS | Hook in first 3 lines, benefits, CTA at end | |
| Screenshots | 15% | 10 slots, first 3 = hook + value, benefit captions | |
| Preview video | 5% | Optional; if used, hook in first 3 sec | |
| Ratings & reviews | 15% | 4.5+, respond to negatives | |
| Icon | 5% | Distinct, simple, no text | |
| Keyword rankings | 10% | Track target keywords in store | |
| Conversion signals | 5% | Promotional text, What's New, events | |

**Quick wins:** Fix keyword repetition, fill keyword field to 100 chars (no spaces after commas), add CTA to description, use all 10 screenshot slots.

---

## Keyword coverage matrix

| Keyword | Title | Subtitle | Keyword field |
|---------|--------|----------|----------------|
| sleep | ✓ | | (avoid repeat) |
| prayer | ✓ | | (avoid repeat) |
| Fajr alarm | | ✓ | |
| Qibla | | ✓ | |
| adhkar | | ✓ | |
| bedtime, prayer times, dua, islamic, reminder, wake, dhikr, evening, sleep tracker, namaz, muslim, tasbih | | | ✓ |

---

## Screenshot strategy (10 slots)

Based on [aso-skills screenshot-optimization](https://github.com/Eronred/aso-skills). First 3 screenshots (above the fold) drive most conversions.

| Slot | Headline (benefit-driven) | Screen to show | Notes |
|------|---------------------------|----------------|------|
| 1 | Sleep better. Wake for Fajr. | Home or Sleep tab | Hook: what the app does and why it matters |
| 2 | Log your sleep. See your progress. | Sleep log / stats | Core value: tracking |
| 3 | One app for prayer, Qibla & adhkar | Prayer or Duas tab | Differentiation |
| 4 | Set bedtime & Fajr alarms | Alarms screen | Feature + benefit |
| 5 | Prayer times by your location | Prayer times screen | Feature + benefit |
| 6 | Qibla direction & angle | Qibla screen | Feature + benefit |
| 7 | Evening adhkar with Arabic & meaning | Duas screen | Feature + benefit |
| 8 | Your data stays on your device | Settings or short copy | Trust / privacy |
| 9 | English & العربية | Language/settings | Localization |
| 10 | Start your blessed sleep routine today | App icon or recap | CTA |

**Design:** Benefit headlines (4–6 words), large readable text, consistent style. Avoid welcome/login/settings-only first screenshot.

---

## Conversion signals

- **Promotional text (170 chars, iOS):** Update without review. Use for Ramadan, new features, or milestones.
- **What’s New:** Keep recent and specific. Example: *"Initial release: sleep tracking, bedtime and Fajr alarms, prayer times, Qibla, and evening adhkar. All data stays on your device."*
- **In-App Events (iOS):** Consider events for Ramadan or feature launches to gain visibility.

---

## Post-submission

- **iOS:** Expect 24–48 hr review. Ensure TestFlight build works if you use it.
- **Android:** Usually faster; check for policy or permission warnings in Play Console.
- **Updates:** Bump `version` (and iOS `buildNumber` / Android `versionCode`), then build and submit again with the same commands above.
