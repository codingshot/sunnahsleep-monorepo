# Review Management — Sunnah Sleep

Based on [aso-skills review-management](https://github.com/Eronred/aso-skills). Use this to improve ratings, respond to reviews, and mine feedback.

---

## Targets

| Metric | Target | Why |
|--------|--------|-----|
| Average rating | 4.5+ stars | Below 4.0 hurts conversion |
| Rating trend | Stable or improving | Declining = fix fast |
| Response rate | 100% of negative | Shows you care; can change ratings |
| Response time | < 24 hours | Builds trust |

---

## In-app rating prompt

**When to show:**
- After a **positive** moment (e.g. completed sleep log, set first alarm, finished a dua)
- After **3+ sessions** and **7+ days** of use
- **Never** after a crash, error, or frustrating flow
- **Never** during onboarding or first session

**Apple SKStoreReviewController:** Can be called only **3 times per 365 days per device**; Apple decides if the dialog appears. You control **when** you call it.

**Good triggers for Sunnah Sleep:**
- **Achievement:** User completes 7-day sleep streak or first week of logs
- **Value:** User sets Fajr alarm and confirms
- **Delight:** User marks a favorite dua or completes evening adhkar

---

## HEAR response framework

Use for every negative review:

1. **H**ear — Acknowledge the specific issue they mentioned  
2. **E**mpathize — Show you understand their frustration  
3. **A**ct — Say what you’re doing (or have done) about it  
4. **R**esolve — Invite them to contact support if needed  

---

## Response templates

**Bug report**

> Thank you for reporting this, [name]. We’ve identified the issue and it’s fixed in version [X.X] releasing [date]. We appreciate your patience — please update when it’s available and let us know if it’s resolved.

**Feature request**

> Great suggestion. We’ve added this to our roadmap. We’re always improving based on feedback. Stay tuned for updates.

**Vague negative (“This app sucks”)**

> We’re sorry to hear about your experience. We’d like to understand what went wrong so we can improve. If you can, reach out to [support email] with details. We’re here to help.

**Praise (short)**

> Thank you — we’re glad Sunnah Sleep is helping your routine. If you have a moment, sharing with friends who might benefit would mean a lot.

**Do not:** Be defensive, copy-paste the same reply everywhere, ignore negatives, ask users to change their rating, or offer incentives for reviews.

---

## Sentiment buckets

| Category | Action |
|----------|--------|
| **Bugs & crashes** | Fix, then respond with timeline |
| **Feature requests** | Log; consider roadmap |
| **UX complaints** | Prioritize UX improvements |
| **Pricing** | N/A (app is free) |
| **Praise** | Thank; optionally ask for sharing |
| **Competitor mentions** | Use for competitive insight |

---

## Review health (fill periodically)

```
Rating:           [X.X] ★ ([trend: ↑/↓/→])
Total reviews:    [N]
Last 30 days:     [N] reviews, [X.X] avg
Response rate:    [X]%

Top issues:
1. [issue] — [N] mentions
2. [issue] — [N] mentions

Top praise:
1. [praise] — [N] mentions
```

---

## Action plan template

1. **Immediate:** Respond to [N] negative reviews using templates above  
2. **This week:** [Fix top bug / adjust rating prompt timing]  
3. **This month:** [Top feature request / competitor review mining]  

---

*Reference: [Eronred/aso-skills](https://github.com/Eronred/aso-skills) — review-management*
