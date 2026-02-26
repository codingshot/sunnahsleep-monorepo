/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // PWA-aligned semantic tokens (see docs/THEME.md)
        primary: "#0f766e",
        primaryForeground: "#ffffff",
        background: "#fafaf9",
        foreground: "#1c1917",
        card: "#ffffff",
        cardForeground: "#1c1917",
        muted: "#78716c",
        "muted-foreground": "#a8a29e",
        border: "#e7e5e4",
        destructive: "#b91c1c",
        destructiveForeground: "#ffffff",
        "background-dark": "#0c0a09",
        "foreground-dark": "#fafaf9",
        "card-dark": "#1c1917",
        "primary-dark": "#14b8a6",
        "border-dark": "#292524",
      },
    },
  },
  plugins: [],
};
