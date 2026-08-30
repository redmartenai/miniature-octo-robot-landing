# Red Marten Brand System — Phase 1

| File | What it is |
|---|---|
| `red-marten-brand-book.html` | The brand book. 15 sections, light + dark, live mark motion demos. |
| `tokens.json` | **Source of truth.** W3C DTCG format. Everything else is generated from this. |
| `tokens.css` | CSS custom properties + the four mark-motion keyframe sets. Import once at app root. |
| `tailwind.preset.ts` | Tailwind preset mapping utilities onto the role tokens. |
| `MartenLogo.tsx` | `MartenMark`, `MartenLockup`, `MartenLoader`, `MartenThinking`. |
| `assets/marten-mark.svg` | Master mark, Marten Red fill. |
| `assets/marten-mark-cream.svg` | Cream fill, for red and ink grounds. |
| `assets/marten-mark-ink.svg` | Ink fill, for mono and print. |
| `assets/marten-mark-currentcolor.svg` | Inheritable fill, for inline use. |
| `assets/marten-favicon.svg` | Red plate, radius 26, mark at 78 %. Rasterise to 16/32/180/512. |

## Setup

```ts
// app/layout.tsx
import "@/brand/tokens.css";

// tailwind.config.ts
import marten from "./brand/tailwind.preset";
export default { presets: [marten], content: ["./app/**/*.{ts,tsx}"] };
```

Fonts: `Familjen Grotesk` (display), `Geist` (UI), `Geist Mono` (data) — all on Google Fonts.

## The mark

Vectored from `test.png` (199 × 192) at **96.06 % pixel overlap** — cream/red field separated, contour traced at 6× with sub-pixel smoothing, fitted to **41 cubic Béziers**. Two closed paths: the **body** (with the eye cut out, `fill-rule="evenodd"`) and the **trail**. 112 × 103.4 u on a 120 grid, leap axis 43°.

- **The marten never mirrors.** It always leaps right.
- **Below 32 px the eye is dropped** — the counter fills in and reads as a defect. `MartenMark` handles this automatically.
- **Never scale past 1.04** in animation. The body–trail gap is 1.9 u at its narrowest and closes.

## Three rules that keep the system intact

1. **Components read role tokens, never ramp steps.** Use `--color-border-strong`, not `--color-bone-300`. This is what makes dark mode a one-file change. The only exceptions are `--brand-red` and `--brand-cream`, which are deliberately theme-invariant so the logo plate never shifts.
2. **The two-reds rule.** Marten Red is a **surface** — plates, primary buttons, active nav, focus rings, chart series 1. Error red `#B23A2C` is **text and iconography** — never a fill larger than a badge. `#8A0E0D` is 1.9:1 on dark, so dark mode substitutes `red.400 #CF5F52` for every accent role.
3. **Mark motion is a system state, not decoration.** `leap` = arriving, `trail` = fetching, `scent` = an agent is reasoning, `sprint` = a workflow is executing. Only one is on screen at a time.

## Open items

- **Master vector.** The curves here are derived from a 199 px raster. Supply the source vector and they become authored; keep the `.body` / `.tail` / `.wiper` class names so the motion system still binds.
- **Wordmark.** "Red Marten" is currently set in Familjen Grotesk 700 at −0.04 em. If you want a drawn wordmark rather than a typeset one, that is a separate pass.
