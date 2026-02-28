# A/B Test Store Listing — Sunnah Sleep

Based on [aso-skills ab-test-store-listing](https://github.com/Eronred/aso-skills). Use Apple’s Product Page Optimization (PPO) to improve conversion.

---

## What you can test (Apple PPO)

| Element | Testable | Notes |
|---------|----------|--------|
| App icon | Yes | Up to 3 variants |
| Screenshots | Yes | Up to 3 variants |
| App preview video | Yes | Up to 3 variants |
| Title / Subtitle / Description | No | Not in PPO |

**Constraints:** Organic traffic only; ~90% confidence to declare winner; one test at a time; 7–90 days.

---

## Test priority

| Element | Impact on CVR | Effort | Test order |
|---------|----------------|--------|------------|
| First screenshot | Very high (15–30% lift) | Medium | 1 |
| App icon | High (10–20% lift) | Medium | 2 |
| Screenshot order | Medium (5–15%) | Low | 3 |
| Screenshot style | Medium (5–15%) | High | 4 |
| Preview video | Medium (5–10%) | High | 5 |

**Start with the first screenshot** — it’s the first thing users see and drives most of the decision.

---

## Hypothesis format

```
If we [change], then [metric] will [improve] because [reason].
```

**Examples for Sunnah Sleep**

- If we add “Sleep better. Wake for Fajr.” to the first screenshot, conversion will increase because it states the benefit immediately.
- If we show the Duas screen first instead of Sleep, conversion will increase because adhkar is a key differentiator for our audience.
- If we switch the icon to a warmer color, tap-through rate will increase because it stands out more in Health & Fitness.

---

## Test plan template

```
Test name: [e.g. First screenshot – benefit headline]
Element: [icon / screenshots / video]
Hypothesis: If we [change], then [metric] will [improve] because [reason].

Variants:
- Control (A): [current]
- Variant B: [one clear change]
- Variant C: [optional second change]

Estimated duration: [N] days
Success metric: Conversion rate (or tap-through for icon)
Minimum detectable effect: [e.g. 10%] relative lift
```

---

## Screenshot test ideas

| Test | Control | Variant | Expected impact |
|------|---------|---------|-----------------|
| First screenshot | Feature-focused | Benefit-focused (“Sleep better. Wake for Fajr.”) | 10–30% CVR |
| Social proof | None | “Loved by Muslims worldwide” (if true) | 5–15% CVR |
| Text size | Small | Large, bold headline | 5–10% CVR |
| Style | Light | Dark (if app has dark mode) | 5–15% CVR |
| Order | Current | Reorder by benefit priority | 5–15% CVR |

---

## Icon test ideas

| Test | Control | Variant | Expected impact |
|------|---------|---------|-----------------|
| Color | Current | Higher contrast / different hue | 5–20% TTR |
| Style | Detailed | Simpler shape | 5–15% TTR |
| Symbol | Current | Different symbol (e.g. moon, book) | 5–20% TTR |

---

## Sample size / duration

- **&lt; 1k impressions/day:** 30–90 days (consider if worth it)
- **1k–5k/day:** 14–30 days
- **5k+/day:** 7–14 days  

Aim for **≥ 1000 impressions per variant**. Don’t stop early; wait for ~95% confidence if possible.

---

## Custom Product Pages (CPP)

35 custom product pages per app, each with its own:
- Screenshots  
- App preview video  
- Promotional text  

**Use for:** Different audiences (e.g. from different ad campaigns), Ramadan vs evergreens, or localized creative — not for random A/B split (PPO does that).

---

## 3-month testing roadmap (example)

| Month | Test | Element |
|-------|------|---------|
| 1 | First screenshot: benefit headline vs current | Screenshots |
| 2 | Icon: color or style variant | Icon |
| 3 | Screenshot order by benefit | Screenshots |

---

*Reference: [Eronred/aso-skills](https://github.com/Eronred/aso-skills) — ab-test-store-listing, screenshot-optimization*
