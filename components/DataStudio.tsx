"use client";

import { useEffect, useRef, useState } from "react";
import { AppFrame } from "./AppFrame";

const QUERY = "show me logistics accounts hiring SDRs with intent this week";
const CHIPS = ["industry = Logistics", "hiring = SDR", "intent ≥ 65", "window = 7 days"];
const COLS = ["Company", "Employees", "Hiring SDRs", "Intent"];
const ROWS: [string, string, string, number][] = [
  ["Meridian Freight", "480", "3 roles", 92],
  ["Coreline Systems", "210", "1 role", 88],
  ["Halden Systems", "1,200", "5 roles", 81],
  ["Vantage Freight", "340", "2 roles", 78],
  ["Harbourline Ports", "890", "2 roles", 74],
  ["Kestrel Analytics", "150", "1 role", 69],
];

export function DataStudio() {
  const ref = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState("");
  const [compiled, setCompiled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(QUERY);
      setCompiled(true);
      return;
    }
    // type the query once when the panel first enters view
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        let i = 0;
        const tick = () => {
          i += 1;
          setTyped(QUERY.slice(0, i));
          if (i < QUERY.length) {
            timer = setTimeout(tick, 26);
          } else {
            timer = setTimeout(() => setCompiled(true), 320);
          }
        };
        let timer = setTimeout(tick, 200);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <AppFrame
        url="acme-revops.redmarten.app/data-studio"
        status={<span className="af-live"><i /> live</span>}
      >
        <div className="ds">
          <div className="ds-bar">
            <span className="ds-prompt">Ask</span>
            <span className="ds-query">
              {typed}
              {!compiled && <span className="ds-caret" aria-hidden />}
            </span>
          </div>

          <div className={`ds-chips${compiled ? " on" : ""}`} aria-hidden={!compiled}>
            <span className="ds-chip-lbl">compiled to</span>
            {CHIPS.map((c) => (
              <span className="ds-chip" key={c}>
                {c}
                <b aria-hidden>×</b>
              </span>
            ))}
          </div>

          <div className={`ds-table${compiled ? " on" : ""}`}>
            <div className="ds-row ds-head">
              {COLS.map((c) => (
                <span key={c}>{c}</span>
              ))}
            </div>
            {ROWS.map(([name, size, hiring, intent]) => (
              <div className="ds-row" key={name}>
                <span className="ds-co">{name}</span>
                <span>{size}</span>
                <span>{hiring}</span>
                <span className="ds-intent">
                  <span className="ds-bar-track">
                    <span className="ds-bar-fill" style={{ width: `${intent}%` }} />
                  </span>
                  <b>{intent}</b>
                </span>
              </div>
            ))}
          </div>
        </div>
      </AppFrame>
      <figcaption className="figure-cap">
        <b>Fig. 2</b> — Ask in plain English; Data Studio compiles it to filters and returns a list —
        6 of 604 companies, scored on 38 attributes.
      </figcaption>
    </div>
  );
}
