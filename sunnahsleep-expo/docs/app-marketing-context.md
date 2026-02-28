# App Marketing Context — Sunnah Sleep

This document is the single source of context for ASO and app marketing. It follows the [aso-skills](https://github.com/Eronred/aso-skills) app-marketing-context structure so agents and tools can reference it.

---

## App Overview

| Field | Value |
|-------|--------|
| **App Name** | Sunnah Sleep |
| **Apple App ID** | (set in App Store Connect after first submit) |
| **Google Play** | `com.sunnahsleep.app` |
| **Category** | Health & Fitness (primary); Lifestyle (secondary) |
| **Platform** | iOS, Android (Expo) |
| **Price Model** | Free |
| **Launch Date** | Not yet launched |
| **Current Version** | 1.0.0 |

---

## Value Proposition

- **Problem:** Muslims want a single app for sleep routine, Fajr/bedtime alarms, prayer times, Qibla, and evening adhkar—without scattered apps or non-Islamic sleep content.
- **Target Audience:** Muslims (any age) who care about sunnah sleep habits, on-time Fajr, and adhkar; likely English and Arabic speakers.
- **Unique Differentiator:** Combines sleep log, Islamic alarms (bedtime + Fajr), prayer times, Qibla, and curated evening duas in one app; privacy-first (data on device).
- **Elevator Pitch:** Sunnah Sleep helps you build a blessed sleep routine with sleep tracking, Fajr and bedtime alarms, prayer times, Qibla, and evening adhkar—all in one app.

---

## Competitors

| App | Notes | Strengths | Weaknesses |
|-----|------|-----------|------------|
| Muslim Pro | Prayer + Qibla + content | Huge install base, many features | Cluttered; sleep/adhkar not focus |
| Pillow / Sleep Cycle | Sleep tracking | Strong sleep analytics | Not Islamic; no adhkar/alarms |
| Alarm apps (generic) | Fajr alarms | Simple | No prayer times, Qibla, or adhkar |
| Dua/adhkar apps | Evening adhkar | Focused content | No sleep or alarm integration |

**Positioning:** Sunnah Sleep is the only app that combines **sleep + Islamic alarms + prayer + Qibla + adhkar** in one place with a clean, focused experience.

---

## Current ASO State

- **Title:** Sunnah Sleep (or optimized: Sunnah Sleep: Sleep & Prayer)
- **Subtitle:** Sleep, alarms, prayer & adhkar (or optimized to avoid repeating title)
- **Keyword Field:** Optimized 100-char comma-separated list (no spaces); see `store.config.json` and `docs/STORE_LISTING.md`
- **Rating:** N/A (pre-launch)
- **Primary Keywords (target):** sleep, islamic sleep, prayer times, fajr alarm, qibla, adhkar, dua, bedtime

---

## Goals

1. **Launch** — Publish on App Store and Play Store with strong metadata and screenshots.
2. **Discoverability** — Rank for "islamic sleep", "fajr alarm", "prayer times", "qibla", "adhkar", "sleep tracker" in primary markets (US, UK, Muslim-majority regions).
3. **Conversion** — Clear value prop and screenshots so store visitors understand the app and download.

---

## Resources

- **Budget:** Indie / minimal paid marketing at launch
- **Team:** Solo/small team
- **Tools:** EAS (Expo Application Services), store.config.json for metadata
- **Constraints:** No paid ASO tools (e.g. Appeeky) initially; rely on best-practice metadata and keyword field

---

## Markets

- **Primary:** United States (en-US), United Kingdom (en-GB)
- **Secondary:** Saudi Arabia, UAE, Indonesia, Malaysia, Pakistan (consider localization later)
- **Languages:** English (en), Arabic (ar) in-app; store listing en-US first

---

## Related ASO Skills & Docs (from aso-skills)

| Skill | Local doc | Use for |
|-------|-----------|--------|
| aso-audit | [STORE_LISTING.md](./STORE_LISTING.md#aso-self-audit-aso-skills-style) | Score card, quick wins |
| keyword-research / metadata-optimization | [STORE_LISTING.md](./STORE_LISTING.md) | Title, subtitle, keywords, description |
| screenshot-optimization | [STORE_LISTING.md](./STORE_LISTING.md#screenshot-strategy-10-slots) | 10-slot screenshot plan |
| competitor-analysis | [ASO_COMPETITOR_ANALYSIS.md](./ASO_COMPETITOR_ANALYSIS.md) | Metadata comparison, keyword gaps |
| review-management | [ASO_REVIEW_MANAGEMENT.md](./ASO_REVIEW_MANAGEMENT.md) | HEAR, templates, rating prompt |
| localization | [ASO_LOCALIZATION.md](./ASO_LOCALIZATION.md) | Markets, keywords ≠ translation |
| app-launch | [ASO_APP_LAUNCH.md](./ASO_APP_LAUNCH.md) | 8-week launch checklist |
| app-store-featured | [ASO_FEATURED.md](./ASO_FEATURED.md) | Featuring readiness, pitch template |
| ab-test-store-listing | [ASO_AB_TESTING.md](./ASO_AB_TESTING.md) | PPO tests, hypotheses |

Reference: [Eronred/aso-skills](https://github.com/Eronred/aso-skills)
