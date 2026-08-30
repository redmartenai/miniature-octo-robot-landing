"use client";

import { MartenMark } from "@/brand/MartenLogo";
import { useSite } from "./SiteChrome";
import { NightLedger } from "./NightLedger";
import { Reveal } from "./Reveal";

const TICKER: [string, string][] = [
  ["604", "accounts worked overnight"],
  ["1,247", "meetings booked/qtr"],
  ["3", "decisions at 08:00"],
  ["1", "log of everything"],
];

export function Hero() {
  const { openAuth } = useSite();

  const readBriefing = () => {
    const el = document.getElementById("briefing");
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  return (
    <section className="hero" id="top">
      <NightLedger>
        <Reveal className="hero-kick">
          <span className="kick">The autonomous revenue platform</span>
          <span className="kick r">↳ 01 — Works the night shift</span>
        </Reveal>

        <Reveal as="p" className="hero-cat" delay={0.06}>
          Workflow canvas · GTM data · voice · CRM sync — one autonomous system.
        </Reveal>

        {/* Headline stays plain text — it is the LCP, never gated behind motion. */}
        <h1 className="hero-h">
          <span style={{ display: "block" }}>The revenue desk</span>
          <span style={{ display: "block" }}>that works the</span>
          <span style={{ display: "block" }}>
            <span className="em">night shift.</span>
          </span>
        </h1>

        <Reveal delay={0.12}>
          <p className="lead">
            Red Marten finds the accounts, scores the intent, writes the outreach, makes the
            calls and keeps the CRM clean — then hands you the three decisions that actually need
            a human.
          </p>
          <div className="hero-cta">
            <button className="btn btn-red btn-lg" onClick={() => openAuth("signup")}>
              <MartenMark size={18} className="btn-mark" motion="leap" />
              Start free
            </button>
            <button className="tlink" onClick={readBriefing}>
              Read the briefing <span className="arw">→</span>
            </button>
          </div>
        </Reveal>

        <Reveal className="ticker" delay={0.18}>
          {TICKER.map(([v, l]) => (
            <span className="t" key={l}>
              <span className="dot" />
              <b>{v}</b> {l}
            </span>
          ))}
        </Reveal>
      </NightLedger>
    </section>
  );
}
