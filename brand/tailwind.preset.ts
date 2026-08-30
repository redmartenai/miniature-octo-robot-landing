/**
 * Red Marten Tailwind preset — v1.0
 * Generated from tokens.json. Import in tailwind.config.ts:
 *   import marten from "./brand/tailwind.preset";
 *   export default { presets: [marten], content: [...] };
 *
 * Every colour resolves to a CSS custom property from brand/tokens.css,
 * so `dark` mode is a single attribute flip — no `dark:` variants needed
 * for anything that uses a role token.
 */
import type { Config } from "tailwindcss";

const preset: Omit<Config, "content"> = {
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        /* ── Role tokens — use these in components ── */
        bg: "var(--color-bg)",
        "bg-alt": "var(--color-bg-alt)",
        surface: "var(--color-surface)",
        "surface-2": "var(--color-surface-2)",
        "surface-sunk": "var(--color-surface-sunk)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        fg: "var(--color-fg)",
        "fg-2": "var(--color-fg-2)",
        "fg-3": "var(--color-fg-3)",
        "fg-inverse": "var(--color-fg-inverse)",
        accent: {
          DEFAULT: "var(--color-accent)",
          soft: "var(--color-accent-soft)",
        },
        /* Brand surfaces — theme-invariant. The logo plate never shifts. */
        brand: {
          red: "var(--brand-red)",
          cream: "var(--brand-cream)",
        },
        patina: "var(--color-patina)",
        success: { DEFAULT: "var(--color-success)", soft: "var(--color-success-soft)" },
        warning: { DEFAULT: "var(--color-warning)", soft: "var(--color-warning-soft)" },
        danger:  { DEFAULT: "var(--color-danger)",  soft: "var(--color-danger-soft)" },
        info:    { DEFAULT: "var(--color-info)",    soft: "var(--color-info-soft)" },
        glass: "var(--color-glass)",

        /* ── Raw ramp — palettes, marketing, charts only ── */
        red: {
          950: "#4A0908", 900: "#5F0C0A", 800: "#74100E", 700: "#8A0E0D",
          600: "#A31C18", 500: "#BC3630", 400: "#CF5F52", 200: "#EFC4BE", 100: "#F8E7E3",
        },
        bone: {
          0: "#FFFFFF", 50: "#FCF8F5", 100: "#F5EDE8", 150: "#EFE6DF",
          200: "#E5D9D2", 300: "#CFC1B9", 400: "#9E908A",
          600: "#6C625D", 800: "#3A3330", 900: "#1A1614", 950: "#0D0A09",
        },
        chart: {
          1: "var(--chart-1)", 2: "var(--chart-2)", 3: "var(--chart-3)",
          4: "var(--chart-4)", 5: "var(--chart-5)", 6: "var(--chart-6)",
          other: "var(--chart-other)",
        },
      },

      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },

      fontSize: {
        display:  ["60px", { lineHeight: "61px", letterSpacing: "-0.035em", fontWeight: "600" }],
        h1:       ["40px", { lineHeight: "44px", letterSpacing: "-0.03em",  fontWeight: "600" }],
        h2:       ["30px", { lineHeight: "35px", letterSpacing: "-0.025em", fontWeight: "600" }],
        title:    ["20px", { lineHeight: "26px", letterSpacing: "-0.015em", fontWeight: "600" }],
        subtitle: ["17px", { lineHeight: "25px" }],
        body:     ["15px", { lineHeight: "24px" }],
        small:    ["13px", { lineHeight: "20px" }],
        caption:  ["12px", { lineHeight: "17px" }],
        label:    ["11px", { lineHeight: "14px", letterSpacing: "0.12em", fontWeight: "500" }],
        button:   ["14px", { lineHeight: "14px", letterSpacing: "-0.005em", fontWeight: "500" }],
        numeric:  ["26px", { lineHeight: "30px", letterSpacing: "-0.02em", fontWeight: "500" }],
      },

      spacing: {
        1: "4px", 2: "8px", 3: "12px", 4: "16px", 5: "24px",
        6: "32px", 7: "48px", 8: "64px", 9: "96px", 10: "128px",
        sidebar: "264px",
        "sidebar-collapsed": "64px",
        topbar: "56px",
        node: "224px",
      },

      borderRadius: {
        xs: "4px", sm: "6px", md: "10px", lg: "14px",
        xl: "20px", "2xl": "28px", full: "999px",
      },

      boxShadow: {
        1: "var(--shadow-1)",
        2: "var(--shadow-2)",
        3: "var(--shadow-3)",
        4: "var(--shadow-4)",
        focus: "var(--shadow-focus)",
      },

      transitionTimingFunction: {
        out: "cubic-bezier(.22,1,.36,1)",
        inout: "cubic-bezier(.65,0,.35,1)",
        spring: "cubic-bezier(.34,1.56,.64,1)",
      },

      transitionDuration: { fast: "140ms", base: "240ms", slow: "420ms", cine: "860ms" },

      maxWidth: { measure: "68ch", layout: "1440px" },

      backgroundImage: {
        /* Workflow canvas dot grid */
        canvas: "radial-gradient(var(--color-border-strong) 1px, transparent 1px)",
      },
      backgroundSize: { canvas: "18px 18px" },

      keyframes: {
        "rm-leap-body": {
          from: { opacity: "0", transform: "translate(-14px,11px) scale(.90) rotate(-5deg)" },
          to:   { opacity: "1", transform: "translate(0,0) scale(1) rotate(0)" },
        },
        "rm-leap-wipe":  { from: { transform: "translateX(0)" }, to: { transform: "translateX(124px)" } },
        "rm-trail-wipe": { "0%": { transform: "translateX(0)" }, "55%": { transform: "translateX(124px)" }, "100%": { transform: "translateX(248px)" } },
        "rm-scent":      { "0%,100%": { opacity: ".5", transform: "scale(.965)" }, "45%": { opacity: "1", transform: "scale(1)" } },
        "rm-shift":      { "0%,100%": { transform: "translateX(0)" }, "40%": { transform: "translateX(4%)" } },
        "rm-fade":       { "0%,100%": { opacity: ".28" }, "35%": { opacity: "1" } },
        "edge-flow":     { to: { strokeDashoffset: "-24" } },
        shimmer:         { "100%": { transform: "translateX(100%)" } },
      },
      animation: {
        "leap-body":  "rm-leap-body 720ms cubic-bezier(.34,1.56,.64,1) 200ms forwards",
        "leap-wipe":  "rm-leap-wipe 640ms cubic-bezier(.22,1,.36,1) forwards",
        "trail-wipe": "rm-trail-wipe 1200ms cubic-bezier(.65,0,.35,1) infinite",
        scent:        "rm-scent 1800ms cubic-bezier(.65,0,.35,1) infinite",
        sprint:       "rm-shift 1600ms cubic-bezier(.65,0,.35,1) infinite",
        "edge-flow":  "edge-flow 600ms linear infinite",
        shimmer:      "shimmer 1400ms ease-in-out infinite",
      },

      zIndex: {
        canvas: "0", sticky: "100", dropdown: "200",
        drawer: "300", modal: "400", toast: "500", tooltip: "600",
      },
    },
  },
};

export default preset;
