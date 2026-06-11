import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:         "rgb(var(--rgb-bg)         / <alpha-value>)",
        surface:    "rgb(var(--rgb-surface)    / <alpha-value>)",
        surfaceMid: "rgb(var(--rgb-surface-mid)/ <alpha-value>)",
        highlight:  "rgb(var(--rgb-highlight)  / <alpha-value>)",
        accent:     "rgb(var(--rgb-accent)     / <alpha-value>)",
        cyber: "rgb(var(--rgb-cyber) / <alpha-value>)",
        eng:   "rgb(var(--rgb-eng)   / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        sans: ["var(--font-space)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "hex-grid":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%232E7A5A' fill-opacity='0.12'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM27 41.34L27 35.81 16 41.34v8h2v-8zm0-18.5L27 17.9l-11 6.35v8h2v-8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(168,217,184,0.08)",
        "glass-hover": "0 0 24px rgba(46,122,90,0.3), 0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(168,217,184,0.08)",
        lift: "0 12px 40px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.35), 0 1px 0 rgba(168,217,184,0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
