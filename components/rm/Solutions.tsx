"use client";

import { useEffect, useMemo, useState } from "react";
import { Head, Rise } from "./Shell";
import { SCENARIOS } from "@/lib/rm/data";
import { useBeat, useBox, useInView, useTicker } from "@/lib/rm/motion";

/* ============================================================
   FRAME 03 — SOLUTIONS
   Not six cards. One engine, re-provisioned. Choosing a scenario
   tears down the lane and prints a different one: different
   signals, different agents, different systems of record, a
   different set of outcomes. Same runtime underneath — which is
   the entire argument for an operating system.
   ============================================================ */

export function Solutions() {
  const [i, setI] = useState(0);
  const [run, setRun] = useState(0);
  const { ref: seenRef, seen } = useInView<HTMLDivElement>();
  const [ref, box] = useBox<HTMLDivElement>();
  const [tok, setTok] = useState<number | null>(null);

  const scn = SCENARIOS[i];

  const pick = (n: number) => {
    if (n === i) return;
    setI(n);
    setRun((r) => r + 1);
  };

  /* a unit of work travels the lane whenever it is rebuilt */
  useEffect(() => {
    if (!seen) return;
    const t = setTimeout(() => setTok(0), 420);
    return () => clearTimeout(t);
  }, [run, seen]);

  useBeat(5200, seen, () => setTok(0));

  useTicker(tok !== null, (_t, dt) => {
    setTok((v) => {
      if (v === null) return v;
      const n = v + dt / 2200;
      return n >= 1 ? null : n;
    });
  });

  const geo = useMemo(() => {
    const { w, h } = box;
    if (!w || !h) return null;
    const count = scn.lane.length;
    const vertical = w < 680;
    const nw = vertical ? Math.min(w * 0.62, 260) : Math.min(w * 0.19, 176);
    const top = 46;
    const pts = scn.lane.map((_, n) => {
      const t = count === 1 ? 0.5 : n / (count - 1);
      if (vertical) {
        return { x: w * 0.5, y: top + 34 + t * (h - top - 90) };
      }
      const rows = [0.26, 0.74, 0.2, 0.68, 0.3];
      return { x: w * 0.11 + t * w * 0.78, y: top + (h - top) * rows[n % rows.length] };
    });
    return { w, h, nw, pts, vertical };
  }, [box, scn]);

  const wire = (a: { x: number; y: number }, b: { x: number; y: number }, vertical: boolean) => {
    if (vertical) {
      const dy = (b.y - a.y) * 0.45;
      return `M ${a.x} ${a.y} C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
    }
    const dx = (b.x - a.x) * 0.5;
    return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
  };

  const segs = geo ? geo.pts.length - 1 : 0;
  const activeSeg = tok !== null && segs > 0 ? Math.min(segs - 1, Math.floor(tok * segs)) : -1;

  let token: { x: number; y: number } | null = null;
  if (geo && tok !== null && activeSeg >= 0) {
    const a = geo.pts[activeSeg];
    const b = geo.pts[activeSeg + 1];
    const lt = tok * segs - activeSeg;
    const u = 1 - lt;
    if (geo.vertical) {
      const dy = (b.y - a.y) * 0.45;
      token = {
        x: u * u * u * a.x + 3 * u * u * lt * a.x + 3 * u * lt * lt * b.x + lt * lt * lt * b.x,
        y: u * u * u * a.y + 3 * u * u * lt * (a.y + dy) + 3 * u * lt * lt * (b.y - dy) + lt * lt * lt * b.y,
      };
    } else {
      const dx = (b.x - a.x) * 0.5;
      token = {
        x: u * u * u * a.x + 3 * u * u * lt * (a.x + dx) + 3 * u * lt * lt * (b.x - dx) + lt * lt * lt * b.x,
        y: u * u * u * a.y + 3 * u * u * lt * a.y + 3 * u * lt * lt * b.y + lt * lt * lt * b.y,
      };
    }
  }

  return (
    <section className="rm-sec" id="solutions">
      <div className="rm-wrap" ref={seenRef}>
        <Head
          n="03"
          verb="Plan"
          frame="Solutions"
          title={
            <>
              One platform. <em>Infinite use cases.</em>
            </>
          }
          dek={
            <>
              Every department runs the same six capabilities — only the mandate changes.
              <b> Choose a function</b> and the operating system re-provisions itself in front
              of you: new signals, new agents, new systems, new outcomes.
            </>
          }
        />

        <Rise>
          <div className="rm-scn-dial" role="tablist" aria-label="Scenarios">
            {SCENARIOS.map((s, n) => (
              <button
                key={s.id}
                role="tab"
                aria-selected={n === i}
                className="rm-scn-tab"
                data-on={n === i ? "1" : "0"}
                onClick={() => pick(n)}
              >
                <span className="no">{String(n + 1).padStart(2, "0")}</span>
                {s.label}
              </button>
            ))}
          </div>
        </Rise>

        <Rise className="rm-scn-body" i={1}>
          <div className="rm-scn-lane" ref={ref}>
            <div className="rm-scn-grid" aria-hidden />
            <div className="rm-scn-head">
              <b>{scn.label} · execution lane</b>
              <span>{tok !== null ? "Executing" : "Provisioned"}</span>
            </div>

            {geo && (
              <svg className="rm-scn-wires" viewBox={`0 0 ${geo.w} ${geo.h}`} aria-hidden>
                {geo.pts.slice(0, -1).map((p, n) => (
                  <path
                    key={n}
                    className={`rm-net-wire${activeSeg === n ? " on" : ""}`}
                    d={wire(p, geo.pts[n + 1], geo.vertical)}
                  />
                ))}
                {token && <circle cx={token.x} cy={token.y} r={4.5} fill="var(--copper)" />}
              </svg>
            )}

            {geo &&
              scn.lane.map((node, n) => (
                <div
                  key={`${scn.id}-${n}`}
                  className="rm-scn-node enter"
                  data-kind={node.kind === "agent" ? "agent" : undefined}
                  data-on={activeSeg === n || activeSeg === n - 1 ? "1" : "0"}
                  style={{
                    left: geo.pts[n].x,
                    top: geo.pts[n].y,
                    width: geo.nw,
                    ["--i" as string]: n,
                  }}
                >
                  <span className="k">{node.k}</span>
                  <span className="n">{node.n}</span>
                </div>
              ))}
          </div>

          <aside className="rm-scn-side">
            <h3>{scn.h}</h3>
            <p>{scn.p}</p>
            <ul className="rm-scn-steps">
              {scn.steps.map((s, n) => (
                <li key={s}>
                  <i>{String(n + 1).padStart(2, "0")}</i>
                  {s}
                </li>
              ))}
            </ul>
            <div className="rm-scn-out">
              {scn.out.map((o) => (
                <div key={o.k}>
                  <b>{o.v}</b>
                  <span>{o.k}</span>
                </div>
              ))}
            </div>
          </aside>
        </Rise>

        <Rise className="rm-scn-claim" i={2}>
          <b>
            Six departments. <em>One runtime.</em>
          </b>
          <span>
            Nothing above was a different product. The same graph, the same permission model
            and the same audit trail, given a different mandate.
          </span>
        </Rise>
      </div>
    </section>
  );
}
