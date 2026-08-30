"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Rise, useRm } from "./Shell";
import { AUTO_ACTIONS, AUTO_CLUSTERS } from "@/lib/rm/data";
import { seeded, useInView, useReduced } from "@/lib/rm/motion";

const fmt = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/* ============================================================
   SIGNATURE MOMENT — RUN AUTONOMOUS MODE
   Everything the company generates in a night, on one surface:
   signals, documents, agents, runs, calls, writes. Press the
   button and the system works through all of it — then the
   whole field collapses and three decisions are left standing.

   Complexity in. Intelligence out. The claim is not written on
   the screen; it happens on the screen.
   ============================================================ */

type Phase = "idle" | "running" | "collapse" | "done";

const DOTS = 1500;
const RUN_MS = 4200;
const COLLAPSE_MS = 1500;

const CLUSTER_POS = [
  [0.17, 0.34],
  [0.5, 0.26],
  [0.83, 0.34],
  [0.23, 0.74],
  [0.55, 0.78],
  [0.85, 0.7],
] as const;

const TOTALS = [12480, 3140, 190, 1268, 412, 3126];

export function Autonomous() {
  const { openEnter } = useRm();
  const reduced = useReduced();
  const { ref: seenRef, seen } = useInView<HTMLDivElement>();
  const cvRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const startRef = useRef(0);
  const [counts, setCounts] = useState<number[]>(() => TOTALS.map(() => 0));

  /* deterministic field — same on the server, same on every reload */
  const field = useMemo(() => {
    const rnd = seeded(20260829);
    return Array.from({ length: DOTS }, (_, i) => {
      const c = i % CLUSTER_POS.length;
      const a = rnd() * Math.PI * 2;
      const r = Math.sqrt(rnd()) ;
      return {
        c,
        a,
        r,
        seed: rnd(),
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        lit: 0,
      };
    });
  }, []);

  const setPhaseBoth = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  const run = useCallback(() => {
    if (phaseRef.current === "running" || phaseRef.current === "collapse") return;
    setCounts(TOTALS.map(() => 0));
    if (reduced) {
      setCounts(TOTALS);
      setPhaseBoth("done");
      return;
    }
    startRef.current = performance.now();
    setPhaseBoth("running");
  }, [reduced, setPhaseBoth]);

  const reset = useCallback(() => {
    setCounts(TOTALS.map(() => 0));
    setPhaseBoth("idle");
  }, [setPhaseBoth]);

  /* ---- the field itself ---- */
  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;

    const size = () => {
      const r = cv.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const rad = Math.min(w, h) * 0.19;
      for (const d of field) {
        const [cx, cy] = CLUSTER_POS[d.c];
        d.x = cx * w + Math.cos(d.a) * d.r * rad;
        d.y = cy * h + Math.sin(d.a) * d.r * rad * 0.86;
        d.vx = 0;
        d.vy = 0;
        d.lit = 0;
      }
    };

    const draw = (t: number) => {
      const p = phaseRef.current;
      const el = t - startRef.current;
      ctx.clearRect(0, 0, w, h);

      const cxm = w * 0.5;
      const cym = h * 0.52;

      if (p === "running") {
        const prog = Math.min(1, el / RUN_MS);
        const sweep = prog * (w * 1.15) - w * 0.08;
        for (const d of field) {
          if (!d.lit && d.x < sweep) d.lit = 1;
          if (d.lit) {
            /* worked signals tighten toward their cluster core */
            const [cx, cy] = CLUSTER_POS[d.c];
            d.vx += (cx * w - d.x) * 0.00042;
            d.vy += (cy * h - d.y) * 0.00042;
            d.vx *= 0.94;
            d.vy *= 0.94;
            d.x += d.vx;
            d.y += d.vy;
          }
        }
        if (prog >= 1) {
          startRef.current = t;
          phaseRef.current = "collapse";
          setPhase("collapse");
        }
      } else if (p === "collapse") {
        const prog = Math.min(1, el / COLLAPSE_MS);
        const k = prog * prog;
        for (const d of field) {
          d.x += (cxm - d.x) * (0.04 + k * 0.22);
          d.y += (cym - d.y) * (0.04 + k * 0.22);
        }
        if (prog >= 1) {
          phaseRef.current = "done";
          setPhase("done");
        }
      }

      /* paint */
      if (p !== "done") {
        const fade =
          p === "collapse" ? Math.max(0, 1 - (t - startRef.current) / COLLAPSE_MS) : 1;
        for (const d of field) {
          const breathe = p === "idle" ? 0.5 + 0.5 * Math.sin(t / 2600 + d.seed * 9) : 1;
          const a = (d.lit ? 0.85 : 0.3 + 0.2 * breathe) * fade;
          ctx.fillStyle = d.lit
            ? `rgba(228,161,84,${a})`
            : `rgba(244,236,225,${a * 0.72})`;
          const s = d.lit ? 2.2 : 1.6;
          ctx.fillRect(d.x - s / 2, d.y - s / 2, s, s);
        }

        if (p === "running") {
          const prog = Math.min(1, el / RUN_MS);
          const sweep = prog * (w * 1.15) - w * 0.08;
          const g = ctx.createLinearGradient(sweep - 150, 0, sweep, 0);
          g.addColorStop(0, "rgba(201,125,60,0)");
          g.addColorStop(1, "rgba(201,125,60,.22)");
          ctx.fillStyle = g;
          ctx.fillRect(sweep - 150, 0, 150, h);
          ctx.fillStyle = "rgba(228,161,84,.55)";
          ctx.fillRect(sweep - 1, 0, 1.5, h);
        }
      } else {
        /* three marks left standing */
        for (let i = 0; i < 3; i++) {
          const x = w * (0.5 + (i - 1) * 0.045);
          ctx.fillStyle = "rgba(228,161,84,.7)";
          ctx.fillRect(x - 1.5, h * 0.2, 3, 3);
        }
      }
    };

    size();
    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onResize = () => size();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [field]);

  /* ---- the counters climb while the run is on ---- */
  useEffect(() => {
    if (phase !== "running") return;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / RUN_MS);
      const eased = 1 - Math.pow(1 - p, 2);
      setCounts(TOTALS.map((v) => Math.round(v * eased)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") setCounts(TOTALS);
  }, [phase]);

  const label =
    phase === "idle"
      ? "Standing by"
      : phase === "running"
        ? "Executing"
        : phase === "collapse"
          ? "Resolving"
          : "3 decisions need a human";

  return (
    <section className="rm-auto" ref={seenRef}>
      <div className="rm-auto-in">
        <header className="rm-auto-head">
          <Rise>
            <span className="rm-eyebrow">
              <b>◆</b>
              <i className="tick" />
              The signature moment
            </span>
            <h2 className="rm-auto-h">
              A night of work, <em>and three decisions.</em>
            </h2>
          </Rise>
          <Rise i={1}>
            <p className="rm-auto-dek">
              Below is one night at a mid-size company: every signal, document, agent, run,
              call and write. Start the system and watch what is left for a person.
            </p>
          </Rise>
        </header>

        <Rise className="rm-auto-stage" i={1}>
          <canvas ref={cvRef} />

          <div className="rm-auto-hud">
            {AUTO_CLUSTERS.map((c, i) => (
              <span
                className="rm-auto-tag"
                key={`tag-${c.k}`}
                data-off={phase === "done" ? "1" : "0"}
                style={{ left: `${CLUSTER_POS[i][0] * 100}%`, top: `${CLUSTER_POS[i][1] * 100 - 13}%` }}
              >
                {c.k}
              </span>
            ))}
            <div className="row">
              {AUTO_CLUSTERS.map((c, i) => (
                <div className="cell" key={c.k} data-hot={phase === "running" ? "1" : "0"}>
                  <b>{fmt(counts[i])}</b>
                  <span>
                    {c.k} · {c.n}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rm-auto-res" data-on={phase === "done" ? "1" : "0"} aria-live="polite">
            {phase === "done" && (
              <>
                <h4>Recommended actions · everything else is done</h4>
                {AUTO_ACTIONS.map((a, i) => (
                  <div className="rm-auto-act" key={a.n}>
                    <i>{String(i + 1).padStart(2, "0")}</i>
                    <b>{a.n}</b>
                    <span>{a.m}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </Rise>

        <Rise className="rm-auto-ctl" i={2}>
          {phase === "done" ? (
            <>
              <button className="rm-btn rm-btn-night-sec rm-btn-lg" onClick={reset}>
                Run it again
              </button>
              <button className="rm-btn rm-btn-night rm-btn-lg" onClick={() => openEnter("demo")}>
                See it on your data
              </button>
            </>
          ) : (
            <button
              className="rm-btn rm-btn-night rm-btn-lg"
              onClick={run}
              disabled={phase === "running" || phase === "collapse"}
            >
              <span className="dot" />
              {phase === "idle" ? "Run Autonomous Mode" : "Running…"}
            </button>
          )}
          <span className="cap">{seen ? label : "Standing by"}</span>
        </Rise>

        <Rise className="rm-auto-claim" i={3}>
          <b>
            Complexity in. <em>Intelligence out.</em>
          </b>
        </Rise>
      </div>
    </section>
  );
}
