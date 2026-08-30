"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MartenMark, MartenLockup } from "@/brand/MartenLogo";

const BRAND = [
  ["--brand-red", "#8A0E0D", "Marten Red — the logo plate. Theme-invariant."],
  ["--brand-cream", "#EFE6DF", "Marten Cream — the mark on red/ink. Theme-invariant."],
];

const ROLES = [
  ["--color-bg", "Canvas"],
  ["--color-surface", "Surface"],
  ["--color-surface-sunk", "Sunken"],
  ["--color-border", "Border"],
  ["--color-border-strong", "Border strong"],
  ["--color-fg", "Text"],
  ["--color-fg-2", "Text muted"],
  ["--color-accent", "Accent"],
];

const RED_RAMP = ["950", "900", "800", "700", "600", "500", "400", "200", "100"];
const BONE_RAMP = ["950", "900", "800", "600", "400", "300", "200", "150", "100", "50", "0"];

const SEMANTIC = [
  ["--color-success", "Success"],
  ["--color-warning", "Warning"],
  ["--color-danger", "Error"],
  ["--color-info", "Info"],
];

const MOTION: [string, string, string][] = [
  ["Leap", "leap", "Arriving — splash, hero, auth. Fires once."],
  ["Trail", "trail", "Fetching — route changes and data loading."],
  ["Scent", "scent", "An agent is reasoning."],
  ["Sprint", "sprint", "A workflow is executing."],
];

