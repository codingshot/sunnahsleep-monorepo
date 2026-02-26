/**
 * Sunnah Sleep theme — align with PWA for consistency.
 * Light: warm, calm; Dark: deep with teal accent.
 */
export const theme = {
  light: {
    primary: "#0f766e",
    primaryForeground: "#ffffff",
    background: "#fafaf9",
    foreground: "#1c1917",
    card: "#ffffff",
    cardForeground: "#1c1917",
    muted: "#78716c",
    mutedForeground: "#a8a29e",
    border: "#e7e5e4",
    destructive: "#b91c1c",
    destructiveForeground: "#ffffff",
  },
  dark: {
    primary: "#14b8a6",
    primaryForeground: "#0f172a",
    background: "#0c0a09",
    foreground: "#fafaf9",
    card: "#1c1917",
    cardForeground: "#fafaf9",
    muted: "#a8a29e",
    mutedForeground: "#78716c",
    border: "#292524",
    destructive: "#dc2626",
    destructiveForeground: "#ffffff",
  },
} as const;
