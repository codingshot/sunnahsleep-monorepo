# Sunnah Sleep theme (PWA & Expo)

Use these tokens in both **sunnah-sleep-pwa** and **sunnahsleep-expo** so the app looks consistent.

## Colors

| Token            | Light     | Dark       |
|-----------------|-----------|------------|
| Primary         | `#0f766e` | `#14b8a6`  |
| Background      | `#fafaf9` | `#0c0a09`  |
| Foreground      | `#1c1917` | `#fafaf9`  |
| Card            | `#ffffff` | `#1c1917`  |
| Muted           | `#78716c` | `#a8a29e`  |
| Muted foreground| `#a8a29e` | `#78716c`  |
| Border          | `#e7e5e4` | `#292524`  |
| Destructive     | `#b91c1c` | `#dc2626`  |

## Expo (NativeWind)

All app screens use these semantic classes so the Expo app matches the PWA theme:

- **Background:** `bg-background dark:bg-background-dark`
- **Text:** `text-foreground dark:text-foreground-dark`
- **Cards:** `bg-card dark:bg-card-dark` with `border-border dark:border-border-dark`
- **Muted text:** `text-muted-foreground`
- **Primary buttons:** `bg-primary` with `text-primaryForeground`; tab tint uses `#0f766e` (light) / `#14b8a6` (dark)
- **Destructive:** `text-destructive` / `bg-destructive`

Token source: `sunnahsleep-expo/constants/theme.ts` and `tailwind.config.js`.

## PWA (Tailwind CSS)

Use the same hex values in your CSS variables or Tailwind config so both apps match.