const TYPE: [string, string, React.CSSProperties][] = [
  ["Display / 60", "Familjen Grotesk · 700 · −0.035em", { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 48, letterSpacing: "-0.035em", lineHeight: 1.02 }],
  ["Heading / 40", "Familjen Grotesk · 600 · −0.03em", { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 34, letterSpacing: "-0.03em" }],
  ["Title / 20", "Familjen Grotesk · 600 · −0.015em", { fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 22, letterSpacing: "-0.015em" }],
  ["Body / 15", "Geist · 400", { fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 17, color: "var(--color-fg-2)" }],
  ["Mono / 13", "Geist Mono · 500 · 0.12em", { fontFamily: "var(--font-mono)", fontWeight: 500, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase" }],
];

const RULES: [string, string, string][] = [
  ["1", "Components read role tokens, never ramp steps", "Use --color-border-strong, not --color-bone-300. That is what makes dark mode a one-file change. The only exceptions are --brand-red and --brand-cream, kept theme-invariant so the logo plate never shifts."],
  ["2", "Two reds, separated by role", "Marten Red is a surface — plates, primary buttons, active nav, focus rings. Error red is text and iconography only, never a fill larger than a badge. Dark mode substitutes red.400 for accents."],
  ["3", "Mark motion is a system state, not decoration", "leap = arriving, trail = fetching, scent = an agent is reasoning, sprint = a workflow is executing. Only one is ever on screen at a time."],
];

function Swatch({ token, label, value }: { token: string; label: string; value?: string }) {
  return (
    <div className="bb-sw">
      <div className="chip" style={{ background: value ?? `var(${token})` }} />
      <div className="meta">
        <b>{label}</b>
        <code>{value ?? token}</code>
      </div>
    </div>
  );
}

export default function BrandBook() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [leapKey, setLeapKey] = useState(0);

  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") setTheme(attr);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("rm-theme", next);
    } catch {}
  };

  return (
    <>
      <div className="grain" aria-hidden />
      <header className="bb-top">
        <MartenMark size={26} />
        <span className="wordmark" style={{ fontSize: 18 }}>
          Red Marten
        </span>
        <Link className="back" href="/" style={{ marginLeft: 18 }}>
          ← Back to site
        </Link>
        <span className="ver">BRAND BOOK · v1.0</span>
        <button className="iconbtn" onClick={toggle} title="Toggle theme" style={{ marginLeft: 12 }}>
          {theme === "dark" ? "◑" : "◐"}
        </button>
      </header>

      {/* hero */}
      <section className="wrap bb-hero">
        <MartenLockup size={64} descriptor motion="leap" />
        <h1>The Red Marten brand system.</h1>
        <p>
          One mark, one warm palette, one type system — and a motion language where the marten’s
          movement means something. Everything on this page is driven by the same design tokens the
          product ships with.
        </p>
      </section>

      {/* the mark on grounds */}
      <section className="bb-sec">
        <div className="wrap">
          <span className="num">01 — THE MARK</span>
          <h2>The marten never mirrors. It always leaps right.</h2>
          <p className="intro">
            Two closed paths on a 120-unit grid — the body, with the eye cut out as a counter, and
            the trail. Below 32px the eye is dropped so the counter never reads as a defect.
          </p>
          <div className="bb-grounds">
            <div className="bb-ground red">
              <MartenMark size="38%" />
              <span className="tag">Cream on Marten Red</span>
            </div>
            <div className="bb-ground cream">
              <MartenMark size="38%" />
              <span className="tag">Red on Cream</span>
            </div>
            <div className="bb-ground ink">
              <MartenMark size="38%" />
              <span className="tag">Cream on Ink</span>
            </div>
          </div>
        </div>
      </section>

      {/* motion */}
      <section className="bb-sec">
        <div className="wrap">
          <span className="num">02 — MOTION</span>
          <h2>Four behaviours, four system states.</h2>
          <p className="intro">
            Motion is never decoration. Each behaviour maps to something the product is doing. Tap
            Leap to replay it.
          </p>
          <div className="bb-motion">
            {MOTION.map(([name, key, desc]) => (
              <div
                className="bb-mcard"
                key={key}
                onClick={() => key === "leap" && setLeapKey((k) => k + 1)}
                style={{ cursor: key === "leap" ? "pointer" : "default" }}
              >
                <div className="stagey">
                  <MartenMark
                    key={key === "leap" ? leapKey : key}
                    size={64}
                    motion={key as "leap" | "trail" | "scent" | "sprint"}
                  />
                </div>
                <b>{name}</b>
                <code>data-motion=&quot;{key}&quot;</code>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* color */}
      <section className="bb-sec">
        <div className="wrap">
          <span className="num">03 — COLOUR</span>
          <h2>Warm neutrals, one confident red.</h2>
          <p className="intro">
            Brand surfaces are fixed. Everything else is a role token that flips in dark mode from a
            single file.
          </p>

          <p className="lbl" style={{ marginBottom: 12 }}>Brand · theme-invariant</p>
          <div className="bb-swatches">
            {BRAND.map(([token, val]) => (
              <Swatch key={token} token={token} label={token} value={val} />
            ))}
          </div>

          <p className="lbl" style={{ marginBottom: 12 }}>Role tokens</p>
          <div className="bb-swatches">
            {ROLES.map(([token, label]) => (
              <Swatch key={token} token={token} label={label} />
            ))}
          </div>

          <p className="lbl" style={{ marginBottom: 12 }}>Marten Red ramp</p>
          <div className="bb-swatches">
            {RED_RAMP.map((s) => (
              <Swatch key={s} token={`--color-red-${s}`} label={`red ${s}`} />
            ))}
          </div>

          <p className="lbl" style={{ marginBottom: 12 }}>Bone ramp</p>
          <div className="bb-swatches">
            {BONE_RAMP.map((s) => (
              <Swatch key={s} token={`--color-bone-${s}`} label={`bone ${s}`} />
            ))}
          </div>

          <p className="lbl" style={{ marginBottom: 12 }}>Semantic</p>
          <div className="bb-swatches">
            {SEMANTIC.map(([token, label]) => (
              <Swatch key={token} token={token} label={label} />
            ))}
          </div>
        </div>
      </section>

      {/* type */}
      <section className="bb-sec">
        <div className="wrap">
          <span className="num">04 — TYPOGRAPHY</span>
          <h2>Familjen Grotesk, Geist, Geist Mono.</h2>
          <p className="intro">
            Grotesk for display and headings, Geist for interface text, Geist Mono for data and
            labels.
          </p>
          <ul className="bb-type">
            {TYPE.map(([label, spec, style]) => (
              <li key={label}>
                <span style={style}>Autonomous revenue, handled.</span>
                <span className="spec">
                  {label}
                  <br />
                  {spec}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* components */}
      <section className="bb-sec">
        <div className="wrap">
          <span className="num">05 — COMPONENTS</span>
          <h2>Built from the same tokens.</h2>
          <p className="intro">Buttons, pills and the lockup — nothing bespoke, everything inherits.</p>
          <div className="bb-specimen">
            <button className="btn btn-pri">Primary</button>
            <button className="btn btn-sec">Secondary</button>
            <button className="btn btn-ghost">Ghost</button>
            <span className="pill">
              <i className="dot" /> Autonomous · always on
            </span>
            <MartenLockup size={40} />
          </div>
        </div>
      </section>

      {/* rules */}
      <section className="bb-sec">
        <div className="wrap">
          <span className="num">06 — THE THREE RULES</span>
          <h2>What keeps the system intact.</h2>
          <p className="intro">Follow these and the identity survives contact with a real product.</p>
          <div className="bb-rules">
            {RULES.map(([k, h, p]) => (
              <div className="bb-rule" key={k}>
                <div className="k">{k}</div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="wrap">
          <div className="foot-btm" style={{ marginTop: 0, borderTop: 0 }}>
            <MartenMark size={20} />
            <span>© 2026 Red Marten Technologies · Brand system v1.0</span>
            <span className="sp" />
            <Link href="/">Back to site →</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
