"use client";

import { AppFrame } from "./AppFrame";

// monthly pipeline ($k) — agent-sourced vs human-sourced stack
const PIPE: [string, number, number][] = [
  ["Apr", 180, 120],
  ["May", 240, 140],
  ["Jun", 300, 150],
  ["Jul", 360, 160],
  ["Aug", 420, 170],
  ["Sep", 470, 180],
];
const MAX = 650;

const STATS: [string, string, string][] = [
  ["$4.28M", "Qualified pipeline", "evidence: 412 sourced accounts"],
  ["61% / 39%", "Agent vs human sourced", "evidence: attribution log"],
  ["3.1×", "Forecast coverage", "evidence: 2 late-stage at risk"],
  ["41%", "Voice booking rate", "evidence: 38,902 min · transcripts"],
];

export function Analytics() {
  return (
    <div>
      <AppFrame
        url="acme-revops.redmarten.app/analytics"
        status={<span className="af-live"><i /> updated 08:00</span>}
      >
        <div className="an">
          <div className="an-chart">
            <div className="an-chart-h">
              <b>Pipeline created</b>
              <span className="an-legend">
                <span className="an-key agent" /> Agent-sourced
                <span className="an-key human" /> Human-sourced
              </span>
            </div>
            <div className="an-bars" role="img" aria-label="Pipeline created per month, agent vs human sourced, trending up">
              {PIPE.map(([m, a, h]) => (
                <div className="an-col" key={m}>
                  <div className="an-stack">
                    <span className="an-seg human" style={{ height: `${(h / MAX) * 100}%` }} />
                    <span className="an-seg agent" style={{ height: `${(a / MAX) * 100}%` }} />
                  </div>
                  <span className="an-x">{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="an-stats">
            {STATS.map(([v, l, ev]) => (
              <div className="an-stat" key={l}>
                <b>{v}</b>
                <span className="an-l">{l}</span>
                <a className="an-ev" href="#record">
                  {ev} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </AppFrame>
      <figcaption className="figure-cap">
        <b>Fig. 4</b> — Revenue intelligence with the evidence attached: every number links back to the
        record that produced it.
      </figcaption>
    </div>
  );
}
