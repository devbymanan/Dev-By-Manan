import type { Config } from "tailwindcss";

// Design tokens — see docs/design-notes.md for the full rationale.
// Colors are wired through CSS variables (set in app/globals.css) so the
// dark/light toggle just swaps variable values instead of duplicating
// the palette. "signal" is the one accent color in the system — used
// sparingly, per CLAUDE.md: dark charcoal/black base + electric blue accent.
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "var(--bg-void)",
        raised: "var(--bg-raised)",
        "raised-2": "var(--bg-raised-2)",
        line: "var(--line)",
        ink: "var(--ink)",
        "ink-muted": "var(--ink-muted)",
        signal: "var(--signal)",
        "signal-soft": "var(--signal-soft)",
        "signal-fill": "var(--signal-fill)",
        "signal-fill-hover": "var(--signal-fill-hover)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        content: "1180px",
      },
      transitionTimingFunction: {
        signal: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "pulse-signal": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-signal": "pulse-signal 2.4s ease-in-out infinite",
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
