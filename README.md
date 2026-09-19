# Red Marten — landing page

The landing page for **Red Marten, the autonomous business operating system**.

It is a static page of three files, `auralis.html`, `auralis.css` and `auralis.js`, plus images
in `assets/`. Next.js serves it: `next.config.mjs` rewrites `/` to `public/auralis.html`.

## Run it

```bash
npm install
npm run dev      # http://localhost:8800
```

## Where to edit

Edit the files at the repo root, then copy them into `public/`, which is what gets served.
The two copies are kept byte-for-byte identical:

```bash
cp auralis.html auralis.css auralis.js public/
cp assets/*  public/assets/
```

| Path | What it is |
|---|---|
| `auralis.html` | The page: hero, live operations console, services, system, integrations, audience, philosophy, final CTA, footer and the MARA overlay |
| `auralis.css` | All styles. Keep the short-screen `@media (min-width:901px) and (max-height:670px)` block last |
| `auralis.js` | Scroll-driven motion, the operations console clock, the integrations theatre (WebGL stage and CRM board) and the MARA overlay |
| `assets/` | Photography and grain used by the page |
| `app/layout.tsx` | Only wraps Next's own pages, such as the 404 |
| `brand/` | Brand book: marks, tokens and a Tailwind preset. The page doesn't import it |

Fonts are Satoshi and General Sans from Fontshare and JetBrains Mono from Google Fonts. They are
linked in the page's `<head>`, one family per Fontshare request.
