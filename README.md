# Red Marten — marketing site

A premium landing page + brand book for **Red Marten, the autonomous revenue platform**, built on
the existing Red Marten design system in [`brand/`](./brand/).

Stack: **Next.js 14 (App Router) · React 18 · TypeScript · Tailwind (via the brand preset) ·
Framer Motion**. The real marten mark (`brand/MartenLogo.tsx`) and design tokens
(`brand/tokens.css`) are the single source of truth — nothing here re-defines a colour or a font.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm run start   # production
```

## Routes

| Route | What it is |
|---|---|
| `/` | The landing page — hero, morning briefing (Sarah), 6-module platform, live workflow canvas, agents, before/after, metrics + quotes, solutions, pricing, FAQ, CTA, footer. Sign-up / login modal and toasts included. |
| `/brand-book` | Refreshed brand book — the mark on three grounds, the four motion states (leap / trail / scent / sprint), full colour system, type scale, components, and the three rules. Shares the exact same tokens as the site. |

## How it's wired

- **`app/layout.tsx`** imports `brand/tokens.css` then `app/globals.css`, and loads the three brand
  fonts — Familjen Grotesk (display), Geist (sans), Geist Mono (mono) — binding them to the token
  font variables. A tiny pre-paint script applies the saved theme with no flash.
- **`app/globals.css`** is the site layer: every colour, radius, shadow and font is a role token
  from the brand system, so **light ⇆ dark is a single `data-theme` flip**.
- **`components/SiteChrome.tsx`** is the client provider holding theme, the auth modal and toasts,
  exposed through a `useSite()` hook.
- **`components/Reveal.tsx`** wraps Framer Motion's `whileInView` for the scroll reveals and
  staggered card entrances.
- **`lib/site.ts`** holds all copy and data in one place.

## The marten motion language (used throughout)

| State | Meaning | Where |
|---|---|---|
| `leap` | arriving | hero mark, nav, auth modal |
| `trail` | fetching / loading | loaders |
| `scent` | an agent is reasoning | CTA band mark |
| `sprint` | a workflow is executing | reserved for the product |

Only one is ever on screen at a time.
