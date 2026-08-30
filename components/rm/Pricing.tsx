"use client";

import { useEffect, useRef, useState } from "react";
import { Head, Rise, useRm } from "./Shell";
import { PLAN, TIERS } from "@/lib/rm/data";

/* ============================================================
   FRAME 05 — PRICING
   One plan holds the page. The pilot sits above it as a single
   line, the enterprise specification unfolds below it only if
   you ask. No column of ticks, no three-way comparison.
   ============================================================ */

export function Pricing() {
  const { openEnter } = useRm();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section className="rm-sec" id="pricing">
      <div className="rm-wrap">
        <Head
          n="05"
          verb="Govern"
          frame="Pricing"
          title={
            <>
              Pay for the work. <em>Not for the seats.</em>
            </>
          }
          dek={
            <>
              An operating system that does the work should not be priced like a tool that
              watches it. One plan, unlimited seats, and a meter on execution.
            </>
          }
        />

        <Rise className="rm-plan">
          <div className="rm-plan-main">
            <div>
              <div className="rm-plan-name">
                <h3>{PLAN.name}</h3>
                <span className="tag">{PLAN.tag}</span>
              </div>
              <div className="rm-plan-price">
                <b>{PLAN.price}</b>
                <span>{PLAN.per}</span>
              </div>
              <p className="rm-plan-note">{PLAN.note}</p>
              <div className="rm-plan-cta">
                <button className="rm-btn rm-btn-cop rm-btn-lg" onClick={() => openEnter("create")}>
                  Connect to Red Marten
                </button>
                <button className="rm-btn rm-btn-sec rm-btn-lg" onClick={() => openEnter("demo")}>
                  Book Demo
                </button>
              </div>
            </div>

            <ul className="rm-plan-incl">
              {PLAN.incl.map(([k, v, m]) => (
                <li key={k}>
                  <i>{k.slice(0, 2).toUpperCase()}</i>
                  <span>
                    <b style={{ fontWeight: 500 }}>{v}</b> — {k.toLowerCase()}
                  </span>
                  <em>{m}</em>
                </li>
              ))}
            </ul>
          </div>

          {TIERS.map((t) => (
            <Tier
              key={t.id}
              tier={t}
              open={open === t.id}
              onToggle={() => setOpen(open === t.id ? null : t.id)}
              onCta={() => openEnter(t.id === "pilot" ? "create" : "demo")}
            />
          ))}
        </Rise>

        <Rise className="rm-price-foot" i={1}>
          <span>No card for the pilot</span>
          <span>EU or US data residency</span>
          <span>Cancel at the end of any term</span>
          <span>Migration from legacy RPA included</span>
        </Rise>
      </div>
    </section>
  );
}

function Tier({
  tier,
  open,
  onToggle,
  onCta,
}: {
  tier: (typeof TIERS)[number];
  open: boolean;
  onToggle: () => void;
  onCta: () => void;
}) {
  const body = useRef<HTMLDivElement>(null);
  const has = tier.cols.length > 0;
  const [h, setH] = useState(0);

  /* measure on open so the reveal has a real height to travel to */
  useEffect(() => {
    if (!has) return;
    setH(open && body.current ? body.current.scrollHeight : 0);
  }, [open, has]);

  return (
    <div className="rm-tier" data-open={open ? "1" : "0"}>
      <button
        className="rm-tier-h"
        onClick={has ? onToggle : onCta}
        aria-expanded={has ? open : undefined}
      >
        <h4>{tier.name}</h4>
        <p>{tier.p}</p>
        <span className="x">{has ? "+" : tier.cta}</span>
      </button>
      {has && (
        <div
          className="rm-tier-b"
          ref={body}
          style={{ height: h }}
        >
          {tier.cols.map((c) => (
            <div key={c.h}>
              <h5>{c.h}</h5>
              <ul>
                {c.li.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
