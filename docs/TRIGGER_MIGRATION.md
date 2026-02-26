# Trigger PWA → Expo Migration

Use this when you want to **start** or **resume** the migration. Copy one of the prompts below into the chat.

---

## Full migration (start or run from scratch)

Paste this to run the full process: discovery (if PWA has code), then implement in order with NativeWind, then verify and mark the checklist.

```
Run the PWA → Expo migration for this monorepo.

1. Read docs/MIGRATION_METHODOLOGY.md and docs/FEATURE_PARITY_CHECKLIST.md.
2. If sunnah-sleep-pwa has code: run feature discovery (MIGRATION_METHODOLOGY.md §4), then update FEATURE_PARITY_CHECKLIST.md with actual PWA routes/components and any missing features.
3. In sunnahsleep-expo, implement features in the order given in the checklist’s “Recommended migration order” (app shell first, then auth/onboarding, then screens). Use NativeWind for all UI (className only).
4. After each feature (or each batch): run the “How to verify” steps for the affected checklist rows, then set their status to [x]. Do not mark [x] without verifying.
5. Continue until every checklist row is either [x] or explicitly N/A (e.g. no auth in PWA).
```

---

## Next batch (resume / incremental)

Use when the app is partially migrated and you want to continue.

```
Continue the PWA → Expo migration: open docs/FEATURE_PARITY_CHECKLIST.md, pick the next unchecked section, implement those features in sunnahsleep-expo with NativeWind, verify each row, and mark [x] when done.
```

---

## Single section (e.g. “do Settings”)

Use when you want one section done at a time.

```
Migrate section [N] from the feature parity checklist to sunnahsleep-expo: implement all features in that section with NativeWind, run each “How to verify” step, and mark the rows [x].
```

Replace `[N]` with the section number (0–11) or name (e.g. “7. Settings”).

---

## Verify only (no new code)

Use to re-run verification on already-implemented sections.

```
Run verification for section [N] of docs/FEATURE_PARITY_CHECKLIST.md: for each row in that section, run the “How to verify” steps. Update status to [x] only where verification passes.
```

---

## Reference

- **Methodology:** `docs/MIGRATION_METHODOLOGY.md`
- **Checklist:** `docs/FEATURE_PARITY_CHECKLIST.md`
- **Agent rules:** `AGENTS.md`, `.cursor/rules/expo-nativewind.mdc`, `.cursor/rules/pwa-expo-migration.mdc`
